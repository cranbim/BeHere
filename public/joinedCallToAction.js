function JoinedCallToAction(){
  var viewPlane=400;
  var rps=[];
  var numRects=10;
  var centreX;
  var centreZ;
  var centrePos;
  var viewerPos;
  var viewCentreX, viewCentreY;
  var blobRing=new BlobRunner(10,20);
  var screenX=100;
  var screenY=60;
  var aButton=new AttachButton(width/2, height*.75, width/8);
  var poc=new PrintOnCircle(width/2, height*.75, 120, "Test Message...");  
  windowChanged();
  for(var i=0; i<numRects; i++){
    rp=new RectPersp(0,0,180,-PI/5*i+0.2,100,60, i*screenX, (i+1)*screenX-1);
    rps.push(rp);
  }

  function windowChanged(){
    viewPlane=(height)*0.2+width*0.5;
    centreX=width/2;
    centreZ=height/4;
    centrePos=createVector(centreX, centreZ);
    viewCentreX=width/2;
    viewCentreY=height/3;
    viewerPos=createVector(width/2, 500 );
    aButton.resize(width/2, height*.67, (width+height)/12);
    poc.resize(width/2, height*0.67, (width+height)/10);
    if(height>width){
      poc.newMessage("Turn your device to landscape!...");
    } else {
      poc.newMessage("Welcome to BeHere. Tap the circle to attach...");
    }    
  }
  
  this.windowChanged=function(){
    windowChanged();
  }
  
  this.mouseCheck=function(){
    if(aButton.isOver(mouseX, mouseY)){
      //do something
    }    
  };
  
  this.mouseClicked=function(){
    if(aButton.isOver(mouseX, mouseY)){
      // alert("join ring");
      attachMe();
    }
  };
  
  this.run=function(){
    backgroundFill();
    var frontDevs=[];
    rps.forEach(function(rp,i){
      rp.update();
      if(!rp.front){
        rp.show();
        rp.showImage();
      } else {
        frontDevs.push(rp);
      }
      rp.rotateBy(PI/200);
    });
    frontDevs.forEach(function(rp,i){
    if(rp.front){
      rp.show();
      rp.showImage();
    } 
    });  
    blobRing.run();
    aButton.show();
    poc.show();    
  }

//****************************************
  
  function RectPersp(x,y,z,a,w,h, sx, ex){
    var viewerX=width/2;
    var viewerY=0;
    var zVec=createVector(0,z);
    var lVec=createVector(-w/2,z);
    var rVec=createVector(w/2,z);
    lVec.rotate(a);
    rVec.rotate(a);
    var lVecAbs, rVecAbs;
    lVecAbs=p5.Vector.add(centrePos, lVec);
    rVecAbs=p5.Vector.add(centrePos, rVec);
    // console.log(sx+" "+ex);
    var myBlobs=[];
    
    var lScale, rScale;
    var lX, rX;
    var lAng, rAng;
  
    this.front=false;
    
    
    this.rotateBy=function(ang){
      a+=ang;
      // zVec.rotate(ang);
      lVec.rotate(ang);
      rVec.rotate(ang);
      lVecAbs=p5.Vector.add(centrePos, lVec);
      rVecAbs=p5.Vector.add(centrePos, rVec);
    }
    
    this.update=function(){
      var lDistVec=p5.Vector.sub(lVecAbs,viewerPos);
      var rDistVec=p5.Vector.sub(rVecAbs,viewerPos);
      var lDist=lDistVec.mag();
      var rDist=rDistVec.mag();
      lAng=lDistVec.heading()+PI/2;
      rAng=rDistVec.heading()+PI/2;
      var lVpDist=viewPlane/cos(lAng);
      var rVpDist=viewPlane/cos(rAng);
      lScale=lVpDist/lDist;
      rScale=rVpDist/rDist;
      lX=tan(lAng)*viewPlane;
      rX=tan(rAng)*viewPlane;
      if(lAng<rAng){
        this.front=true;
      } else {
        this.front=false;
      }
    }

    
    this.showProjection2=function(){
      push();
      translate(centrePos.x, centrePos.y);
      stroke(255,0,0);
      ellipse(lVec.x, lVec.y,5,5);
      ellipse(rVec.x, rVec.y,5,5);
      pop();
      
      push();
      translate(viewerPos.x, viewerPos.y-viewPlane);
      stroke(255,0,255);
      ellipse(lX,0,5,5);
      ellipse(rX,0,5,5);
      pop();
    }
    
    this.showProjectionVec=function(){
      push();
      translate(viewerPos.x, viewerPos.y);
      stroke(0,255,0);
      ellipse(0,0,5,5);
      translate(0,-viewPlane);
      line(-100,0,100,0);
      translate(0,viewPlane-(viewerPos.y-centrePos.y));
      ellipse(0,0,10,10);
      pop();
      push();
      //translate(viewerPos.x, viewerPos.y);
      stroke(128,100);
      line(viewerPos.x, viewerPos.y ,lVecAbs.x, lVecAbs.y);
      line(viewerPos.x, viewerPos.y ,rVecAbs.x, rVecAbs.y);
      pop();
    }
    
    this.show=function(){
      push();
      translate(viewCentreX, viewCentreY);
      stroke(128,100);
      line(lX,-h/2,lX,h/2);
      line(rX,-h/2,rX,h/2);
      if(lAng<rAng){
        strokeWeight(3);
        stroke(200,0,150);
        fill(200,0,150,100);
      } else {
        stroke(200,0,150,150);
        fill(0,0,150,100);
      }
      beginShape();
      vertex(lX,-h/2*lScale);
      vertex(rX,-h/2*rScale);
      vertex(rX,h/2*rScale);
      vertex(lX,h/2*lScale);
      endShape(CLOSE);
      // line(lX,-h/2*lScale,lX,h/2*lScale);
      // line(rX,-h/2*rScale,rX,h/2*rScale);
      pop();
    }
    
    this.showImage=function(){
      var margin=5;
      push();
      // stroke(200,5,120);
      noStroke();
      if(lAng<rAng){
        // stroke(0,0,255);
        fill(250,220);
      } else {
        // stroke(128,100);
        fill(250,50);
      }
  
      translate(viewCentreX, viewCentreY);
      var blobs=blobRing.getBlobs(sx, ex);
      // console.log(blobs.length);
      if(blobs.length>0){
        blobs.forEach(function(b){
          if(b.x-sx>margin && b.x-sx<screenX-margin){
            myBlobs.push(b);
            if(myBlobs.length>15){
              myBlobs.shift();
            }
          }
        });
      } else {
        myBlobs.shift();
      }
      myBlobs.forEach(function(mb,i){
        var effX=map(mb.x-sx,0,screenX,lX,rX);
        var effScY=map(mb.x-sx,0,screenX,lScale,rScale);
        var effScX=(rX-lX)/screenX;
        var effY=map(mb.y,0,screenY,-h/2*effScY,h/2*effScY);
        ellipse(effX,effY,(i+2)/2*effScX,(i+2)/2*effScY);
      });
      pop();
    }
  }
  
  function BlobRunner(numScreens, numBlobs){
    var screenX=100;
    var screenY=60;
    var ringLength=screenX*numScreens;
    var blobs=[];
    for(var i=0; i<numBlobs; i++){
      blobs[i]=new Blob(random(ringLength), random(screenY));
    }
    
    this.run=function(){
      var dispScale=(width*0.7)/ringLength;
      push();
      // translate(width/2,0);
      // scale(dispScale);
      // translate(-width/2-width/8,0);
      // fill(255,180);
      // stroke(0);
      // rect(0,100,ringLength,screenY);
      // console.log(dispScale);
      blobs.forEach(function(b){
        b.run();
        // b.show(0,100, 0.6);
      });
      pop();
    }
    
    this.getBlobs=function(sx,ex){
      matchBlobs=[];
      blobs.forEach(function(b){
        pos=b.getPos();
        if(pos.x>=sx && pos.x<ex){
          matchBlobs.push(pos);
        }
      });
      return matchBlobs;
    }
    
    function Blob(x,y){
      var pos=createVector(x,y);
      var vel=createVector(0,0);
      var acc;
      var prevail=createVector(3,0);
      
      this.run=function(){
        acc=p5.Vector.random2D();
        // acc.mult(1);
        vel.add(acc);
        vel.add(prevail);
        vel.limit(5);
        pos.add(vel);
        this.edges();
      }
      
      this.getPos=function(){
        return {x:pos.x, y:pos.y};
      }
      
      this.edges=function(){
        var margin=5;
        if(pos.x<0) pos.x=ringLength;
        if(pos.x>ringLength) pos.x=0;
        if(pos.y>screenY-margin){ 
          vel.y*=-1;
          pos.y=screenY-margin;
        }
        if(pos.y<margin){
          vel.y*=-1;
          pos.y=margin;
        }
      }
      
      this.show=function(offX, offY){
        // stroke(0,200,200);
        // noFill();
        noStroke();
        fill(0);
        ellipse(pos.x+offX, pos.y+offY,4,4);
      }
    }
  
  }
  
  
  function PrintOnCircle(x,y,r,mess){
    var messageChars=mess.split('');
    var mLen=messageChars.length;
    var rad=r;
    var radiansPerChar=TWO_PI/mLen;
    var pixPerChar=radiansPerChar*rad;
    textSize(pixPerChar*2.5);
    var totalLen=textWidth(mess);
    var a=0;
    var aInc=PI/200;
    var reveal=0;
    var hide=0;
    var startL=0;
    var endL=startL;//messageChars.length-1;
    
    this.newMessage=function(mess){
      messageChars=mess.split('');
      mLen=messageChars.length;
      radiansPerChar=TWO_PI/mLen;
      pixPerChar=radiansPerChar*rad;
      textSize(pixPerChar*2.5);
      totalLen=textWidth(mess);
      a=0;
      startL=0;
      endL=startL;    
    }
    
    this.resize=function(nx,ny,nr){
      x=nx;
      y=ny;
      rad=nr;
      pixPerChar=radiansPerChar*rad;
      textSize(pixPerChar*2.5);
      totalLen=textWidth(mess);
    }
    
    this.show=function(){
      if(true){
        //console.log(frameCount+" "+startL+" "+endL+" "+mLen);
        if(endL>=mLen-1){
          //console.log("inc start");
          if(true){
            if(true){
              startL+=1;
              // endL-=2;
            }
            if(startL>=endL){//messageChars.length-1){
              startL=0;
              endL=0;
            }
          }
          a+=aInc*4;
        }else{
          if(frameCount%3===0){
            endL+=1;
          }
          a-=aInc*2;
        }
      }
      translate(x,y);
      accText="";
      //accLen=0;
      //textAlign(CENTER);
      for(var i=startL; i<=endL; i++){
      //messageChars.forEach(function(c,i){
        var c=messageChars[i];
        push();
        // translate(x,y);
        tw=textWidth(c)/2;
        tr=tw/rad;
        // stroke(255);
        // noFill();
        // //rect(-tw/2,-rad,tw,tw*-1.5);
        // noStroke();
        stroke(255);
        strokeWeight(3);
        fill(200,50,150);
        rotate(textWidth(accText)*0.85/rad+a);
        translate(0,-rad);
        rotate(tr);
        text(c,0,0);
        // rotate(tr);
        pop();
        accText+=c;
      }
      // });
      // console.log(a);
    }
  }  
  
    
    
  function AttachButton(x,y,r){
    var hovered=false;
    var rMult=1;
    var initRad=5;
    var innerRad=initRad;
    
    this.resize=function(nx, ny, nr){
      x=nx;
      y=ny;
      r=nr;
    }
    
    this.isOver=function(mx,my){
      hovered=dist(x,y,mx, my)<=r;
      return hovered;
    }
    
    this.show=function(){
      noStroke();
      if(hovered){
        fill(255,100,200);
        rMult=1.5;
      } else {
        fill(200,200,255);
        rMult=1;
      }
      ellipse(x,y,r*2*rMult,r*2*rMult);
      noFill();
      stroke(255,100,200);
      strokeWeight(5);
      ellipse(x,y,innerRad*2*rMult, innerRad*2*rMult);
      innerRad+=2;
      if(innerRad>r) innerRad=initRad;
    };
  }
  
  function backgroundFill(){
    var c1=color(190,190,200);
    var c2=color(40,40,50);
    var inter;
    for(var i=0; i<height; i++){
      inter=map(i,0,height,0,1);
      var col=lerpColor(c1,c2,inter);
      stroke(col);
      line(0,i,width,i);
    }
  }  

}
