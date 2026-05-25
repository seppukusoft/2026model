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
    AL:  15, AK: 6,  AZ: 0,  AR: 15, CA: -9, CO: -6, CT: -8,  DE: -8,
    FL:  8,  GA: 2,  HI: -13, ID: 18, IL: -6,  IN: 9,  IA: 6,   KS: 8,
    KY:  15, LA: 11, ME: -4,  MD: -15, MA: -10, MI: -3,  MN: -7,
    MS:  11, MO: 9,  MT: 6,  NE: 8,  NV: 1,   NH: -2, NJ: 0,  NM: -7,
    NY:  -8, NC: 1,  ND: 18,  OH: 3,  OK: 17,  OR: -8, PA: 1,   RI: -8,
    SC:  8,  SD: 15, TN: 14,  TX: 6,  UT: 11,  VT: -9, VA: -6, WA: -10,
    WV:  21, WI: -2,  WY: 23
};

const GOV_EXCLUDE_RE = /undecided|don't know|demings|dixon|lytle|duggan|stefanik|pizzo|bell|other|refused|someone else|would not vote/i;

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

const govCurrentParty = { "AL": "REP", "AK": "REP", "AZ": "DEM", "AR": "REP", "CA": "DEM", "CO": "DEM", "CT": "DEM", "FL": "REP", "GA": "REP", "HI": "DEM", "ID": "REP", "IL": "DEM", "IA": "REP", "KS": "DEM", "ME": "DEM", "MD": "DEM", "MA": "DEM", "MI": "DEM", "MN": "DEM", "NE": "REP", "NV": "REP", "NH": "REP", "NM": "DEM", "NY": "DEM", "OH": "REP", "OK": "REP", "OR": "DEM", "PA": "DEM", "RI": "DEM", "SC": "REP", "SD": "REP", "TN": "REP", "TX": "REP", "VT": "REP", "WI": "DEM", "WY": "REP" };

let govGains = { DEM: 0, REP: 0, IND: 0 };
let govLosses = { DEM: 0, REP: 0, IND: 0 };

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
        defaults:             govDefaults,
        ratingsUrl:           "./data-GiFps.csv",
        currentParty: govCurrentParty,
        rcvRegions: ["AK"]
    }).then(outcomes => {
        for (const state in outcomes) {
            const outcome = outcomes[state];
            const [[winner, winnerData]] = outcome._sortedWinProbabilities;
            const winningParty = winnerData.party;
            const p = winnerData.pct;
            const isFlip = govCurrentParty[state] && winningParty !== govCurrentParty[state];
            const rating    = p >= 0.95 ? "solid" : p >= 0.8 ? "likely" : p >= 0.65 ? "lean" : "tilt";
            const ratingKey = rating + winningParty[0];

            applyColor("gov", state, ratingKey);
            govSeats[ratingKey] = (govSeats[ratingKey] || 0) + 1;
           
            if (outcome._isDefault) {
                changeName("gov", state, "* (default values)");
                changeNameColor("gov", state, "#FF0000");
            }

            if (isFlip) {
                if (outcome._isDefault) changeName("gov", state, `<br>`);
                //console.log(state)
                govGains[winningParty] = (govGains[winningParty] || 0) + 1;
                govLosses[govCurrentParty[state]] = (govLosses[govCurrentParty[state]] || 0) + 1;
                pulseMap("gov", state); 
                changeName("gov", state, ` (FLIP ${govCurrentParty[state]} → ${winningParty})`);
                changeNameColor("gov", state, colorMapping["likely"+winningParty.slice(0, 1)]);
                //changeBorderColor("gov", state, colorMapping["likely"+govCurrentParty[state].slice(0, 1)]);
                //console.log("gov", state, govCurrentParty[state])
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

        const seatD = govSeats.solidD + govSeats.likelyD + govSeats.leanD + govSeats.tiltD;
        const seatR = govSeats.solidR + govSeats.likelyR + govSeats.leanR + govSeats.tiltR;
        const seatI = govSeats.solidI + govSeats.likelyI + govSeats.leanI + govSeats.tiltI;

        document.getElementById("govSummary").innerHTML = `
            <span style="color:#577ccc"><b>D: ${seatD + govSeats.DEM}</b>  ${netStr(govGains, govLosses, "DEM", "#577ccc")}</span>            
            ${seatI ? `&nbsp;|&nbsp; <span style="color:#8e20c7"><b>+ ${seatI + govSeats.IND} I (caucus D)</b> ${netStr(govGains, govLosses, "IND", "#8e20c7")}</span>` : ""}
            &nbsp;|&nbsp;
            <span style="color:#d22532"><b>R: ${seatR + govSeats.REP}</b>  ${netStr(govGains, govLosses, "REP", "#d22532")}</span>`;

        console.timeEnd("gov");
    });
}

console.time("gov");
document.addEventListener("DOMContentLoaded", () => runMap_gov());