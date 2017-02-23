//*****************************
// ThemeCalmRings
//*****************************



function ThemeCalmRings(w,h){
  
  var rings=[];
  var numRings=5;
  var ror;
  for(var i=0; i<numRings; i++){
    rings[i]=new Ring(h/2+i*10);
  }
  ror=new RingOfRings(25);

  this.run=function(){
    rings.forEach(function(ring){
      ring.show();
      ring.update();
    });
    ror.run();
  }

  function RingOfRings(qtyR){
    var rot=TWO_PI/qtyR;
    var maxiRad=100;
    var miniRad=20;
    var colr=random(250,255);
    var pulseA=0;
    var pulseAInc=PI/100;
    
    
    this.run=function(){
      var miniMod=miniRad*2*cos(pulseA*2)+miniRad;
      var maxiMod=sin(pulseA)*maxiRad+maxiRad*2;
      // strokeWeight(miniMod*1.2);
      // stroke(0);
      // ellipse(width/2,height/2,maxiMod*2, maxiMod*2);
  
      for(var i=0; i<qtyR; i++){
        this.show(rot*i, pulseA, maxiMod, miniMod);
      }
      pulseA+=pulseAInc;
    }
    
    this.show=function(myRot, pulser,maxiMod, miniMod){
      push();
      translate(w/2, h/2);
      rotate(myRot+pulser+sin(pulser)*PI/2);
      fill(miniMod*3+60,0,0);
      //strokeWeight(2);
      noStroke();
      //stroke(colr,0,0);
      ellipse(maxiMod,0,miniMod, miniMod);
      stroke(miniMod*3+60,0,0);
      noFill();
      var echoRingRad=sin(pulser);
      strokeWeight(miniMod/10);
      ellipse(maxiMod,0,miniMod*2*echoRingRad+miniMod, miniMod*2*echoRingRad+miniMod);
      pop();
    }
    
  }
  
  function Ring(r){
    var rad=r;
    var pulseA=random(PI);
    var pulseAInc=PI/random(80,150);
    var sw;
    var colr=floor(random(100,255));
    var colb=floor(random(0,colr));
    
    this.show=function(){
      noFill();
      stroke(colr,0,colb,150);
      strokeWeight(sw*1.2);
      ellipse(w/2, h/2, rad*2, rad*2);
      stroke(colr,0,0);
      strokeWeight(sw);
      ellipse(w/2, h/2, rad*2, rad*2);
    }
    
    this.update=function(){
      pulse=sin(pulseA);
      pulseA+=pulseAInc;
      rad=pulse*r/2+r/2;
      sw=cos(pulseA)*r/5+r/5;
    }
  }

}