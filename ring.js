module.exports={
	Ring: Ring,
	DeviceShadow: DeviceShadow
};

var serverState=require('./serverState.js');
var blobList=require('./blobs.js');
var parameters=new blobList.Parameters();

//Gobal Var  - check for conflicts
var nextRingID=0;


/**********************************************
		Constructor for Device Shadow Object
***********************************************/
function DeviceShadow(session, devid, devWidth, devHeight){
	this.session=session;
	this.devid=devid;
	this.lastBeat=0;
	this.devWidth=devWidth;
	this.devHeight=devHeight;
	this.startX=null;
	this.endX=null;
	this.suspended=false;
	console.log("New device shadow "+this.session.id+", Device"+devid+", Width:"+devWidth+" Height:"+devHeight);

	this.requestForPermit=function(){
		console.log(this.session.id+" received request for attach permit. Pass to device");
		this.session.socket.emit('rfpermit',{});
	};

	this.setStartX=function(sx){
		this.startX=sx;
		this.endX=this.startX+this.devWidth;
		this.session.socket.emit("startX", {sx:sx});
	};

	this.unsetStartX=function(){
		this.startX=null;
		this.endX=null;
		this.session.socket.emit("startX", {sx:null});
	};
}

/**********************************************
		Constructor for Blob Ring Object - does most of the work
***********************************************/
function Ring(name, io, themes){ //have to pass io to have access to sockets object
	var self=this; //to get around this context in functions
	var unattached=null;
	this.blobList=new blobList.BlobList();
	this.ringID=nextRingID++;
	this.name=name;
	this.ringLengthDevs=0;
	this.ringLengthPixels=0;
	this.deviceShadows=[];

	//The state tracking clases are in a separate module
	var requesters=new serverState.RequestList(this.name, this.ringID);
	var grants=new serverState.GrantsList(this.name, this.ringID);
	var offers=new serverState.OffersList(this.name, this.ringID);

	//main operational driver for the ring, called by heartbeat
	this.run=function(heartbeat){
		this.heartbeat=heartbeat;
		//console.log(this.name+" "+this.ringID+" running");
		processAttachRequests();
		processAttachGrants();
		processAttachOffers();
		this.blobList.run(this.ringLengthPixels);
		sendBlobData();
		checkShadowHealth(heartbeat);
		var themeStatus=themes.run();
		// var newTheme=themeStatus.index;
		// var newThemeName=themeStatus.name;//themes.run();
		// //var oldTheme=themes.getCurrent();
		// if(oldTheme>-1){
		// 	//shutdown old theme
		// }
		if(themeStatus.index>-1){
			io.sockets.emit("themeSwitch", themeStatus); //{name: newThemeName, index:newTheme}
		}
		parameters.run(this.ringLengthPixels);
		sendParamData();
	};

	function checkShadowHealth(heartbeat){
		//don't do this for unattached ring
		for(var i=self.deviceShadows.length-1; i>=0; i--){
			var ds=self.deviceShadows[i];
			if(ds.lastBeat<heartbeat-10){
				//force detach of device
				// console.log("Device "+ds.session.id+" last checked in "+ds.lastBeat+" Detach this device");
				// ds.session.socket.emit('notifyDetached',{});
				// detachFromRing(ds.session.id);
			} else if(ds.lastBeat<heartbeat-1){
				if(!ds.suspended){
					// console.log("Device "+ds.session.id+" last checked in "+ds.lastBeat+" Skip this device");
					// suspendDev(ds.session.id);
					// ds.suspended=true;
				}
			} else {
				if(ds.suspended){
					unsuspendDev(ds.session.id);
					ds.suspended=false;
				}
			}
		}
	}

	this.gimmeTheme=function(data){
		//get current active theme
		var themeStatus=themes.getCurrentTheme();
		//send back to requesting device
		var ds=findDevShadow(data.device);
		ds.session.socket.emit("themeSwitch", themeStatus);
	};

	this.themeKiller=function(data){
		themes.clientDrivenSwitch();
	};

	this.logEcho=function(data){
		var ds=findDevShadow(data.device);
		if(ds){
			ds.lastBeat=data.beat;
		}
		// console.log("received beat echo:"+data.beat);
	};

	//To identify if this ring has an unattached counterpart, ie lobby
	this.setUnattached=function(from){
		unattached=from;
	};


	/*****************************************
	build console metadata
	******************************************/

	this.buildJSONRingMeta=function(){
		var metaData={};
		metaData.requesters=requesters.buildMeta();
		metaData.grants=grants.buildMeta();
		metaData.offers=offers.buildMeta();
		return metaData;
	};

	this.buildJSONBlobMeta=function(){
		return this.blobList.getBlobs();
	};




	/*****************************************
	request/permit/offer protocol
	******************************************/
	this.attachRequested=function(data){
		//check it's not already attached
		if(typeof(findDevShadow(data.id))==="undefined"){
			requesters.attachRequest(data.id);
		}	else {
			console.log("The requesting device is already attached");
		}
	};

	function notifyAttached(devs){
		devs.forEach(function(dev){
			findDevShadow(dev).session.socket.emit('notifyAttached',{incoming: devs[0], prev: devs[1], next:devs[2]});
		});
	}

	function processAttachRequests(){
		var newRequests=false;
		//check not expired
		requesters.run();
		var currentRequests=requesters.getRequests();
		//check all requests
		currentRequests.forEach(
			function(requester){
				//is it new?
				if(!requester.requestBroadcastSent){
				//if no existing attached
					if(self.deviceShadows.length===0){
						//create instant attach
						console.log("No existing devices so just join");
						attachToRing(requester.requestingDev);
						requester.requestBroadcastSent=true;
					} else if(self.deviceShadows.length===1){ //if only one attached
						//create instant join
						console.log("Only one existing devices so just join");
						attachToRing(requester.requestingDev,0);
						requester.requestBroadcastSent=true;
					} else { //the ring is not empty
						requester.requestBroadcastSent=true;
						console.log("Just another request");
						newRequests=true;
					}
				}
			}
		);
		if(newRequests){
			//send out permit requests if necessary
			self.deviceShadows.forEach(function(devShadow){
				devShadow.requestForPermit();
				//if just been sent out then don't broadcast
			});
		}
	}

	this.permitReceived=function(data){
		//check for existing
		grants.newGrant(data.id);
		//log whether created or not
	};

	function processAttachGrants(){
		//check for existing,grants
		grants.run();
		var currentGrants=grants.get();
		var granted=[];
		//check for adjacent grants
		currentGrants.forEach(function(grant){
			granted.push(findDevRingPos(grant.device));
		});
		//console.log("Grants count: "+currentGrants.length+" "+granted.length);
		var p=granted.length-1;
		for(var i=0; i<granted.length; i++){
			var currPos=granted[i];
			var prevPos=granted[p];
			p=i;
			console.log("Check adjacency "+currPos+"-"+prevPos+"="+(currPos-prevPos)+", "+(self.deviceShadows.length-1));
			if(granted.length>1){
				if(currPos-prevPos===1||
					currPos-prevPos===-(self.deviceShadows.length-1)){ //two adjacent grants
					//check that an active offer does not exist already
					var pv=self.deviceShadows[prevPos].session.id;
					var nx=self.deviceShadows[currPos].session.id;
					//CREATE AN OFFER devid's not positions, which could change
					if(offers.offerExists(pv,nx)||offers.offerExists(nx,pv)){ //because when there are only two existing devices, the offer is valid both ways around
						console.log("Offer "+pv+" "+nx+" exists already");
					} else {
						//create the offer
						var o=offers.newOffer(pv,nx);
						//assign to the first available requester
						var r=requesters.assignOffer(o);
						//retrieve id of requesting device
						var requestingDev=requesters.getDevid(r);
						var ds=unattached.findShadow(requestingDev);
						console.log("Offer destined for device"+ds.id);
						console.log("Issuing offer "+o+" to "+requestingDev);
						//send offer to requesting device
						ds.session.socket.emit('offer',{id: o, prev:pv, next:nx, expires:offers.getExpiry(o)});
						//??? send offer info and to offering devices.
						offers.linkRequester(o,r);
					}
				}
			}
		}
	}

	function processAttachOffers(){
		offers.run();
	}

	this.offerAccepted=function(data){
		//needs to be implemented
		console.log("Offer "+data.offer+" Accepted by "+data.device);
		//match offer 
		var pAndN=offers.getPandN(data.offer);
		console.log(pAndN);
		console.log(data.device, pAndN.prev, pAndN.next);
		attachToRing(data.device, pAndN.prev, pAndN.next);
		//notify
		notifyAttached([data.device, pAndN.prev, pAndN.next]);
		//cleanup
			//remove grants
		grants.remove(pAndN.prev);
		grants.remove(pAndN.next);
			//remove offer
		offers.remove(data.offer);
	};



	/*****************************************
	Blob functions
	******************************************/

	function sendBlobData(blobs){//(blobs){
		var allBlobs=false;
		if(!blobs || blobs.length===0){ //send all blobs as none specified
			// console.log("sendBlobData was empty");
			blobs=self.blobList.getBlobs();
			allBlobs=true;
		}
		//var blobs=self.blobList.getBlobs();
		io.sockets.emit("blobData", {
			allBlobs: allBlobs,
			ringLength: self.ringLengthPixels,
			numDevs: self.ringLengthDevs,
			// params: {
			// 	time: Date.now(),
			// 	params:[parameters.getVal(0), parameters.getVal(1), parameters.getVal(2)]
			// },
			blobs: blobs
		});
		console.log("sendBlobData:"+blobs.length+" All?:"+allBlobs);
	}

	function sendParamData(){
		io.sockets.emit("parameters", {
			params: {
				time: Date.now(),
				params:[parameters.getVal(0), parameters.getVal(1), parameters.getVal(2)]
			}
		});
	}

			// console.log("PP: "+parameters.getVal(0));
		// console.log("PP: "+parameters.getVal(1));


		//new blob creation from the client
	this.clientBlob=function(data){
		var pos=findDevRingPos(data.device);
		var bData=null;
		console.log("RIng pos:"+pos);
		if(pos!==null){
			bData=this.blobList.newBlob(data.x, data.y, data.device);
			console.log("ring received blob from device "+data.device+" OK");
		} else {
			console.log("ring received blob from device "+data.device+" but not attached to this ring");
		}
		//console.log("blobData:"+bData);
		sendBlobData(bData);//
	};

	this.updateBlob=function(data){
		var bData=this.blobList.updateBlob(data.id, data.x, data.y, data.vel, data.ttl, this.ringLengthPixels);
		//need to also check wraparound on ring length
		//console.log("blobData:"+bData);
		sendBlobData(bData);//bData
	};


	
	/*****************************************
	attachment, detachment, join, unjoin etc
	******************************************/

	function attachToRing(devid, prev, next){
		console.log(self.name+" "+self.ringID+" Attaching device to ring, dev: "+devid+" twixt: "+prev+" and: "+next);
		//assign device shadow to this ring
		var pos=self.joinRing(devid,next);
		//remove from lobby
		var ds=unattached.findShadow(devid);
		ds.lastBeat=self.heartbeat;
		unattached.unjoinRing(devid);
		//notify the device
		var s=ds.session.socket;
		//should this be done from here inside ring???
		s.emit('attached',{ring: self.ringID});
		//send new ring pos to all subsequent devices.
		s.emit('ringpos',{ring: self.ringID, pos:pos});
		if(next){
			ds=self.findShadow(next);
			s=ds.session.socket;
			s.emit('ringpos',{ring: self.ringID, pos:pos+1});
		}
		//remove any active attach requests for this device
		requesters.remove(devid);
	}

	this.detacher=function(data){
		detachFromRing(data.id);
	};


	function detachFromRing(devid){
		console.log(self.name+" "+self.ringID+" Detaching device from ring, dev: "+devid);
		//find device in the current ring
		var ds=self.findShadow(devid);
		//add to unattached
		unattached.joinNewDevShadow(ds);
		//remove from ring
		self.unjoinRing(devid);
		//notify
		//how to do this? send a message?
	}

	this.joinRing=function(devid, nextid){
		var next;
		var shadow=unattached.findShadow(devid);
		if(nextid) next=findDevRingPos(nextid);
		else if(this.ringLengthDevs===0){
			next=0;
		} else {
			next=this.deviceShadows.length-1;
		}
		//calculate new startX
		var newStartX;
		if(this.ringLengthDevs>0){
			newStartX=this.deviceShadows[next].startX;
		} else {
			newStartX=0;
		}
		//actually insert the device
		this.deviceShadows.splice(next,0,shadow);
		//setStartX for newly inserted device
		console.log("joinring set startX to"+newStartX);
		shadow.setStartX(newStartX);
		//update ring geometry
		this.ringLengthDevs++;
		this.ringLengthPixels+=shadow.devWidth;
		//update all subsequent devices

		var endX=shadow.endX;
		for(var i=next+1; i<this.deviceShadows.length; i++){
			if(!this.deviceShadows[i].suspended){
				this.deviceShadows[i].setStartX(endX);
				endX=this.deviceShadows[i].endX;
			}
		}
		console.log(this.name+" "+this.ringID+" "+"new dev shadow joins ring, "+this.ringLengthDevs+" "+this.ringLengthPixels);
//		console.log(this.deviceShadows);
		return next; //position on inserted device
	};


	this.unjoinRing=function(id){
		var i=findDevRingPos(id);
		var shadow=this.findShadow(id);
		if(shadow){
			var startX=shadow.startX;
			var dw=shadow.devWidth;
			//this.deviceShadows[i]=null;
			this.deviceShadows.splice(i,1);
			//update ring geometry
			this.ringLengthDevs--;
			this.ringLengthPixels-=dw;
				//update all subsequent devices
			if(unattached!==null){ //don't do this on the unattached ring	
				shadow.setStartX(null);
				for(var j=i; j<this.deviceShadows.length; j++){
					if(!this.deviceShadows[j].suspended){
						this.deviceShadows[j].setStartX(startX);
						startX=this.deviceShadows[j].endX;
					}
				}
			}
			console.log(this.name+" "+this.ringID+" "+"unJoined device shadow: "+id+" "+this.deviceShadows.length);
		}
	};
	

	function suspendDev(devid){
		var i=findDevRingPos(devid);
		var shadow=self.findShadow(devid);
		var startX=shadow.startX;
		var dw=shadow.devWidth;
		//this.deviceShadows.splice(i,1);
		//update ring geometry
		self.ringLengthDevs--;
		self.ringLengthPixels-=dw;
			//update all subsequent devices
		if(unattached!==null){ //don't do this on the unattached ring	
			shadow.setStartX(null);
			for(var j=i; j<self.deviceShadows.length; j++){
				self.deviceShadows[j].setStartX(startX);
				startX=self.deviceShadows[j].endX;
			}
		}
		console.log(self.name+" "+self.ringID+" "+" suspended device shadow: "+devid);
	}

	function unsuspendDev(devid){
		var pos=findDevRingPos(devid);
		var shadow=self.findShadow(devid);
		if(this.ringLengthDevs===1){
			next=0;
			newStartX=0;
		}
		else if(pos===self.deviceShadows.length-1){
			next=0;
			newStartX=self.deviceShadows[pos-1].endX;
		}else{
			next=pos+1;
			newStartX=self.deviceShadows[next].startX;
		}
		shadow.setStartX(newStartX);
		//update ring geometry
		self.ringLengthDevs++;
		self.ringLengthPixels+=shadow.devWidth;
		//update all subsequent devices
		var endX=shadow.endX;
		if(next>0){
			for(var i=next; i<self.deviceShadows.length; i++){
				self.deviceShadows[i].setStartX(endX);
				endX=self.deviceShadows[i].endX;
			}
		}
		console.log(self.name+" "+self.ringID+" "+" reinstated device shadow: "+devid);
	}


	/*****************************************
	utilities
	******************************************/

	this.joinNewDevShadow=function(shadow){
		this.deviceShadows.push(shadow);
		//update ring geometry
		self.ringLengthDevs++;
		self.ringLengthPixels+=shadow.devWidth;
	};

	this.findShadow=function(devid){
		return findDevShadow(devid);
	};

	function findDevRingPos(devid){ //returns the position in the ring
		var index=null;
		self.deviceShadows.find(function(ds,i){
			if(ds.session.id===devid){
				index=i;
				return true;
			}
		});
		return index;
	}

	function findDevShadow(devid){ //returns the actual dev shadow
		var dev=self.deviceShadows.find(function(ds){
			return ds.session.id===devid;
		});
		// console.log(dev);
		return dev;
	}
}



