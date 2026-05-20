const Link_gov = "https://www.nytimes.com/newsgraphics/polls/governor.csv";

const notGenYet_gov = ["US", "GA", "WI"];

const primaryWinnersByState_gov = {
    RI: "x foulkes",
    OR: "x drazan",
    FL: "x jolly" && "x donalds" ,
    MA: "x minogue",
    MN: "x lindell",
    NH: "x warmington",
    NV: "x lombardo",
    AK: "x wilson", 
    AZ: "x biggs",
    MI: "x james",
};

const cookPVI_gov = {
    AL:  15, AK: 9, AZ: 2, AR: 15, CA: -12, CO: -6, CT: -8, DE: -8,
    FL: 5, GA: 1, HI: -13, ID: 18, IL: -6, IN: 9, IA: 7, KS: 8,
    KY: 15, LA: 11, ME: -4, MD: -15, MA: -14, MI: 3, MN: -3,
    MS: 11, MO: 9, MT: 10, NE: 10, NV: 1, NH: -2, NJ: -4, NM: -4,
    NY: -8, NC: 1, ND: 18, OH: 3, OK: 17, OR: -8, PA: 2, RI: -8,
    SC: 8, SD: 15, TN: 14, TX: 5, UT: 11, VT: -17, VA: -3, WA: -10,
    WV: 21, WI: 0, WY: 23
};

let govSeats = {
    DEM: 6,  
    REP: 8,
    IND: 0,
    UNK: 0,
    solidR: 0, likelyR: 0, leanR: 0, tiltR: 0,
    tiltD: 0, leanD: 0, likelyD: 0, solidD: 0,
    tiltI: 0, leanI: 0, likelyI: 0, solidI: 0,
    tiltL: 0, leanL: 0, likelyL: 0, solidL: 0,
};

const EXCLUDE_RE_gov = /undecided|don't know|demings|dixon|lytle|pizzo|bell|don’t know|other|refused|someone else|would not vote/i;

const partyCache_gov = Object.create(null);

function normalizeParty_gov(p_gov) {
    if (!p_gov) return "IND";

    const key_gov = String(p_gov).toUpperCase();

    return partyCache_gov[key_gov] ??= (
        key_gov.includes("DEM") ? "DEM" :
        key_gov.includes("REP") ? "REP" :
        key_gov.includes("LIB") ? "LIB" :
        "IND"
    );
}

function getLastName_gov(name_gov) {
    if (!name_gov) return "";
    return name_gov._lastName_gov ??= name_gov
        .toLowerCase()
        .replace(/[^a-z\s]/g, "")
        .trim()
        .split(/\s+/)
        .pop();
}

function fixKnownIndependents_gov(state_gov, name_gov) {
    if (state_gov === "MN" && name_gov?.toLowerCase().includes("klobuchar")) return "DEM";
    return null;
}

function applyPartisanSponsorDiscount_gov(poll) {
    const sp = poll.sponsorParty;

    return poll.responses.map(r => {
        if (r.party === sp) {
            //console.log("Discounting", r.candidate, "from", r.pct, "to", (r.pct || 0) * 0.85);
            return { ...r, pct: (r.pct || 0) * 0.85 };
        }
        return r;
    });
}

function groupByPollId_gov(rows_gov) {
    const polls_gov = Object.create(null);

    for (const row_gov of rows_gov) {
        if (!row_gov.poll_id || !row_gov.question_id) continue;

        const key_gov = row_gov.poll_id + "_" + row_gov.question_id;

        let poll_gov = polls_gov[key_gov];
        if (!poll_gov) {
            const endDate_gov = new Date(row_gov.end_date);
            poll_gov = polls_gov[key_gov] = {
                poll_id: row_gov.poll_id,
                question_id: row_gov.question_id,
                state: row_gov.state,
                pollster: row_gov.pollster,
                start_date: row_gov.start_date,
                end_date: row_gov.end_date,
                sample_size: row_gov.sample_size,
                sponsorParty: normalizeParty_gov(row_gov.partisan),
                _endDate_gov: endDate_gov,
                weight: Math.sqrt(row_gov.sample_size || 500) *
                        Math.exp(-(Date.now() - endDate_gov) / 86400000 / 30),
                responses: []
            };
        }

        poll_gov.responses.push({
            candidate: row_gov.candidate_name,
            party: normalizeParty_gov(row_gov.party),
            pct: row_gov.pct
        });
    }

    return Object.values(polls_gov);
}

