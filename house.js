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
        extraRowFilter:       row => row.seat_number != null,
    }).then(outcomes => {
        for (const district in outcomes) {
            const outcome = outcomes[district];
            const [[winner, winnerData]] = outcome._sortedWinProbabilities;
            const winningParty = winnerData.party;
            const p = winnerData.pct;

            const rating     = p >= 0.95 ? "solid" : p >= 0.80 ? "likely" : p >= 0.65 ? "lean" : "tilt";
            const ratingKey  = rating + winningParty[0];
            const mapDistrict = houseMapDistrictCode(district);

            applyColor("house", mapDistrict, ratingKey);
            houseSeats[ratingKey] = (houseSeats[ratingKey] || 0) + 1;

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
            changeDesc("house", mapDistrict, string);
        }

        mapLookup["house"].refresh();
        houseSeats.UNK = 435
            - houseSeats.DEM    - houseSeats.REP    - houseSeats.IND
            - houseSeats.solidD - houseSeats.likelyD - houseSeats.leanD - houseSeats.tiltD
            - houseSeats.solidR - houseSeats.likelyR - houseSeats.leanR - houseSeats.tiltR
            - houseSeats.solidI - houseSeats.likelyI - houseSeats.leanI - houseSeats.tiltI
            - houseSeats.solidL - houseSeats.likelyL - houseSeats.leanL - houseSeats.tiltL;
        renderSeatChart('houseChart', houseSeats, 218, 435);
        console.timeEnd("house");
    });
}

console.time("house");
document.addEventListener("DOMContentLoaded", () => runHouseMap());