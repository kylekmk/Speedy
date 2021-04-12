var backUri = '../popup.html';
var backElem = document.getElementById('back');
backElem.href = backUri;

var body = document.body;
var max = document.getElementById('max');
var min = document.getElementById('min');

var step_input = document.getElementById('step-text');
var max_input = document.getElementById('max-text');
var min_input = document.getElementById('min-text');

var apply = document.getElementById('apply');
var validVal;
var step;

var buttons = document.querySelectorAll('#selection button');
buttons.forEach(elem => {
    elem.onclick = () => setStep(elem);
    if (elem.value === localStorage['speed-step']) {
        step = elem;
    }
});
setStep(step);


// TEMPORARY -- ADD PERSISTANCE
max.value = localStorage['speed-max'];
min.value = localStorage['speed-min'];

adjustLabel(max_input, max);
adjustLabel(min_input, min);

// Check validity of current configuration
apply.onclick = () => {
    if (validVal === undefined) {
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
        buttons.forEach(elem => {
            if (elem.value = localStorage['speed-step']) {
                step = elem;
            }
        });
        max.value = localStorage['speed-max'];
        min.value = localStorage['speed-min'];
        adjustLabel(max_input, max);
        adjustLabel(min_input, min);
        validVal.className = 'denied'
        validVal.innerText = 'Invalid Settings!'
    }
};

max.oninput = () => {
    adjustLabel(max_input, max);
};

min.oninput = () => {
    adjustLabel(min_input, min);
};

// adjusts label for sliders
function adjustLabel(input_field, elem) {
    var roundNum = parseFloat(elem.value).toFixed(2);
    input_field.value = roundNum;
}

// returns boolean for valid configuration
function validValues() {
    return parseFloat(min.value) < parseFloat(max.value);
}

// function the buttons call, sets step value
function setStep(btn) {
    if (step !== undefined) {
        step.className = '';
    }
    console.log(btn);
    roundMinMax(btn.value);
    btn.className = 'selected';
    step = btn;
}

// Round to fit within step
function roundMinMax(factor) {
    factor = parseFloat(factor);
    var minNum = parseFloat(min.value);
    var maxNum = parseFloat(max.value);

    var minMod = min.value % factor;
    var maxMod = max.value % factor;
    var minVal = minMod < factor / 2 ? minNum - minMod : minNum + (factor - minMod);
    var maxVal = maxMod < factor / 2 ? maxNum - maxMod : maxNum + (factor - maxMod);

    min.value = minVal;
    max.value = maxVal;
    min.step = factor;
    max.step = factor;
    adjustLabel(max_input, max);
    adjustLabel(min_input, min);
}