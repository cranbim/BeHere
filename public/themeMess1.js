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


function ThemeHypno(name, w,h){
  this.id=nextThemeId++;
  this.name=name;
  //this.lifeSpan=0;
  var hypnos=[];

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


  function HypnoRing(w,h){

    var rings=[];
    var numRings;
    var a=0;
    var aInc;
    var rGrow=1;
    var gap=25;
    var thick=5;
    var rot=0;
    var rotInc;
    var running=true;

    rotInc=PI/100;
    createCanvas(500,500);
    numRings=w*1.4/2/gap;
    aInc=PI/50;
    for(var i=0; i<numRings; i++){
      var r=new Ring(gap+i*gap, PI/numRings*i);
      rings.push(r);
    }
    
    this.run=function() {
      rings.forEach(function(r,i){
        r.show(rot+rotInc*i*10);
        if(!r.grow(a)) r.reset();
      });
      rot+=rotInc;
      if(running){
        a+=aInc;
      }
    }

    function Ring(rInit, phase){
      var x=width/2;
      var y=height/2;
      var r=rInit;
      
      this.grow=function(a){
        r+=sin(a+phase)*rGrow;//+0.5;
        return !(r>width*1.4/2);
      }
      
      this.show=function(rot){
        push();
        translate(x,y);
        stroke(200);
        strokeWeight(thick);
        noFill();
        //ellipse(0,0,r*2,r*2);
        myRing(0,0,r,rot);
        pop();
      }
      
      this.reset=function(){
        r=gap;
      }
    }

    function myRing(x,y,r,rot){
      var segs=50;
      var maxThick=10;
      var aInc=TWO_PI/segs;
      var a=0;//TWO_PI;
      push();
      translate(x,y);
      rotate(rot);
      //var px=0; var py=0;
      var px=cos(a)*r;
      var py=sin(a)*r;
      for(var i=0; i<segs; i++){
        a+=aInc;
        var rx=cos(a)*r;
        var ry=sin(a)*r;
        strokeWeight((sin(a)*maxThick+maxThick+1)*r/width*2);
        line(px,py,rx,ry);
        px=rx;
        py=ry;
      }
      pop();
    }
  }
}
