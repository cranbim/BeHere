


//html/display vars
var p5div,p5canvas;
var metaDiv;
var idBar;
var buttonBar;
var geometry;
var offersDiv;
var button, attachButton, detachButton, permitButton, fsButton;
var isFullScreen;
var statusMessage, position, idnum;
var offersList; //HTML offers
var hideMeta=false;
var canvasFull=false;
var canSmallWidth=400;
var canSmallHeight=50;
var canFullWidth=400;
var canFullHeight=200;
var lastTouch=0;
var soundOn=false;
var marginLeft=50;
var marginRight=0;


//Core vars
var logger; //object to log to console of file
var deviceData; // store current contect data
var offers=[]; //actual offers
var dataRefresh; //timer for updating the display
var clicks=[]; //stores recent mouse click echoes
var myWidth=400;
var devWidth;
var devHeight=200;
var myStartX=null;
var myEndX=null;
var myBlobs=new MyBlobs();
var allBlobs=new AllBlobs();
var statusBar; //stores the visual cue to actions
var socket;
var id;
var ringLength=10;
var ringDevs=1;
var globalParams=[];
var distances;

//noisefield vars - camn these be held elsewhere?
var noisePerWorldPixel=0.005;
var noiseSegsX=20;
var noiseField;

//geometry vars
var xInc=10;

//theme vars
var themeRunner;

//Temporary variable
var paramPos;
var absParamPos;

//need some sort of subfunction to setup some of these

function setup() {
  //get display capabilities
  devWidth=windowWidth;
  devHeight=windowHeight;
  myWidth=devWidth;
  canFullWidth=devWidth;
  canSmallWidth=devWidth;
  canFullHeight=devHeight;
  //setup html/display sections
  setupCanvas();
  setupMeta();
  setupButtons();
  noiseField=new NoiseField();
  statusBar=new StatusBar(p5canvas.width, p5canvas.height);
  logger=new Logger();
  deviceData=new DeviceData();

  socket=io.connect('/');
  //socket=io.connect('http://192.168.0.5:4000');
  socket.on('connect', connected);
  dataRefresh=setInterval(dataRefreshPoll, 1000);
  //initial display
  refreshHTMLStatus();
  refreshHTMLGeometry();
  themeRunner=new ThemeRunner(canFullWidth, canFullHeight);
  frameRate(30);
}

function setupCanvas(){
  p5div=select('#p5');
  //switch off retina capability to improve performance?
  pixelDensity(1);
  p5canvas=createCanvas(canSmallWidth, canSmallHeight);
  p5canvas.parent(p5div);
  isFullScreen = fullscreen();
  // p5canvas.hide();
  // p5Hidden=true;
}

function changeCanvas(full){
  if(full){
    resizeCanvas(canFullWidth, canFullHeight);
  } else {
    resizeCanvas(canSmallWidth, canSmallHeight);
  }
  statusBar.setSize(p5canvas.width, p5canvas.height);
}

function setupButtons(){
  buttonBar=select('#buttons');
  button = select('#join');
  fsButton= select('#fullScreen');
  attachButton = select('#attach');
  attachButton.hide();
  detachButton = select('#detach');
  detachButton.hide();
  permitButton = select('#permit');
  permitButton.hide();
  statusMessage = select('#status');
  button.mouseClicked(joinMe);
  fsButton.mouseClicked(switchFullScreen);
  attachButton.mouseClicked(attachMe);
  detachButton.mouseClicked(detachFromRing);
  permitButton.mouseClicked(permitAttacher);
}

function windowResized(){
  devWidth=windowWidth;
  devHeight=windowHeight;
  myWidth=devWidth;
  canFullWidth=devWidth;
  canSmallWidth=devWidth;
  canFullHeight=devHeight;

  changeCanvas(deviceData.fullDisplay);
}

function switchFullScreen(){
  isFullScreen = fullscreen();
  fullscreen(!isFullScreen);

  devWidth=windowWidth;
  devHeight=windowHeight;
  myWidth=devWidth;
  canFullWidth=devWidth;
  canSmallWidth=devWidth;
  canFullHeight=devHeight;

  changeCanvas(deviceData.fullDisplay);
}

