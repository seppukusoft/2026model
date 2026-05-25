const senateLink = "https://www.nytimes.com/newsgraphics/polls/senate.csv";

const senateNotGenYet = ["US", "MS"];

const primaryWinnersByState = {
    NE: "dan osborn",
    ME: "graham platner",
    OH: "sherrod brown",
    SD: "julian beaudion",
    IA: "josh turek",
    GA: "mike collins",
    NH: "john sununu",
    MN: "x flanagan",
    KS: "x schmidt",
    MA: "x markey",
    FL: "x vindman",
    MI: "x el-sayed",
    TX: "x paxton",
    KY: "x barr"
};

const cookPVI = {
    AL:  15, AK: 6,  AZ: 0,  AR: 15, CA: -9, CO: -6, CT: -8,  DE: -8,
    FL:  8,  GA: 2,  HI: -13, ID: 18, IL: -6,  IN: 9,  IA: 6,   KS: 8,
    KY:  15, LA: 11, ME: -4,  MD: -15, MA: -10, MI: -3,  MN: -7,
    MS:  11, MO: 9,  MT: 6,  NE: 8,  NV: 1,   NH: -2, NJ: 0,  NM: -7,
    NY:  -8, NC: 1,  ND: 18,  OH: 3,  OK: 17,  OR: -8, PA: 1,   RI: -8,
    SC:  8,  SD: 15, TN: 14,  TX: 6,  UT: 11,  VT: -9, VA: -6, WA: -10,
    WV:  21, WI: -2,  WY: 23
};

const SENATE_EXCLUDE_RE = /undecided|don't know|daines|ryan|allred|crockett|other|refused|someone else|would not vote/i;

let senateSeats = {
    DEM: 32, REP: 31, IND: 2, UNK: 0,
    solidR: 0, likelyR: 0, leanR: 0, tiltR: 0,
    tiltD:  0, leanD:  0, likelyD: 0, solidD: 0,
    tiltI:  0, leanI:  0, likelyI: 0, solidI: 0,
    tiltL:  0, leanL:  0, likelyL: 0, solidL: 0,
};

const SENATE_NO_ELECTION = [
    "HI", "CA", "NV", "UT", "AZ", "WA", "ND", "MO",
    "WI", "IN", "PA", "NY", "MD", "VT", "CT"
];

const senateCurrentParty = { "VA": "DEM", "AL": "REP", "NC": "REP", "AK": "REP", "MN": "DEM", "NH": "DEM", "SD": "REP", "ID": "REP", "NE": "REP", "RI": "DEM", "NM": "DEM", "MI": "DEM", "GA": "DEM", "WV": "REP", "FL": "REP", "OR": "DEM", "KY": "REP", "KS": "REP", "MA": "DEM", "WY": "REP", "OH": "REP", "MS": "REP", "CO": "DEM", "TN": "REP", "SC": "REP", "IA": "REP", "IL": "DEM", "MT": "REP", "AR": "REP", "TX": "REP", "DE": "DEM", "ME": "REP", "LA": "REP", "NJ": "DEM", "OK": "REP" };

let senateGains = { DEM: 0, REP: 0, IND: 0 };
let senateLosses = { DEM: 0, REP: 0, IND: 0 };

