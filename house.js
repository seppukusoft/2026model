const houseLink = "https://www.nytimes.com/newsgraphics/polls/house.csv";

const houseNotGenYet = [
    "NM02", "TX34", "WA03", "MI04", "AZ06", "NC10", "NE01",
    "NC14", "VA01", "WI01", "FL28", "TX23", "MI07", "CA40"
];

const housePrimaryWinnersByDistrict = {
    KY06: "ralph alvarado",
    MI10: "x hines",
    MT01: "x busse",
    ME02: "x dunlap"
};

const houseDistrictPVI = {
    AK01:6, AL01:27, AL02:-5, AL03:23, AL04:33, AL05:15, AL06:20, AL07:-13, AR01:23, AR02:8, AR03:13, AR04:20, AZ01:1, AZ02:7, AZ03:-22, AZ04:-4, AZ05:10, AZ06:0, AZ07:-13, AZ08:8, AZ09:15, CA01:12, CA02:-24, CA03:2, CA04:-17, CA05:8, CA06:-8, CA07:-16, CA08:-24, CA09:-1, CA10:-18, CA11:-36, CA12:-39, CA13:1, CA14:-20, CA15:-26, CA16:-26, CA17:-21, CA18:-17, CA19:-18, CA20:15, CA21:-4, CA22:1, CA23:8, CA24:-13, CA25:-3, CA26:-8, CA27:-3, CA28:-15, CA29:-20, CA30:-22, CA31:-10, CA32:-17, CA33:-7, CA34:-28, CA35:-8, CA36:-21, CA37:-33, CA38:-10, CA39:-7, CA40:1, CA41:2, CA42:-18, CA43:-27, CA44:-19, CA45:-1, CA46:-11, CA47:-3, CA48:7, CA49:-4, CA50:-16, CA51:-13, CA52:-13, CO01:-29, CO02:-20, CO03:5, CO04:9, CO05:5, CO06:-11, CO07:-8, CO08:0, CT01:-12, CT02:-4, CT03:-8, CT04:-13, CT05:-3, DE01:-8, FL01:18, FL02:8, FL03:10, FL04:5, FL05:10, FL06:14, FL07:5, FL08:11, FL09:-4, FL10:-13, FL11:8, FL12:17, FL13:5, FL14:-5, FL15:5, FL16:7, FL17:11, FL18:14, FL19:14, FL20:-22, FL21:7, FL22:-4, FL23:-2, FL24:-18, FL25:-5, FL26:16, FL27:6, FL28:10, GA01:8, GA02:-4, GA03:15, GA04:-27, GA05:-36, GA06:-25, GA07:11, GA08:15, GA09:17, GA10:11, GA11:12, GA12:7, GA13:-21, GA14:19, HI01:-13, HI02:-12, IA01:4, IA02:4, IA03:2, IA04:15, ID01:22, ID02:13, IL01:-18, IL02:-18, IL03:-17, IL04:-17, IL05:-19, IL06:-3, IL07:-34, IL08:-5, IL09:-19, IL10:-12, IL11:-6, IL12:22, IL13:-5, IL14:-3, IL15:20, IL16:11, IL17:-3, IN01:-1, IN02:13, IN03:16, IN04:15, IN05:8, IN06:16, IN07:-21, IN08:18, IN09:15, KS01:16, KS02:10, KS03:-2, KS04:12, KY01:23, KY02:20, KY03:-10, KY04:18, KY05:32, KY06:7, LA01:19, LA02:-17, LA03:22, LA04:26, LA05:18, LA06:-8, MA01:-8, MA02:-13, MA03:-11, MA04:-11, MA05:-24, MA06:-11, MA07:-34, MA08:-15, MA09:-6, MD01:8, MD02:-10, MD03:-12, MD04:-39, MD05:-17, MD06:-3, MD07:-31, MD08:-30, ME01:-11, ME02:4, MI01:11, MI02:15, MI03:-4, MI04:3, MI05:13, MI06:-12, MI07:0, MI08:1, MI09:16, MI10:3, MI11:-9, MI12:-21, MI13:-22, MN01:6, MN02:-3, MN03:-11, MN04:-18, MN05:-32, MN06:10, MN07:18, MN08:7, MO01:-29, MO02:4, MO03:13, MO04:21, MO05:-12, MO06:19, MO07:21, MO08:27, MS01:18, MS02:-11, MS03:14, MS04:21, MT01:5, MT02:15, NC01:3, NC02:-17, NC03:10, NC04:-23, NC05:9, NC06:9, NC07:7, NC08:10, NC09:8, NC10:9, NC11:5, NC12:-24, NC13:8, NC14:8, ND01:18, NE01:6, NE02:-3, NE03:27, NH01:-2, NH02:-2, NJ01:-10, NJ02:5, NJ03:-5, NJ04:14, NJ05:-2, NJ06:-5, NJ07:0, NJ08:-15, NJ09:-2, NJ10:-27, NJ11:-5, NJ12:-13, NM01:-7, NM02:0, NM03:-3, NV01:-2, NV02:7, NV03:-1, NV04:-2, NY01:4, NY02:6, NY03:0, NY04:-2, NY05:-24, NY06:-6, NY07:-25, NY08:-24, NY09:-22, NY10:-32, NY11:10, NY12:-33, NY13:-32, NY14:-19, NY15:-27, NY16:-18, NY17:-1, NY18:-2, NY19:-1, NY20:-8, NY21:10, NY22:-4, NY23:10, NY24:11, NY25:-10, NY26:-11, OH01:-3, OH02:24, OH03:-21, OH04:18, OH05:14, OH06:16, OH07:5, OH08:12, OH09:3, OH10:3, OH11:-28, OH12:16, OH13:0, OH14:9, OH15:4, OK01:11, OK02:28, OK03:23, OK04:17, OK05:9, OR01:-20, OR02:14, OR03:-24, OR04:-6, OR05:-4, OR06:-6, PA01:-1, PA02:-19, PA03:-40, PA04:-8, PA05:-15, PA06:-6, PA07:1, PA08:4, PA09:19, PA10:3, PA11:11, PA12:-10, PA13:23, PA14:17, PA15:19, PA16:11, PA17:-3, RI01:-12, RI02:-4, SC01:6, SC02:7, SC03:21, SC04:11, SC05:11, SC06:-13, SC07:12, SD01:15, TN01:29, TN02:17, TN03:18, TN04:21, TN05:8, TN06:17, TN07:10, TN08:21, TN09:-23, TX01:25, TX02:12, TX03:10, TX04:16, TX05:13, TX06:14, TX07:-12, TX08:16, TX09:-24, TX10:12, TX11:22, TX12:11, TX13:24, TX14:17, TX15:7, TX16:-11, TX17:14, TX18:-21, TX19:25, TX20:-12, TX21:11, TX22:9, TX23:7, TX24:7, TX25:18, TX26:11, TX27:14, TX28:2, TX29:-12, TX30:-25, TX31:11, TX32:-13, TX33:-19, TX34:0, TX35:-19, TX36:18, TX37:-26, TX38:10, UT01:10, UT02:10, UT03:10, UT04:14, VA01:3, VA02:0, VA03:-18, VA04:-17, VA05:6, VA06:12, VA07:-2, VA08:-26, VA09:22, VA10:-6, VA11:-18, VT01:-17, WA01:-15, WA02:-12, WA03:2, WA04:10, WA05:5, WA06:-10, WA07:-39, WA08:-3, WA09:-22, WA10:-9, WI01:2, WI02:-21, WI03:3, WI04:-26, WI05:11, WI06:8, WI07:11, WI08:8, WV01:22, WV02:20, WY01:23
};

