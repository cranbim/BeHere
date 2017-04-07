//*****************************
// ThemeCalmBars
//*****************************

function ThemeCalmBars(w,h){
  
  var rings=[];
  var numRings=25;
  var ror;
  var rModifier=1;
  var offA=0;
  var offAMax=PI/16;
  for(var i=0; i<numRings; i++){
    rings[i]=new Ring(300+i*10);
  }

  this.run=function(blobPos){
    if(blobPos){
      if(blobPos.length>1){
        offA=map(blobPos[0].x,0,w,-offAMax, offAMax);
        rModifier=map(blobPos[0].y,0,h,0.01,1);
      }
    }
    rings.forEach(function(ring){
      ring.show(offA, rModifier);
      ring.update();
    });
    //ror.run();
  };


  
  function Ring(r){
    var rad=r;
    var pulseA=random(PI);
    var pulseAInc=PI/random(20,150);
    var sw;
    var colr=floor(random(100,255));
    var colb=floor(random(0,colr));
    var xOff=random(0.8,1.2);
    var yOff=random(0.8,1.2);
    
    this.show=function(oA, rMod){
      push();
      translate(w/2*xOff, h/2*yOff);
      rotate(oA*pulseA/16);
      translate(-w/2*xOff, -h/2*yOff);
      noFill();
      stroke(colr,0,colb,150);
      strokeWeight(sw*rMod*1.2);
      //ellipse(width/2, height/2, rad*2, rad*2);
      line(-w/4,h/2-r/2+rad,w*1.25,h/2-r/2+rad);
      stroke(colr,0,0);
      strokeWeight(sw*rMod);
      //ellipse(width/2, height/2, rad*2, rad*2);
      line(-w/4,h/2,w*1.25,h/2);
      pop();
    }
    
    this.update=function(){
      pulse=sin(pulseA);
      pulseA+=pulseAInc;
      rad=pulse*r/2+r/2;
      sw=cos(pulseA)*r/5+r/5;
    }
  }

}