function applyCandidateThreshold_gov(polls_gov, minPolls_gov = 3) {
    const counts_gov = Object.create(null);

    for (const poll_gov of polls_gov) {
        const state_gov = poll_gov.state;
        const seen_gov = new Set();
        counts_gov[state_gov] ??= Object.create(null);

        for (const r_gov of poll_gov.responses) {
            if (EXCLUDE_RE_gov.test(r_gov.candidate)) continue;
            if (seen_gov.has(r_gov.candidate)) continue;
            seen_gov.add(r_gov.candidate);
            counts_gov[state_gov][r_gov.candidate] =
                (counts_gov[state_gov][r_gov.candidate] || 0) + 1;
        }
    }

    for (const poll_gov of polls_gov) {
        const allowed_gov = counts_gov[poll_gov.state];
        poll_gov.responses = poll_gov.responses.filter(r_gov =>
            !EXCLUDE_RE_gov.test(r_gov.candidate) &&
            (allowed_gov[r_gov.candidate] || 0) >= minPolls_gov
        );
    }

    return polls_gov;
}

function groupPollsByState_gov(polls_gov) {
    const byState_gov = Object.create(null);
    for (const p_gov of polls_gov) (byState_gov[p_gov.state] ??= []).push(p_gov);
    return Object.entries(byState_gov).map(([state_gov, polls_gov]) => ({ state: state_gov, polls: polls_gov }));
}

function filterPolls_gov(polls_gov) {
    const filtered_gov = polls_gov.filter(poll_gov => {
        for (const r_gov of poll_gov.responses) {
            r_gov._candidateLC_gov ??= r_gov.candidate.toLowerCase();
            if (r_gov._candidateLC_gov.includes("generic")) {
                return false;
            }
        }

        const required_gov = primaryWinnersByState_gov[poll_gov.state];
        if (required_gov) {
            const requiredLast_gov = getLastName_gov(required_gov);

            const match_gov = poll_gov.responses.some(r_gov => {
                return getLastName_gov(r_gov.candidate) === requiredLast_gov;
            });

            if (!match_gov) {
                return false;
            }
        }

        return true;
    });

    const counts_gov = Object.create(null);
    for (const p_gov of filtered_gov) counts_gov[p_gov.state] = (counts_gov[p_gov.state] || 0) + 1;

    return filtered_gov.filter(p_gov => {
        if (counts_gov[p_gov.state] < 2) {
            return false;
        }
        return true;
    });
}

function normalizeResponses_gov(poll_gov) {
    if (poll_gov._normalized_gov) return poll_gov._normalized_gov;

    const discounted_gov = applyPartisanSponsorDiscount_gov(poll_gov);

    let sum_gov = 0;
    const cleaned_gov = [];

    for (const r_gov of discounted_gov) {
        if (!EXCLUDE_RE_gov.test(r_gov.candidate)) {
            cleaned_gov.push(r_gov);
            sum_gov += r_gov.pct || 0;
        }
    }

    if (!sum_gov) return poll_gov._normalized_gov = cleaned_gov;

    const scale_gov = 100 / sum_gov;
    return poll_gov._normalized_gov = cleaned_gov.map(r_gov => ({
        ...r_gov,
        pct: r_gov.pct * scale_gov
    }));
}

