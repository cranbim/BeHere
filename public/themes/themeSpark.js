//*****************************
// Theme Spark
//*****************************


  function ThemeSpark(w,h){
    sparklers=[];

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
  }


  function Sparkler(){
    var sparks=[];
    var r,g,b,rt,gt,bt;
    var nx, ny, px, py;
    var maxSparks=20;


    r=100; g=80; b=200;
    rt=50; gt=255; bt=0;

    this.run=function(bpos){
      for(var i=sparks.length-1; i>=0; i--){
        sparks[i].show();
        if(!sparks[i].run()) sparks.splice(i,1);
      }
      shiftCol();
      if(bpos){
        px=nx; py=ny;
        nx=bpos.x; ny=bpos.y;
        if(random(10)<4 && sparks.length<maxSparks){
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



    function Spark(pos, travel, mr, mg, mb){
      travel.normalize();
      var rad=random(3,12);
      travel.mult(rad/2);
      var ttlMax=50;
      var ttl=50;
      var trail=[];
      var maxTrail=10;
      var width=4;
      var alpha=255;
      this.show=function(){
        trail.forEach(function(spot){
          push();
          alpha=map(ttl,ttlMax,0,255,50);
          fill(color(random(150,250),mg,mb,alpha));
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
        ttl--;
        return ttl>0;
      };
    }
  }