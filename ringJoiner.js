module.exports={
	RingCode: RingCode
};

var codeLength=3;

function RingCode(){

	this.ringCode="xxx";

	this.generate=function(){
		ringCodeA=[];
		for(var i=0; i<codeLength; i++){
			ringCodeA[i]=String.fromCharCode(Math.floor(Math.random()*26)+97);
		}
		this.ringCode=ringCodeA.join('');
		console.log("New RingCode :"+this.ringCode);
	};


}
