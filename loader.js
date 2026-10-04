document.addEventListener("DOMContentLoaded", async () => {

    const MODELS = {
        v1: { name: "Original Model", resultsDir: "./results",    pollsDir: "./polls"    },
        v2: { name: "Model v2",       resultsDir: "./results_v2", pollsDir: "./polls_v2" },
    };
    const DEFAULT_MODEL = "v1";

    let currentModel = DEFAULT_MODEL;
    let modelEpoch   = 0;      

    const CHAMBERS = [
        { type: "senate", key: "senate", chartId: "senateChart", summaryId: "senateSummary", threshold: 50,  total: 100, seq: 0 },
        { type: "gov",    key: "gov",    chartId: "govChart",    summaryId: "govSummary",    threshold: 25,  total: 50,  seq: 0 },
        { type: "house",  key: "house",  chartId: "houseChart",  summaryId: "houseSummary",  threshold: 218, total: 435, seq: 0 },
    ];

    const stores = {};
    function store(model) {
        return (stores[model] ??= { dates: [], data: {}, polls: {} });
    }

    const dateFromFile = file => file.replace("results_", "").replace(".json", "");

    async function fetchJSON(url) {
        const r = await fetch(url);
        if (!r.ok) throw new Error(`HTTP ${r.status} for ${url}`);
        return r.json();
    }

    // fresh: skip the caches and re-download (used for the latest date on load)
    async function fetchResults(model, date, { fresh = false } = {}) {
        const s = store(model);
        const cacheKey = `${model}:results_${date}`;
        if (!fresh) {
            if (s.data[date]) return s.data[date];
            try {
                const cached = sessionStorage.getItem(cacheKey);
                if (cached) return (s.data[date] = JSON.parse(cached));
            } catch { /* storage unavailable or corrupt entry: fall through to the network */ }
        }
        const r = await fetch(`${MODELS[model].resultsDir}/results_${date}.json`);
        if (!r.ok) return null;
        s.data[date] = await r.json();
        if (!fresh) {
            try { sessionStorage.setItem(cacheKey, JSON.stringify(s.data[date])); }
            catch { /* quota exceeded: keep the in-memory copy only */ }
        }
        return s.data[date];
    }

    async function fetchPolls(model, key, date, { fresh = false } = {}) {
        const s = store(model);
        const k = `${key}_${date}`;
        if (fresh || !s.polls[k]) {
            const r = await fetch(`${MODELS[model].pollsDir}/${key}_${date}.json`);
            if (!r.ok) return null;
            s.polls[k] = await r.json();
        }
        return s.polls[k];
    }

    async function loadModel(model) {
        const cfg = MODELS[model];
        const { file, dates = [] } = await fetchJSON(`${cfg.resultsDir}/latest.json`);
        const latestDate = dateFromFile(file);

        const [results, senatePolls, govPolls, housePolls] = await Promise.all([
            fetchResults(model, latestDate, { fresh: true }),
            ...CHAMBERS.map(c => fetchPolls(model, c.key, latestDate, { fresh: true })),
        ]);
        if (!results?.senate || !results?.gov || !results?.house) {
            throw new Error(`Incomplete results in ${cfg.resultsDir}/${file}`);
        }
        store(model).dates = dates;
        return { results, polls: { senate: senatePolls, gov: govPolls, house: housePolls } };
    }

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

    function renderChamber(chamber, raceData) {
        applyRaceResults(chamber.type, raceData);
        renderSeatChart(chamber.chartId, raceData.seats, chamber.threshold, chamber.total);
        document.getElementById(chamber.summaryId).innerHTML = raceData.summaryHTML;
    }

    async function showDate(chamber, date) {
        const model = currentModel;
        const epoch = modelEpoch;
        const seq   = ++chamber.seq;
        const stale = () => epoch !== modelEpoch || seq !== chamber.seq;

        try {
            const raceData = (await fetchResults(model, date))?.[chamber.key];
            if (stale()) return;
            if (raceData) renderChamber(chamber, raceData);

            const polls = await fetchPolls(model, chamber.key, date);
            if (stale()) return;
            if (polls) renderPollsSection(`${chamber.key}PollsTable`, polls, chamber.key);
        } catch (err) {
            console.error(`loader.js: failed to show ${model} ${chamber.key} for ${date}`, err);
        }
    }

    const autoplayStops = [];

    function setSliderLabel(key, i) {
        const dates = store(currentModel).dates;
        document.getElementById(`${key}SliderLabel`).childNodes[0].textContent = dates[i] + " ";
        document.getElementById(`${key}LatestBadge`).style.display = i === dates.length - 1 ? "inline" : "none";
    }

    function configureSliders() {
        const { dates } = store(currentModel);
        autoplayStops.forEach(stop => stop());

        CHAMBERS.forEach(({ key }) => {
            const row    = document.getElementById(`${key}SliderRow`);
            const slider = document.getElementById(`${key}DateSlider`);
            if (!row || !slider) return;

            if (dates.length < 2) { row.style.display = "none"; return; }

            slider.min   = 0;
            slider.max   = dates.length - 1;
            slider.value = dates.length - 1;
            document.getElementById(`${key}SliderMin`).textContent = dates[0];
            document.getElementById(`${key}SliderMax`).textContent = dates[dates.length - 1];
            setSliderLabel(key, dates.length - 1);
            row.style.display = "";
        });
    }

    function setupSliders() {
        CHAMBERS.forEach(chamber => {
            const { key } = chamber;
            const row    = document.getElementById(`${key}SliderRow`);
            const slider = document.getElementById(`${key}DateSlider`);
            if (!row || !slider) return;

            let debounce;
            slider.addEventListener("input", () => {
                const i = parseInt(slider.value);
                setSliderLabel(key, i);
                clearTimeout(debounce);
                debounce = setTimeout(() => showDate(chamber, store(currentModel).dates[i]), 0);
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
            autoplayStops.push(stopPlay);

            async function runStep() {
                if (autoplayTimeout === null) return;
                const dates = store(currentModel).dates;
                const date = dates[autoplayIdx];
                slider.value = autoplayIdx;
                setSliderLabel(key, autoplayIdx);
                await showDate(chamber, date);
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

    function updateLastUpdated(generated, model) {
        const updatedAt = generated ? new Date(generated).getTime() : null;
        document.getElementById("lastUpdated").textContent =
            "Last updated " + timeAgo(updatedAt) + " · " + MODELS[model].name;
    }

    const toggleBtn = document.getElementById("modelToggle");
    const statusEl  = document.getElementById("modelStatus");

    function setStatus(msg) { if (statusEl) statusEl.textContent = msg; }

    function updateToggleButton() {
        if (!toggleBtn) return;
        const other = currentModel === DEFAULT_MODEL ? "v2" : DEFAULT_MODEL;
        toggleBtn.textContent = "Switch to " + MODELS[other].name;
        toggleBtn.disabled = false;
    }

    function applyModel(model, { results, polls }) {
        currentModel = model;
        modelEpoch++;                   

        CHAMBERS.forEach(chamber => {
            renderChamber(chamber, results[chamber.key]);
            renderPollsSection(`${chamber.key}PollsTable`, polls[chamber.key] ?? [], chamber.key);
        });

        configureSliders();
        initLineCharts(
            { senate: results.senate, gov: results.gov, house: results.house },
            store(model).dates,
            date => fetchResults(model, date)
        );

        updateLastUpdated(results.generated, model);
        updateToggleButton();
        setStatus("");
    }

    let switching = false;
    async function switchModel(target) {
        if (switching || target === currentModel) return;
        switching = true;
        if (toggleBtn) { toggleBtn.disabled = true; toggleBtn.textContent = "Loading…"; }
        try {
            applyModel(target, await loadModel(target));
        } catch (err) {
            console.error(`loader.js: could not load ${target}`, err);
            setStatus(`Couldn't load ${MODELS[target].name}. Still showing ${MODELS[currentModel].name}.`);
        } finally {
            switching = false;
            updateToggleButton();
        }
    }
    
    setupSliders();

    try {
        applyModel(DEFAULT_MODEL, await loadModel(DEFAULT_MODEL));
    } catch (err) {
        console.error("loader.js: failed to load results", err);
        setStatus("Couldn't load the model results.");
        return;
    }

    if (toggleBtn) toggleBtn.addEventListener("click", () => {
        switchModel(currentModel === DEFAULT_MODEL ? "v2" : DEFAULT_MODEL);
    });

    function matchPollsHeight() {
        document.querySelectorAll('.map-polls-row').forEach(row => {
            const mapCol   = row.querySelector('.map-col');
            const pollsCol = row.querySelector('.polls-col');
            if (!mapCol || !pollsCol) return;
            const h = mapCol.offsetHeight;
            if (h > 0) pollsCol.style.height = h + 'px';
        });
    }

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