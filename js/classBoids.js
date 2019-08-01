  let
    sqrt = Math.sqrt,
    POSITIONX = 0,
    POSITIONY = 1,
    SPEEDX = 2,
    SPEEDY = 3,
    ACCELERATIONX = 4,
    ACCELERATIONY = 5,
    DIRECTION = 6

  class Flock {
    constructor(opts){
      this.opts = opts;
      this.speedLimitRoot = opts.speedLimit || 0;
      this.accelerationLimitRoot = opts.accelerationLimit || 9;
      this.speedLimit = Math.pow(this.speedLimitRoot, 1.8);
      this.accelerationLimit = Math.pow(this.accelerationLimitRoot, 2);
      this.separationDistance = Math.pow(opts.separationDistance || 45, 2);
      this.alignmentDistance = Math.pow(opts.alignmentDistance || 415, 2);
      this.cohesionDistance = Math.pow(opts.cohesionDistance || 175, 2);
      this.separationForce = opts.separationForce || 0.9;
      this.cohesionForce = opts.cohesionForce || 0.5;
      this.alignmentForce = opts.alignmentForce || opts.alignment || 4;
      this.attractors = opts.attractors || [];
      this.pointTargets = {points:[],width:0,height:0};
      this.toPoint = false;
      this.clock = 0;
      this.wordSwitch = false;
      this.globalSpeedX = 0;
      this.boids = [];
      this.init()
    }
    
    init(){
      for (let i = 0, l = this.opts.boids === undefined ? 50 : this.opts.boids; i < l; i++) {

        if (this.opts.startPositions) {
          this.boids[i] = [
            this.opts.startPositions[i][0], this.opts.startPositions[i][1], 0, 0, 0, 0];
        } else {
          this.boids[i] = [Math.random() * 100, Math.random() * 100, 0, 0, 0, 0];
        }
        
      }
    }

    tick() {
      let 
        boids = this.boids,
        sepDist = this.separationDistance,
        sepForce = this.separationForce,
        cohDist = this.cohesionDistance,
        cohForce = this.cohesionForce,
        aliDist = this.alignmentDistance,
        aliForce = this.alignmentForce,
        speedLimit = this.speedLimit,
        accelerationLimit = this.accelerationLimit,
        accelerationLimitRoot = this.accelerationLimitRoot,
        speedLimitRoot = this.speedLimitRoot,
        size = boids.length,
        current = size,
        sforceX, sforceY,
        cforceX, cforceY,
        aforceX, aforceY,
        spareX, spareY,
        attractors = this.attractors,
        attractorCount = attractors.length,
        distSquared,
        currPos,
        length,
        target;

      
      if(this.toPoint && this.clock < 1){
        this.clock += 0.00125 
      }else{
        this.clock = 0
        let textpoints = (this.wordSwitch) ? generate('Goodbye',18,6) : generate('Hello',18,6)
        this.pointTargets = textpoints
        this.wordSwitch = !this.wordSwitch
      }
      
      //Loop through all boids
      while (current--) {
        sforceX = 0; sforceY = 0;
        cforceX = 0; cforceY = 0;
        aforceX = 0; aforceY = 0;
        currPos = boids[current];
        
        // Attract to textpoint
        if(this.toPoint === true && this.pointTargets.points.length >= (size-current)){
          let newPoint = this.pointTargets.points[size-current-1]
          let centeredX = newPoint.x - (this.pointTargets.width/2)
          let centeredY = newPoint.y - (this.pointTargets.height/2)
          spareX = currPos[0] - centeredX
          spareY = currPos[1] - centeredY
          distSquared = spareX * spareX + spareY * spareY
          length = sqrt(spareX * spareX + spareY * spareY);
          let aForce = 20
          
          // boids[current][SPEEDX] -= (aForce * spareX / length) || 0;
          boids[current][SPEEDX] = (length <= .1) ? 0 : (boids[current][SPEEDX] - (aForce * spareX / length)); 
          boids[current][SPEEDY] = (length <= .1) ? 0 : (boids[current][SPEEDY] - (aForce * spareY / length)); 

          // boids[current][SPEEDY] -= (aForce * spareY / length) || 0;
        }
        
        
        // Attractors
        target = attractorCount;
        while (target--) {
          var attractor = attractors[target];
          spareX = currPos[0] - attractor.x;
          spareY = currPos[1] - attractor.y;
          distSquared = spareX * spareX + spareY * spareY;

          if (distSquared < attractor.r * attractor.r) {
            length = sqrt(spareX * spareX + spareY * spareY);
            boids[current][SPEEDX] -= (attractor.f * spareX / length) || 0;
            boids[current][SPEEDY] -= (attractor.f * spareY / length) || 0;
          }
        }
        

        
        // target = (this.toPoint) ? size-this.pointTargets.points.length : size;
        target = size
        while (target--) {
          if (target === current) {continue; }
          spareX = currPos[0] - boids[target][0];
          spareY = currPos[1] - boids[target][1];
          distSquared = spareX * spareX + spareY * spareY;

          if (distSquared < sepDist) {
            sforceX += spareX;
            sforceY += spareY;
          } else {
            if (distSquared < cohDist) {
              cforceX += spareX;
              cforceY += spareY;
            }
            if (distSquared < aliDist) {
              aforceX += boids[target][SPEEDX];
              aforceY += boids[target][SPEEDY];
            }
          }
        }
        

        // Separation
        length = sqrt(sforceX * sforceX + sforceY * sforceY);
        boids[current][ACCELERATIONX] += (sepForce * sforceX / length) || 0;
        boids[current][ACCELERATIONY] += (sepForce * sforceY / length) || 0;
        // Cohesion
        length = sqrt(cforceX * cforceX + cforceY * cforceY);
        boids[current][ACCELERATIONX] -= (cohForce * cforceX / length) || 0;
        boids[current][ACCELERATIONY] -= (cohForce * cforceY / length) || 0;
        // Alignment
        length = sqrt(aforceX * aforceX + aforceY * aforceY);
        boids[current][ACCELERATIONX] -= (aliForce * aforceX / length) || 0;
        boids[current][ACCELERATIONY] -= (aliForce * aforceY / length) || 0;
      }
      current = size;

      // Apply speed/acceleration for
      // this tick
      let ratio;
      while (current--) {
        if (accelerationLimit) {
          distSquared = boids[current][ACCELERATIONX] * boids[current][ACCELERATIONX] + boids[current][ACCELERATIONY] * boids[current][ACCELERATIONY];
          if (distSquared > accelerationLimit) {
            ratio = accelerationLimitRoot / sqrt(distSquared);
            boids[current][ACCELERATIONX] *= ratio;
            boids[current][ACCELERATIONY] *= ratio;
          }
        }

        boids[current][SPEEDX] += boids[current][ACCELERATIONX];
        boids[current][SPEEDY] += boids[current][ACCELERATIONY];

        if (speedLimit) {
          distSquared = boids[current][SPEEDX] * boids[current][SPEEDX] + boids[current][SPEEDY] * boids[current][SPEEDY];
          if (distSquared > speedLimit) {
            ratio = speedLimitRoot / sqrt(distSquared);
            boids[current][SPEEDX] *= ratio;
            boids[current][SPEEDY] *= ratio;
          }
        }
        let px = boids[current][POSITIONX] , py = boids[current][POSITIONY];

        boids[current][POSITIONX] += boids[current][SPEEDX] + this.globalSpeedX;
        boids[current][POSITIONY] += boids[current][SPEEDY];
        boids[current][DIRECTION] = Math.atan2(boids[current][POSITIONY] - py, boids[current][POSITIONX] - px);
      }
    };

  };

