//*****************************
// ThemeStrings
//*****************************


  function ThemeStrings(w,h){
  // function Strings(){
    var strings=[];
    var numStrings=16;
    var pitch;
    var rot=0.1;
    var rotInc=0;
    var prox=height/2;
    
    pitch=width*1.1/numStrings
    for(var i=0; i<numStrings; i++){
      strings[i]=new String(pitch*i);
    }
    rotInc=PI/1000;

    this.run=function(blobPos){
      strings.forEach(function(s){
        s.update(blobPos);
        s.show();
      });
    }

    function String(x){
      var numSegs=100;
      var a=0;
      var aInc;
      var phase=0;
      var f=0.1;
      var near;
      var nTot=0.1;
      var nCount=0;
      var c,w,p,alph;
      
      
      this.update=function(points){
        var fTot=0.1;
        nTot=1;
        nCount=0;
        if(points && points.length>0){
          points.forEach(function(p){
            // stroke(255,0,0);
            // ellipse(p.x,p.y,10,10);
            //near=prox-abs(x-p.x);
            near=prox-dist(p.x,p.y,x,height/2);
            if(near>0){
              f=map(near,prox,0,18,0.5);
              nTot+=near;
              nCount++;

            } else {
              f=0.1;
              nTot+=1;
            }
            fTot+=f;

          });
          //nTot/=points.length;
        }
        
        aInc=TWO_PI/numSegs*fTot*2;
        phase+=aInc*10;
        if(phase>TWO_PI) phase-=TWO_PI;

      }
      
      this.show=function(){
        push();
        var hue;
        colorMode(HSB,255);
        translate(x,height/2);
        rotate(rot);
        //rot+=rotInc;
        if(true){
          c=map(nTot,prox/2,0*nCount,255,0);
          hue=map(nTot,prox,0,1,30);
          w=map(nTot,prox,0,1,10);
          p=map(nTot,prox,0,1,4);
          alph=map(nTot,prox/2,0,255,100);
        }
        stroke(hue,c,255,alph);
        strokeWeight(w);
        noFill();
        beginShape();
        var sy=-height/2;
        for(var i=0; i<numSegs; i++){
          var sx=sin(a+phase)*pitch/p;
          sy+=height/numSegs;
          vertex(sx,sy);
          a+=aInc;
        }
        endShape();
        colorMode(RGB,255);
        pop();
      }
      
    }

  }

