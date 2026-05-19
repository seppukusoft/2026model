const houseLink = "https://www.nytimes.com/newsgraphics/polls/house.csv";

const houseNotGenYet = ["NM02", "TX34", "WA03", "MI04", "AZ06", "NC10",  "NE01", "NC14", "VA01", "WI01", "FL28", "TX23",   "MI07", "CA40"];

const housePrimaryWinnersByDistrict = {
    KY06: "ralph alvarado" ,
    MI10: "x hines",
    MT01: "x busse",
    ME02: "x dunlap"
};

const houseDistrictPVI = { 
    AK01:6, AL01:27, AL02:-5, AL03:23, AL04:33, AL05:15, AL06:20, AL07:-13, AR01:23, AR02:8, AR03:13, AR04:20, AZ01:1, AZ02:7, AZ03:-22, AZ04:-4, AZ05:10, AZ06:0, AZ07:-13, AZ08:8, AZ09:15, CA01:12, CA02:-24, CA03:2, CA04:-17, CA05:8, CA06:-8, CA07:-16, CA08:-24, CA09:-1, CA10:-18, CA11:-36, CA12:-39, CA13:1, CA14:-20, CA15:-26, CA16:-26, CA17:-21, CA18:-17, CA19:-18, CA20:15, CA21:-4, CA22:1, CA23:8, CA24:-13, CA25:-3, CA26:-8, CA27:-3, CA28:-15, CA29:-20, CA30:-22, CA31:-10, CA32:-17, CA33:-7, CA34:-28, CA35:-8, CA36:-21, CA37:-33, CA38:-10, CA39:-7, CA40:1, CA41:2, CA42:-18, CA43:-27, CA44:-19, CA45:-1, CA46:-11, CA47:-3, CA48:7, CA49:-4, CA50:-16, CA51:-13, CA52:-13, CO01:-29, CO02:-20, CO03:5, CO04:9, CO05:5, CO06:-11, CO07:-8, CO08:0, CT01:-12, CT02:-4, CT03:-8, CT04:-13, CT05:-3, DE01:-8, FL01:18, FL02:8, FL03:10, FL04:5, FL05:10, FL06:14, FL07:5, FL08:11, FL09:-4, FL10:-13, FL11:8, FL12:17, FL13:5, FL14:-5, FL15:5, FL16:7, FL17:11, FL18:14, FL19:14, FL20:-22, FL21:7, FL22:-4, FL23:-2, FL24:-18, FL25:-5, FL26:16, FL27:6, FL28:10, GA01:8, GA02:-4, GA03:15, GA04:-27, GA05:-36, GA06:-25, GA07:11, GA08:15, GA09:17, GA10:11, GA11:12, GA12:7, GA13:-21, GA14:19, HI01:-13, HI02:-12, IA01:4, IA02:4, IA03:2, IA04:15, ID01:22, ID02:13, IL01:-18, IL02:-18, IL03:-17, IL04:-17, IL05:-19, IL06:-3, IL07:-34, IL08:-5, IL09:-19, IL10:-12, IL11:-6, IL12:22, IL13:-5, IL14:-3, IL15:20, IL16:11, IL17:-3, IN01:-1, IN02:13, IN03:16, IN04:15, IN05:8, IN06:16, IN07:-21, IN08:18, IN09:15, KS01:16, KS02:10, KS03:-2, KS04:12, KY01:23, KY02:20, KY03:-10, KY04:18, KY05:32, KY06:7, LA01:19, LA02:-17, LA03:22, LA04:26, LA05:18, LA06:-8, MA01:-8, MA02:-13, MA03:-11, MA04:-11, MA05:-24, MA06:-11, MA07:-34, MA08:-15, MA09:-6, MD01:8, MD02:-10, MD03:-12, MD04:-39, MD05:-17, MD06:-3, MD07:-31, MD08:-30, ME01:-11, ME02:4, MI01:11, MI02:15, MI03:-4, MI04:3, MI05:13, MI06:-12, MI07:0, MI08:1, MI09:16, MI10:3, MI11:-9, MI12:-21, MI13:-22, MN01:6, MN02:-3, MN03:-11, MN04:-18, MN05:-32, MN06:10, MN07:18, MN08:7, MO01:-29, MO02:4, MO03:13, MO04:21, MO05:-12, MO06:19, MO07:21, MO08:27, MS01:18, MS02:-11, MS03:14, MS04:21, MT01:5, MT02:15, NC01:3, NC02:-17, NC03:10, NC04:-23, NC05:9, NC06:9, NC07:7, NC08:10, NC09:8, NC10:9, NC11:5, NC12:-24, NC13:8, NC14:8, ND01:18, NE01:6, NE02:-3, NE03:27, NH01:-2, NH02:-2, NJ01:-10, NJ02:5, NJ03:-5, NJ04:14, NJ05:-2, NJ06:-5, NJ07:0, NJ08:-15, NJ09:-2, NJ10:-27, NJ11:-5, NJ12:-13, NM01:-7, NM02:0, NM03:-3, NV01:-2, NV02:7, NV03:-1, NV04:-2, NY01:4, NY02:6, NY03:0, NY04:-2, NY05:-24, NY06:-6, NY07:-25, NY08:-24, NY09:-22, NY10:-32, NY11:10, NY12:-33, NY13:-32, NY14:-19, NY15:-27, NY16:-18, NY17:-1, NY18:-2, NY19:-1, NY20:-8, NY21:10, NY22:-4, NY23:10, NY24:11, NY25:-10, NY26:-11, OH01:-3, OH02:24, OH03:-21, OH04:18, OH05:14, OH06:16, OH07:5, OH08:12, OH09:3, OH10:3, OH11:-28, OH12:16, OH13:0, OH14:9, OH15:4, OK01:11, OK02:28, OK03:23, OK04:17, OK05:9, OR01:-20, OR02:14, OR03:-24, OR04:-6, OR05:-4, OR06:-6, PA01:-1, PA02:-19, PA03:-40, PA04:-8, PA05:-15, PA06:-6, PA07:1, PA08:4, PA09:19, PA10:3, PA11:11, PA12:-10, PA13:23, PA14:17, PA15:19, PA16:11, PA17:-3, RI01:-12, RI02:-4, SC01:6, SC02:7, SC03:21, SC04:11, SC05:11, SC06:-13, SC07:12, SD01:15, TN01:29, TN02:17, TN03:18, TN04:21, TN05:8, TN06:17, TN07:10, TN08:21, TN09:-23, TX01:25, TX02:12, TX03:10, TX04:16, TX05:13, TX06:14, TX07:-12, TX08:16, TX09:-24, TX10:12, TX11:22, TX12:11, TX13:24, TX14:17, TX15:7, TX16:-11, TX17:14, TX18:-21, TX19:25, TX20:-12, TX21:11, TX22:9, TX23:7, TX24:7, TX25:18, TX26:11, TX27:14, TX28:2, TX29:-12, TX30:-25, TX31:11, TX32:-13, TX33:-19, TX34:0, TX35:-19, TX36:18, TX37:-26, TX38:10, UT01:10, UT02:10, UT03:10, UT04:14, VA01:3, VA02:0, VA03:-18, VA04:-17, VA05:6, VA06:12, VA07:-2, VA08:-26, VA09:22, VA10:-6, VA11:-18, VT01:-17, WA01:-15, WA02:-12, WA03:2, WA04:10, WA05:5, WA06:-10, WA07:-39, WA08:-3, WA09:-22, WA10:-9, WI01:2, WI02:-21, WI03:3, WI04:-26, WI05:11, WI06:8, WI07:11, WI08:8, WV01:22, WV02:20, WY01:23 

};

