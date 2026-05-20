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

function renderSeatChart(canvas, seats, majority, x) {
    const ctx = document.getElementById(canvas);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Seats'],
            datasets: [
                { label: 'Republican (no election)',  data: [seats.REP],     backgroundColor: '#dc354671' },
                { label: 'Solid Republican',          data: [seats.solidR],  backgroundColor: '#d22532' },
                { label: 'Likely Republican',         data: [seats.likelyR], backgroundColor: '#ff5865' },
                { label: 'Lean Republican',           data: [seats.leanR],   backgroundColor: '#ff8b98' },
                { label: 'Tilt Republican',           data: [seats.tiltR],   backgroundColor: '#cf8980' },
                { label: 'Solid Libertarian',         data: [seats.solidL],  backgroundColor: '#ffdb00' },
                { label: 'Likely Libertarian',        data: [seats.likelyL], backgroundColor: '#ffe66e' },
                { label: 'Lean Libertarian',          data: [seats.leanL],   backgroundColor: '#fff1a0' },
                { label: 'Tilt Libertarian',          data: [seats.tiltL],   backgroundColor: '#fff9c2' },
                { label: 'Unknown',                   data: [seats.UNK],     backgroundColor: '#808080' },
                { label: 'Tilt Independent',          data: [seats.tiltI],   backgroundColor: '#c4aeee' },
                { label: 'Lean Independent',          data: [seats.leanI],   backgroundColor: '#b57edc' },
                { label: 'Likely Independent',        data: [seats.likelyI], backgroundColor: '#a14fd2' },
                { label: 'Solid Independent',         data: [seats.solidI],  backgroundColor: '#8e20c7' },
                { label: 'Independent (no election)', data: [seats.IND],     backgroundColor: '#8e20c771' },
                { label: 'Tilt Democratic',           data: [seats.tiltD],   backgroundColor: '#848fb3' },
                { label: 'Lean Democratic',           data: [seats.leanD],   backgroundColor: '#90acfc' },
                { label: 'Likely Democratic',         data: [seats.likelyD], backgroundColor: '#577ccc' },
                { label: 'Solid Democratic',          data: [seats.solidD],  backgroundColor: '#244999' },
                { label: 'Democratic (no election)',  data: [seats.DEM],     backgroundColor: '#24499971' },
            ].map(d => ({ ...d, barThickness: 22, categoryPercentage: 1.0, barPercentage: 1.0 }))
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            layout: { padding: { left: 20, right: 20, top: 10, bottom: 10 } },
            plugins: {
                legend: { display: false },
                chartAreaBorder: { borderColor: 'white', borderWidth: 2 },
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