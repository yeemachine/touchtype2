let handModel
const modelParams = {
  flipHorizontal: true,   // flip e.g for video 
  imageScaleFactor: 0.7,  // reduce input image size for gains in speed.
  maxNumBoxes: 20,        // maximum number of boxes to detect
  iouThreshold: 0.5,      // ioU threshold for non-max suppression
  scoreThreshold: 0.79,    // confidence threshold for predictions.
}

handTrack.load(modelParams).then(model => {
  handModel = model
  runModel()
})

const runModel = () => {
  handModel.detect(videoElement).then(predictions => {
    console.log('Predictions: ', predictions); 
    requestAnimationFrame(runModel);
  });
} 