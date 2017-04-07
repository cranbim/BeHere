//Dave messing with Blinkt as status leds with node
module.exports={
	StatusLights: StatusLights,
};


function StatusLights(){

	var timer;
	var count=0;
	var count1=0;
	var count2=0;
	var blankBack=true;
	var showCount2=false;
	var justStarted=true;


	//test that we are on the pi and that the blinkt module exists
	if(!moduleAvailable('node-blinkt')){
		console.log("Not running on the Pi or Blinkt not available");
		console.log("There will be no pretty lights - sorry!");
	} else {
		console.log("Running on pi with Blinkt available");
		var Blinkt = require('node-blinkt');
		var leds = new Blinkt();
		leds.setup();
		leds.clearAll();
		timer=setTimeout(myLights,100);
	}

	function moduleAvailable(name) {
	  try {
	    require.resolve(name);
	    return true;
	  } catch(e){}
	  return false;
	}

	function myLights(){
		count++;
		//console.log("   !!!!!! My lights "+count+" !!!!!");
		if(justStarted){
			startupSequence();
		} else {
			if(count%20===0){
			// 	blankBack=false;
			// 	setTimeout(resetBack,1000);
				showCount2=!showCount2;
			}
			setBackground();
			showCounter();
			//make chasr LED brighter
			leds.setBrightness(count%8,0.3);
			//update leds
			leds.sendUpdate();
			//update counters
			
			if(count%10===0){
				// count1--;
				// count2++;
			}
		}
		setTimeout(myLights,100);
		//if(count<1000) setTimeout(myLights,100);
		// else{
		// 	setTimeout(clear,500);
		// 	setTimeout(clear,1000);
		// }
	}

	this.clear=function(){
		clear();
	}

	function startupSequence(){
		if(count<30){
			console.log("startup "+count);
			leds.setAllPixels(0,0,0,0);
			leds.setPixel(count%8,80,0,200,0.1);
			leds.sendUpdate();
		} else {
			justStarted=false;
		}
	}

	function resetBack(){
		blankBack=true;
	}

	function showCounter(){
		if(blankBack){
			var thisCount=showCount2 ? count1 : count2;
		  var sb="00000000".concat(thisCount.toString(2)).slice(-8).split('');
		  sb.forEach(function(d,i){
		    if(d=='1'){
					if(showCount2){
						leds.setPixel(i,255,40,40,0.1);
					} else {
						leds.setPixel(i,0,0,255,0.1);
					}
		    }
		  });
		}
	}

	function setBackground(){
		if(blankBack){
			leds.setAllPixels(0,40,0,0.1);
		} else {
			leds.setAllPixels(0,200,40,0.1);
		}
	}

	function clear(){
		if(!moduleAvailable('node-blinkt')){
			console.log("Not running on the Pi or Blinkt not available");
		}else {
	  	console.log("clear");
	  	leds.setAllPixels(0,0,0,0);
	  	leds.sendUpdate();
		}
	}

	this.setCounts=function(c1, c2){
		count1=c1;
		count2=c2;
	}

}
