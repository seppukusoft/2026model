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

function testSeats() {
    const ctx = document.getElementById('senateChart');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Seats'],
            datasets: [
                { label: 'Republican (no election)',  data: [senateSeats.REP],     backgroundColor: '#dc354671' },
                { label: 'Solid Republican',          data: [senateSeats.solidR],  backgroundColor: '#d22532' },
                { label: 'Likely Republican',         data: [senateSeats.likelyR], backgroundColor: '#ff5865' },
                { label: 'Lean Republican',           data: [senateSeats.leanR],   backgroundColor: '#ff8b98' },
                { label: 'Tilt Republican',           data: [senateSeats.tiltR],   backgroundColor: '#cf8980' },
                { label: 'Solid Libertarian',         data: [senateSeats.solidL],  backgroundColor: '#ffdb00' },
                { label: 'Likely Libertarian',        data: [senateSeats.likelyL], backgroundColor: '#ffe66e' },
                { label: 'Lean Libertarian',          data: [senateSeats.leanL],   backgroundColor: '#fff1a0' },
                { label: 'Tilt Libertarian',          data: [senateSeats.tiltL],   backgroundColor: '#fff9c2' },
                { label: 'Unknown',                   data: [senateSeats.UNK],     backgroundColor: '#808080' },
                { label: 'Tilt Independent',          data: [senateSeats.tiltI],   backgroundColor: '#c4aeee' },
                { label: 'Lean Independent',          data: [senateSeats.leanI],   backgroundColor: '#b57edc' },
                { label: 'Likely Independent',        data: [senateSeats.likelyI], backgroundColor: '#a14fd2' },
                { label: 'Solid Independent',         data: [senateSeats.solidI],  backgroundColor: '#8e20c7' },
                { label: 'Independent (no election)', data: [senateSeats.IND],     backgroundColor: '#8e20c771' },
                { label: 'Tilt Democratic',           data: [senateSeats.tiltD],   backgroundColor: '#848fb3' },
                { label: 'Lean Democratic',           data: [senateSeats.leanD],   backgroundColor: '#90acfc' },
                { label: 'Likely Democratic',         data: [senateSeats.likelyD], backgroundColor: '#577ccc' },
                { label: 'Solid Democratic',          data: [senateSeats.solidD],  backgroundColor: '#244999' },
                { label: 'Democratic (no election)',  data: [senateSeats.DEM],     backgroundColor: '#24499971' },
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
            xMin: 50,
            xMax: 50,
            borderColor: '#ff0000',
            borderWidth: 3,
            borderDash: [3, 3]
        }
    }
}
            },
            scales: {
                x: { display: false, stacked: true, min: 0, max: 100 },
                y: { display: false, stacked: true }
            }
        },
        plugins: [ChartDataLabels]
    });
}

