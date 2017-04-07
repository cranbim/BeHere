//*****************************
// ThemeDotStripe
//*****************************

function ThemeDotStripe(w,h){
  var numBlobsPerFrame=30;
  var c1=-25;
  var c2=25;
  var cBase=0;
  var a=0;
  aInc=0.005;
  var bg=255;
  cBase=random(255);
  
  this.renderBackground=function(){
    //background(255);
  }
  this.renderBackground();
  
  this.run=function(blobPos){
    colorMode(HSB,255);
    bg=map(abs(PI-(a%TWO_PI)),PI,0,255,0);
    cBase+=0.1;
    var throb=sin(a)*50+150;
    a+=aInc;
    push();
    translate(w/2, h/2);
    rotate(a);
    translate(-w/2, -h/2);
    for(var i=0; i<numBlobsPerFrame; i++){
      var x=random(-100,w+100);
      var y=random(h);
      var control=map(dist(x,y,x, h/2),0,w/2,1,0);
      stroke(map(control,0,1,cBase+c1, cBase+c2)%255,
        throb,
        map(control,0,1,100,255),
        255);
      fill(map(control,0,1,cBase+c1, cBase+c2)%255,
        throb,
        map(control,0,1,100,255),
        map(control,0,1,10,150));
      if(random(100)<5){
        fill(map(control,0,1,cBase+c1, cBase+c2)%255,
        255,
        255,
        255);
      }
      ellipse(x, y,control*w/30,control*w/30);
      if(random(100)<1){
        fill(bg,120);
        noStroke();
        var r=random(w/20,w/8);
        ellipse(x,y,r,r);
      }
    }
    pop();
    // fill(bg,180);
    // noStroke();
    // var r=random(width/20,width/8);
    // ellipse(mouseX,mouseY,r,r);
  }
}
