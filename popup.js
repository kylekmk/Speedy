document.addEventListener('DOMContentLoaded', function() {


    document.getElementById('right-shift').onclick = function() { changeSpeed(.25); };
    document.getElementById('left-shift').onclick = function() { changeSpeed(-.25); };
    // document.getElementById('speed-input').addEventListener('onkeypress', isNumber);

    // constant min and max
    const SLIDEFACTOR = 20;
    const SLIDEMIN = .1;
    const SLIDEMAX = 5;

    var videoSpeed;
    var input_temp;
    var decimal_bool = false;
    var slider = document.getElementById("Slider");
    var input = document.getElementById("speed-input");
    var savedSpeed = parseFloat(localStorage['speed']);
    setSpeed(savedSpeed);
    
    // set html elements to proper values and track the agreed video speed
    slider.value = savedSpeed != undefined ? savedSpeed * SLIDEFACTOR : SLIDEFACTOR;
    videoSpeed = savedSpeed != undefined ? savedSpeed : slider.value / SLIDEFACTOR;
    input.value = savedSpeed != undefined ? savedSpeed : slider.value / SLIDEFACTOR;

    slider.oninput = function() {
        setSlider(slider.value / SLIDEFACTOR);
    };

    input.onclick = function () {
        input_temp = input.value;
        input.value = "";
    };

    input.onchange = function() {
        if (parseFloat(input.value) >= SLIDEMIN && parseFloat(input.value) <= SLIDEMAX) {
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
        videoSpeed = newSpeed;
        input.value = videoSpeed.toFixed(2);
        chrome.tabs.query({ currentWindow: true, active: true },
            function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, newSpeed)
            })
    }

    function setSlider(slideSpeed) {
        slideSpeed = slideSpeed > SLIDEMAX ?
            SLIDEMAX : slideSpeed < SLIDEMIN ?
            SLIDEMIN : slideSpeed;
        slider.value = slideSpeed * SLIDEFACTOR;
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