const houseExcludeRe = /undecided|don't know|dembo|dotson|don't know|other|refused|someone else|would not vote/i;

const housePartyCache = Object.create(null);

function houseNormalizeParty(p) {
    if (!p) return "IND";

    const key = String(p).toUpperCase();

    return housePartyCache[key] ??= (
        key.includes("DEM") ? "DEM" :
        key.includes("REP") ? "REP" :
        key.includes("LIB") ? "LIB" :
        "IND"
    );
}

function houseGetLastName(name) {
    if (!name) return "";
    return name._houseLastName ??= name
        .toLowerCase()
        .replace(/[^a-z\s]/g, "")
        .trim()
        .split(/\s+/)
        .pop();
}

function houseFixKnownIndependents(district, name) {
    return null;
}

function houseDistrictCode(row) {
    if (row.state && row.seat_number < 10) {
        return `${row.state}0${row.seat_number}`;
    }
    return `${row.state}${row.seat_number}`;
}

function houseApplyPartisanSponsorDiscount(poll) {
    const sp = poll.sponsorParty;

    return poll.responses.map(r => {
        if (r.party === sp) {
            //console.log("Discounting", r.candidate, "from", r.pct, "to", (r.pct || 0) * 0.85);
            return { ...r, pct: (r.pct || 0) * 0.85 };
        }
        return r;
    });
}

