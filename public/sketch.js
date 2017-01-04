


//html/display vars
var p5div,p5canvas;
var metaDiv;
var idBar;
var buttonBar;
var geometry;
var offersDiv;
var button, attachButton, detachButton, permitButton;
var statusMessage, position, idnum;
var offersList; //HTML offers
var hideMeta=false;
var canvasFull=false;
var canSmallWidth=400;
var canSmallHeight=50;
var canFullWidth=400;
var canFullHeight=200;
var winWidth;
var winHeight;


//Core vars
var logger; //object to log to console of file
var deviceData; // store current contect data
var offers=[]; //actual offers
var dataRefresh; //timer for updating the display
var clicks=[]; //stores recent mouse click echoes
var myWidth=400;
var devHeight=200;
var myStartX=null;
var myEndX=null;
var myBlobs=new MyBlobs();
var statusBar; //stores the visual cue to actions
var socket;
var id;


//noisefield vars - camn these be held elsewhere?
var noisePerWorldPixel=0.005;
var noiseSegsX=20;
var noiseField;

//geometry vars
var xInc=10;

//theme vars
var themeRunner;

//need some sort of subfunction to setup some of these

function setup() {
  //get display capabilities
  // winWidth=windowWidth;
  // winHeight=winHeight;
  // canFullWidth=winWidth;
  // canSmallWidth=winWidth;
  // canFullHeight=winHeight;
  //setup html/display sections
  setupCanvas();
  setupMeta();
  setupButtons();
  noiseField=new NoiseField();
  statusBar=new StatusBar();
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
  p5canvas=createCanvas(canSmallWidth, canSmallHeight);
  p5canvas.parent(p5div);
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
  attachButton = select('#attach');
  attachButton.hide();
  detachButton = select('#detach');
  detachButton.hide();
  permitButton = select('#permit');
  permitButton.hide();
  statusMessage = select('#status');
  button.mouseClicked(joinMe);
  attachButton.mouseClicked(attachMe);
  detachButton.mouseClicked(detachFromRing);
  permitButton.mouseClicked(permitAttacher);
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
  background(80);
  var showing=false;
  if(deviceData.status=="attached"){
    //noiseField.show();
    //noiseField.update();
    var blobPos=myBlobs.getPos();
    if(themeRunner) themeRunner.run(blobPos);
    showing=true;
  }
  runClicks();
  myBlobs.run(showing);
  statusBar.show();
  statusBar.run();
  stroke(0);
  fill(255);
  text(parseInt(frameRate(),0),10,height-10);
  //send a heartbeat echo every 0.5-1 frame
  echoHeartBeat();
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


function mouseClicked(){
  //click also triggers a touch. why?
  logger.log("f mouseClicked","clicked");

  if(mouseX>=0 &&
    mouseX<=width &&
    mouseY>=0 &&
    mouseY<=height){
      newClick(mouseX+myStartX, mouseY);
  }
}

function touchEnded(){ //temp disabled as activates on click
  logger.log("f touchEnded","touched");
  if(touchX>=0 &&
    touchX<=width &&
    touchY>=0 &&
    touchY<=height){
      newClick(touchX+myStartX, touchY);
  }
  // return false;
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
  themeRunner.switchTheme(data.index);
}

function notifyAttached(){
  statusBar.trigger('attached',5);
}

function handleBlobData(data){
  console.log("Incoming blob data "+data.blobs.length);
  processBlobData(data.blobs);
}

function processBlobData(blobs){
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
  });
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
  statusBar.trigger("offer");
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
  statusBar.trigger("accept");
}

function attachedToRing(data){
  console.log("Successfully attached to ring: "+data.ring);
  deviceData.status="attached";
  refreshHTMLStatus();
  refreshHTMLGeometry();
  statusBar.trigger("attach");
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
  statusBar.trigger("detach");
  deviceData.status="joined";
  refreshHTMLStatus();
  refreshHTMLGeometry();
  console.log("Been detached");
}

function permitAttacher(){
  console.log("Permit Attacher");
  socket.emit('permit',{id:id});
  statusBar.trigger("grant");
}

function setID(data){
  id=data.id;
  deviceData.id=id;
  refreshHTMLStatus();
  console.log("My ID="+id);
}

function requestForPermit(){
  console.log("received request for attach permit from ring");
  statusBar.trigger("permit");
}

//early implementation and seems to mix up the mvc
function joinMe(){
  if(deviceData.status=="connected"){
    deviceData.status="joined";
    refreshHTMLStatus();
    socket.emit('join',{id: id, width:myWidth});
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
  statusBar.trigger("request");
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
  statusBar.trigger("blob");
  socket.emit("newBlob",{device:id, x:x, y:y});
}

/*****************************************
  Click object constructor
  ******************************************/

function Click(x,y){
  var r=5;
  var rInc=1;
  var alpha=255;
  var ttl=60;

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
    alpha=map(ttl,60,0,150,20);
    return ttl>0;
  };
}

