module.exports={
	BlobList: BlobList,
	Parameters: Parameters
};

function BlobList(){
	var nextBlobID=1000;
	var blobs=[];

	this.updateBlob=function(id, x, y, ttl, maxX){
		//console.log("update blob "+id+" with x:"+x);
		var b=this.findBlob(id);
		if(b) {
			b.updateVals(x,y, ttl);
			b.update(maxX);
		} else {
		}
		//return blob data structured as an array
		if(!b) return [];
		return [b.getPos()];
	};

	this.findBlob=function(id){
		return blobs.find(function(blob){
			return blob.getID()===id;
		});
	};

	this.newBlob=function(x,y,dev){
		var b=new Blob(x,y, dev);
		blobs.push(b);
		return [b.getPos()];
	};

	this.run=function(maxX){
		for(var i=blobs.length-1; i>=0; i--){
			if(!blobs[i].update(maxX)) blobs.splice(i,1);
		}
	};

	this.getBlobs=function(){
		var blobData=[];
		blobs.forEach(function(blob){
			blobData.push(blob.getPos());
		});
		return blobData;
	};


	/**********************************************
		Constructor for Blob object
	***********************************************/
	function Blob(x, y, devid){
		var ttl=1000;
		var id=nextBlobID++;
		// console.log("New Blob ${id} from ${devid} at ${x}, ${y}");
		console.log("New Blob "+id+" from "+devid+" at "+x+", "+y);

		this.updateVals=function(ux,uy,uTTL){
			x=ux;
			y=uy;
			ttl=uTTL;
		};

		this.getID=function(){
			return id;
		};

		this.update=function(maxX){
			//ttl--;
			if(x>=maxX) {
				x-=maxX;
				console.log("x wrapped back to start");
			} else if(x<0){
				x+=maxX;
				console.log("x wrapped back to end");
			} else {
				// console.log("x is within limits");
			}
			return ttl>0;
		};

		this.getPos=function(){
			return {x:x, y:y, id:id, ttl:ttl};
		};
	}

}


function Parameters(){
	var numParams=2;
	var params=[];

	for(var i=0; i<numParams; i++){
		params[i]=new Parameter(i+1);
	}
	params.push(new ParamLoop());

	this.run=function(ringLengthPixels){
		params.forEach(function(p){
			p.run(ringLengthPixels);
		});
	};

	this.getVal=function(ind){
		return params[ind].get();
	};

	console.log("New Parameters");
	console.log("0: "+params[0].get());


	function Parameter(ind){
		var value=0;
		var steps=10;
		var inc=ind/steps;

		this.run=function(ringLengthPixels){
			value+=inc;
			if(value>1) value-=1;
			// console.log("run param");
		};

		this.get=function(){
			return value;
		};
	}

	function ParamLoop(){
		var value=0;
		
		this.run=function(ringLengthPixels){
			value-=250;
			// if(value>ringLengthPixels){
			// 	value=0;
			// }
			// if(value<0){
			// 	value=ringLengthPixels;
			// }
			console.log("param loop: "+value);
		};


		this.get=function(){
			return value;
		};
	}

}

	
