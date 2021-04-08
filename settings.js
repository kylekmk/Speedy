var body = document.body;
var step = document.getElementById('step');
var max = document.getElementById('max');
var min = document.getElementById('min');

var step_input = document.getElementById('step-text');
var max_input = document.getElementById('max-text');
var min_input = document.getElementById('min-text');

var apply = document.getElementById('apply');
var validVal;

document.querySelectorAll('#selection button').forEach(elem => elem.onclick = () => setStep(elem));
var selectedBtn;


// TEMPORARY -- ADD PERSISTANCE
step.value = localStorage['speed-step'];
max.value = localStorage['speed-max'];
min.value = localStorage['speed-min'];

adjustLabel(step_input, step);
adjustLabel(max_input, max);
adjustLabel(min_input, min);

apply.onclick = () => {
    if (validVal == undefined) {
        validVal = document.createElement('p');
        document.getElementById('apply-box').appendChild(validVal);
    }

    if (validValues()) {
        localStorage['speed-step'] = step.value;
        localStorage['speed-max'] = max.value;
        localStorage['speed-min'] = min.value;
        validVal.className = 'approved';
        validVal.innerText = 'Changes Applied!';
    } else {
        step.value = localStorage['speed-step'];
        max.value = localStorage['speed-max'];
        min.value = localStorage['speed-min'];
        adjustLabel(step_input, step);
        adjustLabel(max_input, max);
        adjustLabel(min_input, min);
        validVal.className = 'denied'
        validVal.innerText = 'Invalid Settings!'
    }
};

step.oninput = () => {
    adjustLabel(step_input, step);
};

max.oninput = () => {
    adjustLabel(max_input, max);
};

min.oninput = () => {
    adjustLabel(min_input, min);
};

function adjustLabel(input_field, elem) {
    var roundNum = parseFloat(elem.value).toFixed(2);
    input_field.value = roundNum;
}

function validValues() {
    return min.value < max.value && step.value <= max.value - min.value;
}

function setStep(btn) {
    if (selectedBtn != undefined) {
        selectedBtn.className = '';
    }
    btn.className = 'selected';
    selectedBtn = btn;
}
// STEP SHOULD BE .01 .05 .1 .25 .5 or 1