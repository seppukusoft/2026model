const _ratingsPromiseCache = Object.create(null);

function buildRatingsMap(ratingsText) {
    const parsed = Papa.parse(ratingsText, { header: true, dynamicTyping: true });
    const map = new Map();
    for (const row of parsed.data) {
        if (!row.Pollster) continue;
        const biasMatch = String(row["Mean-reverted bias"] || "").match(/@@(-?[\d.]+)/);
        const bias = biasMatch ? parseFloat(biasMatch[1]) : 0;
        const ppm  = parseFloat(row["Predictive Plus-Minus"]) || 0;
        const key  = row.Pollster.toLowerCase().replace(/[^a-z0-9]/g, "");
        map.set(key, { ppm, bias });
    }
    return map;
}

function findPollsterRating(pollsterName, ratingsMap) {
    if (!pollsterName || !ratingsMap.size) return null;
    const norm = pollsterName.toLowerCase().replace(/[^a-z0-9]/g, "");
    let bestMatch = null, bestLen = 0;
    for (const [key, rating] of ratingsMap) {
        if ((norm.includes(key) || key.includes(norm)) && key.length > bestLen) {
            bestLen = key.length;
            bestMatch = rating;
        }
    }
    return bestMatch;
}

function applyBiasCorrection(responses, bias) {
    if (!bias) return responses;
    return responses.map(r => {
        const correction = (r.party === "DEM" || r.party === "WFP") ? -(bias / 2)
                         :  r.party === "REP"                        ?  (bias / 2)
                         : 0;
        return correction ? { ...r, pct: Math.max(0, (r.pct || 0) + correction) } : r;
    });
}


function renormalizeEstimates(estimates) {
    let sum = 0;
    for (const c in estimates) sum += estimates[c].pct;
    if (!sum || sum <= 0) return estimates;
    const scale = 100 / sum;
    const out = Object.create(null);
    for (const c in estimates) {
        out[c] = { pct: estimates[c].pct * scale, party: estimates[c].party };
    }
    return out;
}

