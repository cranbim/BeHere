// Plasma Ring monitor
// Cranbim DJW 2017

var socket;
var id;
var beatnum;
var monitorid;
var whenStarted;
var deviceData; // store current contect data

//properly my own variables
var devices;
var ringLengthPixels=1;

//vars to mimick real device env
var myWidth=100;
var devWidth=myWidth;
var marginLeft=0;
var marginRight=0;
var devHeight=60;
var myStartX=0;
var hideMeta=false;
var globalParams=[];

//theme vars
var themeRunner;

//Parameter variable
var paramPos;
var absParamPos;

function setup(){
	createCanvas(windowWidth, windowHeight);
  socket=io.connect('/');
  socket.on('connect', connected);
  monitorid=select('#monitorid');
  beatnum=select('#beatnum');
  themeRunner=new ThemeRunner(400,180);
  devices=new VirtualDevices();
  deviceData=new DeviceData();
}

function connected(){
  console.log("Monitor connected");
  if(whenStarted){
    reloadPage();
  }
  whenStarted=Date.now();
  socket.on('heartbeat',beat);
  socket.on('id',setID);
  socket.on('serverThemes',loadServerThemes);
  socket.on('themeSwitch',switchTheme);
  socket.on('blobData', handleBlobData);
  socket.on('parameters',handleParameters);
  socket.on('consoleData',consoleData);
  socket.on('disconnect', function(){
		console.log("Disconnected from server ("+socket.id+")");
	});
}


function reloadPage(){
  location.reload();
}

function setID(data){
  console.log(data.id);
  id=data.id;
  socket.emit('monitor',{monitorid:id});
  monitorid.html(id);
}


function beat(data){
  beatnum.html(data.beat);
  console.log(data.beat);
  themeRunner.checkThemes();
}

function loadServerThemes(data){
  console.log("Server sending themes");
	themeRunner.loadServerThemes(data);
// cannot load themes as they depend on soem device global data
// eg. deviceData
// and others.
}

function switchTheme(data){
  console.log("switching theme");
  console.log(data);
  themeRunner.switchThemeByName(data.name, data.params);
}

function draw(){
	background(200);
	stroke(120, 20, 5);
	fill(120,20,5,100);
	ellipse(width/2, height/2, height, height);
	// runThemeAndBlobs([]);
  devices.run();
  devices.showVDevices();
}

function handleBlobData(data){
  console.log("Incoming blob data "+data.blobs.length);
  processBlobData(data);
}



function runThemeAndBlobs(blobPos){
//  var showing=false;
  if(themeRunner) {
    if(!themeRunner.themeRendersBackground){
      background(40);
    }
    //backgroundRendered=true;
//    themeRunner.setCurrentParams(absParamPos);
	
  	// themeRunner.run({},100,[],false);
  
    // if(themeRunner.run(myBlobs, ringLength, blobPos, soundOn)){
    //   console.log("Theme calling end");
    //   socket.emit('themeKiller',{id: id});
    // }
    // showing=true;
    // if(themeRunner.themeControlsBlobs()){
    //   myBlobs.runOnly(showing);
    // } else {
    //   myBlobs.runPlusMove(showing);
    // }
  }
}

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

function consoleData(data){
  console.log("monitor received console data");
  console.log(data);
  devices.refreshDevices(data.ring.data);
}

function processBlobData(data){
  if(data.allBlobs){
    var blobs=data.blobs;
    devices.checkBlobs(blobs);
  }
}

/*************************
  Object for Device data
**************************/

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
}

/*************************************
  Object for Virtual Devices control
**************************************/

function VirtualDevices(){
  var devices=[];
  var dyingDevices=[];
  var spin=0;
  var spinInc=PI/400;
  var eases=new Eases();

  this.run=function(){
    eases.run();
    // console.log("Eased ring length "+eases.ringLengthPixels);
    // console.log("Ring length pixels "+ ringLengthPixels);
  };

  this.refreshDevices=function(devList){
    console.log("devs "+devices.length+" "+devList.length);
    for(var i=devices.length-1; i>=0; i--){
      var matched=false;
      if(devList){
        if(devList.length>0){
          for(var j=devList.length-1; j>=0; j--){
            if(devList[j].connection==devices[i].id){
              // console.log("match");
              matched=true;
              devices[i].startX=devList[j].geometry.startX;
              devices[i].endX=devList[j].geometry.endX;
              devList.splice(j,1);
            } else {
              // console.log("no Match");
            }
          }
          if(!matched){
            if(devices[i].ease.easeDirIn){ //device is fully in
              // console.log("ease out dev "+devices[i].id);
              devices[i].ease.easeOut(); //start easing out
            } else { //device already easing out.
              if(devices[i].ease.done){
                // console.log("remove dev "+devices[i].id);
                ringLengthPixels-=devices[i].devWidth;
                eases.removeEase(devices[i].ease.id);
                devices.splice(i,1);
              }
            }            
          }
        } else {
          // console.log("zero devices "+devList.length);
          devices=[];
          eases.clear();
          ringLengthPixels=1;
        }
      } else {
        // console.log("devList is null");
      }
    }
    // console.log(devList);
    devList.forEach(function(dev){
      // console.log("adding device "+dev.connection);
      var ease=eases.createEase(dev.geometry.devWidth, dev.geometry.devHeight);
      devices.push(new VDevice(
        dev.connection,
        dev.geometry,
        ease));
      ringLengthPixels+=dev.geometry.devWidth;
    });
    // console.log("devices: "+devices.length+" "+ringLengthPixels);
  };

  this.showVDevices=function(){
    // console.log("show devs");
    var scl=(width/4)/(eases.ringLengthPixels/PI);
    var rot=0;
    var xOff=0;
    var yOff=0;
    var spinIncNow;
    devices.forEach(function(dev,i){
      dev.run(scl);
      if(devices.length===1){
        yOff=0;
        spinIncNow=0;
        spin=0;
      } else {
        yOff=height/3;
        spinIncNow=spinInc;
      }
      dev.show(scl, 0, yOff, rot, spin);
      rot+=(TWO_PI/eases.ringLengthPixels)*dev.devWidth;
    });
    spin+=spinIncNow;
  };

  this.checkBlobs=function(blobs){
    devices.forEach(function(dev,i){
      dev.blobs=[];
      blobs.forEach(function(blob){
        if(blob.x>=dev.startX && blob.x<dev.endX){
          dev.blobs.push(new SimpleBlob(blob.x-dev.startX, blob.y, blob.vel));
        }
      });
    });
  };

}

