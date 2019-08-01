const videoElement = document.querySelector('video');

getStream()

function getStream() {
  if (window.stream) {
    window.stream.getTracks().forEach(function(track) {
      track.stop();
    });
  }

  const constraints = {
    video: true
  };

  navigator.mediaDevices.getUserMedia(constraints)
    .then(gotStream)
    .catch(handleError);
}

function gotStream(stream) {
  console.log(videoElement,stream)
  window.stream = stream; // make stream available to console
  videoElement.srcObject = stream;
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