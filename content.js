chrome.runtime.onMessage.addListener(function (request) {
   
   
   if (document.URL.includes('https://www.crunchyroll.com/')){
      vilosPlayer();
   } 
   var vids = document.getElementsByTagName("video");
   console.log(vids);

   for (var i = 0; i < vids.length; i++){
      vids[i].playbackRate = request;
   }   

});

// touch vilos player to access element
function vilosPlayer() {
   var iframe = VILOS_PLAYERJS.elem;
   console.log (iframe);
}