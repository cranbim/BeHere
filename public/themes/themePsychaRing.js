//*****************************
// ThemePsychaRing
//*****************************


  function ThemePsychaRing(w,h){

  // function PsychaRing(){
    var numCircles=40;
    var shift;
    var newCount=0;
    var a=0;
    var circleWidth=floor(random(width/160,width/20));
    var aSInc=PI/random(50,200);
    var numSegs=floor(random(2,10));
    var s1=new Spinner(circleWidth, 1, random(255), 1);
    var s2=new Spinner(circleWidth, 1, random(255), -1);
    
    this.run=function(){
      s1.run();
      s2.run();
      a+=aSInc;
    };
    
    
    function Spinner(circleWidth, offset, col, dir){
      var circles=[];
      var startRad=50;
      var maxRad=width*1.4;
      var count=0;
      var newCount=0;
      var growth=0;
      var grow=1;//floor(random(1,8))/2;
      
      for(var i=0; i<numCircles; i++){
        var rad=startRad+i*circleWidth*4;
        if(rad>maxRad) break;
        circles.push(new BrokenCircle(rad, circleWidth, numSegs, PI/100*i, startRad, maxRad));
      }
      count=circles.length;
      
      this.run=function(){
        growth+=grow;
        if(growth%(grow*circleWidth*4)===0){
          if(dir>0){
            var nc=new BrokenCircle(startRad, circleWidth, numSegs, -(PI/100)*(1+newCount++), startRad, maxRad);
            circles.unshift(nc);
          } else {
            var nc=new BrokenCircle(maxRad-circleWidth, circleWidth, numSegs, (PI/100)*(count++), startRad, maxRad);
            circles.push(nc);
          }
        }
        for(var i=circles.length-1; i>=0; i--){
          circles[i].show(col);
          if(!circles[i].update(offset, dir, startRad, maxRad)){
            circles.splice(i,1);
          }
        }
      }
    // }
    
    
    function BrokenCircle(r, sw, numSegs, phase, startRad, maxRad){
      var numSegsRender=numSegs*2;
      var segSize=TWO_PI/numSegsRender;
      var drawing=true;
      var radialResolution=100;
      var aShift=0;
      
      
      this.show=function(c){
        push();
        colorMode(HSB,255);
        var alpha=map(r,startRad, maxRad, 20,255);
        stroke(c, 255,255, alpha);
        strokeWeight(sw);
        noFill();
        translate(width/2, height/2);
        rotate(aShift);
        for(var i=0; i<numSegsRender; i+=2){
          arc(0,0,r,r,i*segSize,(i+1)*segSize);
        }
        pop();
        colorMode(RGB,255);
      };
      
      this.update=function(offset, dir, min, max){
        r+=1*dir;
        if(r>max) return false;
        if(r<min) return false;
        //aShift+=aInc;
        aShift=sin(a+phase+offset*segSize)*PI;
        return true;
      };
    }
  }

}