function setupMeta(){
  idBar=select('#idbar');
  metaDiv=select('#meta');
  geometry = select('#geometry');
  position = select('#position');
  offersDiv = select('#attach_offers');
  idnum = select('#idnum');
}

function draw() {
  background(40);
  //backGroundFromParams();
  processParams();
  mapParamToRing();
  var test=mapParamToOther(ringLength);
  //backgroundDistanceMeter();
  var showing=false;
  if(deviceData.status=="attached"){
    //noiseField.show();
    //noiseField.update();
    var blobPos=myBlobs.getPos();
    if(themeRunner) {
      themeRunner.setCurrentParams(absParamPos);
      if(themeRunner.run(blobPos, soundOn)){
        console.log("Theme calling end");
        socket.emit('themeKiller',{id: id});
      }
    }
    showing=true;
  }
  runClicks();
  myBlobs.run(showing);
  statusBar.show();
  // statusBar.run();

  //Helper, debug stuff on the display
  stroke(0);
  strokeWeight(2);
  fill(255);
  textSize(20);
  text(parseInt(frameRate(),0),10,height-10);
  //send a heartbeat echo every 0.5-1 frame
  echoHeartBeat();
  stroke(255,0,0,255);
  strokeWeight(2);
  // translate(paramPos,0);
  line(paramPos,0,paramPos,height);
  stroke(0,255,255);
  line(test,0,test,height);
}

function processParams(){
  if(globalParams[2]){
    var p2=globalParams[2];
    var ellapsedSinceRefresh=(Date.now()-p2.myTimeStamp);
    absParamPos=p2.last+ellapsedSinceRefresh*p2.stepPerMS;
  }
}

function mapParamToRing(){
  var newVal;
  newVal=ringLength+absParamPos%ringLength;
  if(newVal>myStartX && newVal<myEndX){
    paramPos=newVal-myStartX;
  } else {
    paramPos=-10;
  }
}

function mapParamToOther(other){
  var localPos;
  var newVal=other+absParamPos%other+20;
  if(newVal>myStartX && newVal<myEndX){
    localPos=newVal-myStartX;
  } else {
    localPos=-10;
  }
  return localPos;
}


function backgroundDistanceMeter(){
  var lerpedPos=0;
  if(distances){
    lerpedPos=lerp(distances.last, distances.current, distances.count/30);
    distances.count++;
    //console.log(distances.count, lerpedPos);
  }
  var r=100;
  var myX=myStartX+myWidth/2;
  var dist=abs(myX-lerpedPos);
  var relDist=dist/ringLength*2;
  var aspect=width/height;
  //console.log(myX, dist, relDist);
  r=map(relDist,0,1,width/2,10);
  // text(r,20,40);
  push();
  noStroke();
  fill(255,50);
  ellipse(width/2, height/2, r, r/aspect);
  pop();
}

function echoHeartBeat(){
  if(frameCount%30===0){ //assume slower framerate
    socket.emit('echo',{device: id, beat: deviceData.currentBeat});
  }
}

//this is OK
function connected(){
  logger.log("f connected()", "Connected ("+socket.id+")");
  deviceData.status="connected";
  refreshHTMLStatus();
  refreshHTMLGeometry();

  socket.on('id',setID);
  socket.on('disconnect', disconnected);
  socket.on('heartbeat',beat);
  socket.on('rfpermit',requestForPermit);
  socket.on('attached',attachedToRing);
  socket.on('offer',processOffer);
  socket.on('ringpos',updateRingPos);
  socket.on('startX', setStartX);
  socket.on('blobData',handleBlobData);
  socket.on('parameters',handleParameters);
  socket.on('notifyAttached',notifyAttached);
  socket.on('notifyDetached',notifyDetached);
  socket.on('themeSwitch',switchTheme);
}

function disconnected(){
  console.log("Disconnected from server ("+socket.id+")");
  deviceData.status="nothing";
  refreshHTMLStatus();
  refreshHTMLGeometry();
}

function touchEnded(){
  logger.log("f touchEnded","touched");
  if(Date.now()>lastTouch+100){
    if(touchX>=0 &&
      touchX<=width &&
      touchY>=0 &&
      touchY<=height){
        newClick(touchX+myStartX, touchY);
    }
    lastTouch=Date.now();
  }
  //return false;
}

