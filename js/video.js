const videoElement = document.querySelector('video');

(() => {

  const constraints = { 
    video: { 
      facingMode: "user" 
    }, 
    audio: false 
  }

  // Get access to the camera!
  if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    
    navigator.mediaDevices.getUserMedia(constraints)
    .then((stream)=>{
      gotStream(stream)
    }).catch(err=>{
      alert(err)
    });
    
  }

})();


function gotStream(stream) {
  
  videoElement.srcObject = stream;
  
  let b = setInterval(()=>{
    
    if(videoElement.readyState >= 3){
      
      
      var vidTexture = PIXI.Texture.from(videoElement);
      videoSprite = new PIXI.Sprite(vidTexture);
      videoRatio = videoElement.offsetWidth/videoElement.offsetHeight
      videoSprite.scale.x = -1
      
      if(window.innerWidth/window.innerHeight < videoRatio){
        videoSprite.width = window.innerHeight*videoRatio;
        videoSprite.height = window.innerHeight;
      }else{
        videoSprite.width = window.innerWidth;
        videoSprite.height = window.innerWidth/videoRatio;
      }
      
      videoSprite.position.x = halfWidth + videoSprite.width/2
      videoSprite.position.y = halfHeight - videoSprite.height/2
      videoSprite.zIndex = -1;
      videoSprite.alpha = 0.1
      //sprite to canvas
      stage.addChild(videoSprite);
      
      poseNetINIT()

      //stop checking every half second
      clearInterval(b);
      
    }      
    
  },500);
  
}

function handleError(error) {
  console.error('Error: ', error);
}
