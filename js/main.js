'use strict';

var stats,
  stage,
  renderer,
  attractors = [],
  items = [],
  textures,
  numBoids = 900,
  halfWidth = 0,
  halfHeight = 0,
  boidsContainer,
  curScale = 1,
  boidsLimit = {};

let flock,bg

const setupStats = () => {
  var st = document.createElement('div');
  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.bottom = '0px';

  document.body.appendChild(st);
  st.appendChild(stats.domElement);
}

const setupDatGUI = () => {
  var gui = new dat.GUI();
  var bOptions = {
    boids: numBoids,
    separationDistance : 45,
    alignmentDistance : 415,
    cohesionDistance : 170,
    atractionForce: -20
  };
  var c = gui.add(bOptions, 'boids', numBoids, 1200).step(1);
  c.onFinishChange((value) => {

    if (value > flock.boids.length) {

      flock.boids.forEach((e,i)=>{
        flock.boids.push([0, 0, Math.random() * 6 - 3, Math.random() * 6 - 3, 0, 0]);
        // create a new Sprite using the texture
        var tex = textures[Math.floor(Math.random() * textures.length)];
        var b = new PIXI.Sprite(tex);

        // center the sprites anchor point
        b.anchor.x = 0.5;
        b.anchor.y = 0.5;
        var s = random(0.3, 0.4);
        // let s = 0.4
        b.scale = new PIXI.Point(s, s);

        boidsContainer.addChild(b);
        items.push(b);
      })

    }else {
      flock.boids.forEach((e,i)=>{
        flock.boids.pop();
        var x = items.pop();
        x.visible = false;
        x.renderable = false;
      })

    }
  });

  gui.add(flock, 'speedLimitRoot', 0, 20);
  gui.add(flock, 'accelerationLimitRoot', 0.01, 50).step(0.01);

  var c1 = gui.add(bOptions, 'separationDistance', 0, 500);
  c1.onChange((value) => {
    flock.separationDistance = Math.pow(value, 2);
  });

  var c2 = gui.add(bOptions, 'alignmentDistance', 0, 500);
  c2.onChange((value) => {
    flock.alignmentDistance = Math.pow(value, 2);
  });

  var c3 = gui.add(bOptions, 'cohesionDistance', 0, 500);
  c3.onChange((value) => {
    flock.cohesionDistance = Math.pow(value, 2);
  });

  gui.add(flock, 'separationForce', 0.01, 5).step(0.01);
  gui.add(flock, 'cohesionForce', -0.9, 0.9).step(0.01);
  gui.add(flock, 'alignmentForce', 0.10, 5).step(0.01);

  var f2 = gui.addFolder('Attraction');
  var c4 = f2.add(bOptions, 'atractionForce', -40, 40).step(0.01);
  c4.onChange((value) => {
    // flock.attractors[0].f = value;
  });
  f2.open();
  gui.close();
}

let shock = new PIXI.filters.ShockwaveFilter(
  [window.innerWidth/2,window.innerHeight/2],
  {},
  0
)


const init = () => {
  
  var t1 = PIXI.Texture.from('https://cdn.glitch.com/4d39133e-b3b7-4768-b5c7-ea33124bc0dd%2Ftest_green.png?v=1563926788361');
  var t2 = PIXI.Texture.from('https://cdn.glitch.com/4d39133e-b3b7-4768-b5c7-ea33124bc0dd%2Ftest_paula.png?v=1563926352608');
  var t3 = PIXI.Texture.from('https://cdn.glitch.com/4d39133e-b3b7-4768-b5c7-ea33124bc0dd%2Fradialpink.png?v=1563928193076');
  var t4 = PIXI.Texture.from('https://cdn.glitch.com/4d39133e-b3b7-4768-b5c7-ea33124bc0dd%2Ftest_paula.png?v=1563926352608');
  let bgTex = PIXI.Texture.from('https://cdn.glitch.com/a634d84f-6e3f-45f4-a7ee-ac2a661cbbe2%2Fblackbg.png?v=1563540862661')

  textures = [t3];

  stage = new PIXI.Container();

  renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);
  renderer.backgroundColor﻿ = 0x4c0099;

  // console.log('Using', renderer);

  renderer.view.style.display = 'block';
  document.body.appendChild(renderer.view);

  boidsContainer = new PIXI.Container();
  
  let dotF = new PIXI.filters.DotFilter(0.8);
  let asciiF = new PIXI.filters.AsciiFilter(6);
  let bloomF = new PIXI.filters.BloomFilter (2, 4)
  let outlineF = new PIXI.filters.OutlineFilter(1, 0xFFFFFF)
  let glowF = new PIXI.filters.GlowFilter(2, 2, 1, 0xFFFFFF, 0.5)
  let RGBF = new PIXI.filters.RGBSplitFilter([-1,5], [0,0], [0,0])
  let godF = new PIXI.filters.GodrayFilter()

  bg = new PIXI.Sprite(bgTex);
  bg.height = window.innerHeight;
  bg.width = window.innerWidth
  // stage.addChild(bg)
  stage.addChild(boidsContainer);
  // stage.filters = [shock];
  boidsContainer.filters = [RGBF,asciiF]

  createFlock();
  
  flock.boids.forEach((e,i)=>{
    var tex = textures[Math.floor(Math.random() * textures.length)];
    var b = new PIXI.Sprite(tex);
    b.anchor.x = 0.5;
    b.anchor.y = 0.5;
    var s = random(0.2, 0.45);
    // let s = 0.4
    b.scale = new PIXI.Point(s, s);
    b.position.x = halfWidth;
    b.position.y = halfHeight;

    boidsContainer.addChild(b);
    items.push(b);
  })

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
    separationForce: 0,
    cohesionForce: 0.1,
    attractors: attractors,
    alignmentForce: 0.9
  });
  
  document.fonts.load('10pt "IBM Plex Serif"').then(()=>{
  flock.pointTargets = generate('Thank You',18,6)
  });
  // setupDatGUI();

  //creating attraction here and setting mousemove
  // flock.attractors = [
  //   {x:500, 
  //    y:0, 
  //    r:40, 
  //    f:-80
  //   },
  //   {x:500, 
  //    y:0, 
  //    r:100, 
  //    f:20}
  // ];

//   window.addEventListener("mousemove",(e)=>{
//     flock.attractors[0].x = e.clientX - halfWidth;
//     flock.attractors[0].y = e.clientY - halfHeight;
    
//     flock.attractors[1].x = e.clientX - halfWidth;
//     flock.attractors[1].y = e.clientY - halfHeight;
//   })

}

const render = () => {
  flock.tick();
  shock.time = (shock.time >= 5 ) ? 0 : shock.time + 0.015;

  // stats.update();
  var boidData = flock.boids;

  for (var i = 0, l = boidData.length, x, y; i < l; i += 1) {
    x = boidData[i][0]; y = boidData[i][1];
    boidData[i][0] = x > boidsLimit.right ? boidsLimit.left : -x > boidsLimit.right ? boidsLimit.right : x;
    boidData[i][1] = y > boidsLimit.bottom ? boidsLimit.top : -y > boidsLimit.bottom ? boidsLimit.bottom : y;
    items[i].position.x = x;
    items[i].position.y = y;
    items[i].rotation =  boidData[i][6];
  }

  renderer.render(stage);
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
  bg.height = window.innerHeight;
  bg.width = window.innerWidth

  if (window.innerWidth < 720) {
    curScale = 0.7;
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
}

const random = (from, to) => {
  return (Math.random() * (to - from) + from);
}

init();
