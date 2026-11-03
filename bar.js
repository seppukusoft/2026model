const chartAreaBorder = {
    id: 'chartAreaBorder',
    beforeDraw(chart, args, options) {
        const { ctx, chartArea } = chart;
        ctx.save();
        ctx.strokeStyle = options.borderColor || 'white';
        ctx.lineWidth = options.borderWidth || 2;
        ctx.strokeRect(
            chartArea.left,
            chartArea.top,
            chartArea.right - chartArea.left,
            chartArea.bottom - chartArea.top
        );
        ctx.restore();
    }
};

Chart.register(chartAreaBorder);

const majorityArrows = {
    id: 'majorityArrows',
    afterDraw(chart) {
        const majority = chart.config.options.plugins.majorityArrows?.value;
        if (majority == null) return;
        const { ctx, chartArea, scales } = chart;
        const x = scales.x.getPixelForValue(majority);
        const top = chartArea.top;
        const bottom = chartArea.bottom;
        const s = 7;

        ctx.save();
        ctx.fillStyle = '#ff0000';

        ctx.beginPath();
        ctx.moveTo(x,     top);      
        ctx.lineTo(x - s, top - s);  
        ctx.lineTo(x + s, top - s);  
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(x,     bottom);     
        ctx.lineTo(x - s, bottom + s);  
        ctx.lineTo(x + s, bottom + s); 
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }
};

Chart.register(majorityArrows);

// Seat keys in dataset order â€” must match the datasets array below
const _seatKeys = [
    'DEM','solidD','likelyD','leanD','tiltD',
    'IND','solidI','likelyI','leanI','tiltI',
    'UNK',
    'tiltL','leanL','likelyL','solidL',
    'tiltR','leanR','likelyR','solidR','REP',
];

function renderSeatChart(canvas, seats, majority, x) {
    const existingChart = Chart.getChart(canvas);

    // Fast path: if the chart already exists for this canvas, just update its
    // data arrays and re-render with no animation.  This avoids the expensive
    // destroy â†’ create cycle that triggers Chart.js entry animations.
    if (existingChart) {
        for (let i = 0; i < _seatKeys.length; i++) {
            existingChart.data.datasets[i].data[0] = seats[_seatKeys[i]];
        }
        // Update majority line + arrows in case the threshold shifted
        existingChart.options.plugins.annotation.annotations.majorityLine.xMin = majority;
        existingChart.options.plugins.annotation.annotations.majorityLine.xMax = majority;
        existingChart.options.plugins.majorityArrows.value = majority;
        existingChart.options.scales.x.max = x;
        existingChart.update('none');   // 'none' = skip all animations
        return;
    }

    const ctx = document.getElementById(canvas);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Seats'],
            datasets: [
                { label: 'Democratic (no election)',  data: [seats.DEM],     backgroundColor: '#24499971' },
                { label: 'Solid Democratic',          data: [seats.solidD],  backgroundColor: '#244999' },
                { label: 'Likely Democratic',         data: [seats.likelyD], backgroundColor: '#577ccc' },
                { label: 'Lean Democratic',           data: [seats.leanD],   backgroundColor: '#90acfc' },
                { label: 'Tilt Democratic',           data: [seats.tiltD],   backgroundColor: '#848fb3' },
                { label: 'Independent (no election)', data: [seats.IND],     backgroundColor: '#8e20c771' },
                { label: 'Solid Independent',         data: [seats.solidI],  backgroundColor: '#8e20c7' },
                { label: 'Likely Independent',        data: [seats.likelyI], backgroundColor: '#a14fd2' },
                { label: 'Lean Independent',          data: [seats.leanI],   backgroundColor: '#b57edc' },
                { label: 'Tilt Independent',          data: [seats.tiltI],   backgroundColor: '#c4aeee' },
                { label: 'Unknown',                   data: [seats.UNK],     backgroundColor: '#808080' },
                { label: 'Tilt Libertarian',          data: [seats.tiltL],   backgroundColor: '#fff9c2' },
                { label: 'Lean Libertarian',          data: [seats.leanL],   backgroundColor: '#fff1a0' },
                { label: 'Likely Libertarian',        data: [seats.likelyL], backgroundColor: '#ffe66e' },
                { label: 'Solid Libertarian',         data: [seats.solidL],  backgroundColor: '#ffdb00' },
                { label: 'Tilt Republican',           data: [seats.tiltR],   backgroundColor: '#cf8980' },
                { label: 'Lean Republican',           data: [seats.leanR],   backgroundColor: '#ff8b98' },
                { label: 'Likely Republican',         data: [seats.likelyR], backgroundColor: '#ff5865' },
                { label: 'Solid Republican',          data: [seats.solidR],  backgroundColor: '#d22532' },
                { label: 'Republican (no election)',  data: [seats.REP],     backgroundColor: '#dc354671' },
            ].map(d => ({ ...d, barThickness: 22, categoryPercentage: 1.0, barPercentage: 1.0 }))
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            indexAxis: 'y',
            layout: { padding: { left: 20, right: 20, top: 10, bottom: 10 } },
            plugins: {
                legend: { display: false },
                chartAreaBorder: { borderColor: 'white', borderWidth: 2 },
                majorityArrows: { value: majority }, 
                datalabels: {
                    color: '#fff',
                    formatter: v => v ? v : '',
                    font: { weight: 'bold', size: 12 },
                    anchor: 'center',
                    align: 'center',
                    clamp: true
                },
                annotation: {
                    annotations: {
                        majorityLine: {
                            type: 'line',
                            xMin: majority, xMax: majority,
                            borderColor: '#ff0000',
                            borderWidth: 3,
                            borderDash: [3, 3]
                        }
                    }
                }
            },
            scales: {
                x: { display: false, stacked: true, min: 0, max: x },
                y: { display: false, stacked: true }
            }
        },
        plugins: [ChartDataLabels]
    });
}