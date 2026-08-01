(function () {
    const lineChartInstances = {};
    const activeRender = {};
    const partyColors = { DEM: '#90acfc', REP: '#ff8b98', IND: '#b57edc', LIB: '#fff1a0' };
    const atLargeStates = new Set(["AK","VT","WY","ND","SD","DE"]);

    function fmtDistrict(d) {
        const state = d.slice(0, 2), num = d.slice(2);
        return (atLargeStates.has(state) && num === "01") ? `${state}-AL` : `${state}-${num}`;
    }

    function parseCandidates(desc, metric) {
        const headers = metric === 'prob'
            ? ['<b>Win Probability:</b>']
            : ['<b>Vote Estimate (final round):</b>', '<b>Vote Estimate:</b>'];
        let start = -1;
        for (const h of headers) {
            const i = desc.indexOf(h);
            if (i !== -1) { start = i + h.length; break; }
        }
        if (start === -1) return [];
        const end = desc.indexOf('<b>', start);
        const chunk = end === -1 ? desc.slice(start) : desc.slice(start, end);
        return chunk.split('<br>').flatMap(part => {
            const m = part.replace(/<[^>]+>/g, '').trim().match(/^(.+?):\s*([\d.]+)%$/);
            return m ? [{ candidate: m[1].trim(), value: parseFloat(m[2]) }] : [];
        });
    }

    const oppositeParty = { REP: 'DEM', DEM: 'REP' };

    function toRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r},${g},${b},${alpha})`;
    }

    function candidateColor(name, winnerName, winnerParty, total) {
        if (name === winnerName) return partyColors[winnerParty] || '#aaaaaa';
        if (total === 2) return partyColors[oppositeParty[winnerParty]] || '#888888';
        return '#888888';
    }

    async function renderLineChart(type, chamberKey, regionKey, metric, dates, fetchDate) {
        const token = Symbol();
        activeRender[type] = token;

        const wrapper = document.getElementById(`${type}LineChartWrapper`);
        wrapper.style.display = '';

        // Fetch all dates in parallel (fetchDate handles caching)
        const allData = new Array(dates.length);
        await Promise.all(dates.map(async (date, i) => {
            const r = await fetchDate(date);
            if (r) allData[i] = r;
        }));

        if (activeRender[type] !== token) return; // superseded by a newer selection

        // Collect per-candidate values across dates; track winner from latest available date
        const byCandidate = {};
        let winnerName = '', winnerParty = '';
        for (let i = 0; i < dates.length; i++) {
            const region = allData[i]?.[chamberKey]?.regions?.[regionKey];
            if (!region) continue;
            winnerName  = region.winner      || winnerName;
            winnerParty = region.winnerParty || winnerParty;
            for (const c of parseCandidates(region.description, metric)) {
                if (!byCandidate[c.candidate]) byCandidate[c.candidate] = new Array(dates.length).fill(null);
                byCandidate[c.candidate][i] = c.value;
            }
        }

        const names = Object.keys(byCandidate);
        const datasets = names.map(name => {
            const color = candidateColor(name, winnerName, winnerParty, names.length);
            return {
                label: name,
                data: byCandidate[name],
                borderColor: color,
                backgroundColor: toRgba(color, 0.15),
                pointRadius: dates.length > 20 ? 2 : 3,
                tension: 0.3,
                spanGaps: true,
                fill: false,
            };
        });

        const allValues = datasets.flatMap(d => d.data.filter(v => v !== null));
        const spread = allValues.length ? Math.max(...allValues) - Math.min(...allValues) : 0;
        const pad = Math.max(2, spread * 0.15);
        const yMin = allValues.length ? Math.max(0,   Math.floor(Math.min(...allValues) - pad)) : 0;
        const yMax = allValues.length ? Math.min(100, Math.ceil( Math.max(...allValues) + pad)) : 100;

        if (lineChartInstances[type]) lineChartInstances[type].destroy();

        lineChartInstances[type] = new Chart(document.getElementById(`${type}LineChart`), {
            type: 'line',
            data: { labels: dates, datasets },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#ccc', boxWidth: 12 } },
                    datalabels: { display: false },
                    chartAreaBorder: { borderColor: 'white', borderWidth: 1 },
                    annotation: { annotations: {} },
                    majorityArrows: { value: null },
                },
                scales: {
                    x: { ticks: { color: '#ccc', maxTicksLimit: 12, maxRotation: 45 } },
                    y: {
                        min: yMin,
                        max: yMax,
                        ticks: { color: '#ccc', callback: v => v + '%' },
                        grid: { color: '#333' },
                    }
                }
            }
        });
    }

    window.initLineCharts = function (chambers, dates, fetchDate) {
        if (dates.length < 2) return;

        const configs = [
            { type: 'senate', key: 'senate', data: chambers.senate, fmt: k => k,       placeholder: '— Select state —'    },
            { type: 'gov',    key: 'gov',    data: chambers.gov,    fmt: k => k,       placeholder: '— Select state —'    },
            { type: 'house',  key: 'house',  data: chambers.house,  fmt: fmtDistrict,  placeholder: '— Select district —' },
        ];

        for (const { type, key, data, fmt, placeholder } of configs) {
            const regionSel = document.getElementById(`${type}RegionSelect`);
            const metricSel = document.getElementById(`${type}MetricSelect`);
            const controls  = document.getElementById(`${type}LineControls`);
            const wrapper   = document.getElementById(`${type}LineChartWrapper`);

            controls.style.display = 'flex';
            regionSel.options[0].textContent = placeholder;

            Object.entries(data.regions)
                .filter(([, v]) => !v.noElection)
                .sort(([a], [b]) => fmt(a).localeCompare(fmt(b)))
                .forEach(([k]) => {
                    const opt = document.createElement('option');
                    opt.value = k;
                    opt.textContent = fmt(k);
                    regionSel.appendChild(opt);
                });

            const handler = () => {
                if (!regionSel.value) { wrapper.style.display = 'none'; return; }
                renderLineChart(type, key, regionSel.value, metricSel.value, dates, fetchDate);
            };
            regionSel.addEventListener('change', handler);
            metricSel.addEventListener('change', handler);
        }
    };
})();