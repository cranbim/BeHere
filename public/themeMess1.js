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


function ThemeHairBall(name, w,h){
  this.id=nextThemeId++;
  this.name=name;
  //this.lifeSpan=0;
  var hb;

  initTheme();

  function initTheme(){
    hb=new HairBall();
  }
  
  this.init=function(){
    initTheme();
  };

  this.run=function(blobPos){
    hb.run(blobPos);
  };

  function HairBall(){
    var segs=[];
    var maxSegs=30;
    var len=10;
    var segRot;
    var segMaxRot;
    var hairs=[];
    var numHairs=40;
    var a=0;
    var r=100;
    var x,y;
    for(var i=0; i<numHairs; i++){
      x=width/2+cos(a)*r;
      y=height/2+sin(a)*r;
      hairs[i]=new Hair(x,y,PI/2+a);
      a+=2*PI/numHairs;
    }


    thisrun=function(){
      stroke(255);
      //b1.display();
      for(var i=0; i<hairs.length; i++){
        hairs[i].display();
      }
      fill(100);
    };

    function Hair(x,y, a){
      this.x=x;
      this.y=y;
      this.col=random(150,255);
      var noiseBase=random(1);
      var noiseY=random(1);
      var noiseInc=0.01;
      var segs=[];
      var trigger=floor(random(10));
      var numSegs=3;
      var len=10;
      var segRot;
      var segMaxRot;
      var s=new Segment2(createVector(100+i*10,100),len,a);
      segs.push(s);
      for(var i=1; i<numSegs; i++){
        var s=new Segment2(createVector(100+i*10,100),len,0);
        segs.push(s);
      }
      segRot=PI/1000;
      segMaxRot=PI/10;

      this.display=function(){
        stroke(255);
        var pos=createVector(this.x, this.y);
        var a=0;
        //noiseBase+=noiseInc;
        noiseY+=noiseInc;
          var aging
        for(var i=0; i<segs.length; i++){
          var n=map(noise(noiseBase+i*noiseInc, noiseY),0,1,-segRot, segRot);
          segs[i].rotateMe(n);
          if(segs.length>20){
            if(i>segs.length-20){
              aging=1;
            }else{
              aging=i/(segs.length-20);
            }
          }else{
            aging=1;
          }
          //aging=i/segs.length;
          segs[i].update(pos, a, aging);
          pos=segs[i].tip;
          a=segs[i].myAngle;
          segs[i].display(this.col);
        }
         //if(frameCount%50==0) addSegBase();
         if(frameCount%10==trigger) addSegEnd();
         if(segs.length>maxSegs){
           this.x=segs[1].base.x;
           this.y=segs[1].base.y;
           segs[1].myRotation+=segs[0].myRotation;
           segs.shift();
         }
      }
      function addSegEnd(){
        var s=new Segment2(createVector(100+4*10,100),len,0);
        segs.push(s);
      }

      function addSegBase(){
      //    var a=segs[0].myAngle;
          var s=new Segment2(createVector(100*10,100),len,0);
      //    s.myRotation=a;
          segs.unshift(s);
      }
    }

    function Segment2(base, length, startA){
      this.base=base;
      this.seg=createVector(0,length);
      this.tip=p5.Vector.add(this.base,this.seg);
      this.givenAngle=0;
      this.myRotation=startA;
      this.myAngle=0;
      var myRotDir=-1;
      this.mass=0;
      this.vel=0;
      this.acc=0;
      this.hit=false;
      this.thick=1;
      this.fade=255;
      
      
      this.rotateMe=function(a){
        this.myRotation+=a*myRotDir;
      };
      
      this.update=function(pos,angle,dying){
        this.base=pos;
        this.givenAngle=angle;
        this.seg.rotate(-this.myAngle+this.givenAngle+this.myRotation);
        this.tip=p5.Vector.add(this.base,this.seg);
        this.myAngle=this.givenAngle+this.myRotation;
        this.thick+=0.05;
        this.fade=map(dying,0,1, 20,255);
      };
      
      this.display=function(col){
        push();
        translate(this.base.x, this.base.y);
        rotate(this.givenAngle);
        rotate(this.myRotation);
        //if(this.hit) stroke(255,0,0); else stroke(255);
        stroke(this.fade, this.fade);
        strokeWeight(this.thick);
        line(0,0,0,length);
        pop();
      };
      
      this.collide=function(item){
        this.hit=collideLinePoly(this.base.x, this.base.y, this.tip.x, this.tip.y, item);
        //console.log(frameCount+" "+this.hit);
        if(this.hit){
          myRotDir=-myRotDir;
        }
        return this.hit;
      };
    }
  }
}





