var socket;
var id;
var beatnum;
var consoleid;
var lobbyDiv;
var buttonDiv;
var buttonResetThemes;
var buttonShowMeta;
var buttonRingCode;
var lobbyUL, themeUL, narraUL;
var ringDiv;
var themeDiv;
var narrDiv;
var ringUL=null;
var MetaDiv;
var metaULreq, metaULgrant, metaULoffer, metaBlobs;
var ringCodeSpan;
var narrativeChanging=true;
var narrativeLive;
var attachedDevices, lobbyDevices;


var state={
  soundOn: false,
  showMeta: false,
  narrative: null
};

function setup() {
  noCanvas();
  beatnum=select("#heartbeat");
  consoleid=select("#consoleid");
  ringCodeSpan=select("#ringCode");
  socket=io.connect('/');
  socket.on('connect', connected);
  socket.on('id',setID);
  socket.on('disconnect', function(){
    console.log("Disconnected from server ("+socket.id+")");
  });
  lobbyDiv=select('#lobbydevs');
  ringDiv=select('#ringdevs');
  metaDiv=select('#metadata');
  themeDiv=select('#themes');
  narraDiv=select('#narrative');
  buttonDiv=select('#button-bar');
  buttonResetThemes=select('#resetThemes');
  buttonResetThemes.mouseClicked(resetThemes);
  var buttonShowMeta=createButton('showMeta');
  var soundButton=createButton('Turn Sound On');
  var buttonRingCode=createButton('New Join Code');
  var buttonClearBlobs=createButton('Clear Blobs');
  buttonRingCode.parent(buttonDiv);
  buttonRingCode.mouseClicked(function(){
    socket.emit('newRingCode',{});
  });
  soundButton.parent(buttonDiv);
  soundButton.mouseClicked(function(){
    state.soundOn=!state.soundOn;
    if(state.soundOn) soundButton.html('Turn Sound Off');
    else soundButton.html('Turn Sound On');
    socket.emit('soundControl', {soundOn: state.soundOn});
  });
  buttonClearBlobs.parent(buttonDiv);
  buttonClearBlobs.mouseClicked(function(){
    socket.emit('consoleCommand',{command: 'clearBlobs'});
  });
  buttonShowMeta.parent(buttonDiv);
  buttonShowMeta.mouseClicked(function(){
    state.showMeta=!state.showMeta;
    console.log("show Meta? "+state.showMeta);
    buttonShowMeta.html(state.showMeta?'Hide Meta':'ShowMeta');
    socket.emit('showMeta', {showMeta:state.showMeta});
  });
  attachedDevices=new AttachedDevices();
  lobbyDevices=new LobbyDevices();
  console.log("Console setup complete");
}

function resetThemes(){
  socket.emit('resetThemes',{});
}

function sendSoundControl(){
  socket.emit('soundControl', {soundOn: state.soundOn});
}

function connected(data){
  console.log("Console connected");
  consoleid.html(id);
  socket.on('heartbeat',beat);
  socket.on('consoleData',consoleData);
  // socket.on('offer',offerReceived);
  sendSoundControl();
}

// function offerReceived(data){
//   lobbyDevices.offerReceived(data);
// }

