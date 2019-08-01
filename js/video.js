const videoElement = document.querySelector('video');

getStream()

function getStream() {
//   if (window.stream) {
//     window.stream.getTracks().forEach(function(track) {
//       track.stop();
//     });
//   }

  const constraints = { video: { facingMode: "user" }, audio: false }


// Get access to the camera!
if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // Not adding `{ audio: true }` since we only want video now
    navigator.mediaDevices.getUserMedia(constraints).then((stream)=>{
        gotStream(stream)
    });
}


}




function gotStream(stream) {
  
  console.log(videoElement,stream)
  // window.stream = stream; // make stream available to console
  videoElement.srcObject = stream;
  // videoElement.play()
  let b = setInterval(()=>{
    if(videoElement.readyState >= 3){
      poseNetINIT()
      //stop checking every half second
      clearInterval(b);
    }                   
  },500);
}

function handleError(error) {
  console.error('Error: ', error);
}
