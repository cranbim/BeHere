// function ThemeBlank(name, w,h){
//   this.id=nextThemeId++;
//   this.name=name;
//   //this.lifeSpan=0;

//   initTheme();

//   function initTheme(){
//   }
  
//   this.init=function(){
//     initTheme();
//   }; 

//   this.run=function(){
//     this.show();
//     this.update();
//   };

//   this.show=function(){
//   };

//   this.update=function(){
//   };
// }


function ThemeDefault(name, w,h){
  this.id=nextThemeId++;
  this.name=name;
  //this.lifeSpan=0;
  var f;

  initTheme();

  function initTheme(){
    f=new Filler();
  }
  
  this.init=function(){
    initTheme();
  };

  this.run=function(blobPos){
    f.run();
  };



}


function ThemeCountdown(w,h){
  var particles=[];
  var numParticles=500;
  var attracting=false;
  var osb;
  var counter=10;
  var myFCount;
  var changeCol=false;
  var newCol=255;

  for(var i=0; i<numParticles; i++){
    particles[i]=new Particle();
  }
  osb=new OSB();
  }

  this.run=function(){
    colorMode(HSB,255);
    background((newCol+128)%255,110,100);
    particles.forEach(function(p){
      p.update(attracting);
      if(changeCol) p.changeCol(newCol);
      p.show(osb);
    });
    run();
    colorMode(RGB);
  }

  function run(){
    changeCol=false;
    if(frameCount%60===0){
      attracting=true;
      newCol=random(255);
      myFCount=20;
    }
    if(attracting && myFCount--<0){
      attracting=false;
      osb.drawNum(counter--);
      changeCol=true;
    }  
  }


  function Particle(){
    var pos=createVector(random(width), random(height));
    var noMove=createVector(0,0);
    var vel=createVector(1,0);
    var acc;
    var move;
    var c;
    var col;
    changeCol();

    
    this.update=function(attracting){
      move=noMove;
      c=osb.getPixelsXY(pos.x, pos.y);
      acc=p5.Vector.random2D();
      acc.mult(3);
      if(attracting){
        this.attract(width/2, height/2);
      }
      vel.add(move);
      vel.add(acc);
      vel.limit(c.r===255?10:4);
      pos.add(vel);
      edges();
    }
    
    
    this.attract=function(x,y){
      move=createVector(x,y);
      move.sub(pos);
      move.mult(0.3);
    }
    
    function edges(){
      if(pos.x>width) pos.x=0;
      if(pos.x<0) pos.x=width;
      if(pos.y<0) pos.y=height;
      if(pos.y>height) pos.y=0;
    }
    
    this.changeCol=changeCol;
    
    function changeCol(ncol){
      col=ncol;
    }
    
    this.show=function(osb){
      var rad=c.r===255?4:12
      push();
      //console.log(pos.x+" "+pos.y+" "+c.r);
      // colorMode(HSB,255);
      // if(c.r===255) noFill();
      // else 
      fill(col,200,200);
      //fill(c.r===255?255:150,150);
      noStroke();
      ellipse(pos.x, pos.y, rad,rad);
      // colorMode(RGB);
      pop();
    }
  }

  function OSB(){
    var buffer=createGraphics(width, height);
    var d=pixelDensity();
    
    buffer.background(255);
    buffer.fill(0);
    buffer.noStroke();
    // buffer.textSize(height*0.7);
    // var tw=buffer.textWidth("10");
    // buffer.text("10",buffer.width/2-tw/2,buffer.height*0.7);
    buffer.ellipse(width/2, height/2,200,200);
    buffer.loadPixels();

    this.getPixelsXY=function(x,y){
      x=constrain(floor(x),0,width-1);
      y=constrain(floor(y),0,height-1);
      var pixelsOffset=(y*d*width*d+x*d)*4;
      // var pixelsOffset=0;
      return {
        r:buffer.pixels[pixelsOffset+0],
        g:buffer.pixels[pixelsOffset+1],
        b:buffer.pixels[pixelsOffset+2],
        a:buffer.pixels[pixelsOffset+3],
      };
    }
    
    this.drawNum=function(num){
      buffer.background(255);
      buffer.fill(0);
      buffer.noStroke();
      buffer.textSize(height*0.9);
      var tw=buffer.textWidth(num);
      buffer.text(num,buffer.width/2-tw/2,buffer.height*0.9);
      //buffer.ellipse(width/2, height/2,200,200);
      buffer.loadPixels();
    }
    
  }
}





