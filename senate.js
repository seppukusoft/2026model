const senateLink = "https://www.nytimes.com/newsgraphics/polls/senate.csv";

const senateNotGenYet = ["US"];

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
    TX: "x cornyn",
    KY: "x barr"
};

const cookPVI = {
    AL:  15, AK: 6,  AZ: 2,  AR: 15, CA: -12, CO: -6, CT: -8,  DE: -8,
    FL:  7,  GA: 2,  HI: -13, ID: 18, IL: -6,  IN: 9,  IA: 6,   KS: 8,
    KY:  15, LA: 11, ME: -4,  MD: -15, MA: -14, MI: 0,  MN: -3,
    MS:  11, MO: 9,  MT: 10,  NE: 8,  NV: 1,   NH: -2, NJ: -4,  NM: -4,
    NY:  -8, NC: 1,  ND: 18,  OH: 5,  OK: 17,  OR: -8, PA: 1,   RI: -8,
    SC:  8,  SD: 15, TN: 14,  TX: 6,  UT: 11,  VT: -17, VA: -3, WA: -10,
    WV:  21, WI: 0,  WY: 23
};

const SENATE_EXCLUDE_RE = /undecided|don't know|daines|ryan|crockett|other|refused|someone else|would not vote/i;

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
        extraRowFilter:       row => row.display_name !== "Praecones Analytica",
    }).then(outcomes => {
        //console.log(outcomes)
        for (const state in outcomes) {
            const outcome = outcomes[state];
            const [[winner, winnerData]] = outcome._sortedWinProbabilities;
            const winningParty = winnerData.party;
            const p = winnerData.pct;

            const rating    = p >= 0.95 ? "solid" : p >= 0.8 ? "likely" : p >= 0.65 ? "lean" : "tilt";
            const ratingKey = rating + winningParty[0];
            applyColor("senate", state, ratingKey);
            senateSeats[ratingKey] = (senateSeats[ratingKey] || 0) + 1;

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
            changeDesc("senate", state, string);
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
        console.timeEnd("senate");
    });
}

console.time("senate");
document.addEventListener("DOMContentLoaded", () => runSenateMap());