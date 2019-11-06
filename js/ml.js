
const video = document.querySelector("video");

const options = {
 imageScaleFactor: 0.3,
 outputStride: 16,
 flipHorizontal: true,
 minConfidence: 0.5,
 maxPoseDetections: 3,
 scoreThreshold: 0.5,
 nmsRadius: 20,
 detectionType: 'single',
 multiplier: 0.75,
}

// Create a new poseNet method

let poseNet
const poseNetINIT = ()=> {
  poseNet = ml5.poseNet(video,options, modelLoaded);
}
// When the model is loaded
function modelLoaded() {
  console.log("Model Loaded!");
  poseNet.on("pose", function(results) {
  if(results.length>0){
    flock.toPoint = true
    let scaledPoints = []
    let skeletonPoints = []
    results.forEach((e,i)=>{
      let person = e.pose
      let keypoints = e.pose.keypoints
      let keypointsScaled = {}
      
      keypoints.forEach((e,i)=>{
        keypointsScaled[e.part]={
          x:scale(e.position.x,video.width,video.clientWidth),
          y:scale(e.position.y,video.height,video.clientHeight)
        }
      })
      
      skeletonPoints.push(keypointsScaled)
      console.log(skeletonPoints)
      if(person.score > 0.05){
        
        let leftWrist = person.leftWrist
        let rightWrist = person.rightWrist
        let nose = person.nose
        let leftEye = person.leftEye
        let rightEye = person.rightEye

        let leftWristScaled = {
          x:scale(leftWrist.x,video.width,video.clientWidth),
          y:scale(leftWrist.y,video.height,video.clientHeight)
        }
        
        let rightWristScaled = {
          x:scale(rightWrist.x,video.width,video.clientWidth),
          y:scale(rightWrist.y,video.height,video.clientHeight)
        }
        
        let noseScaled = {
          x:scale(nose.x,video.width,video.clientWidth),
          y:scale(nose.y,video.height,video.clientHeight)
        }
        
        let leftEyeScaled = {
          x:scale(leftEye.x,video.width,video.clientWidth),
          y:scale(leftEye.y,video.height,video.clientHeight)
        }
        
         let rightEyeScaled = {
          x:scale(rightEye.x,video.width,video.clientWidth),
          y:scale(rightEye.y,video.height,video.clientHeight)
        }
    
        
        scaledPoints.push(leftWristScaled,rightWristScaled,leftEyeScaled,rightEyeScaled)
        
      }  
    })
    generateAttractor(scaledPoints)

  }else{
    flock.toPoint = false
    flock.attractors = []
  }
});
}

const scale = (num, in_min, in_max) => {
  return (num - in_min/2)*in_max/in_min
}

// Listen to new 'pose' events


const generateAttractor = (arr) => {
  
  flock.attractors = []
  arr.forEach((e,i)=>{
    flock.attractors.push(
      {
       x:e.x, 
       y:e.y, 
       r:50, 
       f:-80
      },
      {
       x:e.x, 
       y:e.y, 
       r:70, 
       f:20
      });
  })

}