function consoleData(data){
  console.log(data);
  var ld=data.lobby;
  var rd=data.ring;
  var md=data.ringMeta;
  var bd=data.blobMeta;
  var td=data.themeMeta;
  var nd=data.narrative;
  showRingCode(data.ringCode);
  showLobbyData(ld);
  showRingData(rd);
  showRequestsMeta(md);
  showGrantMeta(md);
  showOfferMeta(md);
  showBlobMeta(bd);
  // showThemeMeta(td);
  showNarrative(nd);
}

  function showRingCode(rc){
    ringCodeSpan.html(rc);
  }

  function showLobbyData(ld){
    var devString;
    if(!lobbyUL) {
      lobbyUL=createElement('ul');
      var el=createElement('li',"something");
      el.parent(lobbyUL);
      lobbyUL.parent(lobbyDiv);
    }
    lobbyDevices.refresh(ld.data);
    // var lobbyList=selectAll('li',lobbyUL);
    // lobbyList.forEach(function(li){
    //   li.remove();
    // });
    // ld.data.forEach(function(dev,i){
    //   devString=("00"+dev.position).slice(-3)+" "+dev.connection/*+" "+dev.socket*/;
    //   var el=createElement('li',devString);
    //   el.parent(lobbyUL);
    // });
  }

  function showRingData(rd){
    var devString;
    if(!ringUL){
      ringUL=createElement('ul');
      var el=createElement('li',"something");
      el.parent(ringUL);
      ringUL.parent(ringDiv);
    }
    attachedDevices.refresh(rd.data);
    // var ringList=selectAll('li',ringUL);
    // ringList.forEach(function(li){
    //   li.remove();
    // });
    // rd.data.forEach(function(dev,i){
    //   devString=("00"+dev.position).slice(-2)+" "+dev.connection/*+" "+dev.socket*/;
    //   //console.log(devString);
    //   var el=createElement('li',devString);
    //   el.parent(ringUL);
    // });
  }

  function showRequestsMeta(md){
    var devString;
    if(!metaULreq){
      metaULreq=createElement('ul');
      metaULreq.parent(metaDiv);
    }
    var count=select('p',metaULreq);
    if(!count) {
      count=createP("");
      count.parent(metaULreq);
    }
    count.html("Attach Requests #: "+md.requesters.length);
    var metaReqList=selectAll('li',metaULreq);
    metaReqList.forEach(function(li){
      li.remove();
    });
    md.requesters.forEach(function(r,i){
      devString=r.id+": "+r.device+" , "+r.active;
      //console.log(devString);
      var el=createElement('li',devString);
      el.parent(metaULreq);
    });
  }

  function showGrantMeta(md){
    if(!metaULgrant){
      metaULgrant=createElement('ul');
      metaULgrant.parent(metaDiv);
    }
    var count=select('p',metaULgrant);
    if(!count) {
      count=createP("");
      count.parent(metaULgrant);
    }
    count.html("Attach Grants #: "+md.grants.length);
    var metaGrantList=selectAll('li',metaULgrant);
    metaGrantList.forEach(function(li){
      li.remove();
    });
    md.grants.forEach(function(g,i){
      devString=i+": "+g.device+" , "+g.active;
      //console.log(devString);
      var el=createElement('li',devString);
      el.parent(metaULgrant);
    });
  }

  function showOfferMeta(md){
    if(!metaULoffer){
      metaULoffer=createElement('ul');
      metaULoffer.parent(metaDiv);
    }
    count=select('p',metaULoffer);
    if(!count) {
      count=createP("");
      count.parent(metaULoffer);
    }
    count.html("Attach Offers #: "+md.offers.length);
    var metaOfferList=selectAll('li',metaULoffer);
    metaOfferList.forEach(function(li){
      li.remove();
    });
    md.offers.forEach(function(o,i){
      devString=o.id+", prev:"+o.prev+", next:"+o.next+", active:"+o.active;
      //console.log(devString);
      var el=createElement('li',devString);
      el.parent(metaULoffer);
    });
  }

  function showBlobMeta(bd){
    if(!metaBlobs){
      metaBlobs=createElement('ul');
      metaBlobs.parent(metaDiv);
    }
    count=select('p',metaBlobs);
    if(!count) {
      count=createP("");
      count.parent(metaBlobs);
    }
    count.html("Active Blobs #: "+bd.length);
    var blobList=selectAll('li',metaBlobs);
    blobList.forEach(function(li){
      li.remove();
    });
    bd.forEach(function(b,i){
      devString=b.id+", x:"+floor(b.x)+", y"+floor(b.y)+", ttl:"+b.ttl;
      //console.log(devString);
      var el=createElement('li',devString);
      el.parent(metaBlobs);
    });
  }

  function showThemeMeta(td){
    if(!themeUL) {
      themeUL=createElement('ul');
      var el=createElement('li',"something");
      el.parent(themeUL);
      themeUL.parent(themeDiv);
    }
    var themeList=selectAll('li',themeUL);
    themeList.forEach(function(li){
      li.remove();
    });
    td.themes.forEach(function(theme,i){
      //devString=("00"+dev.position).slice(-3)+" "+dev.connection+" "+dev.socket;
      devString=("0"+i).slice(-2)+" Theme: "+theme.id+" "+theme.name;
      var el=createElement('li',devString);
      el.parent(themeUL);
    });
    var devString="Current Theme: "+("0"+td.current.index).slice(-2)+", ttl: "+td.current.ttl;
    var el=createElement('li',devString);
    el.parent(themeUL);
  }


  function showNarrative(nd){
    if(narrativeChanging){
      narrativeChanging=false;
      if(!narraUL) {
        narraUL=createElement('ul');
        narraUL.addClass('simple-list');
        var el=createElement('li',"something");
        el.parent(narraUL);
        narraUL.parent(narraDiv);
      }
      var narraList=selectAll('li',narraUL);
      narraList.forEach(function(li){
        li.remove();
      });
      nd.themes.forEach(function(theme,i){
        //devString=("00"+dev.position).slice(-3)+" "+dev.connection+" "+dev.socket;
       var themeOn=createCheckbox('',theme.on);
       var themeDuration=createInput(theme.duration);
       themeOn.attribute("index",i);
       themeDuration.attribute("index",i);
       themeOn.changed(themeOnChanged);
       themeDuration.changed(themeDurChanged);
        devString=("0"+i).slice(-2)+" Theme: "+theme.name;
        var el=createElement('li');
        themeOn.addClass("simple-list-item");
        el.addClass("container");
        var elString=createP(devString);
        el.child(themeOn);
        el.child(elString);
        el.child(themeDuration);
        el.parent(narraUL);
      });
      narrativeLive=createElement('li',devString);
      narrativeLive.parent(narraUL);
    }
    var devString="Current Theme: "+nd.current.name+", ttl: "+nd.current.ttl;
    narrativeLive.html(devString);
    narrativeLive.parent(narraUL);
  }

  function themeOnChanged(){
    narrativeChanging=true;
    changeThemeStatus(this.attribute("index"),this.checked());
  }

  function themeDurChanged(){
    narrativeChanging=true;
    changeThemeDuration(this.attribute("index"),this.value());
  }

  function changeThemeStatus(index, onOff){
    console.log("Turning theme #"+index+" "+onOff);
    socket.emit('themeOnOff',{index: index, status: onOff});
  }

  function changeThemeDuration(index, duration){
    console.log("Change Duration theme #"+index+" "+duration);
    socket.emit('themeDuration',{index: index, duration: duration});
  }

