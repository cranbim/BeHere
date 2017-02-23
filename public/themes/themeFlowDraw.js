//*****************************
// ThemeFlowDraw
//*****************************


function ThemeFlowDraw(w,h){
  var flowfield;
  var fieldForce=5;
  var step=40;
  var particles=[];
  var numParticles=5;
  var threshold=10;
  var touching=false;
  var showField=false;
  var noiseSeedVal=0;
  var params={};

  flowfield=new Flowfield(step);
  for(var i=0; i<numParticles; i++){
    particles[i]=new Particle(random(w),h/2);
  }
  //background(0);
  particles.push(new Particle(random(w),h/2, true));
  background(0);

  this.run=function(bPos, soundOn, paramsIn){
    params=paramsIn;
    if(noiseSeedVal===0){
      noiseSeedVal=params.seed;
      flowfield.initNoise(noiseSeedVal);
    }
    this.renderBackground();
    // background(0,2);
    flowfield.update();
    if(touching){
  //    flowfield.obstruct(mouseX, mouseY);
      flowfield.randomShift();
    }
    if(showField){
      flowfield.show();
    }
    for(var i=0; i<10; i++){
      particles.forEach(function(p){
        p.follow(flowfield);
        p.show();
      })
    }
    // fill(255);
    // text(floor(frameRate()),20,h-20);
  };

  this.runBlobs=function(blobs){
    // console.log("Blob count: "+blobs.howMany());
    var myBlobs=blobs.getBlobs();
    myBlobs.forEach(function(b){
      b.show(true);
      b.update();
    })
    // console.log("I am running the Blobs now!");
  };

  this.renderBackground=function(){
    background(40,2);
  }



  function Flowfield(step){
    var field;
    var wf=floor(w/step);
    var hf=floor(h/step);
    var xOff=0;
    var xOffInc=0.05;
    var yOff=0;
    var yOffInc=0.05;
    var xShift=0.01;
    var yShift=0;
    noiseSeed(10);

    this.initNoise=function(newSeed){
      noiseSeed(newSeed);
    }

    
    this.update=function(){
      field=[];
      for(var y=0; y<hf; y++){
        var row=[];
        for(var x=0; x<wf; x++){
          xOff=(Date.now()%33)*xShift;
          row[x]=noise(xOff+(myStartX+x)*xOffInc, yOff+y*yOffInc);
        }
        field[y]=row;
      }
      //xOff+=xShift;
      yOff+=yShift;
    };
    
    this.update();
    
    this.flowAt=function(tx, ty){
      if(field){
        var x=constrain(floor(tx/step),0,wf-1);
        var y=constrain(floor(ty/step),0,hf-1);
        if(field[y]){
          // console.log(field.length+" "+field[y].length+" "+tx+" "+x+", "+ty+" "+y);
          return field[y][x];
        }
      }
    }
    
    this.obstruct=function(tx,ty){
      var txs=floor(tx/step);
      var tys=floor(ty/step);
      console.log(tx+" "+txs);
      for(var y=0; y<hf; y++){
        for(var x=0; x<wf; x++){
          var d=dist(txs,tys, x, y);
          if(d<threshold){
            var v=createVector(txs,tys);
            var spot=createVector(x,y);
            spot.sub(v);
            spot.normalize();
            var val=map(spot.heading(),-PI/2, PI/2,0,1);
            field[y][x]=val;
          }
        }
      }
    }
    
    this.randomShift=function(){
      xOff+=random(1);
    }
    
    this.show=function(){
      push();
      for(var y=0; y<hf; y++){
        for(var x=0; x<wf; x++){
          var c=map(field[y][x],0,1,0,255);
          fill(c);
          noStroke();
          //rect(x*step,y*step,step,step);
          
          var a=map(field[y][x],0,1,-PI,PI);
          push();
          translate(x*step+step/2,y*step+step/2);
          rotate(a);
          stroke(255);
          strokeWeight(0.5);
          noFill();
          line(-step/2,0,step/2,0);
          pop();
        }
      }
      pop();
    }
  }
  
  function Particle(x,y,special){
    this.special=special;
    var pos=createVector(x,y);
    var vel=createVector(0,0);
    var acc;
    var lim=5;
    var prev;
    var sw=0;
    var swa=0;
    var swainc=PI/random(50,200);
    console.log(special);
    
    this.follow=function(flow){
      // console.log(" "+this.special);
      prev=pos.copy();
      acc=p5.Vector.fromAngle(map(flow.flowAt(pos.x, pos.y),0,1,-PI, PI));
      acc.mult(fieldForce);
      vel.add(acc);
      if(special){
        vel.limit(lim*2);
      } else {
        vel.limit(lim);
      }
      pos.add(vel);
      edges();
    };
    
    function edges(){
      if(pos.x>w){
        pos.x=0;
        prev.x=0;
        vel=p5.Vector.random2D();
      } 
      if(pos.x<0){
        pos.x=w-1;
        prev.x=w-1;
        vel=p5.Vector.random2D();
      } 
      if(pos.y>h){
        pos.y=0;
        prev.y=0;
        vel=p5.Vector.random2D();
      } 
      if(pos.y<0){
        pos.y=h-1;
        prev.y=h-1;
        vel=p5.Vector.random2D();
      } 
    }
    
    this.show=function(){
      swa+=swainc;
      sw=sin(swa)*10+5;
      noFill();
      if(special){
        strokeWeight(2);
        stroke(250,0,0);
        line(prev.x, prev.y, pos.x, pos.y);
      } else {
        strokeWeight(sw);
        stroke(0,200,255,100);
        line(prev.x, prev.y, pos.x, pos.y);
      }
      // strokeWeight(3);
      // stroke(255);
      // line(prev.x, prev.y, pos.x, pos.y);
  
    }
  }
}
