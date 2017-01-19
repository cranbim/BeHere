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


function ThemeFlipper1(name, w,h){
  this.id=nextThemeId++;
  this.name=name;
  //this.lifeSpan=0;
  var flipset;

  initTheme();

  function initTheme(){
    flipset=new FlipSet();
  }
  
  this.init=function(){
    initTheme();
  };

  this.run=function(blobPos){
    flipset.run(blobPos);
  };
  

  function FlipSet(){
    var flippers=[];
    var step=25;
    var w,h;
    w=floor(width/step);
    h=floor(height/step);
    for(var y=0; y<h; y++){
      for(var x=0; x<w; x++){
        flippers.push(new FlipSpot(step/2+step*x,step/2+step*y,step));
      }
    }
    
    this.run=function(blobPos){
      flippers.forEach(function(f){
        blobPos.forEach(function(p){
          f.check(p.x, p.y);
        });
        f.update();
        f.show();
      });
    };
    
    this.move=function(){
      flippers.forEach(function(f){
        //f.update();
        f.check(mouseX, mouseY);
      });
    };

    function FlipSpot(x,y,size){
      var flipping=false;
      var flipInc=0.1;
      var flipDir=1;
      var flippage=-1;
      var flipShade=1;
      var r=size/2;
      var baseCol=200;
      var highCol=255;
      var col=baseCol;
      var a=random(PI);
      var threshold=r*3;
      
      this.trigger=function(){
        flipping=true;
        flipDir=1;
      };
      
      this.untrigger=function(){
        flipping=true;
        flipDir=-1;
      };
      
      this.check=function(mx, my){
        var d=dist(mx, my, x, y);
        if(d<threshold){
          col=highCol;
          //flipShade=map(threshold-d,0,threshold,1,0);
          this.trigger();
        } else {
          col=baseCol;
          if(!flipping)
            this.untrigger();
        }
      };
      
      this.update=function(){
        this.check();
        //console.log(flipping);
        if(flipping){
          var speed=flipDir>0?2:0.25;
          flippage+=flipInc*flipDir*speed;
          //console.log(flippage);
          if(flippage<-1){
            flippage=-1;
            flipping=false;
          } else if(flippage>1*flipShade){
            //this.untrigger();
            flippage=1;
            flipping=false;
          }
        }
      };
      
      this.show=function(){
        push();
        translate(x,y);
        rotate(a);
        noStroke();
        // stroke(col);
        if(flippage<0) fill(0);
        else fill(255);
        ellipse(0,0,r*2*(1/flippage),r*2*flippage);
        pop();
      };
    }
    
  }

}





