// noisePerWorldPixel=0.0005;
// var noiseSegsX=20;


function NoiseField(){
  var step,w,h;
  var noiseOffX=0;
  var noiseOffY=0;
  var field=[];
  var shiftXinc=0.01;
  var shiftYinc=0.001;
  var shiftX=0;
  var shiftY=0;
  var noiseSyncFrame=frameCount;

  this.setField=function(devWidth, startX, noiseSegsX, noisePerWorldPixel){
    step=floor(devWidth/noiseSegsX);
    w=noiseSegsX;
    h=floor(devHeight/step);
    noiseOffX=startX*noisePerWorldPixel;
    noiseSeed(10,10);
    generate();
    console.log("field offset" +noiseOffX);
  };

  this.update=function(){
    shiftX+=shiftXinc;
    //shiftY+=shiftYinc;
    //shiftX=(frameCount-noiseSyncFrame)*shiftXinc;
    generate();
  };

  function generate(){
    for(var y=0; y<h; y++){
      var noiseRow=[];
      for(var x=0; x<w; x++){
        noiseRow[x]=noise(shiftX+noiseOffX+x*step*noisePerWorldPixel,shiftY+noiseOffY+y*step*noisePerWorldPixel);
      }
      field[y]=noiseRow;
    }
  }

  this.syncOffset=function(){
    shiftX=0;
    shiftY=0;
  };

  this.calcOffset=function(startX){
    noiseSyncFrame=frameCount;
    noiseOffX=startX*noisePerWorldPixel;
  };

  this.show=function(){
    for(var y=0; y<field.length; y++){
      for(var x=0; x<field[y].length; x++){
        fill(map(field[y][x],0,1,0,255),150);
        noStroke();
        rect(x*step, y*step,step,step);
      }
    }
  };
}