function mouseClicked(){
  //click also triggers a touch. why?
  logger.log("f mouseClicked","clicked");
  if(Date.now()>lastTouch+100){
    if(mouseX>=0 &&
      mouseX<=width &&
      mouseY>=0 &&
      mouseY<=height){
        newClick(mouseX+myStartX, mouseY);
    }
    lastTouch=Date.now();
  }
}

function keyPressed(){
  if(key=='h' || key=='H'){
    hideMeta=!hideMeta;
  }
  changeHTMLMetaDisplay();
 }

//should we just have a run function that takes care of this kind of thing
function dataRefreshPoll(){
  offers.forEach(function(o){
    console.log("Offer "+o.id+" expires in "+floor((o.expires-Date.now())/1000));
  });
  checkOffers();
  renderOffers();
}

function switchTheme(data){
  console.log("switching theme");
  console.log(data);
  // themeRunner.switchThemeByIndex(data.index);
  themeRunner.switchThemeByName(data.name);
}

function notifyAttached(){
  statusBar.trigger('attached',5,30);
}

function handleBlobData(data){
  console.log("Incoming blob data "+data.blobs.length);
  processBlobData(data);
}

function processBlobData(data){
  var allBlobsSent=data.allBlobs;
  if(allBlobsSent){
    allBlobs.reset();
  }
  var blobs=data.blobs;
  ringLength=data.ringLength;
  numDevs=data.numDevs;
  //parametersChanged(data.params);
  // console.log("Ring data "+ringLength+" "+numDevs);
  blobs.forEach(function(blob){
    //check if blob is in our patch
    if(blob.x>=myStartX && blob.x<myEndX){
      //check if we know about this blob
      if(!myBlobs.exists(blob)){
        //if not create it
        myBlobs.addBlob(blob);
        console.log("Blob entered my patch "+blob.id+" x:"+blob.x+" S:"+myStartX+" E:"+myEndX);
      }
      //if we do then just run it
    }
    if(allBlobsSent){
      allBlobs.addBlob(blob);
    }
  });
  if(allBlobsSent){
    // allBlobs.writeAll();
    distanceChanged();
  }
}

function distanceChanged(){
  //console.log("Dist changed");
  if(!distances){
    distances={
      current: 0,
      last:0 ,
      count:0
    };
  } else {
    distances.last=distances.current;
    distances.current=allBlobs.allAvgX;
    distances.count=0;
  }
}

function handleParameters(data){
  var params=data.params;
  params.params.forEach(function(p,i){
    if(globalParams[i]!==undefined){
      globalParams[i].last=globalParams[i].current;
      globalParams[i].current=p;
      globalParams[i].count=0;
      globalParams[i].lastTimeServer=globalParams[i].currentTimeServer;
      globalParams[i].currentTimeServer=params.time;
      globalParams[i].myTimeStamp=Date.now();
      globalParams[i].stepPerMS=(p-globalParams[i].last)/(params.time-globalParams[i].lastTimeServer);
      // var p2=globalParams[2];
      // var paramStep=(p2.current-p2.last)/(p2.currentTimeServer-p2.lastTimeServer)*333;//333 is ms per frame at 30fps
      // var ellapsedSinceRefresh=(Date.now()-p2.myTimeStamp)/333;
      // globalParams[i].stepPerFrame=paramStep;
    }else{
      globalParams[i]={
        lastTimeServer: params.time,
        currentTimeServer: params.time,
        myTimeStamp: Date.now(),
        last: p,
        current: p,
        count:0,
        stepPerMS:0
      };
    }
  });
  // console.log(globalParams);
}

function setStartX(data){
  console.log("new StartX Pre: "+myStartX+" "+myEndX);
  if(data.sx!==null){
    myStartX=data.sx;
    myEndX=myStartX+myWidth;
  } else {
    myStartX=null;
    myEndX=null;
  }
  deviceData.geometry.startX=myStartX;
  deviceData.geometry.endX=myEndX;
  refreshHTMLGeometry();
  console.log("new StartX post: "+myStartX+" "+myEndX);
  noiseField.calcOffset(myStartX);
  noiseField.syncOffset();
  //empty existing blobs
  myBlobs.empty();
}

