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


function ThemeSparker(name, w,h){
  this.id=nextThemeId++;
  this.name=name;
  //this.lifeSpan=0;
  var s;

  initTheme();

  function initTheme(){
    s=new Sparker();
  }
  
  this.init=function(){
    initTheme();
  };

  this.run=function(blobPos){
    s.run(blobPos);
  };

  function Sparker(){
    var sparks=[];

    this.run=function(points){
      while (sparks.length<points.length){
        sparks.push(new Spark(20));
      }
      points.forEach(function(p, i){
        sparks[i].generate(p.x, p.y);
        sparks[i].show();
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
}