function renormalizeEstimates_gov(estimates_gov) {
    let sum_gov = 0;

    for (const c_gov in estimates_gov) {
        sum_gov += estimates_gov[c_gov].pct;
    }

    if (!sum_gov || sum_gov <= 0) return estimates_gov;

    const scale_gov = 100 / sum_gov;

    const out_gov = Object.create(null);
    for (const c_gov in estimates_gov) {
        out_gov[c_gov] = {
            pct: estimates_gov[c_gov].pct * scale_gov,
            party: estimates_gov[c_gov].party
        };
    }

    return out_gov;
}

function computeStateEstimates_gov(pollsByState_gov) {
    const results_gov = Object.create(null);

    for (const { state: state_gov, polls: polls_gov } of pollsByState_gov) {
        const totals_gov = Object.create(null);
        const weights_gov = Object.create(null);
        const parties_gov = Object.create(null);

        for (const poll_gov of polls_gov) {
            const responses_gov = normalizeResponses_gov(poll_gov);

            for (const r_gov of responses_gov) {
                const c_gov = r_gov.candidate;

                totals_gov[c_gov] ??= 0;
                weights_gov[c_gov] ??= 0;

                const fixed_gov = fixKnownIndependents_gov(state_gov, c_gov);
                const party_gov = fixed_gov || normalizeParty_gov(r_gov.party);

                parties_gov[c_gov] = party_gov;

                totals_gov[c_gov] += r_gov.pct * poll_gov.weight;
                weights_gov[c_gov] += poll_gov.weight;
            }
        }

        const out_gov = Object.create(null);

        for (const c_gov in totals_gov) {
            out_gov[c_gov] = {
                pct: totals_gov[c_gov] / weights_gov[c_gov],
                party: parties_gov[c_gov]
            };
        }

        results_gov[state_gov] = renormalizeEstimates_gov(out_gov);
    }

    return results_gov;
}

function pviBiasForCandidate_gov(party_gov, pvi_gov) {
    const PVI_STRENGTH_gov = 0.3;

    if (party_gov === "DEM") return -pvi_gov * PVI_STRENGTH_gov;
    if (party_gov === "REP") return  pvi_gov * PVI_STRENGTH_gov;
    return 0;
}

function applyPviToEstimates_gov(state_gov, estimates_gov, polls_gov) {
    const pvi_gov = cookPVI_gov[state_gov] + 1 || 0;

    let nEff_gov = 0;
    for (const p_gov of polls_gov) nEff_gov += p_gov.weight;

    const strength_gov = 0.3 * Math.min(1, 5 / Math.sqrt(nEff_gov || 1));

    const out_gov = Object.create(null);

    for (const c_gov in estimates_gov) {
        const base_gov = estimates_gov[c_gov].pct;
        const party_gov = estimates_gov[c_gov].party;

        const shift_gov =
            party_gov === "DEM" ? -pvi_gov * strength_gov :
            party_gov === "REP" ?  pvi_gov * strength_gov : 0;

        out_gov[c_gov] = {
            pct: base_gov + shift_gov,
            party: party_gov
        };
    }

    return out_gov;
}

function randomNormal_gov(mean_gov = 0, sigma_gov = 1) {
    let u_gov = 0, v_gov = 0;
    while (!u_gov) u_gov = Math.random();
    while (!v_gov) v_gov = Math.random();
    return mean_gov + sigma_gov * Math.sqrt(-2*Math.log(u_gov)) * Math.cos(2*Math.PI*v_gov);
}