function updateRingPos(data){
  deviceData.geometry.position=data.pos;
  console.log("new ring pos "+deviceData.geometry.position);
  refreshHTMLGeometry();
}

function processOffer(data){
  var offerTemp={
    id: data.id,
    prev: data.prev,
    next: data.next,
    expires: data.expires
  };
  offers.push(offerTemp);
  //should really clean up and recreate this each time
  console.log("Offer "+data.id+" received, between: "+data.prev+","+data.next);
  statusBar.trigger("offer",0,30);
  deviceData.offersChanged=true;
}

function checkOffers(){
  for(var i=offers.length-1; i>=0; i--){
    if((offers[i].expires-Date.now())<10){
      offers.splice(i,1);
      deviceData.offersChanged=true;
    }
  }
}


function handleAcceptOffer(){
  console.log("Accept Offer");
  var offer;
  var buttonOfferID=parseInt(this.attribute("data-offer"),0);
  //find offer assocaited with the clicked button
  offers.forEach(function(o){
    if(o.id===buttonOfferID) {
      offer=o;
    } else {
      //nothing
    }
  });
  //process clicked offer
  console.log("Offer accepted "+offer.id);
  this.html("Accepted");
  socket.emit("offerAccepted",{offer:offer.id, device:id});
  statusBar.trigger("accept",0,30);
}

function attachedToRing(data){
  console.log("Successfully attached to ring: "+data.ring);
  deviceData.status="attached";
  refreshHTMLStatus();
  refreshHTMLGeometry();
  statusBar.trigger("attach",0,30);
  noiseField.setField(myWidth, myStartX, noiseSegsX, noisePerWorldPixel);
  attachedFrame=frameCount;
}

function detachFromRing(){
  console.log("Requested detach");
  socket.emit('detach',{id:id});
  processDetach();
}

function notifyDetached(){
  processDetach();
}

function processDetach(){
  statusBar.trigger("detach",0,30);
  deviceData.status="joined";
  refreshHTMLStatus();
  refreshHTMLGeometry();
  console.log("Been detached");
}

function permitAttacher(){
  console.log("Permit Attacher");
  socket.emit('permit',{id:id});
  statusBar.trigger("grant",0,30);
}

function setID(data){
  id=data.id;
  deviceData.id=id;
  refreshHTMLStatus();
  console.log("My ID="+id);
}

function requestForPermit(){
  console.log("received request for attach permit from ring");
  statusBar.trigger("permit",0,30);
}

//early implementation and seems to mix up the mvc
function joinMe(){
  if(deviceData.status=="connected"){
    deviceData.status="joined";
    refreshHTMLStatus();
    socket.emit('join',{id: id, width:myWidth, height:devHeight});
    console.log("request join to unattached");
  }else if(deviceData.status=="joined"){
    deviceData.status="connected";
    refreshHTMLStatus();
    socket.emit('unjoin',{id: id});
    console.log("request unjoin from unattached");
  }
}

function attachMe(){
  socket.emit('attach',{id: id});
  console.log("requested attachement to ring");
  statusBar.trigger("request",0,30);
}

function beat(data){
  console.log(data.beat);
  deviceData.currentBeat=data.beat;
}

/*****************************************
  Click response code
  ******************************************/

function runClicks(){
  for(var i=clicks.length-1; i>=0; i--){
    clicks[i].show();
    if(!clicks[i].update()) clicks.splice(i,1);
  }
}

function newClick(x,y){
  var c=new Click(x-myStartX,y);
  clicks.push(c);
  //statusBar.trigger("blob",0,10);
  socket.emit("newBlob",{device:id, x:x, y:y});
}

/*****************************************
  Click object constructor
  ******************************************/

function Click(x,y){
  var r=5;
  var rInc=3;
  var alpha=255;
  var ttl=30;

  this.show=function(){
    push();
    translate(x,y);
    stroke(0,150,230, alpha);
    strokeWeight(10);
    noFill();
    ellipse(0,0,r*2,r*2);
    strokeWeight(5);
    ellipse(0,0,r,r);
    pop();
  };

  this.update=function(){
    r+=rInc;
    ttl--;
    alpha=map(ttl,30,0,250,20);
    return ttl>0;
  };
}

