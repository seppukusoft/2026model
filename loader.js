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

        const atLargeStates = new Set(["AK", "VT", "WY", "ND", "SD", "DE"]);
        function formatDistrict(d) {
            const state = d.slice(0, 2);
            const num   = d.slice(2);
            if (atLargeStates.has(state) && num === "01") return `${state}-AL`;
            return `${state}-${num}`;
        }

        function lastName(name) {
            return name.trim().split(/\s+/).pop();
        }

        function renderPollsSection(tableId, pollsData, chamber) {
            const tbody    = document.querySelector(`#${tableId} tbody`);
            const prevBtn  = document.querySelector(`#${tableId}-prev`);
            const nextBtn  = document.querySelector(`#${tableId}-next`);
            const pageInfo = document.querySelector(`#${tableId}-page`);
            const pageSize = 10;
            let page = 0;

            const sorted = pollsData
                .filter(p => p.responses.length >= 2)
                .sort((a, b) => new Date(b.end_date) - new Date(a.end_date));

            const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));

            function draw() {
                tbody.innerHTML = "";
                const slice = sorted.slice(page * pageSize, (page + 1) * pageSize);
                for (const poll of slice) {
                    const ch = chamber === "house"
                        ? formatDistrict(poll.district ?? "")
                        : (poll.state ?? "");

                    const results = poll.responses
                        .sort((a, b) => b.pct - a.pct)
                        .map(r => {
                            const color = r.party === "DEM" ? "#90acfc"
                                        : r.party === "REP" ? "#ff8b98"
                                        : r.party === "LIB" ? "#fff1a0"
                                        : "#b57edc";
                            return `<span style="color:${color}">${lastName(r.candidate)} ${r.pct.toFixed(1)}%</span>`;
                        }).join("<br>");

                    const tr = document.createElement("tr");
                    tr.innerHTML = `
                        <td>${ch}</td>
                        <td>${poll.pollster}</td>
                        <td style="white-space:nowrap">${poll.start_date} – ${poll.end_date}</td>
                        <td>${poll.sample_size ?? "—"}</td>
                        <td>${results}</td>
                    `;
                    tbody.appendChild(tr);
                }

                pageInfo.textContent = `${page + 1} / ${totalPages}`;
                prevBtn.disabled = page === 0;
                nextBtn.disabled = page >= totalPages - 1;
            }

            prevBtn.addEventListener("click", () => { page--; draw(); });
            nextBtn.addEventListener("click", () => { page++; draw(); });
            draw();
        }

        renderPollsSection("senatePollsTable", senatePolls, "senate");
        renderPollsSection("govPollsTable",    govPolls,    "gov");
        renderPollsSection("housePollsTable",  housePolls,  "house");

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

    function matchPollsHeight() {
        document.querySelectorAll(".map-polls-row").forEach(row => {
            const mapCol = row.querySelector(".map-col");
            const pollsCol = row.querySelector(".polls-col");
            if (!mapCol || !pollsCol) return;
            const h = mapCol.offsetHeight;
            if (h > 0) pollsCol.style.height = h + "px";
        });
    }

    setTimeout(matchPollsHeight, 500);
    window.addEventListener("resize", matchPollsHeight);
    function setupPollToggles() {
    [
        ["govPollsToggle",    "govPollsTable",    "govPollsTable-prev",    "govPollsTable-next",    "govPollsTable-page"],
        ["senatePollsToggle", "senatePollsTable", "senatePollsTable-prev", "senatePollsTable-next", "senatePollsTable-page"],
        ["housePollsToggle",  "housePollsTable",  "housePollsTable-prev",  "housePollsTable-next",  "housePollsTable-page"],
    ].forEach(([btnId, tableId, prevId, nextId, pageId]) => {
        const btn      = document.getElementById(btnId);
        const scroll   = document.querySelector(`#${tableId}`).closest(".polls-col");
        const pagination = scroll.nextElementSibling;
        let hidden = false;

        btn.addEventListener("click", () => {
            hidden = !hidden;
            scroll.style.display      = hidden ? "none" : "";
            pagination.style.display  = hidden ? "none" : "";
            btn.textContent           = hidden ? "Show Polls" : "Hide";
            matchPollsHeight();
        });
    });
}

setupPollToggles();
});