/*************************
  Object for Simple Blob
**************************/

function SimpleBlob(x,y,vel){
  this.x=x;
  this.y=y;
  this.vel=createVector(vel.x, vel.y);
  this.vel.mult(0.7);
  this.inside=true;
}

/*************************
  Object for Virtual Device
**************************/


function VDevice(id, geom, ease){
  var self=this;
  this.id=id;
  this.devWidth=geom.devWidth;
  this.devHeight=geom.devHeight;
  this.startX=geom.startX;
  this.endX=geom.endX;
  this.suspended=geom.suspended;
  this.blobs=[];
  this.ease=ease;
  this.ending=false;
  console.log("New Dev X: "+geom.devWidth+" "+this.devWidth+" "+this.startX);

  this.run=function(scl){
    scl=1;
    this.blobs.forEach(function(blob){
      blob.x+=blob.vel.x*scl;
      blob.y+=blob.vel.y*scl;
      if(blob.x>self.devWidth){
        blob.inside=false;
        blob.x=self.endX;
      }
      if(blob.y>self.devHeight){
        // blob.inside=false;
        blob.y=0;
      }
      if(blob.y<0) {
        // blob.inside=false;
        blob.y=self.devHeight;
      }
    });
  };

  this.show=function(scl, xOff, yOff, rot, spin){
    // fill(0,100,255);
    // ellipse(random(50), random(50),20,20);
    push();
    translate(width/2, height/2);
    rotate(rot+spin);
    translate(0,yOff);
    //translate(xOff+gap, yOff);
    // console.log((xOff+gap)+", "+yOff+", "+this.devWidth+", "+this.devHeight);
    //scale(scl*this.ease.now, scl);//scl
    scale(scl*this.ease.getEasedX(), scl*this.ease.getEasedY());
    translate(-this.devWidth/2, -this.devHeight/2);
    stroke(255);
    fill(200,0,100, 100);
    rect(0,0,this.devWidth, this.devHeight);
    // console.log("Blobs for "+this.id);
    // console.log(this.blobs);
    this.blobs.forEach(function(blob){
      stroke(255,0,0);
      if(blob.inside){
        fill(255);
      } else {
        noFill();
      }
      //fill(255,0,0,100);
      ellipse(blob.x, blob.y,15,15);
    });
    pop();
    //return xOff+this.devWidth*scl;
  };
}

/*************************
  Object for Ease manager
**************************/
function Eases(){
  this.easing=false;
  this.devEases=[];
  this.ringLengthPixels=0;
  var nextEaseID=0;

  this.createEase=function(devWidth, devHeight){
    var e=new Ease(nextEaseID++, devWidth, devHeight, 60);
    this.devEases.push(e);
    return e;
  };

  this.clear=function(){
    this.easing=false;
    this.devEases=[];
    this.ringLengthPixels=0;
  };

  this.removeEase=function(id){
    for(var i=this.devEases.length-1; i>=0; i--){
      if(this.devEases[i].id===id){
        this.devEases.splice(i, 1);
      }
    }
  };

  this.run=function(){
    if(this.devEases.length>0){
      this.easing=true;
      this.ringLengthPixels=0;
      for(var i=this.devEases.length-1; i>=0; i--){
        this.devEases[i].run();
        this.ringLengthPixels+=this.devEases[i].getEasedWidth();
      }
    }
    this.easing=this.devEases.length>0;
    if(this.easing){

    }
  };
}

/*************************
  Object for individual eases
**************************/


function Ease(id, devWidth, devHeight, dur){
  this.id=id;
  this.min=0;
  this.max=1;
  this.now=0;
  this.devWidth=devWidth;
  this.step=this.max/dur;
  this.done=false;
  this.easeDirIn=true;

  this.run=function(){
    if(!this.done){
    this.now+=this.step;
    // console.log("ease "+this.id+" "+this.now);
      if(this.now<0 || this.now>this.max){
        this.done=true;
      }
    }
  };

  this.easeOut=function(){
    this.easeDirIn=false;
    this.step*=-1;
    this.done=false;
  };


  // this.getEasedHeight=function(){
  //   var easedH;
  //   if(this.now>0.5) easedH=this.devWidth;
  //   else easedH=map(this.now, 0, 0.5, this.devHeight/20, this.devHeight);
  //   // console.log(eased);
  //   return easedH;
  // }
  this.getEasedX=function(){
    var easedX;
    if(this.now<0.5) easedX=0.05;
    else easedX=map(this.now, 0.5, 1, 0.05, 1);
    return easedX;
  };

  this.getEasedY=function(){
    var easedY;
    if(this.now>=0.5) easedY=1;
    else easedY=map(this.now, 0, 0.5, 0.05, 1);
    return easedY;
  };

  this.getEasedWidth=function(){
    return map(this.now, 0, 1, 0, this.devWidth);
  };
}