/*****************************************
  MyBlobs and integral Blob objects
  ******************************************/
function AllBlobs(){
  var prev=500;
  var next=500;

  this.allBlobs=[];
  this.allCount=0;
  this.allTotalX=0;
  this.allTotalY=0;
  this.allAvgX=0;
  this.allAvgY=0;
  this.prevCount=0;
  this.prevTotalX=0;
  this.prevTotalY=0;
  this.prevAvgX=0;
  this.prevAvgY=0;

  this.reset=function(){
    this.allBlobs=[];
    this.allCount=0;
    this.allTotalX=0;
    this.allTotalY=0;
    this.allAvgX=0;
    this.allAvgY=0;
    this.prevCount=0;
    this.prevTotalX=0;
    this.prevTotalY=0;
    this.prevAvgX=0;
    this.prevAvgY=0;
  };

  this.addBlob=function(blob){
    this.allCount++;
    this.allTotalX+=blob.x;
    this.allAvgX=this.allTotalX/this.allCount;
    this.allTotalY+=blob.y;
    this.allAvgY=this.allTotalY/this.allCount;
    this.allBlobs.push({x:blob.x, y:blob.y});
    if(blob.x>(myStartX-prev) && blob.x<myStartX){
      this.prevCount++;
      this.prevTotalX+=blob.x;
      this.prevTotalY+=blob.y;
      this.prevAvgX=this.prevTotalX/this.prevCount;
      this.prevAvgY=this.prevTotalY/this.prevCount;
    }
  };

  this.writeAll=function(){
    console.log("AllBlobs "+this.allCount+" avX:"+this.allAvgX+" avY:"+this.allAvgY);
    console.log("All prev"+this.prevCount+" avX:"+this.prevAvgX+" avY:"+this.prevAvgY);
  };
}


function MyBlobs(){
  blobs=[];

  this.addBlob=function(data){
    var b=new Blob(data);
    blobs.push(b);
  };

  this.exists=function(data){
    return blobs.find(function(blob){
      return data.id===blob.id;
    });
  };

  this.run=function(showBlobs){
    for(var i=blobs.length-1; i>=0; i--){
      if(showBlobs) blobs[i].show();
      if(!blobs[i].update()){
        blobs.splice(i,1);
      }
    }
  };

  this.getPos=function(){
    bPos=[];
    blobs.forEach(function(b){
      bPos.push({
        x:b.pos.x-myStartX,
        y:b.pos.y
      });
    });
    return bPos;
  };

  this.empty=function(){
    blobs=[];
  };

  function Blob(data){
    this.id=data.id;
    this.bloboid=new Bloboid(this.id);
    this.ttl=data.ttl;
    this.x=data.x;
    this.y=data.y;
    this.pos=createVector(this.x,this.y);
    this.vel=createVector(1,0);
    this.prevailing=createVector(1,0);
    var rr=0; var rg=255; var rb=150;
    var er=255; var eg=0; var eb=0;
    var drag=0.90;
    var steer=2;
    var maxTTL=1000;



    this.oldshow=function(){
      push();
      translate(this.x-myStartX, this.y);
      stroke(255,0,150);
      if(this.ttl>100){
        fill(0,255,150);
      } else {
        fill(255,0,0);
      }
      ellipse(0,0,30,30);
      pop();
    };

    this.show=function(){
      this.bloboid.addPoint(this.x-myStartX, this.y);
      var ra=map(this.ttl, maxTTL, 100, 0, 255);
      var ga=255-ra;
      var ba=0;
      var flicker=false;
      if(this.ttl<200){
        flicker=true;
        ra=255;
        ga=0;
      }
      this.bloboid.run(ra,ga,rb, flicker, this.ttl);
    };

    this.update=function(){
      this.pos=createVector(this.x,this.y);
      var acc=p5.Vector.fromAngle(random(-TWO_PI, TWO_PI));
      acc.mult(steer);
      this.vel.mult(drag);
      this.vel.add(acc);
      this.vel.add(this.prevailing);
      this.vel.limit(10);
      this.pos.add(this.vel);
      this.x=this.pos.x;
      this.y=this.pos.y;
      // this.x+=xInc;
      this.ttl--;
      if(this.x>=myEndX || this.x<myStartX){
        console.log("blob "+this.id+" just exited");
        socket.emit('blobUpdate',{id:this.id, x:this.x, y:this.y, ttl:this.ttl});
      }
      if(this.y<0) this.y=height;
      if(this.y>height) this.y=0;
      if(this.ttl%30<1) socket.emit('blobUpdate',{id:this.id, x:this.x, y:this.y, ttl:this.ttl});
      return this.x>=myStartX && this.x<myEndX && this.ttl>0;
    };
  }

  function Bloboid(id){
    var x, y;
    var trail=[];
    var maxTrail=10;
    
    this.run=function(r1,g1,b1, flicker, ttl){
      //this.addPoint(x,y);
      this.showTrail(r1,g1,b1, flicker, ttl);
    };
    
    this.addPoint=function(x,y){
      if(trail.length>maxTrail){
        trail.splice(0,1);
      }
      trail.push({x:x, y:y});
    };
    
    this.showTrail=function(r1,g1,b1, flicker, ttl){
      push();
      for(var i=0; i<trail.length; i++){
        var r=trail.length-i;
        // r*=r;
        r=2*i;
        // noFill();
        fill(r1,g1,b1,map(i,0,trail.length, 10,255));
        stroke(r1,g1,b1,map(i,0,trail.length, 10,255));
        if(flicker){
          noFill();
          // if(i%2===0){
          //   noFill();
          // }
        }
        ellipse(trail[i].x, trail[i].y, r,r );
      }
      var x=trail[trail.length-1].x;
      var y=trail[trail.length-1].y;
      var relPos=floor((x+myStartX)/ringLength*100);
      // console.log(myStartX+" "+x+" "+ringLength+" "+relPos);
      //fill(255);
      textSize(14);
      stroke(0);
      strokeWeight(1);
      fill(200,200);
      text(id,x+15,y-15);
      text((relPos+"%"),x+15,y);
      text(ttl,x+15,y+15);
      pop();
    };
  }
}

