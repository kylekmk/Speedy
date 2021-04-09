chrome.runtime.onMessage.addListener(function (request) {
   
   
   if (document.URL.includes('https://www.crunchyroll.com/')){
      crunchyRoll();
   } 
   var vids = document.getElementsByTagName("video");
   console.log(vids);

   for (var i = 0; i < vids.length; i++){
      vids[i].playbackRate = request;
   }   

});

function crunchyRoll() {
   var iframe = VILOS_PLAYERJS.elem;
   console.log (iframe);
}