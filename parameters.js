module.exports={
	Parameters: Parameters
};

// three global parameters;
// 1: [0] is a counter incremnting by 0.1 each cycle
// 2: [1] increments by a random value %1
// 3: [2] is an integer decrementing each cycle 
// 	by 500. used to create a cursor cycling 
// 	backwards through the ring  pixel space
 
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

	this.reset=function(paramIndex){
		params[paramIndex].reset();
	};

	function Parameter(ind){
		var value=0;
		var steps=10;
		//var inc=ind/steps;
		var incrementMe=getIncrementer();

		this.run=function(ringLengthPixels){
			value+=incrementMe();//inc
			if(value>1) value-=1;
		};

		function getIncrementer(){
			if(ind===2) { 
				return function(){
					return Math.random();
				};
			}else { 
				return function(){
					return ind/steps;
				};
			}
		}

		this.get=function(){
			return value;
		};
	}

	function ParamLoop(){
		var value=0;

		this.reset=function(){
			value=0;
		};
		
		this.run=function(ringLengthPixels){
			value-=500;
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

	