/*****************************************
  status bar object constructor
  ******************************************/
function StatusBar(start, end){
  var w=10;
  var alphaS=50;
  var alphaE=200;
  var pos=start-10;
  // var inc=(end-start)/duration;
  var r=200;
  var g=0;
  var b=200;
  var sweepMult=12;
  var sweepThick=6;
  textSize(width*0.05);
  var tL;//=textWidth(message);
  var tLength=height*2;
  var tSpeed;//=tLength/duration;
  var tPos=height;
  var running=true;
  this.flashes=0;
  var duration=30;
  var message="none";
  var flashes=0;
  var tPosX=100;

  this.setValues=function(){
    inc=(end-start)/duration;
    //textSize(height*0.5);
    tLength=this.h;
    textSize(this.w*0.2);
    tL=textWidth(message);
    tPosX=this.w/2-tL/2;
    tSpeed=this.h/duration;
  };

  this.setValues();
  
  var statusColors={
    request: {r: 20, g:80, b:255, m:"REQUEST" },
    permit: {r: 255, g:20, b:150, m:"ALLOW?" },
    grant: {r: 125, g:20, b:255, m:"PERMIT" },
    offer: {r: 255, g:130, b:0, m:"OFFER" },
    accept: {r: 255, g:230, b:0, m:"ACCEPT" },
    accepted: {r: 0, g:255, b:50, m:"ACCEPTED" },
    attach: {r: 0, g:180, b:0, m:"ATTACHING" },
    detach: {r: 255, g:0, b:0, m:"DETACH" },
    attached: {r: 0, g:180, b:0, m:"ATTACH HERE" },
    blob: {r: 200, g:80, b:20, m:"BLOB" },
    none: {r: 0, g:0, b:0, m:"NOTHING" }
  };

  this.setSize=function(w,h){
    this.w=w;
    this.h=h;
    start=w;
    end=0;
  };
  
  this.show=function(){
    if(running){
      if(pos>end){
        for(var i=0; i<w; i++){
          var a=map(i,w,0,alphaS, alphaE);
          fill(r,g,b,a);
          noStroke();
          rectMode(CORNER);
          rect(pos+i*sweepMult,0,sweepThick,height);
          rect(width-pos-i*sweepMult,0,-sweepThick,height);
          var vPos=map(pos,start,end,height,0);
          rect(0, vPos+i*sweepMult, width,sweepThick);
          rect(0, height-vPos-i*sweepMult, width, -sweepThick);
         //rect(width/2, height/2, pos+i, pos+i, w+i);
  
        }
        var rad=map(pos,start,end,0,width/8);
        rectMode(CENTER);
        stroke(r,g,b,a);
        strokeWeight(sweepThick);
        noFill();
        for(var i=0; i<w; i++){
          var a=map(i,0,w,0, 255);
          stroke(r,g,b,a);
          var vPos=map(pos,0,width, 0, height);
          rect(width/2, height/2, pos+i*sweepThick, vPos+i*sweepThick, rad+i);
        }
        fill(r,g,b,150);
        //noStroke();
        stroke(0);
        strokeWeight(4);
        textSize(this.w*0.2);
        text(message,this.w/2-tL/2,tPos);
        pos+=inc;
        tPos-=tSpeed;
      } else{
        if(flashes>0){
          flashes--;
          this.reset();
        } else {
          running=false;
        }
      }
    }
  }
  
  this.trigger=function(trigKey, count, dur){
    flashes=count||0;
    // this.ttl=ttlMax;
    if(!statusColors[trigKey]){
      trigKey="none";
    }
    r=statusColors[trigKey].r;
    g=statusColors[trigKey].g;
    b=statusColors[trigKey].b;
    duration=dur;
    message=statusColors[trigKey].m;
    running=true;
    pos=start-10;
    tPos=this.h;
    this.setValues();
  };


  
  this.reset=function(){
    running=true;
    pos=start-10;
    tPos=width;
  }
}

