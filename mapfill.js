let mapLookup = {
        "senate": map1,
        "house": map2,
        "gov": map3
    };

const colorMapping = {
        "solidR": "#d22532", "likelyR": "#ff5865", "leanR": "#ff8b98", "tiltR": "#cf8980",
        "tiltD": "#848fb3", "leanD": "#90acfc", "likelyD": "#577ccc", "solidD": "#244999",
        "tiltI": "#c4aeee", "leanI": "#b57edc", "likelyI": "#a14fd2", "solidI": "#8e20c7",
        "tiltL": "#fff9c2", "leanL": "#fff1a0", "likelyL": "#ffe66e", "solidL": "#ffdb00",
        "noElec": "#575757"
    };

let pulseEnabled = false;

function applyColor(type, state, newColor) {
    const target = mapLookup[type];
    if (target) {
        //console.log(type, target);
        target.mapdata.state_specific[state].color = colorMapping[newColor]; 
    } 
}

function changeDesc(type, state, string) {
    const target = mapLookup[type];
    if (target) {
        target.mapdata.state_specific[state].description = `${string}`;
    }
}

function changeName(type, state, string) {
    const target = mapLookup[type];
    if (target) {
        target.mapdata.state_specific[state].name += `${string}`;
    }
}

function changeNameColor(type, state, color) {
    const target = mapLookup[type];
    if (target) {
        let name = target.mapdata.state_specific[state].name.trim();
        target.mapdata.state_specific[state].name = `<span style="color: ${color};">${name}</span>`;
    }
}

function togglePulse() {
    pulseEnabled = !pulseEnabled;
    document.getElementById("pulseToggle").textContent = pulseEnabled ? "Pause Pulses" : "Pulse Flipped Seats";
}

function pulseMap(type, state) {
    const target = mapLookup[type];
    setInterval(() => {
        if (pulseEnabled) target.pulse_state(state);
    }, 4000);
}

function changeBorderColor(type, state, color) {
    const target = mapLookup[type];
    if (target) {
        target.mapdata.state_specific[state].border_color = `${color}`;
        target.mapdata.state_specific[state].border_size = 300;
    }
}