function monteCarloMulti_gov(candidates_gov, sigma_gov, parties_gov, pvi_gov, iterations_gov = 25000) {
    const names_gov = Object.keys(candidates_gov);
    const n_gov = names_gov.length;
    const wins_gov = Object.fromEntries(names_gov.map(k_gov => [k_gov, 0]));
    const draws_gov = new Array(n_gov);

    for (let i_gov = 0; i_gov < iterations_gov; i_gov++) {
        let sum_gov = 0;

        for (let j_gov = 0; j_gov < n_gov; j_gov++) {
            const name_gov = names_gov[j_gov];
            const bias_gov = pviBiasForCandidate_gov(parties_gov[name_gov], pvi_gov);
            const v_gov = Math.max(0, randomNormal_gov(candidates_gov[name_gov] + bias_gov, sigma_gov));
            draws_gov[j_gov] = v_gov;
            sum_gov += v_gov;
        }

        if (!sum_gov) continue;

        let best_gov = 0;
        let bestPct_gov = 0;

        for (let j_gov = 0; j_gov < n_gov; j_gov++) {
            const pct_gov = (draws_gov[j_gov] / sum_gov) * 100;
            if (pct_gov > bestPct_gov) {
                bestPct_gov = pct_gov;
                best_gov = j_gov;
            }
        }

        wins_gov[names_gov[best_gov]]++;
    }

    for (const k_gov in wins_gov) wins_gov[k_gov] /= iterations_gov;
    return wins_gov;
}

function sigmaFromPolls_gov(polls_gov) {
    let nEff_gov = 0;
    for (const p_gov of polls_gov) nEff_gov += p_gov.weight;
    return nEff_gov <= 0 ? 5 : Math.max(7, 10 / Math.sqrt(nEff_gov));
}

function computeStateOutcomes_gov(stateEstimates_gov, pollsByState_gov, marketPriors = {}) {
    const pollMap_gov = Object.fromEntries(pollsByState_gov.map(p_gov => [p_gov.state, p_gov.polls]));
    const outcomes_gov = Object.create(null);

    for (const state_gov in stateEstimates_gov) {
        const estimates_gov = stateEstimates_gov[state_gov];
        const polls_gov = pollMap_gov[state_gov] || [];

        const sigma_gov = sigmaFromPolls_gov(polls_gov);

        const candidatePct_gov = {};
        const candidateParty_gov = {};

        for (const c_gov in estimates_gov) {
            candidatePct_gov[c_gov] = estimates_gov[c_gov].pct;
            candidateParty_gov[c_gov] = estimates_gov[c_gov].party;
        }

        const pviAdjusted_gov = renormalizeEstimates_gov(
            applyPviToEstimates_gov(state_gov, estimates_gov, polls_gov)
        );

        const marketAdjusted_gov = applyMarketPriorToEstimates(state_gov, pviAdjusted_gov, marketPriors);

        for (const c_gov in marketAdjusted_gov) candidatePct_gov[c_gov] = marketAdjusted_gov[c_gov].pct;

        const sorted_gov = Object.entries(marketAdjusted_gov)
            .sort((a_gov, b_gov) => b_gov[1].pct - a_gov[1].pct);

        const margin_gov = sorted_gov.length >= 2
            ? sorted_gov[0][1].pct - sorted_gov[1][1].pct
            : 0;


        const winProbs_gov = monteCarloMulti_gov(
            candidatePct_gov,
            sigma_gov,
            candidateParty_gov,
            0
        );

        const winProbEntries_gov = Object.entries(winProbs_gov)
            .map(([c_gov, p_gov]) => [c_gov, { pct: p_gov, party: candidateParty_gov[c_gov] }])
            .sort((a_gov, b_gov) => b_gov[1].pct - a_gov[1].pct);

        const voteEntries_gov = Object.entries(marketAdjusted_gov)
            .sort((a_gov, b_gov) => b_gov[1].pct - a_gov[1].pct);

        outcomes_gov[state_gov] = {
            voteEstimates: marketAdjusted_gov,
            winProbabilities: Object.fromEntries(winProbEntries_gov),
            _sortedWinProbabilities_gov: winProbEntries_gov,
            _sortedVoteEstimates_gov: voteEntries_gov,
            margin: margin_gov
        };
    }

    return outcomes_gov;
}