/*****************************************
  Old status bar object constructor
  ******************************************/

// function NoStatusBar(){
//   this.flashes=0;
//   this.x=0;
//   this.y=0;
//   this.w=width;
//   this.h=height;
//   this.thick=50;
//   this.thickStep=this.thick/5;
//   var ttlMax=60;
//   this.ttl=0;
//   var r=20;
//   var g=225;
//   var b=100;
//   var alpha=255;
//   var statusColors={
//     request: {r: 20, g:80, b:255 },
//     permit: {r: 255, g:20, b:150 },
//     grant: {r: 125, g:20, b:255 },
//     offer: {r: 255, g:130, b:0 },
//     accept: {r: 255, g:230, b:0 },
//     accepted: {r: 0, g:255, b:50 },
//     attach: {r: 0, g:180, b:0 },
//     detach: {r: 255, g:0, b:0 },
//     attached: {r: 0, g:180, b:0 },
//     blob: {r: 200, g:80, b:20 },
//     none: {r: 0, g:0, b:0 }
//   };

//   this.setSize=function(w,h){
//     this.w=w;
//     this.h=h;
//   };

//   this.run=function(){
//     if(this.ttl>0){
//       this.ttl--;
//     } else {
//       if(this.flashes>0){
//         this.flashes--;
//         this.ttl=ttlMax;
//       }
//     }
//   };

//   this.trigger=function(trigKey, count){
//     this.flashes=count||0;
//     this.ttl=ttlMax;
//     if(!statusColors[trigKey]){
//       trigKey="none";
//     }
//     r=statusColors[trigKey].r;
//     g=statusColors[trigKey].g;
//     b=statusColors[trigKey].b;
//   };

//   this.show=function(){
//     if(this.ttl>0){
//       for(var i=0; i<5; i++){
//         alpha=map(this.ttl,ttlMax,0,(5-i)*50,50);
//         noFill();
//         stroke(r,g,b,alpha);
//         strokeWeight(this.thickStep);
//         rect(this.x+this.thickStep*(i+0.5),this.y+this.thickStep*(i+0.5),this.w-this.thickStep*(i+0.5)*2, this.h-this.thickStep*(i+0.5)*2);
//         strokeWeight(1);
//       }
//     }
//   };
// }

