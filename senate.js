const senateLink = "https://www.nytimes.com/newsgraphics/polls/senate.csv";

const notGenYet = ["US","MI","TX","FL","MA","KS","MT","MN","MS"];

const primaryWinnersByState = {
    NE: "dan osborn",
    ME: "graham platner",
    OH: "sherrod brown",
    SD: "julian beaudion",
    IA: "josh turek",
    GA: "mike collins",
    NH: "john sununu"
};

const cookPVI = {
    AL:  15, AK: 6, AZ: 2, AR: 15, CA: -12, CO: -6, CT: -8, DE: -8,
    FL: 5, GA: 1, HI: -13, ID: 18, IL: -6, IN: 9, IA: 6, KS: 8,
    KY: 15, LA: 11, ME: -4, MD: -15, MA: -14, MI: 0, MN: -3,
    MS: 11, MO: 9, MT: 10, NE: 10, NV: 1, NH: -2, NJ: -4, NM: -4,
    NY: -8, NC: 1, ND: 18, OH: 5, OK: 17, OR: -8, PA: 1, RI: -8,
    SC: 8, SD: 15, TN: 14, TX: 6, UT: 11, VT: -17, VA: -3, WA: -10,
    WV: 21, WI: 0, WY: 23
};

const EXCLUDE_RE = /undecided|don't know|don’t know|other|refused|someone else|would not vote/i;

const partyCache = Object.create(null);

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
    return name._lastName ??= name
        .toLowerCase()
        .replace(/[^a-z\s]/g, "")
        .trim()
        .split(/\s+/)
        .pop();
}

function fixKnownIndependents(state, name) {
    if (state === "NE" && name?.toLowerCase().includes("osborn")) return "IND";
    return null;
}

function groupByPollId(rows) {
    const polls = Object.create(null);

    for (const row of rows) {
        if (!row.poll_id || !row.question_id) continue;

        const key = row.poll_id + "_" + row.question_id;

        let poll = polls[key];
        if (!poll) {
            const endDate = new Date(row.end_date);
            poll = polls[key] = {
                poll_id: row.poll_id,
                question_id: row.question_id,
                state: row.state,
                pollster: row.pollster,
                start_date: row.start_date,
                end_date: row.end_date,
                sample_size: row.sample_size,
                _endDate: endDate,
                weight: Math.sqrt(row.sample_size || 500) *
                        Math.exp(-(Date.now() - endDate) / 86400000 / 30),
                responses: []
            };
        }

        poll.responses.push({
            candidate: row.candidate_name,
            party: normalizeParty(row.party),
            pct: row.pct
        });
    }

    return Object.values(polls);
}

function applyCandidateThreshold(polls, minPolls = 3) {
    const counts = Object.create(null);

    for (const poll of polls) {
        const state = poll.state;
        const seen = new Set();
        counts[state] ??= Object.create(null);

        for (const r of poll.responses) {
            if (EXCLUDE_RE.test(r.candidate)) continue;
            if (seen.has(r.candidate)) continue;
            seen.add(r.candidate);
            counts[state][r.candidate] = (counts[state][r.candidate] || 0) + 1;
        }
    }

    for (const poll of polls) {
        const allowed = counts[poll.state];
        poll.responses = poll.responses.filter(r =>
            !EXCLUDE_RE.test(r.candidate) &&
            (allowed[r.candidate] || 0) >= minPolls
        );
    }

    return polls;
}

function groupPollsByState(polls) {
    const byState = Object.create(null);
    for (const p of polls) (byState[p.state] ??= []).push(p);
    return Object.entries(byState).map(([state, polls]) => ({ state, polls }));
}

function filterPolls(polls) {
    const filtered = polls.filter(poll => {
        for (const r of poll.responses) {
            r._candidateLC ??= r.candidate.toLowerCase();
            if (r._candidateLC.includes("generic")) {
                return false;
            }
        }

        const required = primaryWinnersByState[poll.state];
        if (required) {
            const requiredLast = getLastName(required);

            const match = poll.responses.some(r => {
                return getLastName(r.candidate) === requiredLast;
            });

            if (!match) {
                return false;
            }
        }

        return true;
    });

    const counts = Object.create(null);
    for (const p of filtered) counts[p.state] = (counts[p.state] || 0) + 1;

    return filtered.filter(p => {
        if (counts[p.state] < 2) {
            return false;
        }
        return true;
    });
}