let houseSeats = {
    DEM: 0, REP: 0, IND: 0, UNK: 0,
    solidR: 0, likelyR: 0, leanR: 0, tiltR: 0,
    tiltD:  0, leanD:  0, likelyD: 0, solidD: 0,
    tiltI:  0, leanI:  0, likelyI: 0, solidI: 0,
    tiltL:  0, leanL:  0, likelyL: 0, solidL: 0,
};

const HOUSE_EXCLUDE_RE = /undecided|don't know|dembo|dotson|other|refused|someone else|would not vote/i;

const houseCurrentParty = { "AL01": "REP", "AL02": "DEM", "AL03": "REP", "AL04": "REP", "AL05": "REP", "AL06": "REP", "AL07": "DEM", "AK00": "REP", "AZ01": "REP", "AZ02": "REP", "AZ03": "DEM", "AZ04": "DEM", "AZ05": "REP", "AZ06": "REP", "AZ07": "DEM", "AZ08": "REP", "AZ09": "REP", "AR01": "REP", "AR02": "REP", "AR03": "REP", "AR04": "REP", "CA01": "REP", "CA02": "DEM", "CA03": "IND", "CA04": "DEM", "CA05": "REP", "CA06": "DEM", "CA07": "DEM", "CA08": "DEM", "CA09": "DEM", "CA10": "DEM", "CA11": "DEM", "CA12": "DEM", "CA13": "DEM", "CA14": "DEM", "CA15": "DEM", "CA16": "DEM", "CA17": "DEM", "CA18": "DEM", "CA19": "DEM", "CA20": "REP", "CA21": "DEM", "CA22": "REP", "CA23": "REP", "CA24": "DEM", "CA25": "DEM", "CA26": "DEM", "CA27": "DEM", "CA28": "DEM", "CA29": "DEM", "CA30": "DEM", "CA31": "DEM", "CA32": "DEM", "CA33": "DEM", "CA34": "DEM", "CA35": "DEM", "CA36": "DEM", "CA37": "DEM", "CA38": "DEM", "CA39": "DEM", "CA40": "REP", "CA41": "REP", "CA42": "DEM", "CA43": "DEM", "CA44": "DEM", "CA45": "DEM", "CA46": "DEM", "CA47": "DEM", "CA48": "REP", "CA49": "DEM", "CA50": "DEM", "CA51": "DEM", "CA52": "DEM", "CO01": "DEM", "CO02": "DEM", "CO03": "REP", "CO04": "REP", "CO05": "REP", "CO06": "DEM", "CO07": "DEM", "CO08": "REP", "CT01": "DEM", "CT02": "DEM", "CT03": "DEM", "CT04": "DEM", "CT05": "DEM", "DE00": "DEM", "FL01": "REP", "FL02": "REP", "FL03": "REP", "FL04": "REP", "FL05": "REP", "FL06": "REP", "FL07": "REP", "FL08": "REP", "FL09": "DEM", "FL10": "DEM", "FL11": "REP", "FL12": "REP", "FL13": "REP", "FL14": "DEM", "FL15": "REP", "FL16": "REP", "FL17": "REP", "FL18": "REP", "FL19": "REP", "FL20": "DEM", "FL21": "REP", "FL22": "DEM", "FL23": "DEM", "FL24": "DEM", "FL25": "DEM", "FL26": "REP", "FL27": "REP", "FL28": "REP", "GA01": "REP", "GA02": "DEM", "GA03": "REP", "GA04": "DEM", "GA05": "DEM", "GA06": "DEM", "GA07": "REP", "GA08": "REP", "GA09": "REP", "GA10": "REP", "GA11": "REP", "GA12": "REP", "GA13": "DEM", "GA14": "REP", "HI01": "DEM", "HI02": "DEM", "ID01": "REP", "ID02": "REP", "IL01": "DEM", "IL02": "DEM", "IL03": "DEM", "IL04": "DEM", "IL05": "DEM", "IL06": "DEM", "IL07": "DEM", "IL08": "DEM", "IL09": "DEM", "IL10": "DEM", "IL11": "DEM", "IL12": "REP", "IL13": "DEM", "IL14": "DEM", "IL15": "REP", "IL16": "REP", "IL17": "DEM", "IN01": "DEM", "IN02": "REP", "IN03": "REP", "IN04": "REP", "IN05": "REP", "IN06": "REP", "IN07": "DEM", "IN08": "REP", "IN09": "REP", "IA01": "REP", "IA02": "REP", "IA03": "REP", "IA04": "REP", "KS01": "REP", "KS02": "REP", "KS03": "DEM", "KS04": "REP", "KY01": "REP", "KY02": "REP", "KY03": "DEM", "KY04": "REP", "KY05": "REP", "KY06": "REP", "LA01": "REP", "LA02": "DEM", "LA03": "REP", "LA04": "REP", "LA05": "REP", "LA06": "DEM", "ME01": "DEM", "ME02": "DEM", "MD01": "REP", "MD02": "DEM", "MD03": "DEM", "MD04": "DEM", "MD05": "DEM", "MD06": "DEM", "MD07": "DEM", "MD08": "DEM", "MA01": "DEM", "MA02": "DEM", "MA03": "DEM", "MA04": "DEM", "MA05": "DEM", "MA06": "DEM", "MA07": "DEM", "MA08": "DEM", "MA09": "DEM", "MI01": "REP", "MI02": "REP", "MI03": "DEM", "MI04": "REP", "MI05": "REP", "MI06": "DEM", "MI07": "REP", "MI08": "DEM", "MI09": "REP", "MI10": "REP", "MI11": "DEM", "MI12": "DEM", "MI13": "DEM", "MN01": "REP", "MN02": "DEM", "MN03": "DEM", "MN04": "DEM", "MN05": "DEM", "MN06": "REP", "MN07": "REP", "MN08": "REP", "MS01": "REP", "MS02": "DEM", "MS03": "REP", "MS04": "REP", "MO01": "DEM", "MO02": "REP", "MO03": "REP", "MO04": "REP", "MO05": "DEM", "MO06": "REP", "MO07": "REP", "MO08": "REP", "MT01": "REP", "MT02": "REP", "NE01": "REP", "NE02": "REP", "NE03": "REP", "NV01": "DEM", "NV02": "REP", "NV03": "DEM", "NV04": "DEM", "NH01": "DEM", "NH02": "DEM", "NJ01": "DEM", "NJ02": "REP", "NJ03": "DEM", "NJ04": "REP", "NJ05": "DEM", "NJ06": "DEM", "NJ07": "REP", "NJ08": "DEM", "NJ09": "DEM", "NJ10": "DEM", "NJ11": "DEM", "NJ12": "DEM", "NM01": "DEM", "NM02": "DEM", "NM03": "DEM", "NY01": "REP", "NY02": "REP", "NY03": "DEM", "NY04": "DEM", "NY05": "DEM", "NY06": "DEM", "NY07": "DEM", "NY08": "DEM", "NY09": "DEM", "NY10": "DEM", "NY11": "REP", "NY12": "DEM", "NY13": "DEM", "NY14": "DEM", "NY15": "DEM", "NY16": "DEM", "NY17": "REP", "NY18": "DEM", "NY19": "DEM", "NY20": "DEM", "NY21": "REP", "NY22": "DEM", "NY23": "REP", "NY24": "REP", "NY25": "DEM", "NY26": "DEM", "NC01": "DEM", "NC02": "DEM", "NC03": "REP", "NC04": "DEM", "NC05": "REP", "NC06": "REP", "NC07": "REP", "NC08": "REP", "NC09": "REP", "NC10": "REP", "NC11": "REP", "NC12": "DEM", "NC13": "REP", "NC14": "REP", "ND00": "REP", "OH01": "DEM", "OH02": "REP", "OH03": "DEM", "OH04": "REP", "OH05": "REP", "OH06": "REP", "OH07": "REP", "OH08": "REP", "OH09": "DEM", "OH10": "REP", "OH11": "DEM", "OH12": "REP", "OH13": "DEM", "OH14": "REP", "OH15": "REP", "OK01": "REP", "OK02": "REP", "OK03": "REP", "OK04": "REP", "OK05": "REP", "OR01": "DEM", "OR02": "REP", "OR03": "DEM", "OR04": "DEM", "OR05": "DEM", "OR06": "DEM", "PA01": "REP", "PA02": "DEM", "PA03": "DEM", "PA04": "DEM", "PA05": "DEM", "PA06": "DEM", "PA07": "REP", "PA08": "REP", "PA09": "REP", "PA10": "REP", "PA11": "REP", "PA12": "DEM", "PA13": "REP", "PA14": "REP", "PA15": "REP", "PA16": "REP", "PA17": "DEM", "RI01": "DEM", "RI02": "DEM", "SC01": "REP", "SC02": "REP", "SC03": "REP", "SC04": "REP", "SC05": "REP", "SC06": "DEM", "SC07": "REP", "SD00": "REP", "TN01": "REP", "TN02": "REP", "TN03": "REP", "TN04": "REP", "TN05": "REP", "TN06": "REP", "TN07": "REP", "TN08": "REP", "TN09": "DEM", "TX01": "REP", "TX02": "REP", "TX03": "REP", "TX04": "REP", "TX05": "REP", "TX06": "REP", "TX07": "DEM", "TX08": "REP", "TX09": "DEM", "TX10": "REP", "TX11": "REP", "TX12": "REP", "TX13": "REP", "TX14": "REP", "TX15": "REP", "TX16": "DEM", "TX17": "REP", "TX18": "DEM", "TX19": "REP", "TX20": "DEM", "TX21": "REP", "TX22": "REP", "TX23": "REP", "TX24": "REP", "TX25": "REP", "TX26": "REP", "TX27": "REP", "TX28": "DEM", "TX29": "DEM", "TX30": "DEM", "TX31": "REP", "TX32": "DEM", "TX33": "DEM", "TX34": "DEM", "TX35": "DEM", "TX36": "REP", "TX37": "DEM", "TX38": "REP", "UT01": "REP", "UT02": "REP", "UT03": "REP", "UT04": "REP", "VT00": "DEM", "VA01": "REP", "VA02": "REP", "VA03": "DEM", "VA04": "DEM", "VA05": "REP", "VA06": "REP", "VA07": "DEM", "VA08": "DEM", "VA09": "REP", "VA10": "DEM", "VA11": "DEM", "WA01": "DEM", "WA02": "DEM", "WA03": "DEM", "WA04": "REP", "WA05": "REP", "WA06": "DEM", "WA07": "DEM", "WA08": "DEM", "WA09": "DEM", "WA10": "DEM", "WV01": "REP", "WV02": "REP", "WI01": "REP", "WI02": "DEM", "WI03": "REP", "WI04": "DEM", "WI05": "REP", "WI06": "REP", "WI07": "REP", "WI08": "REP", "WY00": "REP" };