function Logger(){
  const CONSOLE=0;
  const LOGFILE=1;
  const BOTH=2;
  var logFile;
  var logMode=CONSOLE;

  this.log=function(func, message){
    if(logMode==CONSOLE || logMode==BOTH){
      var logString=Date.now()+"; "+func+"; "+message;
      console.log(logString);
    }
  };
}

//*********************************
// Object to store status data 
// used by HTML View
//*********************************

function DeviceData(){
  this.id="nothing";
  this.status="nothing";
  this.currentBeat=-1;
  this.geometry={
    fullDisplay: false,
    position: -1,
    myWidth: myWidth,
    myHeight: devHeight,
    startX: -1,
    endX: -1
  };
  this.offersChanged=false;

  // this.statusChanged=function(){
  //   //update relevant bits of html
  // };

  // this.geometryChanged=function(){

  // };
}

//*********************************
// HTML view update functions
//*********************************

  function changeHTMLMetaDisplay(){
    if(hideMeta) metaDiv.hide();
    else metaDiv.show();
  }


  function refreshHTMLStatus(){
    if(deviceData.status=="nothing"){
      deviceData.fullDisplay=false;
      statusMessage.html("Status: not connected   ID:"+deviceData.id);
      button.hide();
      fsButton.show();
      attachButton.hide();
      detachButton.hide();
      permitButton.hide();
      //p5canvas.hide();
      changeCanvas(deviceData.fullDisplay);
    } else if(deviceData.status=="connected"){
      deviceData.fullDisplay=false;
      statusMessage.html("Status: connected   ID:"+deviceData.id);
      button.show();
      button.html('Join');
      fsButton.show();
      connectionStatus=0;
      attachButton.hide();
      detachButton.hide();
      permitButton.hide();
      //p5canvas.hide();
      changeCanvas(deviceData.fullDisplay);
    } else if(deviceData.status=="joined"){
      deviceData.fullDisplay=false;
      statusMessage.html("Status: joined to lobby   ID:"+deviceData.id);
      button.show();
      button.html('un-Join');
      fsButton.hide();
      connectionStatus=1;
      attachButton.show();
      detachButton.hide();
      permitButton.hide();
      //p5canvas.hide();
      changeCanvas(deviceData.fullDisplay);
    } else if(deviceData.status=="attached"){
      deviceData.fullDisplay=true;
      statusMessage.html("Status: attached to ring   ID:"+deviceData.id);
      button.hide();
      fsButton.hide();
      attachButton.hide();
      detachButton.show();
      permitButton.show();
      //p5canvas.show();
      changeCanvas(deviceData.fullDisplay);
    } else {
      deviceData.fullDisplay=false;
      statusMessage.html("Status: I have no idea   ID:"+deviceData.id);
      button.hide();
      fsButton.hide();
      attachButton.hide();
      detachButton.hide();
      permitButton.hide();
      //p5canvas.hide();
      changeCanvas(deviceData.fullDisplay);
    }
    // statusMessage.html=stat;
  }

  function refreshHTMLGeometry(){
    var tempHTML="pos: "+deviceData.geometry.position+ " startX: "+deviceData.geometry.startX+" endX: "+deviceData.geometry.endX+" width: "+deviceData.geometry.myWidth+" height: "+deviceData.geometry.myHeight;
    geometry.html(tempHTML);
  }

function renderOffers(){
  if(true) {//temp to make sure the render is updated even with no change
  //if(deviceData.offersChanged){
    deviceData.offersChanged=false;
    if(!offersList){
      console.log("create offers list");
      offersList=createElement('ul');
      offersList.parent(offersDiv);
    }
    var oListTemp=selectAll('li',offersList);
    oListTemp.forEach(function(li){
      li.remove();
    });
    offers.forEach(function (offer){
      var offerString="Attach between"+offer.prev+" and "+offer.next+" exp:"+(offer.expires-Date.now());
      var li=createElement('li');
      li.parent(offersList);
      var el=createP(offerString);
      var acceptOfferButton=createButton("Accept!");
      li.child(el);
      li.child(acceptOfferButton);
      acceptOfferButton.mouseClicked(handleAcceptOffer);
      acceptOfferButton.attribute("data-offer",offer.id);
    });
  } else {
    //do not refresh, nothing has changed
  }
}


