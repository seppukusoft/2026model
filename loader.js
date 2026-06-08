document.addEventListener("DOMContentLoaded", async () => {
    let data;
    let fetchedFile;
    let dates = [];

    try {
        const idxRes = await fetch("./results/latest.json");
        if (!idxRes.ok) throw new Error(`HTTP ${idxRes.status}`);
        const { file, dates: _dates = [] } = await idxRes.json();
        dates = _dates;
        fetchedFile = file; 

        const date = file.replace("results_", "").replace(".json", "");
        const [resultsRes, senatePolls, govPolls, housePolls] = await Promise.all([
            fetch(`./results/${file}`).then(r => r.json()),
            fetch(`./polls/senate_${date}.json`).then(r => r.json()),
            fetch(`./polls/gov_${date}.json`).then(r => r.json()),
            fetch(`./polls/house_${date}.json`).then(r => r.json()),
        ]);
        data = resultsRes;

        const atLargeStates = new Set(["AK", "VT", "WY", "ND", "SD", "DE"]);
        function formatDistrict(d) {
            const state = d.slice(0, 2);
            const num   = d.slice(2);
            if (atLargeStates.has(state) && num === "01") return `${state}-AL`;
            return `${state}-${num}`;
        }

        function lastName(name) {
            if (name == "Someone else") return name;
            return name.trim().split(/\s+/).pop();
        }

        function renderPollsSection(tableId, pollsData, chamber) {
            const tbody     = document.querySelector(`#${tableId} tbody`);
            const searchInput = document.getElementById(`${tableId.replace("Table", "")}Search`);

            const sorted = pollsData
                .filter(p => p.responses.length >= 2)
                .sort((a, b) => new Date(b.end_date) - new Date(a.end_date));

            function draw() {
                const query = searchInput ? searchInput.value.toLowerCase().trim() : "";
                const filtered = !query ? sorted : sorted.filter(poll => {
                    const ch = chamber === "house"
                        ? formatDistrict(poll.district ?? "")
                        : (poll.state ?? "");
                    const candidateText = poll.responses.map(r => r.candidate).join(" ");
                    return [ch, poll.pollster, poll.start_date, poll.end_date, candidateText]
                        .join(" ").toLowerCase().includes(query);
                });

                tbody.innerHTML = "";
                for (const poll of filtered) {
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
            }

            if (searchInput) {
                if (searchInput._draw) searchInput.removeEventListener("input", searchInput._draw);
                searchInput._draw = draw;
                searchInput.addEventListener("input", draw);
            }
            draw();
        }

        renderPollsSection("senatePollsTable", senatePolls, "senate");
        renderPollsSection("govPollsTable",    govPolls,    "gov");
        renderPollsSection("housePollsTable",  housePolls,  "house");

    } catch (err) {
        console.error("loader.js: failed to fetch results.json", err);
        return;
    }

    const { senate, gov, house, generated } = data; 

    const activePulses = { senate: [], gov: [], house: [] };

    function applyRaceResults(type, raceData) {
        const targetMap = mapLookup[type];

        if (activePulses[type]) {
            activePulses[type].forEach(clearInterval);
            activePulses[type] = [];
        }

        for (const state in targetMap.mapdata.state_specific) {
            let st = targetMap.mapdata.state_specific[state];
            
            if (st.orig_name === undefined) {
                st.orig_name = st.name;
            }
            
            st.name = st.orig_name;
            st.description = "default"; 
        }

        for (const [region, info] of Object.entries(raceData.regions)) {
            applyColor(type, region, info.color);

            for (const op of (info.nameOps ?? [])) {
                if (op.op === "append") changeName(type, region, op.value);
                else                    changeNameColor(type, region, op.value);
            }

            if (info.description) changeDesc(type, region, info.description);
            
            if (info.pulse) {
                const pulseId = pulseMap(type, region);
                if (pulseId) activePulses[type].push(pulseId);
            }
        }

        targetMap.refresh();
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

    const dataCache = {};
    async function refreshChamber(type, key, chartId, summaryId, threshold, total, date) {
        if (!dataCache[date]) {
        const cacheKey = `results_${date}`;
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
            dataCache[date] = JSON.parse(cached);
        } else {
            const r = await fetch(`./results/results_${date}.json`);
            if (!r.ok) return;
            dataCache[date] = await r.json();
            sessionStorage.setItem(cacheKey, JSON.stringify(dataCache[date]));
        }
    }
        const raceData = dataCache[date][key];
        applyRaceResults(type, raceData);
        renderSeatChart(chartId, raceData.seats, threshold, total);
        document.getElementById(summaryId).innerHTML = raceData.summaryHTML;
    }

    const pollsCache = {};
    async function fetchAndRenderPolls(key, date) {
        const cacheKey = `${key}_${date}`;
        if (!pollsCache[cacheKey]) {
            const r = await fetch(`./polls/${key}_${date}.json`);
            if (!r.ok) return;
            pollsCache[cacheKey] = await r.json();
        }
        renderPollsSection(`${key}PollsTable`, pollsCache[cacheKey], key);
    }

    function setupSliders() {
        if (dates.length < 2) return;
        [
            ["senate", "senate", "senateChart", "senateSummary", 50,  100],
            ["gov",    "gov",    "govChart",    "govSummary",    25,  50],
            ["house",  "house",  "houseChart",  "houseSummary",  218, 435],
        ].forEach(([type, key, chartId, summaryId, threshold, total]) => {
            const row    = document.getElementById(`${key}SliderRow`);
            const slider = document.getElementById(`${key}DateSlider`);
            if (!row || !slider) return;
            slider.min   = 0;
            slider.max   = dates.length - 1;
            slider.value = dates.length - 1;
            document.getElementById(`${key}SliderMin`).textContent = dates[0];
            document.getElementById(`${key}SliderMax`).textContent = dates[dates.length - 1];
            document.getElementById(`${key}SliderLabel`).childNodes[0].textContent = dates[dates.length - 1] + " ";
            row.style.display = "";
            let debounce;
            slider.addEventListener("input", () => {
                const date = dates[parseInt(slider.value)];
                document.getElementById(`${key}SliderLabel`).childNodes[0].textContent = date + " ";
                document.getElementById(`${key}LatestBadge`).style.display = date === dates[dates.length - 1] ? "inline" : "none";
                clearTimeout(debounce);
                debounce = setTimeout(async () => {
                    await refreshChamber(type, key, chartId, summaryId, threshold, total, date);
                    await fetchAndRenderPolls(key, date);
                }, 0);
            });

            let autoplayTimeout = null;
            let autoplayIdx = 0;
            const btn = document.createElement("button");
            btn.textContent = "▶";
            btn.title = "Autoplay timeline";
            btn.style.cssText = "padding:1px 10px; font-size:0.9em; flex-shrink:0;";
            row.appendChild(btn);

            function stopPlay() {
                clearTimeout(autoplayTimeout);
                autoplayTimeout = null;
                btn.textContent = "▶";
            }
            async function runStep() {
                if (autoplayTimeout === null) return;
                const date = dates[autoplayIdx];
                slider.value = autoplayIdx;
                document.getElementById(`${key}SliderLabel`).childNodes[0].textContent = date + " ";
                document.getElementById(`${key}LatestBadge`).style.display = autoplayIdx === dates.length - 1 ? "inline" : "none";
                await refreshChamber(type, key, chartId, summaryId, threshold, total, date);
                await fetchAndRenderPolls(key, date);
                autoplayIdx++;
                if (autoplayIdx < dates.length && autoplayTimeout !== null) {
                    autoplayTimeout = setTimeout(runStep, 500);
                } else {
                    stopPlay();
                }
            }
            btn.addEventListener("click", () => {
                if (autoplayTimeout !== null) { stopPlay(); return; }
                autoplayIdx = 0;
                btn.textContent = "⏹";
                autoplayTimeout = setTimeout(runStep, 0);
            });
        });
    }
    setupSliders();

    function matchPollsHeight() {
        document.querySelectorAll('.map-polls-row').forEach(row => {
            const mapCol   = row.querySelector('.map-col');
            const pollsCol = row.querySelector('.polls-col');
            if (!mapCol || !pollsCol) return;
            const h = mapCol.offsetHeight;
            if (h > 0) pollsCol.style.height = h + 'px';
        });
    }

    function timeAgo(date) {
        if (!date) return "unknown time";
        const seconds = Math.floor((new Date() - date) / 1000);
        
        if (seconds < 0) return "just now";

        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60
        };

        for (const [unit, secondsInUnit] of Object.entries(intervals)) {
            const interval = Math.floor(seconds / secondsInUnit);
            if (interval >= 1) {
                return interval + " " + unit + (interval === 1 ? "" : "s") + " ago";
            }
        }
        return "just now";
    }

    const updatedAt = generated ? new Date(generated).getTime() : null;
    document.getElementById("lastUpdated").textContent = "Last updated " + timeAgo(updatedAt);

    setTimeout(matchPollsHeight, 500);
    window.addEventListener('resize', matchPollsHeight);

    function setupPollToggles() {
        [
            ['govPollsToggle',    'govPollsTable'],
            ['senatePollsToggle', 'senatePollsTable'],
            ['housePollsToggle',  'housePollsTable'],
        ].forEach(([btnId, tableId]) => {
            const btn = document.getElementById(btnId);
            if (!btn) return;
            const pollsCol = document.querySelector(`#${tableId}`).closest('.polls-col');
            const mapCol   = pollsCol.closest('.map-polls-row').querySelector('.map-col');
            let hidden = false;
            let savedHeight = document.querySelector('#map3_inner').style.height;

            btn.addEventListener('click', () => {
                hidden = !hidden;
                if (hidden) {
                    pollsCol.style.display = 'none';
                    btn.textContent = 'Show Polls';
                    window.dispatchEvent(new Event('resize'));
                } else {
                    pollsCol.style.display = '';
                    btn.textContent = 'Hide Polls';
                    if (savedHeight > 0) pollsCol.style.height = savedHeight;
                    window.dispatchEvent(new Event('resize'));
                }
            });
        });
    }

    setupPollToggles();
});