/*****************************************
  MyBlobs and integral Blob objects
  ******************************************/

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
    this.ttl=data.ttl;
    this.x=data.x;
    this.y=data.y;
    this.pos=createVector(this.x,this.y);
    this.vel=createVector(1,0);
    this.prevailing=createVector(1,0);


    this.show=function(){
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

    this.update=function(){
      this.pos=createVector(this.x,this.y);
      var acc=p5.Vector.fromAngle(random(-PI, PI));
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
}

/*****************************************
  status bar object constructor
  ******************************************/

function StatusBar(){
  this.flashes=0;
  this.x=0;
  this.y=0;
  this.w=width;
  this.h=height;
  this.thick=50;
  this.thickStep=this.thick/5;
  var ttlMax=60;
  this.ttl=0;
  var r=20;
  var g=225;
  var b=100;
  var alpha=255;
  var statusColors={
    request: {r: 20, g:80, b:255 },
    permit: {r: 255, g:20, b:150 },
    grant: {r: 125, g:20, b:255 },
    offer: {r: 255, g:130, b:0 },
    accept: {r: 255, g:230, b:0 },
    accepted: {r: 0, g:255, b:50 },
    attach: {r: 0, g:180, b:0 },
    detach: {r: 255, g:0, b:0 },
    attached: {r: 0, g:180, b:0 },
    blob: {r: 200, g:80, b:20 },
    none: {r: 0, g:0, b:0 }
  };

  this.setSize=function(w,h){
    this.w=w;
    this.h=h;
  };

  this.run=function(){
    if(this.ttl>0){
      this.ttl--;
    } else {
      if(this.flashes>0){
        this.flashes--;
        this.ttl=ttlMax;
      }
    }
  };

  this.trigger=function(trigKey, count){
    this.flashes=count||0;
    this.ttl=ttlMax;
    if(!statusColors[trigKey]){
      trigKey="none";
    }
    r=statusColors[trigKey].r;
    g=statusColors[trigKey].g;
    b=statusColors[trigKey].b;
  };

  this.show=function(){
    if(this.ttl>0){
      for(var i=0; i<5; i++){
        alpha=map(this.ttl,ttlMax,0,(5-i)*50,50);
        noFill();
        stroke(r,g,b,alpha);
        strokeWeight(this.thickStep);
        rect(this.x+this.thickStep*(i+0.5),this.y+this.thickStep*(i+0.5),this.w-this.thickStep*(i+0.5)*2, this.h-this.thickStep*(i+0.5)*2);
        strokeWeight(1);
      }
    }
  };
}

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
    position: -1,
    myWidth: myWidth,
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
      statusMessage.html("Status: not connected   ID:"+deviceData.id);
      button.hide();
      attachButton.hide();
      detachButton.hide();
      permitButton.hide();
      //p5canvas.hide();
      changeCanvas(false);
    } else if(deviceData.status=="connected"){
      statusMessage.html("Status: connected   ID:"+deviceData.id);
      button.show();
      button.html('Join');
      connectionStatus=0;
      attachButton.hide();
      detachButton.hide();
      permitButton.hide();
      //p5canvas.hide();
      changeCanvas(false);
    } else if(deviceData.status=="joined"){
      statusMessage.html("Status: joined to lobby   ID:"+deviceData.id);
      button.show();
      button.html('un-Join');
      connectionStatus=1;
      attachButton.show();
      detachButton.hide();
      permitButton.hide();
      //p5canvas.hide();
      changeCanvas(false);
    } else if(deviceData.status=="attached"){
      statusMessage.html("Status: attached to ring   ID:"+deviceData.id);
      button.hide();
      attachButton.hide();
      detachButton.show();
      permitButton.show();
      //p5canvas.show();
      changeCanvas(true);
    } else {
      statusMessage.html("Status: I have no idea   ID:"+deviceData.id);
      button.hide();
      attachButton.hide();
      detachButton.hide();
      permitButton.hide();
      //p5canvas.hide();
      changeCanvas(false);
    }
    // statusMessage.html=stat;
  }

  function refreshHTMLGeometry(){
    var tempHTML="pos: "+deviceData.geometry.position+ " startX: "+deviceData.geometry.startX+" endX: "+deviceData.geometry.endX+" width: "+deviceData.geometry.myWidth;
    geometry.html(tempHTML);
  }

function renderOffers(){
  if(deviceData.offersChanged){
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
      var offerString="Offer to attach between "+offer.prev+" and "+offer.next+" expires in:"+(offer.expires-Date.now());
      var li=createElement('li');
      li.parent(offersList);
      var el=createP(offerString);
      var acceptOfferButton=createButton("accept offer");
      li.child(el);
      li.child(acceptOfferButton);
      acceptOfferButton.mouseClicked(handleAcceptOffer);
      acceptOfferButton.attribute("data-offer",offer.id);
    });
  } else {
    //do not refresh, nothing has changed
  }
}