function runSenateMap() {
    runRacePipeline(senateLink, {
        excludeRe:            SENATE_EXCLUDE_RE,
        primaryWinners:       primaryWinnersByState,
        pviMap:               cookPVI,
        notGenYet:            senateNotGenYet,
        fixKnownIndependents: (state, name) =>
            state === "NE" && name?.toLowerCase().includes("osborn") ? "IND" : null,
        getRegionFromRow:     row => row.state,
        regionKey:            "state",
        defaults: senateDefaults,
        extraRowFilter:       row => row.display_name !== "Praecones Analytica",
        currentParty:         senateCurrentParty,
        ratingsUrl:           "./data-GiFps.csv",
        rcvRegions:           ["AK", "ME"]
    }).then(outcomes => {
        //console.log(outcomes)
        for (const state in outcomes) {
            const outcome = outcomes[state];
            const [[winner, winnerData]] = outcome._sortedWinProbabilities;
            const winningParty = winnerData.party;
            const p = winnerData.pct;
            const isFlip = senateCurrentParty[state] && winningParty !== senateCurrentParty[state];
            const rating    = p >= 0.95 ? "solid" : p >= 0.8 ? "likely" : p >= 0.65 ? "lean" : "tilt";
            const ratingKey = rating + winningParty[0];

            applyColor("senate", state, ratingKey);
            senateSeats[ratingKey] = (senateSeats[ratingKey] || 0) + 1;

            if (isFlip) {
                if (outcome._isDefault) changeName("senate", state, `<br>`);
                senateGains[winningParty] = (senateGains[winningParty] || 0) + 1;
                senateLosses[senateCurrentParty[state]] = (senateLosses[senateCurrentParty[state]] || 0) + 1;
                pulseMap("senate", state); 
                changeName("senate", state, ` (FLIP ${senateCurrentParty[state]} → ${winningParty})`);
                changeNameColor("senate", state, colorMapping["likely"+winningParty.slice(0, 1)]);
                //changeBorderColor("senate", state, colorMapping["likely"+senateCurrentParty[state].slice(0, 1)]);
            }

            let string = "<b>Win Probability:</b><br>";
            for (const [name, { pct }] of outcome._sortedWinProbabilities) {
                if ((pct * 100).toFixed(2) !== "0.00")
                    string += `${name}: ${(pct * 100).toFixed(2)}%<br>`;
            }
            string += ["AK", "ME"].includes(state)
                ? "<b>Vote Estimate (first round):</b><br>"
                : "<b>Vote Estimate:</b><br>";
            for (const [name, { pct }] of outcome._sortedVoteEstimates) {
                if (pct.toFixed(2) !== "0.00")
                    string += `${name}: ${pct.toFixed(2)}%<br>`;
            }

            if (outcome._rcvFinalEstimates) {
                string += "<b>Vote Estimate (final round):</b><br>";
                const finalSorted = Object.entries(outcome._rcvFinalEstimates).sort((a, b) => b[1].pct - a[1].pct);
                for (const [name, { pct }] of finalSorted) {
                    string += `${name}: ${pct.toFixed(2)}%<br>`;
                }
                if (outcome._rcvEliminationOrder.length) {
                    string += `<i>Eliminated: ${outcome._rcvEliminationOrder.join(" → ")}</i><br>`;
                }
            }
            changeDesc("senate", state, string);

            if (outcome._isDefault) {
                changeName("senate", state, "* (default values)");
                changeNameColor("senate", state, "#FF0000");
            }
        }

        for (const state of SENATE_NO_ELECTION) {
            applyColor("senate", state, "noElec");
            changeDesc("senate", state, "No election");
        }

        mapLookup["senate"].refresh();
        senateSeats.UNK = 100
            - senateSeats.DEM    - senateSeats.REP    - senateSeats.IND
            - senateSeats.solidD - senateSeats.likelyD - senateSeats.leanD - senateSeats.tiltD
            - senateSeats.solidR - senateSeats.likelyR - senateSeats.leanR - senateSeats.tiltR
            - senateSeats.solidI - senateSeats.likelyI - senateSeats.leanI - senateSeats.tiltI
            - senateSeats.solidL - senateSeats.likelyL - senateSeats.leanL - senateSeats.tiltL;
        renderSeatChart('senateChart', senateSeats, 50, 100);

        const seatD = senateSeats.solidD + senateSeats.likelyD + senateSeats.leanD + senateSeats.tiltD;
        const seatR = senateSeats.solidR + senateSeats.likelyR + senateSeats.leanR + senateSeats.tiltR;
        const seatI = senateSeats.solidI + senateSeats.likelyI + senateSeats.leanI + senateSeats.tiltI;

        document.getElementById("senateSummary").innerHTML = `
            <span style="color:#577ccc"><b>D: ${seatD + senateSeats.DEM}</b>  ${netStr(senateGains, senateLosses, "DEM", "#577ccc")}</span>
            ${seatI ? `<span style="color:#8e20c7"><b>+ ${seatI + senateSeats.IND} I</b> ${netStr(senateGains, senateLosses, "IND", "#8e20c7")}</span>` : ""}
            &nbsp;|&nbsp;
            <span style="color:#d22532"><b>R: ${seatR + senateSeats.REP}</b>  ${netStr(senateGains, senateLosses, "REP", "#d22532")}</span>
        `;

        console.timeEnd("senate");
    });
}

console.time("senate");
document.addEventListener("DOMContentLoaded", () => runSenateMap());