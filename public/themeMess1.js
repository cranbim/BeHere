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


function ThemeBlank(name, w,h){
  this.id=nextThemeId++;
  this.name=name;
  //this.lifeSpan=0;
  var sparklers=[];

  initTheme();

  function initTheme(){
    sparklers=[];
  }
  
  this.init=function(){
    initTheme();
  };

  this.run=function(blobPos){
    while(blobPos.length>sparklers.length){
      var s=new Sparkler();
      sparklers.push(s);
    }
    // blobPos.forEach(function(p,i){
    //  dusts[i].run(p);
    // });
    sparklers.forEach(function(s,i){
      s.run(blobPos[i]);
    });
  };



  function Sparkler(){
    var sparks=[];
    var r,g,b,rt,gt,bt;
    var nx, ny, px, py;

    r=100; g=80; b=200;
    rt=50; gt=255; bt=0;

    this.run=function(pos){
      for(var i=sparks.length-1; i>=0; i--){
        sparks[i].show();
        if(!sparks[i].run()) sparks.splice(i,1);
      }
      shiftCol();
      if(pos){
        px=nx; py=ny;
        nx=pos.x; ny=pos.y;
        if(random(10)<6){
          var travel=createVector(nx, ny);
          travel.sub(px, py);
          var pos=createVector(nx, ny);
          var s=new Spark(pos, travel, r, g, b);
          sparks.push(s);
        }
      }
    };



    function shiftCol(){
      r+=(rt-r)/10;
      if(abs(rt-r)<2) rt=random(100,255);
      g+=(gt-g)/10;
      if(abs(gt-g)<2) gt=random(100,255);
      r+=(bt-b)/10;
      if(abs(bt-b)<2) bt=random(100,255);
    }

  }

  function Spark(pos, travel, mr, mg, mb){
    travel.normalize();
    var rad=random(0.5,5);
    travel.mult(rad/2);
    var ttl=100;
    var trail=[];
    var maxTrail=20;
    var width=4;
    var alpha=255;
    // r+=random(50,150);
    // r=r%255;
    // r=255;
    
    this.show=function(){
      trail.forEach(function(spot){
        push();
        alpha=map(ttl,100,0,255,50);
        fill(color(random(50,150),mg,mb,alpha));
        //fill(255,alpha);
        noStroke();
        translate(spot.pos.x, spot.pos.y);
        ellipse(0,0,rad,rad);
        pop();
      });
    };
    
    this.run=function(){
      var p=pos.copy();
      var spot={
        pos:p
      };
      trail.unshift(spot);
      if(trail.length>maxTrail) trail.pop();
      if(ttl<maxTrail){
        trail.pop();
      } else {
        pos.add(travel);
        if(random(10)<4){
          var v=p5.Vector.random2D().mult(2);
          pos.add(v);
        }
      }
      //pos.x+=1;
      ttl--;
      return ttl>0;
    };
  }
}

var sparks=[];
var r,g,b,rt,gt,bt;

function setup() {
  createCanvas(800,600);
  // frameRate(10);
  r=100; g=80; b=200;
  rt=50; gt=255; bt=0;
}

function draw() {
  background(0);
  //sparks.forEach(function(spark)
  // if(sparks.length>0){
    for(var i=sparks.length-1; i>=0; i--){
      sparks[i].show();
      if(!sparks[i].run()) sparks.splice(i,1);
    }
  // }
 // console.log(sparks.length);
 shiftCol();
}

function shiftCol(){
  r+=(rt-r)/10;
  if(abs(rt-r)<2) rt=random(100,255);
  g+=(gt-g)/10;
  if(abs(gt-g)<2) gt=random(100,255);
  r+=(bt-b)/10;
  if(abs(bt-b)<2) bt=random(100,255);
}

function mouseMoved(){
  if(random(10)<4){
    var travel=createVector(mouseX, mouseY);
    travel.sub(pmouseX, pmouseY);
    var pos=createVector(mouseX, mouseY);
    var s=new Spark(pos, travel, r, g, b);
    sparks.push(s);
  }
}

function Spark(pos, travel, mr, mg, mb){
  travel.normalize();
  var rad=random(0.5,5);
  travel.mult(rad/2);
  var ttl=100;
  var trail=[];
  var maxTrail=20;
  var width=4;
  var alpha=255;
  // r+=random(50,150);
  // r=r%255;
  // r=255;
  
  this.show=function(){
    trail.forEach(function(spot){
      push();
      alpha=map(ttl,100,0,255,50);
      fill(color(random(50,150),mg,mb,alpha));
      //fill(255,alpha);
      noStroke();
      translate(spot.pos.x, spot.pos.y);
      ellipse(0,0,rad,rad);
      pop();
    });
  };
  
  this.run=function(){
    var p=pos.copy();
    var spot={
      pos:p
    };
    trail.unshift(spot);
    if(trail.length>maxTrail) trail.pop();
    if(ttl<maxTrail){
      trail.pop();
    } else {
      pos.add(travel);
      if(random(10)<4){
        var v=p5.Vector.random2D().mult(2);
        pos.add(v);
      }
    }
    //pos.x+=1;
    ttl--;
    return ttl>0;
  };
}
