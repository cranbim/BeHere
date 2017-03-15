//*****************************
// ThemeLandscape
//*****************************


function ThemeLandscape(w,h){
  var skyLines=[];
  var hillZ=0;
  var hillZInc=0.1;
  var offInc=8;
  var skyAlpha=100;
  var hillMaxAng=0;
  var hillMaxAngInc=0.01;
  var hillMax;
  var numSkyLines=40;
  var zBackDiv=50;
  var nearZ=h/4*3;//300;
  var farZ=nearZ/2;//150;
  
  var hillsOverCity=true;
  
  function init() {
    // for(var i=0; i<5; i++){
    skyLines.push(new HillLine(h/2,50));
    // }
    hillZ+=hillZInc;
  }

  init();
  
  
  this.run=function(){
    background(150);
    hillMaxAng+=hillMaxAngInc;
    hillMax=sin(hillMaxAng)*100+100;
    fill(150,250,255);
    noStroke();
    rect(0,0,w,h/2);
    if(frameCount%20===0){
      if(skyLines.length<numSkyLines){
        if(hillsOverCity){
          if(hillMax>20){
            skyLines.push(new HillLine(h/2,150));
          } else {
            skyLines.push(new WaterLine(h/2,20));
          }
        } else {
          if(globalParams[1].current<0.6){
          // if(random(10)<3){
            skyLines.push(new SkyLine(h/2,20));
          } else {
            skyLines.push(new SubUrbanLine(h/2,30));
          }
          
        }
        // console.log(skyLines.length);
        // console.log(">>>"+globalParams[1].current+" "+(globalParams[1].current<0.4));
        if(globalParams[1].current<0.2){
        // if(random(100)<20){
          hillsOverCity=!hillsOverCity;
        }
      }
    }
    var remove=-1;
    skyLines.forEach(function(skyLine,i){
      if(!skyLine.run()) remove=i;
    });
    if(remove>-1){
      skyLines.splice(remove,1);
    }
  };
  
  // this.runBlobs=function(blobs){
  //   // console.log("Blob count: "+blobs.howMany());
  //   var myBlobs=blobs.getBlobs();
  //   myBlobs.forEach(function(b){
  //     b.show(true);
  //     b.update();
  //   })
  //   // console.log("I am running the Blobs now!");
  // };

  this.renderBackground=function(){
    background(40,2);
  };

  
  function HillLine(y, numPoints, yScaleIn, rIn, gIn, bIn){
    var yScale=yScaleIn||1;
    var vertices=[];
    //var maxHeight=120;
    var maxHeight=sin(hillMaxAng)*h/3+h/3;
    var ttl=500;
    var myOffX=0;
    var r=rIn||0;
    var g=gIn||random(100,200);
    var b=bIn||0;
    //var c=colIn || color(random(100,200);
    var nOff=random(1);
    var nOffInc=0.01;
    var step=w/numPoints;
    var baseY=y;
    // var nearZ=300;
    // var farZ=150;
    var z=nearZ;
    var lerpSteps=50;
    
    var remain, targetY, thisStep;
    for(var i=0; i<numPoints-1; i++){
      var yn=noise(hillZ, nOff)*maxHeight;
      if(i===0) targetY=yn;
      remain=targetY-yn;
      if(i>numPoints-lerpSteps){
        thisStep=numPoints-i-1;
        yn=targetY-(remain/lerpSteps*thisStep)*random(0.99,1.01);
        //yn*=yScale;
      }
      vertices.push({x:i*step, y:-yn});
      nOff+=nOffInc;
    }
    vertices.push({x:w-step, y:vertices[0].y});
    
    this.run=function(){
      this.show(r,g,b,ttl, myOffX);
      ttl--;
      var oInc=map(ttl,500,0,offInc,0);
      myOffX+=oInc;
      if(myOffX<0) myOffX+=w;
      return ttl>0;
    };
    
    this.getHeightAt=function(x){
      var xIndex=floor(x/step);
      var heightHere=vertices[xIndex];
      return heightHere;
    };
    
    this.show=function(r,g,b, ttl, myOffX){
      push();
      translate(w/2,baseY-h/2);
      scale(map(ttl,500,0,2,1));
      translate(-w/2+step/2,0);
      z+=(farZ-z)/zBackDiv;
      translate(0,z);
      fill(130,220,255,map(ttl,500,0,0,skyAlpha));
      noStroke();
      rect(0,0,width,-z);
      noStroke();
      fill(r,g,b);//,map(ttl,500,0,255,100));
      beginShape();
      vertex(0,0);
      var vOff=floor(map(myOffX,0,w,0,vertices.length));
      var j;
      for(var i=0; i<vertices.length-1; i++){
        j=(i+vOff)%vertices.length;
        vertex(vertices[i].x, vertices[j].y*yScale);
      }
      vertex(w-step*2,0);
      endShape(CLOSE);
      pop();
    };
  }
  
  function WaterLine(y, numPoints){
    var vertices=[];
    var maxHeight=h/40;
    var ttl=500;
    var myOffX=0;
    var c=random(100,200);
    var nOff=random(1);
    var nOffInc=0.1;
    var step=width/numPoints;
    var baseY=y;
    // var nearZ=300;
    // var farZ=150;
    var z=nearZ;
    var lerpSteps=50;
    
    var remain, targetY, thisStep;
    for(var i=0; i<numPoints-1; i++){
      var yn=noise(hillZ, nOff)*maxHeight;
      if(i===0) targetY=yn;
      remain=targetY-yn;
      if(i>numPoints-lerpSteps){
        thisStep=numPoints-i-1;
        yn=targetY-(remain/lerpSteps*thisStep)*random(0.99,1.01);
      }
      vertices.push({x:i*step, y:-yn});
      nOff+=nOffInc;
    }
    vertices.push({x:width-step, y:vertices[0].y});
    
    this.run=function(){
      this.show(c,ttl, myOffX);
      ttl--;
      var oInc=map(ttl,500,0,offInc,0);
      myOffX+=oInc;
      if(myOffX<0) myOffX+=w;
      return ttl>0;
    };
    
    this.show=function(c, ttl, myOffX){
      push();
      translate(w/2,baseY-h/2);
      scale(map(ttl,500,0,2,1));
      translate(-w/2+step/2,0);
      z+=(farZ-z)/zBackDiv;
      translate(0,z);
      fill(130,220,255,map(ttl,500,0,0,skyAlpha));
      noStroke();
      rect(0,0,width,-z);
      noStroke();
      fill(0,c-100,c);//,map(ttl,500,0,255,100));
      beginShape();
      vertex(0,0);
      var vOff=floor(map(myOffX,0,w,0,vertices.length));
      var j;
      for(var i=0; i<vertices.length-1; i++){
        j=(i+vOff)%vertices.length;
        vertex(vertices[i].x, vertices[j].y);
      }
      vertex(w-step*2,0);
      endShape(CLOSE);
      pop();
    };
  }
  
  function SkyLine(y, numBlocks){
    var blocks=[];
    var used=0;
    var ttl=500;
    var myOffX=0;
    var c=random(40,180);
    //   var nearZ=300;
    // var farZ=150;
    var z=nearZ;
    var baseY=y;

    var ch=random(40,100);
    var myHill=new HillLine(h/2,150,0.5,ch,ch,ch );
  
  
    
    for(var i=0; i<numBlocks; i++){
      var wid=(w-used)/(numBlocks-i);
      // console.log(used+" "+wid);
      var rWid=random(0.3,2);
      var rH=random(10,h/3);
      blocks[i]=new Block(used, y, wid*rWid, rH);
      used+=wid*rWid;
    }
    // console.log(blocks);
    
    this.run=function(){
      myHill.run();
      this.show();
      blocks.forEach(function(b){
        b.show(c,ttl,myOffX, myHill);
        b.update();
      });
      ttl--;
      var oInc=map(ttl,500,0,offInc,0);
      myOffX-=oInc;
      if(myOffX<0) myOffX+=w;
      return ttl>0;
    }
    
    this.show=function(){
      push();
      translate(w/2,baseY-h/2);
      scale(map(ttl,500,0,2,1));
      translate(-w/2,0);
      // var myX=(oX+x)%w;
      z+=(farZ-z)/zBackDiv;
      translate(0,z);
      fill(150,250,255,map(ttl,500,0,0,skyAlpha));
      noStroke();
      rect(0,0,w,-z);
      pop();
    }
  }
  
  function Block(x,y,bw,bh){
    var hNow=0;
    var bwa=bw-random(8);
    var ease=50;
    // var nearZ=300;
    // var farZ=150;
    var z=nearZ;
    var baseY=y;

  
    
    this.show=function(c,ttl, oX, myHillLine){
      push();
      translate(w/2,baseY-h/2);
      scale(map(ttl,500,0,2,1));
      translate(-w/2,0);
      var myX=(oX+x)%w;
      var hillLineY=myHillLine.getHeightAt(x).y/2;
      z+=(farZ-z)/zBackDiv;
      translate(myX,z+hillLineY);
      noStroke();
      fill(c);//,map(ttl,500,0,255,100));
      rect(0,0,bwa,-hNow);
      pop();
    }
    
    this.update=function(){
      hNow+=(bh-hNow)/ease;
    }
  }
  
  function SubUrbanLine(y, numBlocks){
    var blocks=[];
    var used=0;
    var ttl=500;
    var myOffX=0;
    //   var nearZ=300;
    // var farZ=150;
    var z=nearZ;
    var baseY=y;
    var c=random(100,200);
    var myHill=new HillLine(h/2,150,0.5,c,c,c );
    
  
    
    for(var i=0; i<numBlocks; i++){
      var wid=(w-used)/(numBlocks-i);
      // console.log(used+" "+wid);
      var rWid=random(0.3,2);
      var rH=random(8,h/12);
      blocks[i]=new House (used, y, wid*rWid, rH);
      used+=wid*rWid;
    }
    // console.log(blocks);
    
    this.run=function(){
      this.show();
      myHill.run();
      blocks.forEach(function(b){
        b.show(ttl,myOffX, myHill);
        b.update();
      });
      ttl--;
      var oInc=map(ttl,500,0,offInc,0);
      myOffX-=oInc;
      if(myOffX<0) myOffX+=w;
      return ttl>0;
    }
    
    this.show=function(){
      push();
      translate(w/2,baseY-h/2);
      scale(map(ttl,500,0,2,1));
      translate(-w/2,0);
      // var myX=(oX+x)%w;
      z+=(farZ-z)/zBackDiv;
      translate(0,z);
      fill(150,250,255,map(ttl,500,0,0,skyAlpha));
      noStroke();
      rect(0,0,w,-z);
      pop();
    }
  }
  
  function House(x,y,bw,bh){
    var hNow=0;
    var bwa=bw-random(8);
    var ease=50;
    // var nearZ=300;
    // var farZ=150;
    var z=nearZ;
    var baseY=y;
    var cr=random(100,200);
    var cg=random(50,150);
    var cb=100;
    var hasRoof=random(2)<1?false:true;
  
  
    
    this.show=function(ttl, oX, myHillLine){
      push();
      translate(w/2,baseY-h/2);
      scale(map(ttl,500,0,2,1));
      translate(-w/2,0);
      var myX=(oX+x)%w;
      var hillLineY=myHillLine.getHeightAt(x).y/2;
      //console.log(hillLineY);
      z+=(farZ-z)/zBackDiv;
      translate(myX,z+hillLineY+10);
      noStroke();
      fill(cr,cg,cb);//,map(ttl,500,0,255,100));
      rect(0,0,bwa,-hNow);
      if(hasRoof){
        //stroke(255);
        triangle(0,-hNow,bwa/2,-hNow-hNow/3,bwa,-hNow);
      }
      pop();
    }
    
    this.update=function(){
      hNow+=(bh-hNow)/ease;
    }
  }
}
