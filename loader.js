document.addEventListener("DOMContentLoaded", async () => {
    let data;
    try {
        const idxRes = await fetch("./results/latest.json");
        if (!idxRes.ok) throw new Error(`HTTP ${idxRes.status}`);
        const { file } = await idxRes.json();

        const res = await fetch(`./results/${file}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        data = await res.json();

        const date = file.replace("results_", "").replace(".json", "");
        const [senatePolls, govPolls, housePolls] = await Promise.all([
            fetch(`./polls/senate_${date}.json`).then(r => r.json()),
            fetch(`./polls/gov_${date}.json`).then(r => r.json()),
            fetch(`./polls/house_${date}.json`).then(r => r.json()),
        ]);

        function renderPollsTable(polls) {
            const tabs   = document.querySelectorAll(".polls-tab");
            const tbody  = document.querySelector("#pollsTable tbody");
            let current  = "senate";

            function draw(chamber) {
                tbody.innerHTML = "";
                for (const poll of polls[chamber]) {
                    if (poll.responses.length < 2) continue;
                    const results = poll.responses
                        .sort((a, b) => b.pct - a.pct)
                        .map(r => {
                            const color = r.party === "DEM" ? "#90acfc"
                                        : r.party === "REP" ? "#ff8b98"
                                        : "#b57edc";
                            return `<span style="color:${color}">${r.candidate} ${r.pct.toFixed(1)}%</span>`;
                        }).join(" &nbsp;·&nbsp; ");

                    const tr = document.createElement("tr");
                    const ch = current === "house" ? (poll.district ?? "") : (poll.state ?? "");
                    tr.innerHTML = `
                        <td>${ch ?? ""}</td>
                        <td>${poll.pollster}</td>
                        <td>${poll.start_date} – ${poll.end_date}</td>
                        <td>${poll.sample_size ?? "—"}</td>
                        <td>${results}</td>
                    `;
                    tbody.appendChild(tr);
                }
            }

            tabs.forEach(tab => tab.addEventListener("click", () => {
                tabs.forEach(t => t.removeAttribute("aria-current"));
                tab.setAttribute("aria-current", "true");
                current = tab.dataset.chamber;
                draw(current);
            }));

            draw(current);
        }   
        renderPollsTable({ senate: senatePolls, gov: govPolls, house: housePolls });
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
