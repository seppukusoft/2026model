document.addEventListener("DOMContentLoaded", async () => {
    let data;
    try {
        const idxRes = await fetch("./results/latest.json");
        if (!idxRes.ok) throw new Error(`HTTP ${idxRes.status}`);
        const { file } = await idxRes.json();

        const res = await fetch(`./results/${file}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        data = await res.json();
    } catch (err) {
        console.error("loader.js: failed to fetch results.json", err);
        return;
    }

    const { senate, gov, house } = data;

    function applyRaceResults(type, raceData) {
        for (const [region, info] of Object.entries(raceData.regions)) {
            applyColor(type, region, info.color);

            for (const op of (info.nameOps ?? [])) {
                if (op.op === "append") changeName(type, region, op.value);
                else                    changeNameColor(type, region, op.value);
            }

            if (info.description) changeDesc(type, region, info.description);
            if (info.pulse)       pulseMap(type, region);
        }

        mapLookup[type].refresh();
    }

    applyRaceResults("senate", senate);
    renderSeatChart("senateChart", senate.seats, 50, 100);
    document.getElementById("senateSummary").innerHTML = senate.summaryHTML;

    applyRaceResults("gov", gov);
    renderSeatChart("govChart", gov.seats, 25, 50);
    document.getElementById("govSummary").innerHTML = gov.summaryHTML;

    applyRaceResults("house", house);
    renderSeatChart("houseChart", house.seats, 218, 435);
    document.getElementById("houseSummary").innerHTML = house.summaryHTML;
});
