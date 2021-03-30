chrome.runtime.onMessage.addListener(function (request) {
   var vids = document.getElementsByTagName("video");
   console.log(vids);

   for (var i = 0; i < vids.length; i++){
      vids[i].playbackRate = request;
   }   
});