let houseGains = { DEM: 0, REP: 0, IND: 0 };
let houseLosses = { DEM: 0, REP: 0, IND: 0 };

function houseDistrictCode(row) {
    return row.seat_number < 10
        ? `${row.state}0${row.seat_number}`
        : `${row.state}${row.seat_number}`;
}

function houseMapDistrictCode(district) {
    if (district.endsWith("01")) {
        const atLarge = new Set(["AK", "VT", "WY", "ND", "SD", "DE"]);
        if (atLarge.has(district.slice(0, 2))) return district.slice(0, 2) + "00";
    }
    return district;
}

function runHouseMap() {
    runRacePipeline(houseLink, {
        excludeRe:            HOUSE_EXCLUDE_RE,
        primaryWinners:       housePrimaryWinnersByDistrict,
        pviMap:               houseDistrictPVI,
        notGenYet:            houseNotGenYet,
        fixKnownIndependents: () => null,
        getRegionFromRow:     row => houseDistrictCode(row),
        regionKey:            "district",
        defaults:             houseDefaults,
        currentParty: houseCurrentParty,
        rcvRegions: ["AK00", "ME01", "ME02"],
        extraRowFilter:       row => row.seat_number != null,
    }).then(outcomes => {
        for (const district in outcomes) {
            const outcome = outcomes[district];
            const [[winner, winnerData]] = outcome._sortedWinProbabilities;
            const winningParty = winnerData.party;
            const p = winnerData.pct;
            const isFlip = houseCurrentParty[district] && winningParty !== houseCurrentParty[district];
            const rating     = p >= 0.95 ? "solid" : p >= 0.80 ? "likely" : p >= 0.65 ? "lean" : "tilt";
            const ratingKey  = rating + winningParty[0];
            const mapDistrict = houseMapDistrictCode(district);

            applyColor("house", mapDistrict, ratingKey);
            houseSeats[ratingKey] = (houseSeats[ratingKey] || 0) + 1;

            if (isFlip) {
                if (outcome._isDefault) changeName("house", mapDistrict, `<br>`);
                //console.log(district)
                houseGains[winningParty] = (houseGains[winningParty] || 0) + 1;
                houseLosses[houseCurrentParty[mapDistrict]] = (houseLosses[houseCurrentParty[mapDistrict]] || 0) + 1;
                pulseMap("house", mapDistrict); 
                changeName("house", mapDistrict, ` (FLIP ${houseCurrentParty[mapDistrict]} → ${winningParty})`);
                changeNameColor("house", mapDistrict, colorMapping["likely"+winningParty.slice(0, 1)]);
                //changeBorderColor("house", mapDistrict, colorMapping["likely"+houseCurrentParty[mapDistrict].slice(0, 1)]);
            }

            let string = "<b>Win Probability:</b><br>";
            for (const [name, { pct }] of outcome._sortedWinProbabilities) {
                if ((pct * 100).toFixed(2) !== "0.00")
                    string += `${name}: ${(pct * 100).toFixed(2)}%<br>`;
            }
            string += "<b>Vote Estimate:</b><br>";
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
            changeDesc("house", mapDistrict, string);

            if (outcome._isDefault) {
                changeName("house", mapDistrict, "* (default values)");
                changeNameColor("house", mapDistrict, "#FF0000");
            }
        }

        mapLookup["house"].refresh();
        houseSeats.UNK = 435
            - houseSeats.DEM    - houseSeats.REP    - houseSeats.IND
            - houseSeats.solidD - houseSeats.likelyD - houseSeats.leanD - houseSeats.tiltD
            - houseSeats.solidR - houseSeats.likelyR - houseSeats.leanR - houseSeats.tiltR
            - houseSeats.solidI - houseSeats.likelyI - houseSeats.leanI - houseSeats.tiltI
            - houseSeats.solidL - houseSeats.likelyL - houseSeats.leanL - houseSeats.tiltL;
        renderSeatChart('houseChart', houseSeats, 218, 435);

        const seatD = houseSeats.solidD + houseSeats.likelyD + houseSeats.leanD + houseSeats.tiltD;
        const seatR = houseSeats.solidR + houseSeats.likelyR + houseSeats.leanR + houseSeats.tiltR;
        const seatI = houseSeats.solidI + houseSeats.likelyI + houseSeats.leanI + houseSeats.tiltI;

        function netStr(party, color) {
            const net = (houseGains[party] || 0) - (houseLosses[party] || 0);
            if (net === 0) return "";
            const arrow = net > 0
                ? `<span style="color:#22c55e">▲ ${net}</span>`
                : `<span style="color:#ef4444">▼ ${Math.abs(net)}</span>`;
            return `<span style="color:${color}">${arrow}</span>`;
        }

        document.getElementById("houseSummary").innerHTML = `
            <span style="color:#577ccc"><b>D: ${seatD + houseSeats.DEM}</b>  ${netStr("DEM", "#577ccc")}</span>
            &nbsp;|&nbsp;
            <span style="color:#d22532"><b>R: ${seatR + houseSeats.REP}</b>  ${netStr("REP", "#d22532")}</span>
            ${seatI ? `<span style="color:#8e20c7"><b>+ ${seatI + houseSeats.IND} I</b> ${netStr("IND", "#8e20c7")}</span>` : ""}
        `;

        console.timeEnd("house");
    });
}

console.time("house");
document.addEventListener("DOMContentLoaded", () => runHouseMap());