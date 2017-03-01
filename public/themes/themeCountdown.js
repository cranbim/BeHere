//*****************************
// ThemeCountdown
//*****************************


function ThemeCountdown(w,h){
  var startBeat=deviceData.currentBeat;
  var lastBeat=startBeat;
  var particles=[];
  var numParticles=500;
  var attracting=false;
  var osb;
  var counterInit=5;
  var counter=99;
  var myFCount;
  var changeCol=false;
  var newCol=255;
  var params={};

  for(var i=0; i<numParticles; i++){
    particles[i]=new Particle();
  }
  osb=new OSB();
  

  this.run=function(bPos, soundOn, paramsIn){
    params=paramsIn;
    if(counter===99){
      if(params.hasOwnProperty('beat')){
        console.log("!!!"+params.beat);
        counter=counterInit-floor((lastBeat-params.beat)/2);
      }
    }
    console.log("Theme Params "+params);
    colorMode(HSB,255);
    background(51);
    // background((newCol+128)%255,110,100);
    particles.forEach(function(p){
      p.update(attracting);
      if(changeCol) p.changeCol(newCol);
      p.show(osb);
    });
    run();
    osb.show();
    colorMode(RGB);
    console.log("Time to end theme?: "+(counter<0));
    return(counter<0);
  };

  function run(){
    changeCol=false;
    if(deviceData.currentBeat-lastBeat===2){
      console.log(deviceData.currentBeat+" "+params.beat);
      lastBeat=deviceData.currentBeat;
    // if(frameCount%60===0){
      attracting=true;
      newCol=random(255);
      myFCount=10;
    }
    if(attracting && myFCount--<0){
      attracting=false;
      osb.drawNum(counter--);
      changeCol=true;
    }
  }


  function Particle(){
    var pos=createVector(random(w), random(h));
    var noMove=createVector(0,0);
    var vel=createVector(1,0);
    var acc;
    var recentre=createVector(0,0);
    var centre=createVector(w/2,h/2);
    var move;
    var c;
    var col;
    changeColor();

    
    this.update=function(attracting){
      move=noMove;
      c=osb.getPixelsXY(pos.x, pos.y);
      acc=p5.Vector.random2D();
      acc.mult(20);
      if(attracting){
        this.attract(w/2, h/2);
      }
      vel.add(move);
      vel.add(acc);
      vel.add(recentre);
      if(!attracting){
        vel.limit(c.r===255?40:10);
      } else {
        vel.limit(40);
      }
      // vel.limit(attracting?100:20);
      pos.add(vel);
      edges();
    }
    
    
    this.attract=function(x,y){
      move=createVector(x,y);
      move.sub(pos);
      move.mult(20);
    }
    
    function edges(){
      // if(pos.x>w) pos.x=0;
      // if(pos.x<0) pos.x=w;
      // if(pos.y<0) pos.y=h;
      // if(pos.y>h) pos.y=0;
      if(dist(pos.x, pos.y,w/2, h/2)>h/2){
        recentre=p5.Vector.sub(centre,pos);
        recentre.mult(100);
      }else{
        recentre=createVector(0,0);
      }
        // vel.mult(-1);
        // var newPos=pos.copy();
        // var centre=createVector(w/2,h/2);
        // newPos.sub(centre);
        // newPos.setMag(w/2);
        // centre.add(newPos);
        // pos=centre;
      
    }
    
    this.changeCol=changeColor;
    
    function changeColor(ncol){
      col=ncol;
    }
    
    this.show=function(osb){
      var rad;
      if(attracting){
        rad=w/200;
      } else {
        rad=c.r===255?w/80:w/40;
      }
      // var rad=c.r===255?w/200:w/40;
      push();
      //console.log(pos.x+" "+pos.y+" "+c.r);
      // colorMode(HSB,255);
      // if(c.r===255) noFill();
      // else 
      if(c.r===255){
        noFill();
      } else {
        fill(col,200,200);
      }
      //fill(c.r===255?255:150,150);
      //noStroke();
      stroke(col,200,200);
      ellipse(pos.x, pos.y, rad,rad);
      // colorMode(RGB);
      pop();
    };
  }

  function OSB(){
    var buffer=createGraphics(w, h);
    var d=pixelDensity();
    
    buffer.background(255);
    buffer.stroke(0);
    buffer.strokeWeight(w/20);
    //buffer.noStroke();
    buffer.textSize(h*0.7);
    var tw=buffer.textWidth("10");
    //buffer.text("10",buffer.width/2-tw/2,buffer.height*0.7);
    buffer.ellipse(w/2, h/2,w/4, w/4);
    buffer.loadPixels();

    this.getPixelsXY=function(x,y){
      x=constrain(floor(x),0,buffer.width-1);
      y=constrain(floor(y),0,buffer.height-1);
      var pixelsOffset=(y*d*buffer.width*d+x*d)*4;
      // var pixelsOffset=0;
      return {
        r:pixels[pixelsOffset+0],
        g:pixels[pixelsOffset+1],
        b:pixels[pixelsOffset+2],
        a:pixels[pixelsOffset+3],
      };
    };

    this.show=function(){
      //scale(0.5);
      // image(buffer,0,0);
      // fill(255,0,0);
      // textSize(50);
      // var c=this.getPixelsXY(mouseX, mouseY);
      // console.log(c);
      // if(c)
      //   text(c.r,20,50);
    };
    
    this.drawNum=function(num){
      colorMode(RGB);
      buffer.background(255);
      buffer.fill(0);
      // buffer.stroke(0);
      buffer.noStroke();
      buffer.textSize(h*0.9);
      var tw=buffer.textWidth(num);
      //buffer.text("Hi?",100,100);
      buffer.text(num,buffer.width/2-tw/2,buffer.height*0.8);
      //buffer.ellipse(width/2, height/2,200,200);
      buffer.loadPixels();
    };
    
  }
}