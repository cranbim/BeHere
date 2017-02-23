//*****************************
// ThemeHoneyCombLight
//*****************************


function ThemeHoneyCombLight(ww, wh){
  var w,h;
  var step=50;
  var hStep;
  var dots=[];
  var a=0;
  var aInc;
  var rMult=1;
  var shiftA=0;
  var shiftAInc;
  var shiftPhaseInc=0;//PI/100;
  var shiftDisplace=20;
  var centre;
  
  shiftAInc=-PI/20;
  centre =createVector(ww/2, wh/2);
  aInc=PI/1000;
  //background(0);
  hStep=sin(PI/3)*step;
  w=floor(ww/step/sin(PI/6));
  h=floor(wh/step/sin(PI/6));
  yPos=hStep/2;
  for(var y=0; y<h; y++){
    yPos+=hStep;
    xPos=(y%2)*step/2;
    for(var x=0; x<w; x++){
      xPos+=step;
      if((x-(y%2))%3!==0){
        var d=new Dot(xPos, yPos);
        // stroke(255);
        // ellipse(xPos,yPos,step,step);
        dots.push(d);
      }
    }
  }
  
  this.run=function(bPos){
    dots.forEach(function(dot){
      dot.update(bPos);
      //dot.shift(shiftA, shiftDisplace, shiftPhaseInc);
      dot.show();
    });
    shiftA+=shiftAInc;
    rMult=0;
    bPos.forEach(function(b){
      var d=dist(b.x, b.y, ww/2, wh/2);
      if(d<wh/8)
        rMult+=map(wh/8-d,0,wh/8,1,4);
      else
        rMult=+1;
    });
    
  }

  function Dot(x,y){
    var alph;
    var r;
    var  shiftX=0;
    var shiftY=0;
    var trail=[];
    var maxTrail=5;
    
    this.noupdate=function(tx, ty){
      var d=dist(x+shiftX,y+shiftY,tx,ty);
      var invD=ww-d;
      
        if(d<ww/2)
          r=map(d,0,ww/2,step,2);
        else
          r=1;
        alph=map(d, 0, ww, 255,100);
      // r*=rMult;
      
    }
    
    this.update=function(blobPos){
      r=1;
      alph=1;
      
      blobPos.forEach(function(b){
        var d=dist(x+shiftX,y+shiftY,b.x, b.y);
        var invD=ww-d;
        if(d<ww/2)
          r+=map(d,0,ww/2,step,2);
        else
          r+=0;
        alph+=map(d, 0, ww, 255,100);
      });
    }
    
    this.shift=function(shiftAngle, shiftDisplace, phaseInc){
      var d=dist(x,y,centre.x, centre.y);
      var shiftPhase=d*PI/100;//TWO_PI*(d%shiftDisplace)/shiftDisplace;
      var sinAngle=sin(shiftAngle+shiftPhase)*shiftDisplace;
      var pos=createVector(x,y);
      pos.sub(centre);
      pos.normalize();
      var m=pos.mag();
      pos.setMag(m+sinAngle);
      //pos.mult(sinAngle);
      shiftX=pos.x;
      shiftY=pos.y;
    }
    
    this.show=function(){
      noStroke();
      fill(255,0,0,alph);
      ellipse(x+shiftX-5,y+shiftY+3,r,r);
      fill(0,255,0,alph);
      ellipse(x+shiftX,y+shiftY-5,r,r);
      fill(0,0,255,alph);
      ellipse(x+shiftX+5,y+shiftY+3,r,r);
      fill(255,255);
      ellipse(x+shiftX,y+shiftY,r*rMult,r*rMult);
    }
    
  }
}

