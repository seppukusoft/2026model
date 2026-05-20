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

function sigmaFromPolls(polls) {
    let nEff = 0;
    for (const p of polls) nEff += p.weight;
    return nEff <= 0 ? 5 : Math.max(7, 10 / Math.sqrt(nEff));
}

function monteCarloMulti(candidates, sigma, iterations = 25000) {
    const names = Object.keys(candidates);
    const n = names.length;
    const wins = Object.fromEntries(names.map(k => [k, 0]));
    const draws = new Array(n);

    for (let i = 0; i < iterations; i++) {
        let sum = 0;
        for (let j = 0; j < n; j++) {
            const v = Math.max(0, randomNormal(candidates[names[j]], sigma));
            draws[j] = v;
            sum += v;
        }
        if (!sum) continue;

        let best = 0, bestPct = 0;
        for (let j = 0; j < n; j++) {
            const pct = (draws[j] / sum) * 100;
            if (pct > bestPct) { bestPct = pct; best = j; }
        }
        wins[names[best]]++;
    }

    for (const k in wins) wins[k] /= iterations;
    return wins;
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
        pviOffset = 3.15,
        notGenYet,
        fixKnownIndependents,
        getRegionFromRow,
        regionKey,
        extraRowFilter,
        minPolls = 2,
    } = config;

    const partyCache = Object.create(null);
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
        return poll.responses.map(r =>
            r.party === sp ? { ...r, pct: (r.pct || 0) * 0.85 } : r
        );
    }

    function normalizeResponses(poll) {
        if (poll._normalized) return poll._normalized;
        const discounted = applyPartisanSponsorDiscount(poll);
        let sum = 0;
        const cleaned = [];
        for (const r of discounted) {
            if (!excludeRe.test(r.candidate)) {
                cleaned.push(r);
                sum += r.pct || 0;
            }
        }
        if (!sum) return (poll._normalized = cleaned);
        const scale = 100 / sum;
        return (poll._normalized = cleaned.map(r => ({ ...r, pct: r.pct * scale })));
    }

    function groupByPollId(rows) {
        const polls = Object.create(null);
        for (const row of rows) {
            if (!row.poll_id || !row.question_id) continue;
            const key = row.poll_id + "_" + row.question_id;
            let poll = polls[key];
            if (!poll) {
                const endDate = new Date(row.end_date);
                const region = getRegionFromRow(row);
                poll = polls[key] = {
                    poll_id:      row.poll_id,
                    question_id:  row.question_id,
                    [regionKey]:  region,
                    state:        row.state,
                    pollster:     row.pollster,
                    start_date:   row.start_date,
                    end_date:     row.end_date,
                    sample_size:  row.sample_size,
                    sponsorParty: normalizeParty(row.partisan),
                    weight: Math.sqrt(row.sample_size || 500) *
                            Math.exp(-(Date.now() - endDate) / 86400000 / 30),
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

    function applyPviToEstimates(region, estimates, polls) {
        const pvi = pviMap[region] != null ? pviMap[region] + pviOffset : 0;
        let nEff = 0;
        for (const p of polls) nEff += p.weight;
        const strength = 0.2 * Math.min(1, 5 / Math.sqrt(nEff || 1));
        const out = Object.create(null);
        for (const c in estimates) {
            const { pct: base, party } = estimates[c];
            const shift = party === "DEM" ? -pvi * strength
                        : party === "REP" ?  pvi * strength : 0;
            out[c] = { pct: base + shift, party };
        }
        return out;
    }

    function computeOutcomes(estimates, pollsByRegion, marketPriors) {
        const pollMap = Object.fromEntries(pollsByRegion.map(p => [p[regionKey], p.polls]));
        const outcomes = Object.create(null);
        console.log(pollMap)
        for (const region in estimates) {
            const polls   = pollMap[region] || [];
            const sigma   = sigmaFromPolls(polls);

            const pviAdjusted    = renormalizeEstimates(applyPviToEstimates(region, estimates[region], polls));
            //console.log(pviAdjusted);
            const marketAdjusted = applyMarketPriorToEstimates(region, pviAdjusted, marketPriors);
            console.log(marketAdjusted);
            const candidatePct   = {};
            const candidateParty = {};
            for (const c in marketAdjusted) {
                candidatePct[c]   = marketAdjusted[c].pct;
                candidateParty[c] = marketAdjusted[c].party;
            }

            const sorted = Object.entries(marketAdjusted).sort((a, b) => b[1].pct - a[1].pct);
            const margin = sorted.length >= 2 ? sorted[0][1].pct - sorted[1][1].pct : 0;

            const winProbs = monteCarloMulti(candidatePct, sigma);
            const winProbEntries = Object.entries(winProbs)
                .map(([c, p]) => [c, { pct: p, party: candidateParty[c] }])
                .sort((a, b) => b[1].pct - a[1].pct);

            const voteEntries = [...sorted];

            outcomes[region] = {
                voteEstimates:          marketAdjusted,
                winProbabilities:       Object.fromEntries(winProbEntries),
                _sortedWinProbabilities: winProbEntries,
                _sortedVoteEstimates:    voteEntries,
                margin
            };
        }
        return outcomes;
    }

    const [response, marketPrior] = await Promise.all([fetch(url), getPolymarketPriors()]);
    //console.log(response);
    const csvText = await response.text();
    //console.log(csvText);
    const parsed  = Papa.parse(csvText, { header: true, dynamicTyping: true });
    //console.log(parsed);
    const rows = parsed.data.filter(r =>
        r.stage === "general" &&
        r.state &&
        !notGenYet.includes(getRegionFromRow(r)) &&
        new Date(r.created_at) >= new Date("2026-01-01") &&
        (!extraRowFilter || extraRowFilter(r))
    );

    const polls      = groupByPollId(rows);
    const thresholded = applyCandidateThreshold(polls);
    const filtered   = filterPolls(thresholded);
    const byRegion   = groupPollsByRegion(filtered);
    const estimates  = computeEstimates(byRegion);
    //console.log(estimates);
    return computeOutcomes(estimates, byRegion, marketPrior);
}