function houseGroupByPollId(rows) {
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
                district: houseDistrictCode(row),
                state: row.state,
                seat_number: row.seat_number,
                pollster: row.pollster,
                start_date: row.start_date,
                end_date: row.end_date,
                sample_size: row.sample_size,
                sponsorParty:houseNormalizeParty(row.partisan),
                _endDate: endDate,
                weight: Math.sqrt(row.sample_size || 500) *
                        Math.exp(-(Date.now() - endDate) / 86400000 / 30),
                responses: []
            };
        }

        poll.responses.push({
            candidate: row.candidate_name,
            party: houseNormalizeParty(row.party),
            pct: row.pct
        });
    }

    return Object.values(polls);
}

function houseApplyCandidateThreshold(polls, minPolls = 3) {
    const counts = Object.create(null);

    for (const poll of polls) {
        const district = poll.district;
        const seen = new Set();
        counts[district] ??= Object.create(null);

        for (const r of poll.responses) {
            if (houseExcludeRe.test(r.candidate)) continue;
            if (seen.has(r.candidate)) continue;
            seen.add(r.candidate);
            counts[district][r.candidate] = (counts[district][r.candidate] || 0) + 1;
        }
    }

    for (const poll of polls) {
        const allowed = counts[poll.district];
        poll.responses = poll.responses.filter(r =>
            !houseExcludeRe.test(r.candidate) &&
            (allowed[r.candidate] || 0) >= minPolls
        );
    }

    return polls;
}

function houseGroupPollsByDistrict(polls) {
    const byDistrict = Object.create(null);
    for (const p of polls) (byDistrict[p.district] ??= []).push(p);
    return Object.entries(byDistrict).map(([district, polls]) => ({ district, polls }));
}

function houseFilterPolls(polls) {
    const filtered = polls.filter(poll => {
        for (const r of poll.responses) {
            r._candidateLC ??= r.candidate.toLowerCase();
            if (r._candidateLC.includes("generic")) {
                return false;
            }
        }

        const required = housePrimaryWinnersByDistrict[poll.district];
        if (required) {
            const requiredLast = houseGetLastName(required);

            const match = poll.responses.some(r => {
                return houseGetLastName(r.candidate) === requiredLast;
            });

            if (!match) {
                return false;
            }
        }

        return true;
    });

    const counts = Object.create(null);
    for (const p of filtered) counts[p.district] = (counts[p.district] || 0) + 1;

    return filtered.filter(p => {
        if (counts[p.district] < 2) {
            return false;
        }
        return true;
    });
}