function normalizeResponses(poll) {
    if (poll._normalized) return poll._normalized;

    let sum = 0;
    const cleaned = [];

    for (const r of poll.responses) {
        if (!EXCLUDE_RE.test(r.candidate)) {
            cleaned.push(r);
            sum += r.pct || 0;
        }
    }

    if (!sum) return poll._normalized = cleaned;

    const scale = 100 / sum;
    return poll._normalized = cleaned.map(r => ({
        ...r,
        pct: r.pct * scale
    }));
}

function renormalizeEstimates(estimates) {
    let sum = 0;

    for (const c in estimates) {
        sum += estimates[c].pct;
    }

    if (!sum || sum <= 0) return estimates;

    const scale = 100 / sum;

    const out = Object.create(null);
    for (const c in estimates) {
        out[c] = {
            pct: estimates[c].pct * scale,
            party: estimates[c].party
        };
    }

    return out;
}

function computeStateEstimates(pollsByState) {
    const results = Object.create(null);

    for (const { state, polls } of pollsByState) {
        const totals = Object.create(null);
        const weights = Object.create(null);
        const parties = Object.create(null);

        for (const poll of polls) {
            const responses = normalizeResponses(poll);

            for (const r of responses) {
                const c = r.candidate;

                totals[c] ??= 0;
                weights[c] ??= 0;

                const fixed = fixKnownIndependents(state, c);
                const party = fixed || normalizeParty(r.party);

                parties[c] = party;

                totals[c] += r.pct * poll.weight;
                weights[c] += poll.weight;
            }
        }

        const out = Object.create(null);

        for (const c in totals) {
            out[c] = {
                pct: totals[c] / weights[c],
                party: parties[c]
            };
        }

        results[state] = renormalizeEstimates(out);
    }

    return results;
}

function pviBiasForCandidate(party, pvi) {
    const PVI_STRENGTH = 0.3;

    if (party === "DEM") return -pvi * PVI_STRENGTH;
    if (party === "REP") return  pvi * PVI_STRENGTH;
    return 0;
}

function applyPviToEstimates(state, estimates, polls) {
    const pvi = cookPVI[state] || 0;

    let nEff = 0;
    for (const p of polls) nEff += p.weight;

    const strength = 0.3 * Math.min(1, 5 / Math.sqrt(nEff || 1));

    const out = Object.create(null);

    for (const c in estimates) {
        const base = estimates[c].pct;
        const party = estimates[c].party;

        const shift =
            party === "DEM" ? -pvi * strength :
            party === "REP" ?  pvi * strength : 0;

        out[c] = {
            pct: base + shift,
            party
        };
    }

    return out;
}

function randomNormal(mean = 0, sigma = 1) {
    let u = 0, v = 0;
    while (!u) u = Math.random();
    while (!v) v = Math.random();
    return mean + sigma * Math.sqrt(-2*Math.log(u)) * Math.cos(2*Math.PI*v);
}

function monteCarloMulti(candidates, sigma, parties, pvi, iterations = 25000) {
    const names = Object.keys(candidates);
    const n = names.length;
    const wins = Object.fromEntries(names.map(k => [k, 0]));
    const draws = new Array(n);

    for (let i = 0; i < iterations; i++) {
        let sum = 0;

        for (let j = 0; j < n; j++) {
            const name = names[j];
            const bias = pviBiasForCandidate(parties[name], pvi);
            const v = Math.max(0, randomNormal(candidates[name] + bias, sigma));
            draws[j] = v;
            sum += v;
        }

        if (!sum) continue;

        let best = 0;
        let bestPct = 0;

        for (let j = 0; j < n; j++) {
            const pct = (draws[j] / sum) * 100;
            if (pct > bestPct) {
                bestPct = pct;
                best = j;
            }
        }

        wins[names[best]]++;
    }

    for (const k in wins) wins[k] /= iterations;
    return wins;
}

function sigmaFromPolls(polls) {
    let nEff = 0;
    for (const p of polls) nEff += p.weight;
    return nEff <= 0 ? 5 : Math.max(7, 10 / Math.sqrt(nEff));
}

