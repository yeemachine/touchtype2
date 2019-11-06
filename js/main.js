'use strict';

var stats,
  stage,
  renderer,
  attractors = [],
  items = [], //pixi object of each boid
  textures,
  numBoids = 600,
  halfWidth = 0,
  halfHeight = 0,
  boidsContainer,
  curScale = .5,
  videoRatio,
  videoSprite,
  boidsLimit = {},
  charList = ".,'!@#$%^&*()-{}|\/?~`;:[]<>+",
  colorList = [0xf56c42,0x4278f5,0xf5d142,0xf5428a]

let flock,bg


const init = () => {
  
  var t1 = PIXI.Texture.from('https://cdn.glitch.com/4d39133e-b3b7-4768-b5c7-ea33124bc0dd%2Ftest_green.png?v=1563926788361');
  var t2 = PIXI.Texture.from('https://cdn.glitch.com/4d39133e-b3b7-4768-b5c7-ea33124bc0dd%2Ftest_paula.png?v=1563926352608');
  var t3 = PIXI.Texture.from('https://cdn.glitch.com/4d39133e-b3b7-4768-b5c7-ea33124bc0dd%2Fradialpink.png?v=1563928193076');
  var t4 = PIXI.Texture.from('https://cdn.glitch.com/4d39133e-b3b7-4768-b5c7-ea33124bc0dd%2Ftest_paula.png?v=1563926352608');
  let bgTex = PIXI.Texture.from('https://cdn.glitch.com/a634d84f-6e3f-45f4-a7ee-ac2a661cbbe2%2Fblackbg.png?v=1563540862661')

  textures = [t1];

  stage = new PIXI.Container();

  // renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);
  renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);

  renderer.backgroundColor﻿ = 0x4c0099;
  renderer.view.id = 'pixi'

  console.log('Using', renderer);

  renderer.view.style.display = 'block';
  document.querySelector('section').appendChild(renderer.view);

  boidsContainer = new PIXI.Container();
  boidsContainer.zIndex = 1
  
  let dotF = new PIXI.filters.DotFilter(0.3);
  let asciiF = new PIXI.filters.AsciiFilter(4);
  let bloomF = new PIXI.filters.BloomFilter (2, 4)
  let outlineF = new PIXI.filters.OutlineFilter(1, 0xFFFFFF)
  let glowF = new PIXI.filters.GlowFilter(2, 2, 1, 0xFFFFFF, 0.5)
  let RGBF = new PIXI.filters.RGBSplitFilter([-3,5], [0,2], [2,0])
  let godF = new PIXI.filters.GodrayFilter()

  bg = new PIXI.Sprite(bgTex);
  bg.height = window.innerHeight;
  bg.width = window.innerWidth
  // stage.addChild(bg)
  stage.addChild(boidsContainer);
  // stage.filters = [shock];
  // boidsContainer.filters = [RGBF,asciiF]
  // boidsContainer.filters = [RGBF]

  createFlock();
  


  // setupStats();

  window.addEventListener("resize", windowOnResize);

  windowOnResize();

  render();

}

const createFlock = () => {
  flock = new Flock({
    boids: numBoids,
    speedLimit: 1.8,
    accelerationLimit: 10,
    separationForce: 0.2,
    cohesionForce: 0.1,
    attractors: attractors,
    alignmentForce: 0.5
  });
  
  flock.boids.forEach((e,i)=>{
    // var tex = textures[Math.floor(Math.random() * textures.length)];
    
    let spriteText = new PIXI.Text(charList.charAt(Math.floor(Math.random() * charList.length)),{
      fontFamily : 'Nicholson', 
      fontSize: 80, 
      fill : colorList[Math.floor(Math.random() * colorList.length)], 
      align : 'center'});
    // var b = new PIXI.Sprite(tex);
    let b = spriteText
    b.anchor.x = 0.5;
    b.anchor.y = 0.5;
    var s = random(0.1, 0.25);
    // let s = 0.4
    b.scale = new PIXI.Point(s, s);
    b.position.x = halfWidth;
    b.position.y = halfHeight;

    boidsContainer.addChild(b);
    items.push(b);
  })
  
  document.fonts.load('10pt "IBM Plex Serif"').then(()=>{
    flock.pointTargets = generate('Thank You',18,6)
  });

}

const render = () => {
  if(flock !== undefined){
    flock.tick();

    // stats.update();
    var boidData = flock.boids;

    for (var i = 0, l = boidData.length, x, y; i < l; i += 1) {
      x = boidData[i][0]; y = boidData[i][1];
      boidData[i][0] = x > boidsLimit.right ? boidsLimit.left : -x > boidsLimit.right ? boidsLimit.right : x;
      boidData[i][1] = y > boidsLimit.bottom ? boidsLimit.top : -y > boidsLimit.bottom ? boidsLimit.bottom : y;
      items[i].position.x = x;
      items[i].position.y = y;
      items[i].rotation =  boidData[i][6];
      items[i].style.fontFamily = 'Nicholson'

      items[i].tint = (boidData[i][7] === true) ? 0xff0000 : 0xffffff

    }

    renderer.render(stage);
  }
  
  requestAnimationFrame(render);
}

const windowOnResize = () => {
  var coef,
    spacing = 10;

  renderer.resize(window.innerWidth, window.innerHeight);
  renderer.view.width = window.innerWidth;
  renderer.view.height = window.innerHeight;
  halfWidth = window.innerWidth * 0.5;
  halfHeight = window.innerHeight * 0.5;

  boidsContainer.position.x = halfWidth;
  boidsContainer.position.y = halfHeight;

  if (window.innerWidth < 720) {
    curScale = 1;
  } else {
    curScale = 1;
  }

  boidsContainer.scale.x = curScale;
  boidsContainer.scale.y = curScale;

  coef = 1 / curScale;

  boidsLimit = {
    top: -halfHeight * coef - spacing,
    bottom: halfHeight * coef + spacing,
    left: -halfWidth * coef - spacing,
    right: halfWidth * coef + spacing
  };
  
  if(videoSprite){   
     if(window.innerWidth/window.innerHeight < videoRatio){
        videoSprite.width = window.innerHeight*videoRatio;
        videoSprite.height = window.innerHeight;
      }else{
        videoSprite.width = window.innerWidth;
        videoSprite.height = window.innerWidth/videoRatio;
      }
    videoSprite.position.x = halfWidth + videoSprite.width/2
    videoSprite.position.y = halfHeight - videoSprite.height/2
  }
}

const random = (from, to) => {
  return (Math.random() * (to - from) + from);
}

document.fonts.load('10pt "Nicholson"').then(()=>{
  init();
})