function houseNormalizeResponses(poll) {
    if (poll._houseNormalized) return poll._houseNormalized;

    const discounted = houseApplyPartisanSponsorDiscount(poll);

    let sum = 0;
    const cleaned = [];

    for (const r of discounted) {
        if (!houseExcludeRe.test(r.candidate)) {
            cleaned.push(r);
            sum += r.pct || 0;
        }
    }

    if (!sum) return poll._houseNormalized = cleaned;

    const scale = 100 / sum;
    return poll._houseNormalized = cleaned.map(r => ({
        ...r,
        pct: r.pct * scale
    }));
}

function houseRenormalizeEstimates(estimates) {
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

function houseComputeDistrictEstimates(pollsByDistrict) {
    const results = Object.create(null);

    for (const { district, polls } of pollsByDistrict) {
        const totals = Object.create(null);
        const weights = Object.create(null);
        const parties = Object.create(null);

        for (const poll of polls) {
            const responses = houseNormalizeResponses(poll);

            for (const r of responses) {
                const c = r.candidate;

                totals[c] ??= 0;
                weights[c] ??= 0;

                const fixed = houseFixKnownIndependents(district, c);
                const party = fixed || houseNormalizeParty(r.party);

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

        results[district] = houseRenormalizeEstimates(out);
    }

    return results;
}

function housePviBiasForCandidate(party, pvi) {
    const PVI_STRENGTH = 0.3;

    if (party === "DEM") return -pvi * PVI_STRENGTH;
    if (party === "REP") return  pvi * PVI_STRENGTH;
    return 0;
}

function houseApplyPviToEstimates(district, estimates, polls) {
    const pvi = houseDistrictPVI[district] || 0;

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

function houseRandomNormal(mean = 0, sigma = 1) {
    let u = 0, v = 0;
    while (!u) u = Math.random();
    while (!v) v = Math.random();
    return mean + sigma * Math.sqrt(-2*Math.log(u)) * Math.cos(2*Math.PI*v);
}

function houseMonteCarloMulti(candidates, sigma, parties, pvi, iterations = 25000) {
    const names = Object.keys(candidates);
    const n = names.length;
    const wins = Object.fromEntries(names.map(k => [k, 0]));
    const draws = new Array(n);

    for (let i = 0; i < iterations; i++) {
        let sum = 0;

        for (let j = 0; j < n; j++) {
            const name = names[j];
            const bias = housePviBiasForCandidate(parties[name], pvi);
            const v = Math.max(0, houseRandomNormal(candidates[name] + bias, sigma));
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

function houseSigmaFromPolls(polls) {
    let nEff = 0;
    for (const p of polls) nEff += p.weight;
    return nEff <= 0 ? 5 : Math.max(7, 10 / Math.sqrt(nEff));
}

function houseComputeDistrictOutcomes(districtEstimates, pollsByDistrict, marketPriors = {}) {
    const pollMap = Object.fromEntries(pollsByDistrict.map(p => [p.district, p.polls]));
    const outcomes = Object.create(null);

    for (const district in districtEstimates) {
        const estimates = districtEstimates[district];
        const polls = pollMap[district] || [];

        const sigma = houseSigmaFromPolls(polls);

        const candidatePct = {};
        const candidateParty = {};

        for (const c in estimates) {
            candidatePct[c] = estimates[c].pct;
            candidateParty[c] = estimates[c].party;
        }

        const pviAdjusted = houseRenormalizeEstimates(houseApplyPviToEstimates(district, estimates, polls));

        const marketAdjusted = applyMarketPriorToEstimates(district, pviAdjusted, marketPriors);

        for (const c in marketAdjusted) candidatePct[c] = marketAdjusted[c].pct;

        const sorted = Object.entries(marketAdjusted).sort((a, b) => b[1].pct - a[1].pct);
        const margin = sorted.length >= 2 ? sorted[0][1].pct - sorted[1][1].pct : 0;


        const winProbs = houseMonteCarloMulti(
            candidatePct,
            sigma,
            candidateParty,
            0
        );

        const winProbEntries = Object.entries(winProbs)
            .map(([c, p]) => [c, { pct: p, party: candidateParty[c] }])
            .sort((a, b) => b[1].pct - a[1].pct);

        const voteEntries = Object.entries(marketAdjusted)
            .sort((a, b) => b[1].pct - a[1].pct);

        outcomes[district] = {
            voteEstimates: marketAdjusted,
            winProbabilities: Object.fromEntries(winProbEntries),
            _sortedWinProbabilities: winProbEntries,
            _sortedVoteEstimates: voteEntries,
            margin
        };
    }

    return outcomes;
}

async function houseGetData(url) {
    const [response, marketPrior] = await Promise.all([
        fetch(url),
        getPolymarketPriors()
    ]);
    const csvText = await response.text();

    const parsed = Papa.parse(csvText, {
        header: true,
        dynamicTyping: true
    });

    const rows = parsed.data.filter(r =>
        r.stage === "general" &&
        r.state &&
        r.seat_number != null &&
        !houseNotGenYet.includes(houseDistrictCode(r)) &&
        new Date(r.created_at) >= new Date("2026-01-01")
    );

    const polls = houseGroupByPollId(rows);
    const thresholded = houseApplyCandidateThreshold(polls, 2);
    const filtered = houseFilterPolls(thresholded);

    const byDistrict = houseGroupPollsByDistrict(filtered);
    const estimates = houseComputeDistrictEstimates(byDistrict);
    const outcomes = houseComputeDistrictOutcomes(estimates, byDistrict, marketPrior);

    return outcomes;
}

function houseMapDistrictCode(district) {
    if (district.endsWith("01")) {
        const state = district.slice(0, 2);

        const atLargeStates = new Set([
            "AK", "VT", "WY", "ND", "SD", "DE"
        ]);

        if (atLargeStates.has(state)) {
            return state + "00";
        }
    }

    return district;
}

function runHouseMap() {
    houseGetData(houseLink).then(outcomes => {
        for (const district in outcomes) {
            const outcome = outcomes[district];
            //console.log(district, outcome);
            outcome.winner = Object.entries(outcome.winProbabilities)
                .sort((a,b) => b[1].pct - a[1].pct)[0][0];

            const winningParty = outcome.winProbabilities[outcome.winner].party;

            const prob = {
                solid:  outcome.winProbabilities[outcome.winner].pct > 0.95,
                likely: outcome.winProbabilities[outcome.winner].pct > 0.8,
                lean:   outcome.winProbabilities[outcome.winner].pct > 0.66,
                tilt:   outcome.winProbabilities[outcome.winner].pct >= 0
            };

            const rating = Object.keys(prob).find(key => prob[key]);
            const mapDistrict = houseMapDistrictCode(district);

            //console.log(mapDistrict, outcome.winner, winningParty, rating);
            applyColor("house", mapDistrict, rating + winningParty[0]);

            let string = "<b>Win Probability:</b><br>";
            outcome._sortedWinProbabilities.forEach(element => {
                string += ["0.00"].includes((element[1].pct * 100).toFixed(2))
                    ? ""
                    : `${element[0]}: ${(element[1].pct * 100).toFixed(2)}%<br>`;
            });

            string += "<b>Vote Estimate:</b><br>";
            outcome._sortedVoteEstimates.forEach(element => {
                string += ["0.00"].includes((element[1].pct).toFixed(2))
                    ? ""
                    : `${element[0]}: ${(element[1].pct).toFixed(2)}%<br>`;
            });
            //console.log("house", mapDistrict, string);
            changeDesc("house", mapDistrict, string);
        }

        mapLookup["house"].refresh();
        //console.timeEnd("House total time");
    });
}

//console.time("House total time");
runHouseMap();

