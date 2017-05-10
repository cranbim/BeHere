//Plasma Ring 
//Dave Webb, Cranbim 2016, 2017
//statusBar.js 
//object for status animation

/*****************************************
  status bar object constructor
  ******************************************/
function StatusBar(start, end){
  var w=10;
  var alphaS=50;
  var alphaE=200;
  var pos=start-10;
  // var inc=(end-start)/duration;
  var r=200;
  var g=0;
  var b=200;
  var sweepMult=12;
  var sweepThick=3;
  textSize(width*0.05);
  var tL;//=textWidth(message);
  var tLength=height*2;
  var tSpeed;//=tLength/duration;
  var tPos=height;
  var running=true;
  this.flashes=0;
  var duration=30;
  var message="none";
  var flashes=0;
  var tPosX=100;
  var messageSize;

  this.setValues=function(){
    inc=(end-start)/duration;
    //textSize(height*0.5);
    tLength=this.h;
    textSize(this.w*0.2);
    tL=textWidth(message);
    tPosX=this.w/2-tL/2;
    tSpeed=this.h/duration;
  };

  this.setValues();
  
  var statusColors={
    request: {r: 20, g:80, b:255, m:"REQUEST", ms:0.2 },
    permit: {r: 255, g:20, b:150, m:"ALLOW?", ms:0.2 },
    grant: {r: 125, g:20, b:255, m:"PERMIT", ms:0.2 },
    offer: {r: 255, g:130, b:0, m:"OFFER", ms:0.2 },
    accept: {r: 255, g:230, b:0, m:"ACCEPT", ms:0.2 },
    accepted: {r: 0, g:255, b:50, m:"ACCEPTED", ms:0.2 },
    attach: {r: 0, g:180, b:0, m:"ATTACHING", ms:0.2 },
    detach: {r: 255, g:0, b:0, m:"DETACH", ms:0.2 },
    attached: {r: 0, g:180, b:0, m:"ATTACH HERE", ms:0.2 },
    attachedPrev: {r: 20, g:100, b:255, m:"☛☛☛", ms:0.2 },
    attachedNext: {r: 20, g:100, b:255, m:"☚☚☚", ms:0.2 },
    attachedMe: {r: 20, g:100, b:255, m:"⬆︎⬆︎⬆︎", ms:0.2 },
    blob: {r: 200, g:80, b:20, m:"BLOB" },
    none: {r: 0, g:0, b:0, m:"NOTHING" }
  };

  this.setSize=function(w,h){
    this.w=w;
    this.h=h;
    start=w;
    end=0;
  };
  
  this.show=function(){
    push();
    if(running){
      if(pos>end){
        for(var i=0; i<w; i++){
          var a=map(i,w,0,alphaS, alphaE);
          fill(r,g,b,a);
          noStroke();
          rectMode(CORNER);
          rect(pos+i*sweepMult,0,sweepThick,height);
          rect(width-pos-i*sweepMult,0,-sweepThick,height);
          var vPos=map(pos,start,end,height,0);
          rect(0, vPos+i*sweepMult, width,sweepThick);
          rect(0, height-vPos-i*sweepMult, width, -sweepThick);
         //rect(width/2, height/2, pos+i, pos+i, w+i);
  
        }
        var rad=map(pos,start,end,0,width/8);
        rectMode(CENTER);
        stroke(r,g,b,a);
        strokeWeight(sweepThick);
        noFill();
        for(var i=0; i<w; i++){
          var a=map(i,0,w,0, 255);
          stroke(r,g,b,a);
          var vPos=map(pos,0,width, 0, height);
          rect(width/2, height/2, pos+i*sweepThick, vPos+i*sweepThick, rad+i);
        }
        fill(r,g,b,150);
        //noStroke();
        stroke(0);
        strokeWeight(4);
        textSize(this.w*messageSize);
        text(message,this.w/2-tL/2,tPos);
        pos+=inc;
        tPos-=tSpeed;
      } else{
        if(flashes>0){
          flashes--;
          this.reset();
        } else {
          running=false;
        }
      }
    }
    pop();
  }
  
  this.trigger=function(trigKey, count, dur){
    flashes=count||0;
    // this.ttl=ttlMax;
    if(!statusColors[trigKey]){
      trigKey="none";
    }
    r=statusColors[trigKey].r;
    g=statusColors[trigKey].g;
    b=statusColors[trigKey].b;
    duration=dur;
    message=statusColors[trigKey].m;
    messageSize=statusColors[trigKey].ms;
    running=true;
    pos=start-10;
    tPos=this.h;
    this.setValues();
  };


  
  this.reset=function(){
    running=true;
    pos=start-10;
    tPos=width;
  };
}