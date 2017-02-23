//*****************************
// ThemeBounceRings
//*****************************


  function ThemeBounceRings(w,h){

  // function RingSet(){
    var bouncers=[]
    var count=40;
    var thick=1;

     this.add=function(x,y) {
      bouncers.push(new Bouncer(x,y,100,0.10,0.90));
    };

    this.run=function(blobPos) {
      while(blobPos.length>bouncers.length){
        var p=blobPos[blobPos.length-1];
        this.add(p.x, p.y);
        //bouncers.push(new Bouncer(200,200, 100, 0.15, 0.95));
      }
      if(bouncers.length>blobPos.length){
        bouncers.splice(-(bouncers.length-blobPos.length));
      }
      //text(bouncers.length,width/2, height/2);
      colorMode(HSB,255);
      thick=map(blobPos.length,0,5,5,1);
      for(var i=0; i<count; i++){
        for(var j=0; j<bouncers.length; j++){
          if(i===0) bouncers[j].update(blobPos[j]);
          bouncers[j].show(i*TWO_PI/count, thick);
        }
       }
      colorMode(RGB);
    };
  }

  function Bouncer(x,y, r, s, d){
    var pos=createVector(x,y);
    var vel=createVector(0,0);
    var strength=s;
    var drag=d;
    var hue=random(255);
    // var x=width/2;
    // var y=height/2;
    
    var acc=createVector(0,0);
    
    this.show=function(a, thick){
      push();
      translate(width/2,height/2);
      rotate(a);
      translate(-width/2, -height/2);
      stroke(hue,255,255);
      strokeWeight(thick);
      noFill();//fill(255);
      translate(pos.x, pos.y);
      ellipse(0,0,r,r);
      pop();
    };
    
    this.update=function(blobPos){
      acc=createVector(blobPos.x, blobPos.y);
      acc.sub(pos);
      acc.mult(strength*0.5);
      vel.add(acc);
      vel.mult(drag);
      pos.add(vel);
      r=abs(pos.y-y);
    };
    
  }