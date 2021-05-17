chrome.commands.onCommand.addListener(function (command) {
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

            speedObj.speed[myTabId] = !speedObj.speed[myTabId] ? 1 : speedObj.speed[myTabId];

            const shortcut = command.split('-')[1];
            var curSpeed = parseFloat(speedObj.speed[myTabId]);
            var newSpeed = curSpeed;

            switch (shortcut) {
                case 'faster':
                    newSpeed = curSpeed + parseFloat(speedObj.step);
                    break;
                case 'slower':
                    newSpeed = curSpeed - parseFloat(speedObj.step);
                    break;
                case 'normal':
                    newSpeed = 1.00 < speedObj.min ?
                        speedObj.min + speedObj.step : 1.00 > speedObj.max ?
                            speedObj.max - speedObj.step : 1.00;
                    break;
                case 'max':
                    newSpeed = parseFloat(speedObj.max);
                    break;
            }

            // SAVE SPEED

            newSpeed = newSpeed >= speedObj.max ? speedObj.max :
                newSpeed <= speedObj.min ? speedObj.min : newSpeed

            speedObj.speed[myTabId] = newSpeed;

            chrome.storage.sync.set({ settings: speedObj }, () => {
                console.log('Saved: ', speedObj);
                console.log(myTabId);
                chrome.runtime.sendMessage({
                    type: 'shortcut',
                    speed: speedObj.speed[myTabId]
                });

                chrome.tabs.sendMessage(myTabId, {
                    type: 'video-speed',
                    speed: speedObj.speed[myTabId]
                });
            });
        });
    });
});

// set speed to 1 on every window load
chrome.runtime.onMessage.addListener(function (request) {
    if (request.type === 'background') {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            var myTabId = tabs[0].id;
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

                speedObj.speed[myTabId] = 1.00;

                chrome.storage.sync.set({ settings: speedObj }, () => {
                    console.log('Saved: ', speedObj);
                });
            });
        });
    }
});

// Delete old tab data on startup
window.onload = () => {

    chrome.storage.sync.get('settings', data => {

        // default settings
        var speedObj = {
            step: .25,
            min: .25,
            max: 5.00
        };

        Object.assign(speedObj, data.settings);

        // default speed
        speedObj.speed = new Map();

        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            var myTabId = tabs[0].id;
            speedObj.speed[myTabId] = 1.00;
            chrome.storage.sync.set({ settings: speedObj }, () => {
                console.log('Saved: ', speedObj);
            });
        });
    });

};
