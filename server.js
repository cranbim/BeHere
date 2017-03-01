//Main node executable for PlasmaRIng
//DJW, Cranbim, November 2016
//

//imports
var express = require('express');
var ringMod= require('./ring.js');
var themeRunner= require ('./themeRunner.js');
var ringJoiner= require('./ringJoiner.js');
var ringCode= new ringJoiner.RingCode();

var app=express();

var server = require('http').createServer(app);
var io = require('socket.io')(server);

//global vars
var nextID=10000;
var nextRingID=0;
var nextAttachRequest=0;
var nextAttachOffer=0;
var heartbeat=1000;
var consoleSession;
var currentSoundControl=null;
var currentShowMeta=false;

//setup principle objects
var themes=new themeRunner.ThemeRunner();
//ring to monitor unattached devices
var unattached=new ringMod.Ring("LOBBY", io);
//ring to hold attached devices
var ring=new ringMod.Ring("RING_01", io, themes);
ring.setUnattached(unattached);
var sessions=[];

//start http server
app.use(express.static('public'));
server.listen(4000,"0.0.0.0");

console.log("The Plasma Ring Server is running");
console.log("Listening on port:4000");

io.sockets.on('connection', newConnection);

//set one second heartbeat
var h=setInterval(beat,1000);

function beat(){
	heartbeat++;
	console.log("heartbeat "+heartbeat);
	if(sessions.length>0) io.sockets.emit('heartbeat',{beat:heartbeat});
	//run the ring processes each heartbeat
	ring.run(heartbeat);
	//update console
	sendConsoleData();
}

/*******************************************
  This function and subsidiaries handles the 
  socket connection and i/o
*********************************************/

function newConnection(socket){
  var session=new Session(socket);
  sessions.push(session);
  console.log("New connection, session:"+session.id+" socket:"+socket.id);
  console.log("Num sessions:"+sessions.length);
  //socket.on('mouse', mouseMsg);
  socket.on('disconnect', clientDisconnect);
  socket.on('join',joiner);
  socket.on('unjoin',unjoiner);
//  socket.on('blob',blobMsg);
  socket.on('attach',attacher);
  socket.on('permit',permitReceived);
  socket.on('offerAccepted',offerAccepted);
  socket.on('console',setConsole);
  socket.on('newBlob',blobFromClient);
  socket.on('blobUpdate',updateBlob);
  socket.on('detach', detacher);
  socket.on('echo', logEcho);
  socket.on('themeKiller', themeKiller);
  socket.on('gimmeTheme', gimmeTheme);
  socket.on('getServerThemes', sendThemesToClient);
  socket.on('soundControl', soundControl);
  socket.on('showMeta', showMeta);
  socket.on('resetThemes', resetThemes);
  socket.on('themeOnOff', themeOnOff);
  socket.on('themeDuration', themeDuration);
  socket.on('newRingCode', newRingCode);
  socket.on('consoleCommand', consoleCommand);

  function consoleCommand(data){
		if(data.command=="detach"){
			console.log("Detach dev "+data.id);
			ring.detacher(data);
		} else if(data.command=="disconnect"){
			var sessionToEnd=findSession(data.id);
			console.log("Disconnect dev "+data.id);
			// clientDisconnect(sessionToEnd);
		}else if(data.command=="permit"){
			var sessionToPermit=findSession(data.id);
			console.log("Send permit from dev "+data.id);
			if(sessionToPermit){
				if(sessionToPermit.socket){
					sessionToPermit.socket.emit('issuePermit',{});
				}
			}
		}
  }

  function newRingCode(){
		ringCode.generate();
  }

  function themeDuration(data){
		themes.themeDuration(data.index, data.duration);
  }

  function themeOnOff(data){
  	themes.themeOnOff(data.index, data.status);
  }

  function sendThemesToClient(data){
  	console.log("Sending Themes to client");
  	var themeList=themes.themeLoader;
  	socket.emit('serverThemes', {themes: themeList});
  }

  function resetThemes(data){
  	ring.resetThemes(data);
  }

  function soundControl(data){
  	currentSoundControl=data;
  	io.sockets.emit('soundControl', data); 
  }

  function showMeta(data){
  	currentShowMeta=data.showMeta;
  	io.sockets.emit('showMeta', data); 
  }

  function gimmeTheme(data){
		ring.gimmeTheme(data);
  }

  function themeKiller(data){
		ring.themeKiller(data);
  }

  function logEcho(data){
		ring.logEcho(data);
  }

  function detacher(data){
		ring.detacher(data);
  }

  function updateBlob(data){
		ring.updateBlob(data);
  }

  function blobFromClient(data){
		ring.clientBlob(data);
  }

  function offerAccepted(data){
		ring.offerAccepted(data);
  }
  
  function attacher(data){
		ring.attachRequested(data);
  }

  function permitReceived(data){
		ring.permitReceived(data);
  }

  function joiner(data){
  	if(data.nickName.toLowerCase()===ringCode.ringCode){
  		console.log("Device Joining with correct code");
  		socket.emit('joinApproved',{approved:true});
			var newUnAttached=new ringMod.DeviceShadow(session, data.id, data.width, data.height, data.nickName);
			unattached.joinNewDevShadow(newUnAttached);
			if(currentSoundControl){
				 io.sockets.emit('soundControl', currentSoundControl);
			}
		} else {
			console.log("Incorrect code, not joining");
  		socket.emit('joinApproved',{approved:false});
		}
	}

	function unjoiner(data){
		unattached.unjoinRing(data.id);
		//remove device shadow?????
	}

	function setConsole(data){
		consoleSession=findSession(data.consoleid);
		console.log("Console identified as: "+consoleSession.id);
	}

  function clientDisconnect(){
	//need to handle the effect of disconnect on lobby and rings
		// var sessionToFind=false;
		// if(thisSession){
		// 	sessionToFind=thisSession;
		// } else {
		// 	sessionToFind=session;
		// }
		// if(sessionToFind.id){
			var i=sessions.forEach(function(sesh,index){
				if(sesh.id==session.id) return index;
			});
			sessions.splice(i,1);
			console.log("Removed disconnected session: "+session.id+" socket:"+session.socket.id);
			console.log("Num sessions:"+sessions.length);
			ring.unjoinRing(session.id);
			console.log("disconnected device unjoined from ring");
		// }
	}
}



function sendConsoleData(){
	if(consoleSession){
		console.log("Send console data");
		consoleSession.socket.emit('consoleData',{
			lobby: buildJSONRing(unattached),
			ring: buildJSONRing(ring),
			ringMeta: ring.buildJSONRingMeta(),
			blobMeta: ring.buildJSONBlobMeta(),
			// themeMeta: themes.buildMetaData(),
			narrative: themes.buildNarrativeData(),
			ringCode: ringCode.ringCode
		});
	} else {
		console.log("Can't send console data, no console connected");
	}
}

function findSession(devid){
	return sessions.find(function(session){
		return session.id===devid;
	});
}


function buildJSONRing(thisRing){
	var ringData={};
	var devices=[];
	if(thisRing){
		thisRing.deviceShadows.forEach(function(ud,i){
			devices[i]={
				position: i,
				connection: ud.session.id,
				socket: ud.session.socket.id
			};
		});
		ringData.name=thisRing.name;
		ringData.size=devices.length;
		ringData.data=devices;
	}
	return ringData;
}

//Object to store the session Id and socket
function Session(socket){
	this.socket=socket;
	this.id=nextID++; //increment the ID number
	socket.emit('id',{id:this.id});
}

