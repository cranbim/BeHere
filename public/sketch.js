


//html/display vars
var p5div,p5canvas;
var soundOn=false;
var pD;
var lastTouch=Date.now();


//Core vars
var logger; //object to log to console of file
var deviceData; // store current contect data
var offers=[]; //actual offers
// var dataRefresh; //timer for updating the display
var clicks=[]; //stores recent mouse click echoes
var myBlobs;
var allBlobs;
var statusBar; //stores the visual cue to actions
var socket;
var id;

var myWidth=400;
var devWidth;
var devHeight=200;
var myStartX=null;
var myEndX=null;
var marginLeft=0;//50
var marginRight=0;
var dispStartX=0;
var dispEndX=0;
var ringLength=10;
var ringDevs=1;
var globalParams=[];
var distances;
var whenStarted;
var subtleMeta;

//noisefield vars - camn these be held elsewhere?
var noisePerWorldPixel=0.005;
var noiseSegsX=20;
var noiseField;

//geometry vars
var xInc=10;

//theme vars
var themeRunner;

//Parameter variable
var paramPos;
var absParamPos;

//need some sort of subfunction to setup some of these

function setup() {
  setupCanvas();
  setupMeta();
  setupButtons();
  myBlobs=new MyBlobs();
  allBlobs=new AllBlobs();
  noiseField=new NoiseField();
  statusBar=new StatusBar(devWidth,devHeight);
  logger=new Logger();
  deviceData=new DeviceData();
  subtleMeta=new SubtleMeta(devWidth, devHeight);
  themeRunner=new ThemeRunner(canFullWidth, canFullHeight);
  //initialise socket
  socket=io.connect('/');
  socket.on('connect', connected);
  // dataRefresh=setInterval(dataRefreshPoll, 1000);
  //initial display
  refreshHTMLStatus();
  refreshHTMLGeometry();
  frameRate(30);
}

function setupCanvas(){
  devWidth=windowWidth;
  devHeight=windowHeight;
  myWidth=devWidth+marginLeft+marginRight;
  canFullWidth=devWidth;
  canSmallWidth=devWidth;
  canFullHeight=devHeight;
  p5div=select('#p5');
  //switch off retina capability to improve performance?
  pixelDensity(1);
  pD=pixelDensity();
  p5canvas=createCanvas(canSmallWidth, canSmallHeight);
  p5canvas.parent(p5div);
  isFullScreen = fullscreen();
}

function reloadPage(){
  location.reload();
}

function draw() {
  var backgroundRendered=false;
  if(deviceData.status=="attached"){
    backgroundRendered=true;
    var blobPos=myBlobs.getPos();
    runThemeAndBlobs(blobPos);
  }
  if(!backgroundRendered){
    background(40);
  }
  processParams();
  mapParamToRing();
  runClicks();
  statusBar.show();
  //Helper, debug stuff on the display
  drawMeta();
  if(deviceData.status=="attached"){
    subtleMeta.show(deviceData.geometry.position, deviceData.id);
  }
  echoHeartBeat();
}


function runThemeAndBlobs(blobPos){
  var showing=false;
  if(themeRunner) {
    if(!themeRunner.themeRendersBackground){
      background(40);
    }
    //backgroundRendered=true;
    themeRunner.setCurrentParams(absParamPos);
    if(themeRunner.run(myBlobs, ringLength, blobPos, soundOn)){
      console.log("Theme calling end");
      socket.emit('themeKiller',{id: id});
    }
    showing=true;
    if(themeRunner.themeControlsBlobs()){
      myBlobs.runOnly(showing);
    } else {
      myBlobs.runPlusMove(showing);
    }
  }
}


function echoHeartBeat(){
  //send a heartbeat echo every 0.5-1 frame
  if(frameCount%30===0){ //assume slower framerate
    socket.emit('echo',{device: id, beat: deviceData.currentBeat});
  }
}

function connected(){
  logger.log("f connected()", "Connected ("+socket.id+")");
  deviceData.status="connected";
  refreshHTMLStatus();
  refreshHTMLGeometry();
  socket.on('id',setID);
  socket.on('joinApproved',joinApproved);
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
  socket.on('soundControl',soundControl);
  socket.on('showMeta',showMeta);
  socket.on('serverThemes',loadServerThemes);
  socket.on('issuePermit',issuePermit);
}

function issuePermit(){
  permitAttacher();
}

