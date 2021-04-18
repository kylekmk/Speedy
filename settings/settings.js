document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.sync.get('settings', data => {

        // default settings
        var speedObj = {
            step: .25,
            min: .25,
            max: 5.00
        };

        // default speed
        speedObj.speed = new Map();

        Object.assign(speedObj, data.settings);

        // Put proper values in max/min sliders
        var max = document.querySelector('#max');
        var min = document.querySelector('#min');

        max.value = parseFloat(speedObj.max).toFixed(2);
        min.value = parseFloat(speedObj.min).toFixed(2);

        // put proper values in max/min input fields
        // assign functions to max/min input fields
        var max_input = document.querySelector('#max-text');
        var min_input = document.querySelector('#min-text');

        max_input.onfocus = () => { max_input.value = "" };
        max_input.onblur = () => { max_input.value = parseFloat(max.value).toFixed(2); }
        max_input.onchange = () => { max.value = parseFloat(max_input.value); adjustLabel(max_input, max); };

        min_input.onfocus = () => { min_input.value = "" };
        min_input.onblur = () => { min_input.value = parseFloat(min.value).toFixed(2); }
        min_input.onchange = () => { min.value = parseFloat(min_input.value); adjustLabel(min_input, min); };

        // put slider values in input fields
        adjustLabel(max_input, max);
        adjustLabel(min_input, min);

        // add slider behavior
        max.oninput = () => {
            adjustLabel(max_input, max);
        };

        min.oninput = () => {
            adjustLabel(min_input, min);
        };

        // initialize variables
        var apply = document.querySelector('#apply');
        var validVal;
        var step;

        // highlight selected step button
        var buttons = document.querySelectorAll('#selection button');
        buttons.forEach(elem => {
            elem.onclick = () => setStep(elem);
            if (parseFloat(elem.value) === parseFloat(speedObj.step)) {
                step = elem;
            }
        });
        setStep(step);


        // Check validity of current configuration
        apply.onclick = () => {
            // Creates approved/denied text
            if (validVal === undefined) {
                validVal = document.createElement('span');
                document.querySelector('#apply-box').appendChild(validVal);
            }

            // check for vaild settings
            if (validValues()) {
                speedObj.step = parseFloat(step.value);
                speedObj.max = parseFloat(max.value);
                speedObj.min = parseFloat(min.value);
                validVal.className = 'approved';
                validVal.innerText = 'Changes Applied!';
                // save settings
                chrome.storage.sync.set({ settings: speedObj }, () => {
                    console.log('Saved: ', speedObj);
                });
            } else { // set back to orignal values
                buttons.forEach(elem => {
                    if (elem.value == speedObj.step) {
                        step = elem;
                    }
                });
                max.value = parseFloat(speedObj.max).toFixed(2);
                min.value = parseFloat(speedObj.min).toFixed(2);
                adjustLabel(max_input, max);
                adjustLabel(min_input, min);
                validVal.className = 'denied'
                validVal.innerText = 'Invalid Settings!'
            }
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

            min.value = minVal.toFixed(2);
            max.value = maxVal.toFixed(2);
            min.step = factor;
            max.step = factor;
            adjustLabel(max_input, max);
            adjustLabel(min_input, min);
        }

    });
});
