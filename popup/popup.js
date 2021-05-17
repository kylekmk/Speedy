document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.sync.get('settings', data => {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            var myTabId = tabs[0].id;

            // default settings
            var speedObj = {
                step: .25,
                min: .25,
                max: 5.00
            };

            // default speed
            speedObj.speed = new Map();

            Object.assign(speedObj, data.settings);

            if(!speedObj.speed[myTabId]) {
                speedObj.speed[myTabId] = 1.00;
            } 

            // initialize variables
            var videoSpeed;
            var slider = document.getElementById("Slider");
            var input = document.getElementById("speed-input");

            // initialize settings and save data
            var savedSpeed = parseFloat(speedObj.speed[myTabId]);
            var maxSpeed = parseFloat(speedObj.max);
            var minSpeed = parseFloat(speedObj.min);
            var stepSpeed = parseFloat(speedObj.step);

            // apply functions to arrows and stop button
            document.getElementById('right-shift').onclick = function () { changeSpeed(stepSpeed); saveSpeed(); };
            document.getElementById('left-shift').onclick = function () { changeSpeed(-1 * stepSpeed); saveSpeed(); };
            document.getElementById('stop').onclick = function () { setSlider(1); }

            // assign values to html slider
            slider.max = maxSpeed;
            slider.min = minSpeed;
            slider.step = stepSpeed;
            setSlider(savedSpeed <= maxSpeed && savedSpeed >= minSpeed ? savedSpeed : minSpeed + stepSpeed);

            // add slider behavior
            slider.oninput = () => setSlider(slider.value);
            slider.onchange = () => saveSpeed();

            // set html elements to proper values and track the agreed video speed
            input.value = parseFloat(slider.value).toFixed(2);

            // initialize input properties
            input.max = maxSpeed;
            input.step = stepSpeed;
            input.min = minSpeed;
            input.onfocus = () => { input.value = "" };
            input.onblur = () => { input.value = parseFloat(slider.value).toFixed(2) };
            input.onchange = () => { slider.value = parseFloat(input.value); setSlider(slider.value); };

            //*** FUNCTIONS ***//

            // send message request to content.js to change video speed
            function setSpeed(newSpeed) {
                console.log(newSpeed);
                speedObj.speed[myTabId] = newSpeed;
                videoSpeed = parseFloat(newSpeed);
                input.value = videoSpeed.toFixed(2);
                chrome.tabs.query({ currentWindow: true, active: true },
                    function (tabs) {
                        chrome.tabs.sendMessage(tabs[0].id, {
                            type: 'video-speed',
                            speed: newSpeed
                        })
                    });
            }

            // sets slider to desired speed
            // all requests to change speed funnel through here
            function setSlider(slideSpeed) {
                slideSpeed = parseFloat(slideSpeed);
                // verify speed is in range
                slideSpeed = slideSpeed > maxSpeed ?
                    maxSpeed : slideSpeed < minSpeed ?
                        minSpeed : slideSpeed;
                slider.value = slideSpeed;
                setSpeed(slideSpeed);
            }

            // change speed by a 'speed' amount
            function changeSpeed(speed) {
                var newSpeed = videoSpeed + speed;
                setSlider(newSpeed);
            }

            // listener for shortcuts
            chrome.runtime.onMessage.addListener(
                function (message) {
                    console.log(message);
                    if (message.type === 'shortcut') {
                        setSlider(parseFloat(message.speed));
                    }
                });

            // save speed on changes
            function saveSpeed() {
                chrome.storage.sync.set({ settings: speedObj }, () => {
                    console.log('Saved: ', speedObj);
                });
            }
        });
    });
}, false);