async function getData_gov(url_gov) {
    const [response_gov, marketPrior] = await Promise.all([
        fetch(url_gov),
        getPolymarketPriors()
    ]);
    const csvText_gov = await response_gov.text();

    const parsed_gov = Papa.parse(csvText_gov, {
        header: true,
        dynamicTyping: true
    });

    const rows_gov = parsed_gov.data.filter(r_gov =>
        r_gov.stage === "general" &&
        r_gov.state &&
        !notGenYet_gov.includes(r_gov.state) &&
        new Date(r_gov.created_at) >= new Date("2026-1-01")
    );

    const polls_gov = groupByPollId_gov(rows_gov);
    const thresholded_gov = applyCandidateThreshold_gov(polls_gov, 2);
    const filtered_gov = filterPolls_gov(thresholded_gov);

    const byState_gov = groupPollsByState_gov(filtered_gov);
    const estimates_gov = computeStateEstimates_gov(byState_gov);
    const outcomes_gov = computeStateOutcomes_gov(estimates_gov, byState_gov, marketPrior);

    return outcomes_gov;
}

function runMap_gov() {
    getData_gov(Link_gov).then(outcomes_gov => {
        for (const state_gov in outcomes_gov) {
            const outcome_gov = outcomes_gov[state_gov];
            outcome_gov.winner_gov =
                Object.entries(outcome_gov.winProbabilities)
                    .sort((a_gov,b_gov) => b_gov[1].pct - a_gov[1].pct)[0][0];

            let winningParty_gov = outcome_gov.winProbabilities[outcome_gov.winner_gov].party;

            const prob_gov = {
                solid: outcome_gov.winProbabilities[outcome_gov.winner_gov].pct > 0.95,
                likely: outcome_gov.winProbabilities[outcome_gov.winner_gov].pct > 0.8,
                lean: outcome_gov.winProbabilities[outcome_gov.winner_gov].pct > 0.65,
                tilt: outcome_gov.winProbabilities[outcome_gov.winner_gov].pct >= 0.5 
            };

            const rating_gov = Object.keys(prob_gov).find(key_gov => prob_gov[key_gov]);
            const ratingKey_gov = rating_gov + winningParty_gov[0];
            applyColor("gov", state_gov, ratingKey_gov);
            govSeats[ratingKey_gov] = (govSeats[ratingKey_gov] || 0) + 1;

            let string_gov = "<b>Win Probability:</b><br>";
            outcome_gov._sortedWinProbabilities_gov.forEach(element_gov => {
                string_gov += ["0.00"].includes((element_gov[1].pct * 100).toFixed(2))
                    ? ""
                    : `${element_gov[0]}: ${((element_gov[1].pct * 100).toFixed(2))}%<br>`;
            });

            string_gov += ["AK", "ME"].includes(state_gov)
                ? "<b>Vote Estimate (first round):</b><br>"
                : "<b>Vote Estimate:</b><br>";

            outcome_gov._sortedVoteEstimates_gov.forEach(element_gov => {
                string_gov += ["0.00"].includes((element_gov[1].pct).toFixed(2))
                    ? ""
                    : `${element_gov[0]}: ${((element_gov[1].pct).toFixed(2))}%<br>`;
            });

            changeDesc("gov", state_gov, string_gov);
        }

        const noElec_gov = ["WA", "UT", "MT", "ND", "MO", "LA", "MS", "KY", "IN", "WV", "VA", "NC", "DE", "NJ"];
        noElec_gov.forEach(element_gov => {
            applyColor("gov", element_gov, "noElec");
            changeDesc("gov", element_gov, "No election");
        });

        mapLookup["gov"].refresh();
        govSeats.UNK = 50 - govSeats.DEM - govSeats.REP - govSeats.IND
            - govSeats.solidD - govSeats.likelyD - govSeats.leanD - govSeats.tiltD
            - govSeats.solidR - govSeats.likelyR - govSeats.leanR - govSeats.tiltR
            - govSeats.solidI - govSeats.likelyI - govSeats.leanI - govSeats.tiltI
            - govSeats.solidL - govSeats.likelyL - govSeats.leanL - govSeats.tiltL;
        testGovSeats();
        console.timeEnd("gov");
    });
}
console.time("gov");
document.addEventListener('DOMContentLoaded', () => runMap_gov());