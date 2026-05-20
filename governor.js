const Link_gov = "https://www.nytimes.com/newsgraphics/polls/governor.csv";

const notGenYet_gov = ["US", "GA", "WI"];

const primaryWinnersByState_gov = {
    RI:  "x foulkes",
    OR:  "x drazan",
    FL:  "x donalds",
    MA:  "x minogue",
    MN:  "x lindell",
    NH:  "x warmington",
    NV:  "x lombardo",
    AK:  "x wilson",
    AZ:  "x biggs",
    MI:  "x james",
    WI:  "x tiffany"
};

const cookPVI_gov = {
    AL:  15, AK: 9,  AZ: 2,  AR: 15, CA: -12, CO: -6, CT: -8,  DE: -8,
    FL:  5,  GA: 2,  HI: -13, ID: 18, IL: -6,  IN: 9,  IA: 7,   KS: 8,
    KY:  15, LA: 11, ME: -4,  MD: -15, MA: -14, MI: 3,  MN: -3,
    MS:  11, MO: 9,  MT: 10,  NE: 10, NV: 1,   NH: -2, NJ: -4,  NM: -4,
    NY:  -8, NC: 1,  ND: 18,  OH: 3,  OK: 17,  OR: -8, PA: 2,   RI: -8,
    SC:  8,  SD: 15, TN: 14,  TX: 5,  UT: 11,  VT: -17, VA: -3, WA: -10,
    WV:  21, WI: 0,  WY: 23
};

const GOV_EXCLUDE_RE = /undecided|don't know|demings|dixon|lytle|pizzo|bell|other|refused|someone else|would not vote/i;

let govSeats = {
    DEM: 6, REP: 8, IND: 0, UNK: 0,
    solidR: 0, likelyR: 0, leanR: 0, tiltR: 0,
    tiltD:  0, leanD:  0, likelyD: 0, solidD: 0,
    tiltI:  0, leanI:  0, likelyI: 0, solidI: 0,
    tiltL:  0, leanL:  0, likelyL: 0, solidL: 0,
};

const GOV_NO_ELECTION = [
    "WA", "UT", "MT", "ND", "MO", "LA", "MS",
    "KY", "IN", "WV", "VA", "NC", "DE", "NJ"
];

function runMap_gov() {
    runRacePipeline(Link_gov, {
        excludeRe:            GOV_EXCLUDE_RE,
        primaryWinners:       primaryWinnersByState_gov,
        pviMap:               cookPVI_gov,
        notGenYet:            notGenYet_gov,
        fixKnownIndependents: (state, name) =>
            state === "MN" && name?.toLowerCase().includes("klobuchar") ? "DEM" : null,
        getRegionFromRow:     row => row.state,
        regionKey:            "state",
    }).then(outcomes => {
        for (const state in outcomes) {
            const outcome = outcomes[state];
            const [[winner, winnerData]] = outcome._sortedWinProbabilities;
            const winningParty = winnerData.party;
            const p = winnerData.pct;

            const rating    = p >= 0.95 ? "solid" : p >= 0.8 ? "likely" : p >= 0.65 ? "lean" : "tilt";
            const ratingKey = rating + winningParty[0];
            applyColor("gov", state, ratingKey);
            govSeats[ratingKey] = (govSeats[ratingKey] || 0) + 1;

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
            changeDesc("gov", state, string);
        }

        for (const state of GOV_NO_ELECTION) {
            applyColor("gov", state, "noElec");
            changeDesc("gov", state, "No election");
        }

        mapLookup["gov"].refresh();
        govSeats.UNK = 50
            - govSeats.DEM    - govSeats.REP    - govSeats.IND
            - govSeats.solidD - govSeats.likelyD - govSeats.leanD - govSeats.tiltD
            - govSeats.solidR - govSeats.likelyR - govSeats.leanR - govSeats.tiltR
            - govSeats.solidI - govSeats.likelyI - govSeats.leanI - govSeats.tiltI
            - govSeats.solidL - govSeats.likelyL - govSeats.leanL - govSeats.tiltL;
        renderSeatChart('govChart', govSeats, 25, 50);
        console.timeEnd("gov");
    });
}

console.time("gov");
document.addEventListener("DOMContentLoaded", () => runMap_gov());