function setID(data){
  if(whenStarted){
    reloadPage();
  }
  whenStarted=Date.now();
  id=data.id;
  deviceData.id=id;
  refreshHTMLStatus();
  console.log("My ID="+id);
}

function disconnected(){
  console.log("Disconnected from server ("+socket.id+")");
  deviceData.status="nothing";
  refreshHTMLStatus();
  refreshHTMLGeometry();
  // window.location.href = "./disconnected.html";
}

function beat(data){
  console.log(data.beat);
  deviceData.currentBeat=data.beat;
  themeRunner.checkThemes();
  dataRefreshPoll();
  whenLastTouched();
}

function whenLastTouched(){
  if(Date.now()>lastTouch+10000){ //no touches for 10 seconds
    newClick(random(devWidth)+marginLeft+myStartX, random(devHeight));
    lastTouch=Date.now();  
  }
}

function updateRingPos(data){
  deviceData.geometry.position=data.pos;
  console.log("new ring pos "+deviceData.geometry.position);
  refreshHTMLGeometry();
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
  // noiseField.calcOffset(myStartX);
  // noiseField.syncOffset();
  //empty existing blobs
  myBlobs.empty();
  updateRingPos(data);
}

function soundControl(data){
  console.log(data);
  soundOn=data.soundOn;
}

function showMeta(data){
  console.log(data);
  hideMeta=!data.showMeta;
  changeHTMLMetaDisplay();
}

function switchTheme(data){
  console.log("switching theme");
  console.log(data);
  // themeRunner.switchThemeByIndex(data.index);
  themeRunner.switchThemeByName(data.name, data.params);
}


//should we just have a run function that takes care of this kind of thing
function dataRefreshPoll(){
  offers.forEach(function(o){
    console.log("Offer "+o.id+" expires in "+floor((o.expires-Date.now())/1000));
  });
  checkOffers();
  renderOffers();
}

function loadServerThemes(data){
  console.log("Server sending themes");
  themeRunner.loadServerThemes(data);
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





/*****************************************
  User Interactions
  ******************************************/

function touchEnded(){
  logger.log("f touchEnded","touched");
  if(Date.now()>lastTouch+100){
    if(touchX>=0 &&
      touchX<=width &&
      touchY>=0 &&
      touchY<=height){
        newClick(touchX+marginLeft+myStartX, touchY);
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
        newClick(mouseX+marginLeft+myStartX, mouseY);
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

/*****************************************
  Attachment protocol processing
  ******************************************/

function notifyAttached(data){
  if(data.next===id){
    console.log(">>>> next");
    statusBar.trigger('attachedNext',3,30);
  } else if(data.prev===id){
    console.log(">>>> prev");
    statusBar.trigger('attachedPrev',3,30);
  } else if(data.incoming===id){
    console.log(">>>> Me joining");
    statusBar.trigger('attachedMe',3,30);
  }
  // statusBar.trigger('attached',5,30);
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

function requestForPermit(){
  console.log("received request for attach permit from ring");
  statusBar.trigger("permit",0,30);
}

function joinApproved(data){
  if(data.approved){
    console.log("Join request approved");
    deviceData.status="joined";
    refreshHTMLStatus();
  } else {
    console.log("Join request rejected");
  }
}

function joinMe(){
  if(deviceData.status=="connected"){
    userNickName=select('#nickName').value();
    console.log("New user: "+userNickName);
    select('#myNickName').html(userNickName);
    socket.emit('join',{id: id, width:myWidth, height:devHeight, nickName:userNickName});
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


/*****************************************
  Parameter processing
  ******************************************/

function handleParameters(data){
  var params=data.params;
  //var paramString="Params ";
  params.params.forEach(function(p,i){
    if(globalParams[i]!==undefined){
      globalParams[i].last=globalParams[i].current;
      globalParams[i].current=p;
      globalParams[i].count=0;
      globalParams[i].lastTimeServer=globalParams[i].currentTimeServer;
      globalParams[i].currentTimeServer=params.time;
      globalParams[i].myTimeStamp=Date.now();
      globalParams[i].stepPerMS=(p-globalParams[i].last)/(params.time-globalParams[i].lastTimeServer);
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
    //paramString+=(i+":"+p+", ");
  });
  // console.log(globalParams);
  //console.log(paramString);
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
  var newVal=other+absParamPos%other;
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

/*****************************************
  Utilities
  ******************************************/



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

