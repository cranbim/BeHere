var socket;
var id;
var beatnum;
var consoleid;
var lobbyDiv;
var buttonDiv;
var lobbyUL, themeUL, narraUL;
var ringDiv;
var themeDiv;
var narrDiv;
var ringUL=null;
var MetaDiv;
var metaULreq, metaULgrant, metaULoffer, metaBlobs;

var state={
  soundOn: false
}

function setup() {
  noCanvas();
  beatnum=select("#heartbeat");
  consoleid=select("#consoleid");
  socket=io.connect('http://localhost:4000');
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
  var soundButton=createButton('Turn Sound On');
  soundButton.parent(buttonDiv);
  soundButton.mouseClicked(function(){
    state.soundOn=!state.soundOn;
    if(state.soundOn) soundButton.html('Turn Sound Off');
    else soundButton.html('Turn Sound On');
    socket.emit('soundControl', {soundOn: state.soundOn});
  });
}

function connected(data){
  console.log("Console connected");
  consoleid.html(id);
  socket.on('heartbeat',beat);
  socket.on('consoleData',consoleData);
}

function consoleData(data){
  console.log(data);
  var ld=data.lobby;
  var rd=data.ring;
  var md=data.ringMeta;
  var bd=data.blobMeta;
  var td=data.themeMeta;
  var nd=data.narrative;
  showLobbyData(ld);
  showRingData(rd);
  showRequestsMeta(md);
  showGrantMeta(md);
  showOfferMeta(md);
  showBlobMeta(bd);
  showThemeMeta(td);
  showNarrative(nd);
}

  function showLobbyData(ld){
    var devString;
    if(!lobbyUL) {
      lobbyUL=createElement('ul');
      var el=createElement('li',"something");
      el.parent(lobbyUL);
      lobbyUL.parent(lobbyDiv);
    }
    var lobbyList=selectAll('li',lobbyUL);
    lobbyList.forEach(function(li){
      li.remove();
    });
    ld.data.forEach(function(dev,i){
      devString=("00"+dev.position).slice(-3)+" "+dev.connection/*+" "+dev.socket*/;
      var el=createElement('li',devString);
      el.parent(lobbyUL);
    });
  }

  function showRingData(rd){
    var devString;
    if(!ringUL){
      ringUL=createElement('ul');
      var el=createElement('li',"something");
      el.parent(ringUL);
      ringUL.parent(ringDiv);
    }
    var ringList=selectAll('li',ringUL);
    ringList.forEach(function(li){
      li.remove();
    });
    rd.data.forEach(function(dev,i){
      devString=("00"+dev.position).slice(-2)+" "+dev.connection/*+" "+dev.socket*/;
      //console.log(devString);
      var el=createElement('li',devString);
      el.parent(ringUL);
    });
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
    if(!narraUL) {
      narraUL=createElement('ul');
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
      devString=("0"+i).slice(-2)+" Theme: "+theme.name;
      var el=createElement('li',devString);
      el.parent(narraUL);

    });
    var devString="Current Theme: "+nd.current.name+", ttl: "+nd.current.ttl;
    var el=createElement('li',devString);
    el.parent(narraUL);
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