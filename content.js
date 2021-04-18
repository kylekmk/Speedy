window.onload = function () {
   chrome.runtime.sendMessage({type: 'background'});
};

chrome.runtime.onMessage.addListener(function (request) {

   if (request.type === 'video-speed') {
      var curURL = window.location.href;

      if (curURL.includes('https://www.crunchyroll.com/')) {
         vilosPlayer();
      }
      var vids = document.getElementsByTagName("video");
      console.log(vids);

      for (var i = 0; i < vids.length; i++) {
         vids[i].playbackRate = request.speed;
      }
   }
});

// touch vilos player to access element
function vilosPlayer() {
   var iframe = VILOS_PLAYERJS.elem;
   console.log(iframe);
}