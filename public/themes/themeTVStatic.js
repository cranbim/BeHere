//*****************************
// ThemeTVStatic
//*****************************


  function ThemeTVStatic(w,h){
  // function TVStatic(){
    var numStrikes=200;
    var swipe1=0;
    var swipeH=100;
    var swipe2=height/2+swipeH/2;
    var n;
    var nOff=0;
    var nInc=0.1;
    var swipeInc=-15;
    var maxDur=250;
    var duration=maxDur;
    var fleckSize;

    this.run=function() {
      n=noise(nOff);
      nOff+=nInc;
      background(noise(nOff+0.5)*100,150);
      noStroke();
      fill(100);
      rect(0,-swipeH/2+swipe1,width,swipeH);
      rect(0,-swipeH/2+swipe2,width,swipeH);
      swipe1+=swipeInc;
      if(swipe1>height+swipeH/2) swipe1=-swipeH/2;
      if(swipe1<-swipeH/2) swipe1=height+swipeH/2;
      swipe2+=swipeInc;
      if(swipe2>height+swipeH/2) swipe2=-swipeH/2;
      if(swipe2<-swipeH/2) swipe2=height+swipeH/2;
      for(var i=0; i<numStrikes; i++){
        var x=random(-10,width);
        var y=random(height);
        var l=random(30*n+1);
        var c=random(200,255);
        stroke(c);
        strokeCap(ROUND);
        strokeWeight(noise(nOff+0.1)*fleckSize);
        line(x,y,x+l,y);
      }
      if(duration>0){
        fleckSize=map(duration,maxDur,0,50,15);
        duration --;
        background(255,map(duration,maxDur,0,255,10));
      } else {
        fleckSize=15;
      }

    };

  }