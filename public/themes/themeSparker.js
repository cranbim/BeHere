//*****************************
// ThemeSparker
//*****************************


  function ThemeSparker(w,h){
  // function Sparker(){
    var sparks=[];
    var noise1=new p5.Noise('white');
    var env = new p5.Env();
    env.setADSR(0.005, 0.01, 0, 0.1);
    env.setRange(1, 0);
    noise1.start();
    noise1.amp(0);

    this.shutdown=function(){
      noise1.stop();
      noise1.amp(0);
      console.log("********* noise stopped");
    };

    this.run=function(points, soundOn){
      if(!soundOn){
        noise1.stop();
      } else {
        noise1.start();
      }
      while (sparks.length<points.length){
        sparks.push(new Spark(20));
      }
      points.forEach(function(p, i){
        sparks[i].generate(p.x, p.y);
        sparks[i].show();
        if(random(10)<2) env.play(noise1);
      });
    };
  }

  function Spark(numSegs){
    var segs=[];
    var x, y;
    var a=0;
    
    this.generate=function(px, py){
      x=px;
      y=py;
      a=random(TWO_PI);
      segs=[];
      currX=0;
      var tLen=random(width);
      for(var i=0; i<numSegs; i++){
        var remainSegs=numSegs-1-i;
        var remainX=tLen-currX;
        var seed=remainX/remainSegs;
        segs[i]=p5.Vector.fromAngle(random(-PI/3,PI/3));
        segs[i].mult(random(seed*3));
        currX+=segs[i].x;
      }
    };
    
    this.show=function(){
      push();
      translate(x,y);
      rotate(a);
      translate(random(50),0);
      noFill();
      stroke(0,220,255);
      segs.forEach(function(s,i){
        strokeWeight(map(numSegs-i,numSegs,0,5,0.5));
        line(0,0,s.x, s.y);
        translate(s.x, s.y);
      });
      pop();
    };
  }