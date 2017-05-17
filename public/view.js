//Plasma Ring 
//Dave Webb, Cranbim 2016, 2017
//view.js 
//html view 

//html view vars
var metaDiv;
var idBar;
var userNickName="unknown";
var buttonBar;
var geometry;
var offersDiv, welcomeDiv, joinerDiv;
var titleBar;
var button, joinButton, attachButton, detachButton, permitButton, fsButton;
var isFullScreen;
var statusMessage, position, idnum;
var offersList; //HTML offers
var hideMeta=true;
var canvasFull=false;
var canSmallWidth=400;
var canSmallHeight=50;
var canFullWidth=400;
var canFullHeight=200;
var buttonBarHeight=25;


function changeCanvas(full){
  if(full){
    resizeCanvas(canFullWidth, canFullHeight);//-buttonBarHeight);
  } else {
    resizeCanvas(canSmallWidth, canSmallHeight);
  }
  statusBar.setSize(p5canvas.width, p5canvas.height);
}

function setupButtons(){
  buttonBar=select('#buttons');
  button = select('#join');
  joinButton = select('#join2');
  fsButton= select('#fullScreen');
  attachButton = select('#attach');
  attachButton.hide();
  detachButton = select('#detach');
  detachButton.hide();
  permitButton = select('#permit');
  permitButton.hide();
  statusMessage = select('#status');
  button.mouseClicked(joinMe);
  joinButton.mouseClicked(joinMe);
  fsButton.mouseClicked(switchFullScreen);
  attachButton.mouseClicked(attachMe);
  detachButton.mouseClicked(detachFromRing);
  permitButton.mouseClicked(permitAttacher);
}



function windowResized(){
  devWidth=windowWidth;
  devHeight=windowHeight;
  myWidth=devWidth+marginLeft+marginRight;
  canFullWidth=devWidth;
  canSmallWidth=devWidth;
  canFullHeight=devHeight;
  themeRunner.setCanvasSize(canFullWidth, canFullHeight);
  changeCanvas(deviceData.fullDisplay);
  jcta.windowChanged();
}

function switchFullScreen(){
  isFullScreen = fullscreen();
  fullscreen(!isFullScreen);
  devWidth=windowWidth;
  devHeight=windowHeight;
  myWidth=devWidth+marginLeft+marginRight;
  canFullWidth=devWidth;
  canSmallWidth=devWidth;
  canFullHeight=devHeight;
  changeCanvas(deviceData.fullDisplay);
}

function setupMeta(){
  titleBar=select('#titleBar');
  idBar=select('#idbar');
  metaDiv=select('#meta');
  geometry = select('#geometry');
  position = select('#position');
  offersDiv = select('#attachoffers');
  offersDiv.hide();
  idnum = select('#idnum');
  changeHTMLMetaDisplay();
  welcomeDiv=select('#welcome');
  joinerDiv=select('#attachme');
}

function drawMeta(){
  var test=mapParamToOther(ringLength);

  if(!hideMeta){
    stroke(0);
    strokeWeight(2);
    fill(255);
    textSize(20);
    text(parseInt(frameRate(),0),10,height-10);
    //parameter tracking lines
    stroke(255,0,0,255);
    strokeWeight(2);
    // translate(paramPos,0);
    line(paramPos,0,paramPos,height);
    stroke(0,255,255);
    line(test,0,test,height);
  }
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
    displayWidth: devWidth,
    marginLeft: marginLeft,
    marginRight: marginRight,
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
    if(hideMeta){ 
      metaDiv.hide();
      idBar.hide();
    }
    else {
      metaDiv.show();
      idBar.show();
    }
  }


  function refreshHTMLStatus(){
    if(deviceData.status=="nothing"){
      titleBar.show();
      offersDiv.hide();
      welcomeDiv.hide();
      joinerDiv.hide();
      deviceData.fullDisplay=false;
      p5canvas.hide();
      statusMessage.html("Status: not connected   ID:"+deviceData.id);
      button.hide();
      fsButton.show();
      attachButton.hide();
      detachButton.hide();
      permitButton.hide();
      //p5canvas.hide();
      changeCanvas(deviceData.fullDisplay);
    } else if(deviceData.status=="connected"){
      titleBar.show();
      offersDiv.hide();
      welcomeDiv.show();
      joinerDiv.hide();
      deviceData.fullDisplay=false;
      p5canvas.hide();
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
      titleBar.show();
      offersDiv.show();
      welcomeDiv.hide();
      joinerDiv.show();
      deviceData.fullDisplay=true;
      p5canvas.show();
      statusMessage.html("Status: joined to lobby   ID:"+deviceData.id);
      button.show();
      button.html('un-Join');
      fsButton.hide();
      connectionStatus=1;
      attachButton.show();
      detachButton.hide();
      permitButton.hide();
      setTimeout(jcta.windowChanged,500);
      // jcta.windowChanged();
      //p5canvas.hide();
      changeCanvas(deviceData.fullDisplay);
    } else if(deviceData.status=="attached"){
      titleBar.hide();
      offersDiv.hide();
      welcomeDiv.hide();
      joinerDiv.hide();
      deviceData.fullDisplay=true;
      p5canvas.show();
      statusMessage.html("Status: attached to ring   ID:"+deviceData.id);
      button.hide();
      fsButton.hide();
      attachButton.hide();
      detachButton.show();
      permitButton.show();
      //p5canvas.show();
      changeCanvas(deviceData.fullDisplay);
    } else {
      titleBar.hide();
      offersDiv.show();
      welcomeDiv.hide();
      joinerDiv.hide();
      deviceData.fullDisplay=false;
      p5canvas.show();
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
    var tempHTML="|pos: "+deviceData.geometry.position+ "   |startX: "+deviceData.geometry.startX+"   |endX: "+deviceData.geometry.endX+"   |width: "+deviceData.geometry.myWidth+"   |height: "+deviceData.geometry.myHeight;
    geometry.html(tempHTML);
  }

function renderOffers(){
  if(true) {//temp to make sure the render is updated even with no change
  //if(deviceData.offersChanged){
    deviceData.offersChanged=false;
    if(!offersList){
      console.log("create offers list");
      offersList=createElement('ul');
      offersList.addClass('simple-list');
      offersList.parent(offersDiv);
    }
    var oListTemp=selectAll('li',offersList);
    oListTemp.forEach(function(li){
      li.remove();
    });
    offers.forEach(function (offer){
      var offerString="  Between"+offer.prev+" and "+offer.next+" exp:"+(offer.expires-Date.now());
      var li=createElement('li');
      li.parent(offersList);
      var el=createP(offerString);
      var acceptOfferButton=createButton("Accept Offer");
      li.child(acceptOfferButton);
      li.child(el);
      acceptOfferButton.mouseClicked(handleAcceptOffer);
      acceptOfferButton.attribute("data-offer",offer.id);
    });
  } else {
    //do not refresh, nothing has changed
  }
}



