

const generate = (txt,size,radius) => {
  let c = document.querySelector("#textGenerator")
  let ctx = c.getContext("2d"),
      i, data32, textWidth = 0, textHeight = 0;                                       
  let textPoints = [];
  let w = window.innerWidth,
      h = window.innerHeight;
  c.width = window.innerWidth;
  c.height = window.innerHeight;
  ctx.clearRect(0, 0, w, h);   
  ctx.font = size+"px IBM Plex Serif";
  ctx.fillStyle = "rgb(255, 255, 255)"
  ctx.fillText(txt, 0, size, w);          
  // get a Uint32 representation of the bitmap:
  data32 = new Uint32Array(ctx.getImageData(0, 0, w, h).data.buffer);
  
  // loop through each pixel. We will only store the ones with alpha = 255
  for(i = 0; i < data32.length; i++) {
    if (data32[i] & 0xff000000) {             
      let pointObj = {
        x: (i % w) * radius * 2 + radius,     
        y: ((i / w)|0) * radius * 2 + radius, 
      }
      textPoints.push(pointObj);
      
      textWidth = (textWidth < pointObj.x) ? pointObj.x : textWidth
      textHeight = (textHeight < pointObj.y) ? pointObj.y : textHeight
    }
  }
  
  let textObj = {
    points:textPoints,
    height:textHeight,
    width:textWidth
  }
  
  return textObj
  // return array - here we'll animate it directly to show the resulting objects:
}