function setID(data){
  console.log(data.id);
  id=data.id;
  socket.emit('console',{consoleid:id});
  consoleid.html(id);
}

function beat(data){
  beatnum.html(data.beat);
  console.log(data.beat);
}

/*************************
 Attached devices object
 display and buttons
***************************/

function AttachedDevices(){
  var activeDevs=[];

  this.refresh=function(ringData){
    activeDevs=ringData;
    console.log("refresh ring data");
    var newRingUL=createElement('ul');
    newRingUL.addClass('simple-list');
    ringData.forEach(function(dev,i){
      var liEl=createElement('li');
      liEl.addClass('simple-list-item');
      liEl.attribute('connection',dev.connection);
      devString=("00"+dev.position).slice(-2)+" "+dev.connection/*+" "+dev.socket*/;
      //console.log(devString);
      var el=createElement('li',devString);
      el.parent(liEl);
      var b0=createButton('X');
      b0.attribute('index',i);
      b0.parent(liEl);
      b0.mouseClicked(b0Clicked);
      var b1=createButton('V');
      b1.attribute('index',i);
      b1.parent(liEl);
      b1.mouseClicked(b1Clicked);
      var b2=createButton('<>');
      b2.attribute('index',i);
      b2.parent(liEl);
      b2.mouseClicked(b2Clicked);
      liEl.parent(newRingUL);
    });
    ringUL.remove();
    ringUL=newRingUL;
    ringUL.parent(ringDiv);
  };

  // this.offerReceived=function(data){
  //   console.log(data);
  //   // find li with relevant connection attrbute
  //   var liEls=selectAll('li',ringDiv);
  //   console.log(liEls);
  //   liEls.forEach(function(li, i){
  //     if(li.attribute('connection')){
  //       console.log(li.attribute('connection')+" "+data.offeredTo.toString());
  //       if(li.attribute('connection')==data.offeredTo.toString()){
  //         console.log("Offer matches li #"+i);
  //         li.addClass('specialTest');
  //       }
  //     }
  //   });
  // };

  function b0Clicked(){
    var b=this.attribute('index');
    console.log("Button X "+b+" clicked");
    socket.emit('consoleCommand',{command: 'disconnect', id: activeDevs[b].connection});
  }

  function b1Clicked(){
    var b=this.attribute('index');
    console.log("Button V "+b+" clicked "+activeDevs[b].connection);
    socket.emit('consoleCommand',{command: 'detach', id: activeDevs[b].connection});
  }

  function b2Clicked(){
    var b=this.attribute('index');
    console.log("Button <> "+b+" clicked");
    socket.emit('consoleCommand',{command: 'permit', id: activeDevs[b].connection});
  }

}

function LobbyDevices(){
  lobbyDevices=[];

  this.refresh=function(lobbyData){
    activeDevs=lobbyData;
    console.log("refresh lobby data");
    var newLobbyUL=createElement('ul');
    newLobbyUL.addClass('simple-list');
    lobbyData.forEach(function(dev,i){
      var liEl=createElement('li');
      liEl.addClass('simple-list-item');
      liEl.attribute('connection',dev.connection);
      devString=("00"+dev.position).slice(-3)+" "+dev.connection/*+" "+dev.socket*/;
      var el=createElement('p',devString);
      el.parent(liEl);
      liEl.parent(newLobbyUL);
    });
    lobbyUL.remove();
    lobbyUL=newLobbyUL;
    lobbyUL.parent(lobbyDiv);
  };

  // this.offerReceived=function(data){
  //   console.log(data);
  //   // find li with relevant connection attrbute
  //   var liEls=selectAll('li',lobbyDiv);
  //   console.log(liEls);
  //   liEls.forEach(function(li, i){
  //     if(li.attribute('connection')){
  //       console.log(li.attribute('connection')+" "+data.offeredTo.toString());
  //       if(li.attribute('connection')==data.offeredTo.toString()){
  //         console.log("Offer matches li #"+i);
  //         var b0=createButton('O');
  //         b0.attribute('index',i);
  //         b0.parent(li);
  //         b0.mouseClicked(b0Clicked);
  //         var test=createElement('h1',"Test!!!");
  //         test.parent(li);
  //       }
  //     }
  //   });

  //   function b0Clicked(){
  //     var b=this.attribute('index');
  //     console.log("Button O "+b+" clicked");
  //     // socket.emit('consoleCommand',{command: 'disconnect', id: activeDevs[b].connection});
  //   }
  // };
}

 