function testGovSeats() {
    const ctx = document.getElementById('govChart');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Seats'],
            datasets: [
                { label: 'Republican (no election)',  data: [govSeats.REP],     backgroundColor: '#dc354671' },
                { label: 'Solid Republican',          data: [govSeats.solidR],  backgroundColor: '#d22532' },
                { label: 'Likely Republican',         data: [govSeats.likelyR], backgroundColor: '#ff5865' },
                { label: 'Lean Republican',           data: [govSeats.leanR],   backgroundColor: '#ff8b98' },
                { label: 'Tilt Republican',           data: [govSeats.tiltR],   backgroundColor: '#cf8980' },
                { label: 'Solid Libertarian',         data: [govSeats.solidL],  backgroundColor: '#ffdb00' },
                { label: 'Likely Libertarian',        data: [govSeats.likelyL], backgroundColor: '#ffe66e' },
                { label: 'Lean Libertarian',          data: [govSeats.leanL],   backgroundColor: '#fff1a0' },
                { label: 'Tilt Libertarian',          data: [govSeats.tiltL],   backgroundColor: '#fff9c2' },
                { label: 'Unknown',                   data: [govSeats.UNK],     backgroundColor: '#808080' },
                { label: 'Tilt Independent',          data: [govSeats.tiltI],   backgroundColor: '#c4aeee' },
                { label: 'Lean Independent',          data: [govSeats.leanI],   backgroundColor: '#b57edc' },
                { label: 'Likely Independent',        data: [govSeats.likelyI], backgroundColor: '#a14fd2' },
                { label: 'Solid Independent',         data: [govSeats.solidI],  backgroundColor: '#8e20c7' },
                { label: 'Independent (no election)', data: [govSeats.IND],     backgroundColor: '#8e20c771' },
                { label: 'Tilt Democratic',           data: [govSeats.tiltD],   backgroundColor: '#848fb3' },
                { label: 'Lean Democratic',           data: [govSeats.leanD],   backgroundColor: '#90acfc' },
                { label: 'Likely Democratic',         data: [govSeats.likelyD], backgroundColor: '#577ccc' },
                { label: 'Solid Democratic',          data: [govSeats.solidD],  backgroundColor: '#244999' },
                { label: 'Democratic (no election)',  data: [govSeats.DEM],     backgroundColor: '#24499971' },
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
                            xMin: 25, xMax: 25, 
                            borderColor: '#ff0000',
                            borderWidth: 3,
                            borderDash: [3, 3]
                        }
                    }
                }
            },
            scales: {
                x: { display: false, stacked: true, min: 0, max: 50 }, 
                y: { display: false, stacked: true }
            }
        },
        plugins: [ChartDataLabels]
    });
}

function testHouseSeats() {
    const ctx = document.getElementById('houseChart');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Seats'],
            datasets: [
                { label: 'Republican (no election)',  data: [houseSeats.REP],     backgroundColor: '#dc354671' },
                { label: 'Solid Republican',          data: [houseSeats.solidR],  backgroundColor: '#d22532' },
                { label: 'Likely Republican',         data: [houseSeats.likelyR], backgroundColor: '#ff5865' },
                { label: 'Lean Republican',           data: [houseSeats.leanR],   backgroundColor: '#ff8b98' },
                { label: 'Tilt Republican',           data: [houseSeats.tiltR],   backgroundColor: '#cf8980' },
                { label: 'Solid Libertarian',         data: [houseSeats.solidL],  backgroundColor: '#ffdb00' },
                { label: 'Likely Libertarian',        data: [houseSeats.likelyL], backgroundColor: '#ffe66e' },
                { label: 'Lean Libertarian',          data: [houseSeats.leanL],   backgroundColor: '#fff1a0' },
                { label: 'Tilt Libertarian',          data: [houseSeats.tiltL],   backgroundColor: '#fff9c2' },
                { label: 'Unknown',                   data: [houseSeats.UNK],     backgroundColor: '#808080' },
                { label: 'Tilt Independent',          data: [houseSeats.tiltI],   backgroundColor: '#c4aeee' },
                { label: 'Lean Independent',          data: [houseSeats.leanI],   backgroundColor: '#b57edc' },
                { label: 'Likely Independent',        data: [houseSeats.likelyI], backgroundColor: '#a14fd2' },
                { label: 'Solid Independent',         data: [houseSeats.solidI],  backgroundColor: '#8e20c7' },
                { label: 'Independent (no election)', data: [houseSeats.IND],     backgroundColor: '#8e20c771' },
                { label: 'Tilt Democratic',           data: [houseSeats.tiltD],   backgroundColor: '#848fb3' },
                { label: 'Lean Democratic',           data: [houseSeats.leanD],   backgroundColor: '#90acfc' },
                { label: 'Likely Democratic',         data: [houseSeats.likelyD], backgroundColor: '#577ccc' },
                { label: 'Solid Democratic',          data: [houseSeats.solidD],  backgroundColor: '#244999' },
                { label: 'Democratic (no election)',  data: [houseSeats.DEM],     backgroundColor: '#24499971' },
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
                            xMin: 218, xMax: 218,
                            borderColor: '#ff0000',
                            borderWidth: 3,
                            borderDash: [3, 3]
                        }
                    }
                }
            },
            scales: {
                x: { display: false, stacked: true, min: 0, max: 435 },
                y: { display: false, stacked: true }
            }
        },
        plugins: [ChartDataLabels]
    });
}