function randomNormal(mean = 0, sigma = 1) {
    let u = 0, v = 0;
    while (!u) u = Math.random();
    while (!v) v = Math.random();
    return mean + sigma * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function monteCarloMulti(candidates, sigma, iterations = 25000) {
    const names = Object.keys(candidates);
    const n = names.length;
    const wins  = new Int32Array(n);
    const draws = new Float64Array(n);
    const means = new Float64Array(names.map(k => candidates[k]));

    for (let i = 0; i < iterations; i++) {
        let sum = 0;
        for (let j = 0; j < n; j++) {
            const v = Math.max(0, randomNormal(means[j], sigma));
            draws[j] = v;
            sum += v;
        }
        if (!sum) continue;

        let best = 0, bestPct = 0;
        for (let j = 0; j < n; j++) {
            const pct = draws[j] / sum;
            if (pct > bestPct) { bestPct = pct; best = j; }
        }
        wins[best]++;
    }

    const result = Object.create(null);
    for (let i = 0; i < n; i++) result[names[i]] = wins[i] / iterations;
    return result;
}

//  * config = {
//  *   excludeRe            RegExp   — candidates/words to exclude
//  *   primaryWinners       object   — { [region]: "candidate name" }
//  *   pviMap               object   — { [region]: number }
//  *   pviOffset            number   — added to every pviMap value
//  *   notGenYet            string[] — regions to skip (no general election polls yet)
//  *   fixKnownIndependents function — (region, candidateName) => party string | null
//  *   getRegionFromRow     function — (csvRow) => region string
//  *   regionKey            string   — property name on poll objects ("state" or "district")
//  *   extraRowFilter       function — optional extra filter (csvRow) => boolean
//  *   minPolls             number   — min polls a candidate must appear in
//  * }
//  *
//  * Returns: Promise<{ [region]: outcomeObject }>

async function runRacePipeline(url, config) {
    const {
        excludeRe,
        primaryWinners,
        pviMap,
        pviOffset = 2,
        notGenYet,
        fixKnownIndependents,
        getRegionFromRow,
        regionKey,
        extraRowFilter,
        minPolls = 2,
        defaults = {},
        rcvRegions = [],
        ratingsUrl
    } = config;

    const notGenYetSet  = new Set(notGenYet);
    const rcvRegionsSet = new Set(rcvRegions);

    const partyCache    = Object.create(null);
    const lastNameCache = new Map();

    function normalizeParty(p) {
        if (!p) return "IND";
        const key = String(p).toUpperCase();
        return partyCache[key] ??= (
            key.includes("DEM") ? "DEM" :
            key.includes("REP") ? "REP" :
            key.includes("LIB") ? "LIB" :
            "IND"
        );
    }

    function getLastName(name) {
        if (!name) return "";
        if (lastNameCache.has(name)) return lastNameCache.get(name);
        const ln = name.toLowerCase().replace(/[^a-z\s]/g, "").trim().split(/\s+/).pop();
        lastNameCache.set(name, ln);
        return ln;
    }

    function applyPartisanSponsorDiscount(poll) {
        const sp = poll.sponsorParty;
        if (sp === "IND") return poll.responses;  
        return poll.responses.map(r =>
            r.party === sp ? { ...r, pct: (r.pct || 0) * 0.85 } : r
        );
    }

    function normalizeResponses(poll) {
        if (poll._normalized) return poll._normalized;
        const discounted  = applyPartisanSponsorDiscount(poll);
        const biasCorrect = applyBiasCorrection(discounted, poll.pollsterBias);
        let sum = 0;
        const cleaned = [];
        for (const r of biasCorrect) {
            if (!excludeRe.test(r.candidate)) {
                cleaned.push(r);
                sum += r.pct || 0;
            }
        }
        if (!sum) return (poll._normalized = cleaned);
        const scale = 100 / sum;
        return (poll._normalized = cleaned.map(r => ({ ...r, pct: r.pct * scale })));
    }

    function groupByPollId(rows, ratingsMap) {
        const polls = Object.create(null);
        const pollsterCache = new Map();
        const now = Date.now();

        for (const row of rows) {
            if (!row.poll_id || !row.question_id) continue;
            const key = row.poll_id + "_" + row.question_id;
            let poll = polls[key];
            if (!poll) {
                const methodology = row.methodology || "";
                const methodologyMultiplier =
                    methodology.includes("Probability Panel") ? 1.4:
                    methodology.includes("Online")            ? 0.6:
                    1.0;

                const pollster = row.pollster;
                if (!pollsterCache.has(pollster)) {
                    const r = findPollsterRating(pollster, ratingsMap);
                    pollsterCache.set(pollster, {
                        ppmMultiplier: r ? Math.exp(-r.ppm * 0.5) : 0.75,
                        bias:          r?.bias ?? 0
                    });
                }
                const { ppmMultiplier, bias } = pollsterCache.get(pollster);

                const endDate = new Date(row.end_date);
                const region  = getRegionFromRow(row);
                poll = polls[key] = {
                    poll_id:      row.poll_id,
                    question_id:  row.question_id,
                    [regionKey]:  region,
                    state:        row.state,
                    pollster,
                    start_date:   row.start_date,
                    end_date:     row.end_date,
                    sample_size:  row.sample_size,
                    sponsorParty: normalizeParty(row.partisan),
                    pollsterBias: bias,
                    weight: Math.sqrt(row.sample_size / 2 || 250) *
                            Math.exp(-(now - endDate) / 86400000 / 30) *
                            methodologyMultiplier *
                            ppmMultiplier,
                    responses: []
                };
            }
            poll.responses.push({
                candidate: row.candidate_name,
                party:     normalizeParty(row.party),
                pct:       row.pct
            });
        }
        return Object.values(polls);
    }

    function applyCandidateThreshold(polls) {
        const counts = Object.create(null);
        for (const poll of polls) {
            const region = poll[regionKey];
            const seen = new Set();
            counts[region] ??= Object.create(null);
            for (const r of poll.responses) {
                if (excludeRe.test(r.candidate) || seen.has(r.candidate)) continue;
                seen.add(r.candidate);
                counts[region][r.candidate] = (counts[region][r.candidate] || 0) + 1;
            }
        }
        for (const poll of polls) {
            const allowed = counts[poll[regionKey]];
            poll.responses = poll.responses.filter(r =>
                !excludeRe.test(r.candidate) && (allowed[r.candidate] || 0) >= minPolls
            );
        }
        return polls;
    }

    function groupPollsByRegion(polls) {
        const byRegion = Object.create(null);
        for (const p of polls) (byRegion[p[regionKey]] ??= []).push(p);
        return Object.entries(byRegion).map(([region, ps]) => ({ [regionKey]: region, polls: ps }));
    }

    function filterPolls(polls) {
        const filtered = polls.filter(poll => {
            for (const r of poll.responses) {
                r._candidateLC ??= r.candidate.toLowerCase();
                if (r._candidateLC.includes("generic")) return false;
            }
            const required = primaryWinners[poll[regionKey]];
            if (required) {
                const requiredLast = getLastName(required);
                if (!poll.responses.some(r => getLastName(r.candidate) === requiredLast)) return false;
            }
            return true;
        });
        const counts = Object.create(null);
        for (const p of filtered) counts[p[regionKey]] = (counts[p[regionKey]] || 0) + 1;
        return filtered.filter(p => counts[p[regionKey]] >= 2);
    }

    function computeEstimates(pollsByRegion) {
        const results = Object.create(null);
        for (const entry of pollsByRegion) {
            const region = entry[regionKey];
            const polls  = entry.polls;
            const totals  = Object.create(null);
            const weights = Object.create(null);
            const parties = Object.create(null);

            for (const poll of polls) {
                for (const r of normalizeResponses(poll)) {
                    const c = r.candidate;
                    totals[c]  ??= 0;
                    weights[c] ??= 0;
                    parties[c] = fixKnownIndependents(region, c) || normalizeParty(r.party);
                    totals[c]  += r.pct * poll.weight;
                    weights[c] += poll.weight;
                }
            }

            const out = Object.create(null);
            for (const c in totals) {
                out[c] = { pct: totals[c] / weights[c], party: parties[c] };
            }
            results[region] = renormalizeEstimates(out);
        }
        return results;
    }

    function applyPviToEstimates(region, estimates, nEff) {
        const pvi = pviMap[region] != null ? pviMap[region] + pviOffset : 0;
        const strength = 0.2 * Math.min(2, 5 / Math.sqrt(nEff || 1));
        const out = Object.create(null);
        for (const c in estimates) {
            const { pct: base, party } = estimates[c];
            const shift = party === "DEM" || party === "WFP" ? -pvi * strength
                        : party === "REP"                    ?  pvi * strength : 0;
            out[c] = { pct: base + shift, party };
        }
        return out;
    }

    function computeOutcomes(estimates, pollsByRegion, marketPriors) {
        const pollMap = Object.fromEntries(pollsByRegion.map(p => [p[regionKey], p.polls]));
        const outcomes = Object.create(null);

        for (const region in estimates) {
            const polls  = pollMap[region] || [];
            let nEff = 0;
            for (const p of polls) nEff += p.weight;
            const sigma = nEff <= 0 ? 5 : Math.max(7, 10 / Math.sqrt(nEff));

            const pviAdjusted    = renormalizeEstimates(applyPviToEstimates(region, estimates[region], nEff));
            const marketAdjusted = applyMarketPriorToEstimates(region, pviAdjusted, marketPriors);

            let finalEstimates     = marketAdjusted;
            let rcvEliminationOrder = [];

            if (rcvRegionsSet.has(region) && Object.keys(marketAdjusted).length > 2) {
                let current = Object.assign(Object.create(null), marketAdjusted);
                let currentSize = Object.keys(marketAdjusted).length;
                while (currentSize > 2) {
                    const sortedByVote = Object.entries(current).sort((a, b) => a[1].pct - b[1].pct);
                    const [elimName, elimData] = sortedByVote[0];
                    const elimPct   = elimData.pct;
                    const elimParty = elimData.party;
                    const remaining = sortedByVote.slice(1); 

                    let sameWeight = 0, otherWeight = 0;
                    for (const [, d] of remaining) {
                        if (d.party === elimParty) sameWeight  += d.pct;
                        else                       otherWeight += d.pct;
                    }

                    const partyShare = sameWeight  > 0 ? 0.8 : 0;
                    const otherShare = 1 - partyShare;

                    const next = Object.create(null);
                    for (const [name, data] of remaining) {
                        let bonus = 0;
                        if (data.party === elimParty && sameWeight > 0)
                            bonus = (data.pct / sameWeight) * elimPct * partyShare;
                        else if (data.party !== elimParty && otherWeight > 0)
                            bonus = (data.pct / otherWeight) * elimPct * otherShare;
                        next[name] = { pct: data.pct + bonus, party: data.party };
                    }

                    rcvEliminationOrder.push(elimName);
                    current = renormalizeEstimates(next);
                    currentSize--;
                }
                finalEstimates = current;
            }

            if (Object.keys(finalEstimates).length === 0) continue;

            const candidatePct   = Object.create(null);
            const candidateParty = Object.create(null);
            for (const c in finalEstimates) {
                candidatePct[c]   = finalEstimates[c].pct;
                candidateParty[c] = finalEstimates[c].party;
            }

            let top1 = -Infinity, top2 = -Infinity;
            for (const c in finalEstimates) {
                const pct = finalEstimates[c].pct;
                if (pct > top1) { top2 = top1; top1 = pct; }
                else if (pct > top2) top2 = pct;
            }
            const margin = top2 === -Infinity ? 0 : top1 - top2;

            const winProbs = monteCarloMulti(candidatePct, sigma);
            const winProbEntries = Object.entries(winProbs)
                .map(([c, p]) => [c, { pct: p, party: candidateParty[c] }])
                .sort((a, b) => b[1].pct - a[1].pct);

            const voteEntries = Object.entries(marketAdjusted).sort((a, b) => b[1].pct - a[1].pct);

            outcomes[region] = {
                _rcvFinalEstimates:      rcvEliminationOrder.length ? finalEstimates : null,
                _rcvEliminationOrder:    rcvEliminationOrder,
                _sortedWinProbabilities: winProbEntries,
                _sortedVoteEstimates:    voteEntries,
                margin
            };
        }
        return outcomes;
    }

    if (ratingsUrl && !_ratingsPromiseCache[ratingsUrl]) {
        _ratingsPromiseCache[ratingsUrl] = fetch(ratingsUrl)
            .then(r => r.text())
            .then(buildRatingsMap);
    }

    const [response, marketPrior, ratingsMap] = await Promise.all([
        fetch(url),
        getPolymarketPriors(),
        ratingsUrl ? _ratingsPromiseCache[ratingsUrl] : Promise.resolve(new Map())
    ]);

    const csvText = await response.text();
    const cutoffDate = new Date("2025-11-11");
    const parsed = Papa.parse(csvText, { header: true, dynamicTyping: true });
    const rows = parsed.data.filter(r =>
        r && r.stage === "general" &&
        r.state &&
        !notGenYetSet.has(getRegionFromRow(r)) &&
        new Date(r.created_at) >= cutoffDate &&
        (!extraRowFilter || extraRowFilter(r))
    );

    const polls      = groupByPollId(rows, ratingsMap);
    const thresholded = applyCandidateThreshold(polls);
    const filtered   = filterPolls(thresholded);
    const byRegion   = groupPollsByRegion(filtered);
    const estimates  = computeEstimates(byRegion);
    return { ...defaults, ...computeOutcomes(estimates, byRegion, marketPrior) };
}