function computeStateOutcomes(stateEstimates, pollsByState) {
    const pollMap = Object.fromEntries(pollsByState.map(p => [p.state, p.polls]));
    const outcomes = Object.create(null);

    for (const state in stateEstimates) {
        const estimates = stateEstimates[state];
        const polls = pollMap[state] || [];

        const sigma = sigmaFromPolls(polls);

        const candidatePct = {};
        const candidateParty = {};

        for (const c in estimates) {
            candidatePct[c] = estimates[c].pct;
            candidateParty[c] = estimates[c].party;
        }

        const applied = renormalizeEstimates(applyPviToEstimates(state, estimates, polls));

        const sorted = Object.entries(applied)
            .sort((a,b)=>b[1].pct-a[1].pct);

        const margin =
            sorted.length >= 2
                ? sorted[0][1].pct - sorted[1][1].pct
                : 0;

        const winProbs = monteCarloMulti(
            candidatePct,
            sigma,
            candidateParty,
            cookPVI[state] || 0
        );

        const winProbEntries = Object.entries(winProbs)
            .map(([c, p]) => [c, { pct: p, party: candidateParty[c] }])
            .sort((a, b) => b[1].pct - a[1].pct);

        const voteEntries = Object.entries(applied)
            .sort((a, b) => b[1].pct - a[1].pct);

        outcomes[state] = {
            voteEstimates: applied,
            winProbabilities: Object.fromEntries(winProbEntries),
            _sortedWinProbabilities: winProbEntries,
            _sortedVoteEstimates: voteEntries,
            margin
        };
    }

    return outcomes;
}

async function getData(url) {
    const response = await fetch(url);
    const csvText = await response.text();

    const parsed = Papa.parse(csvText, {
        header: true,
        dynamicTyping: true
    });

    const rows = parsed.data.filter(r =>
        r.stage === "general" &&
        r.state &&
        r.display_name !== "Praecones Analytica" &&
        !notGenYet.includes(r.state) &&
        new Date(r.created_at) >= new Date("2026-1-01")
    );
    //console.log("Raw rows:", rows);
    const polls = groupByPollId(rows);
    //console.log("Total polls:", polls);
    
    const thresholded = applyCandidateThreshold(polls, 2);
    const filtered = filterPolls(thresholded);

    const byState = groupPollsByState(filtered);
    const estimates = computeStateEstimates(byState);
    const outcomes = computeStateOutcomes(estimates, byState);
    //console.log(outcomes);

    return outcomes;
}

function runSenateMap() {
    getData(senateLink).then(outcomes => {
        for (const state in outcomes) {
            const outcome = outcomes[state];
            outcome.winner = Object.entries(outcome.winProbabilities).sort((a,b) => b[1].pct - a[1].pct)[0][0];
            let winningParty = outcome.winProbabilities[outcome.winner].party;
            //console.log(outcome);
            const prob = {
                solid: outcome.winProbabilities[outcome.winner].pct > 0.95,
                likely: outcome.winProbabilities[outcome.winner].pct > 0.8,
                lean: outcome.winProbabilities[outcome.winner].pct > 0.66,
                tilt: outcome.winProbabilities[outcome.winner].pct >= 0.5 
            };
            applyColor("senate", state, Object.keys(prob).find(key => prob[key]) + winningParty[0]);
            let string = "<b>Win Probability:</b><br>";
            outcome._sortedWinProbabilities.forEach(element => {
                string += ["0.00"].includes((element[1].pct * 100).toFixed(2))
                    ? ""
                    : `${element[0]}: ${((element[1].pct * 100).toFixed(2))}%<br>`;
            });
            string += ["AK", "ME"].includes(state) ? "<b>Vote Estimate (first round):</b><br>" : "<b>Vote Estimate:</b><br>";
            outcome._sortedVoteEstimates.forEach(element => {
                string += ["0.00"].includes((element[1].pct).toFixed(2))
                    ? ""
                    : `${element[0]}: ${((element[1].pct).toFixed(2))}%<br>`;
            });
            changeDesc("senate", state, string);
        }
        
        const noElec = ["HI","CA", "NV", "UT", "AZ", "WA", "ND", "MO", "WI", "IN", "PA", "NY", "MD", "VT", "CT", "MO"];
        noElec.forEach(element => {
            applyColor("senate", element, "noElec");
            changeDesc("senate", element, "No election");
        });
        mapLookup["senate"].refresh();
        //console.timeEnd("Total time");
    });
}
//console.time("Total time");
runSenateMap();