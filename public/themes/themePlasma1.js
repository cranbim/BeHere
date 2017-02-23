//*****************************
// ThemePlasma1
//*****************************


  function ThemePlasma1(w,h){
  // function PlasmaBalls(){
    var balls=[];

    this.run=function(blobPos){
      while(balls.length<blobPos.length){
        balls.push(new PlasmaBall());
      }
      blobPos.forEach(function(b,i){
        balls[i].run(b.x, b.y);
      });
    };
  }

  function PlasmaBall(){
    var numParticles=100;
    var particles=[];
    var radMin=width/8;
    var radMax=width/3;
    var radNow=radMin;
    
    this.run=function(x,y){
      if(particles.length<numParticles){
        for(var i=0; i<5; i++){
          particles.push(new Particle(x,y, radNow));
        }
      }
      for(var i=particles.length-1; i>=0; i--){
        if(!particles[i].update()){
          particles.splice(i,1);
        }
        particles[i].show();
      }
    };
  }

  function Particle(x,y, rad){
    var pos=createVector(x,y);
    var vel=createVector(0,0);
    var acc;
    var ttlInit=20;
    var ttl=ttlInit;
    
    this.update=function(){
      var acc=p5.Vector.random2D();
      acc.mult(2);
      vel.add(acc);
      pos.add(vel);
      ttl--;
      return ttl>0;
    };
    
    this.show=function(){
      var r=map(ttl,0,ttlInit,0,rad);
      var a=map(ttl,0,ttlInit,50,255)
      push();
      colorMode(HSB,255);
      fill(map(ttl,ttlInit,0,100,180),map(ttl,ttlInit,0,0,200),255);
      noStroke();
      ellipse(pos.x,pos.y,r,r);
      colorMode(RGB,255);
      pop();
    }
  }

