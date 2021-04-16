chrome.commands.onCommand.addListener(function (command) {
    const speed = command.split('-')[1];
    var curSpeed = parseFloat(localStorage['speed']);
    var newSpeed = curSpeed;

    switch (speed) {
        case 'faster':
            newSpeed = curSpeed + parseFloat(localStorage['speed-step']);
            break;
        case 'slower':
            newSpeed = curSpeed - parseFloat(localStorage['speed-step']);
            break;
        case 'normal':
            newSpeed = 1.00;
            break;
        case 'max':
            newSpeed = parseFloat(localStorage['speed-max']);
            break;
    }

    localStorage['speed'] = newSpeed;


    chrome.runtime.sendMessage({
        speed: newSpeed
    });

    chrome.tabs.query({ currentWindow: true, active: true },
        function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, newSpeed);
        }
    );

});