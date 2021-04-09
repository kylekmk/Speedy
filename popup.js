document.addEventListener('DOMContentLoaded', function() {

    var settingsUri = 'chrome-extension://' + chrome.runtime.id + '/settings.html';
    var settingsElem = document.getElementById('settings');
    settingsElem.href = settingsUri;

    document.getElementById('right-shift').onclick = function() { changeSpeed(.25); };
    document.getElementById('left-shift').onclick = function() { changeSpeed(-.25); };
    // document.getElementById('speed-input').addEventListener('onkeypress', isNumber);

    var videoSpeed;
    var input_temp;
    var decimal_bool = false;
    var slider = document.getElementById("Slider");
    var input = document.getElementById("speed-input");

    var savedSpeed = parseFloat(localStorage['speed']);
    var maxSpeed = parseFloat(localStorage['speed-max']);
    var minSpeed = parseFloat(localStorage['speed-min']);
    var stepSpeed = parseFloat(localStorage['speed-step']);

    slider.max = maxSpeed;
    slider.min = minSpeed;
    slider.step = stepSpeed;
    setSpeed(savedSpeed);
    
    // set html elements to proper values and track the agreed video speed
    slider.value = savedSpeed != undefined && savedSpeed <= maxSpeed && savedSpeed >= minSpeed  ? savedSpeed : minSpeed + stepSpeed;
    videoSpeed = slider.value;
    input.value = slider.value;

    slider.oninput = function() {
        setSlider(slider.value);
    };

    input.onclick = function () {
        input_temp = input.value;
        input.value = "";
    };

    input.onchange = function() {
        if (parseFloat(input.value) >= minSpeed && parseFloat(input.value) <= maxSpeed) {
            input_temp = input.value;
            setSlider(input.value);
        } else {
            input.value = input_temp;
        }
    };

    input.oninput = function () {
        var input_length = input.value.length;
        var input_string = input.value;

        if (!input_string.includes('.')){
            decimal_bool = false;
        }

        // invalid string catcher
        if ((input_length == 4 && !decimal_bool) || input_length > 4 || !isValidKey(input_string.charAt(input_length - 1))){
            input.value = input_string.substring(0, input_length - 1);
        }
    }
    // FUNCTIONS

    function setSpeed(newSpeed) {
        localStorage['speed'] = newSpeed;
        console.log(newSpeed);
        videoSpeed = parseFloat(newSpeed);
        input.value = videoSpeed.toFixed(2);
        chrome.tabs.query({ currentWindow: true, active: true },
            function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, newSpeed)
            })
    }

    function setSlider(slideSpeed) {
        slideSpeed = slideSpeed > maxSpeed ?
            maxSpeed : slideSpeed < minSpeed ?
            minSpeed : slideSpeed;
        slider.value = slideSpeed;
        setSpeed(slideSpeed);
    }

    function changeSpeed(speed) {
        var newSpeed = videoSpeed + speed;
        setSlider(newSpeed);
    }

    function isValidKey (char){
        if (char == '.' && !decimal_bool) {
            decimal_bool = true;
            return decimal_bool;
        }

        if (char >= '0' && char <= '9') {
            return true;
        }
        return false;
    }

}, false);