// themes.js
// display themes for plasma ring
// Dave Webb, Carnbim 2016-2017

//global counter for nextTheme
var nextThemeId=0;
var themesRingLength=0;

//Object for client side running the themes and swicthing
function ThemeRunner(w,h,dd){
	console.log("New theme runner "+w+" "+h);
	var themes=[];
  var themesLoadedFromServer=false;
	var currentTheme=-1;
	var nextTheme=0;
	var lastTheme=-1;
	var nowTheme=null;
  var absParamPos=0;
	var themeTTL=0;
  var isBlobController=false;
  var deviceData=dd;
  this.themeRendersBackground=false;


 
  var themeArrayBase=[
    "ThemeDefault"
  ];

 
  loadThemes(w,h);

  this.checkThemes=function(){
    if(!themesLoadedFromServer){
      // console.log("I have no themes!");
      socket.emit('getServerThemes',{});
    } else {
      // console.log("I have my server themes!");
    }
  };

  this.loadServerThemes=function(data){
    console.log("Themes received from server");
    loadThemesFromServer(data.themes, w, h);
  };

	//loadThemesFromServer(themesFromServer, w,h);

  function loadThemesFromServer(themesArray, w, h){
    //themeArray=themeArrayBase.concat(themesArray);
    if(themesLoadedFromServer){
      console.log("Themes Already Loaded");
    } else {
      themesArray.forEach(function(t){
        console.log("st>> "+t);
        var themeInstance=new ThemeInstance(t, w, h, deviceData, window[t]);
        themes.push(themeInstance);// new ThemeInstance(t, w, h, t));
      });
      console.log("Server Themes Loaded");
    }
    // loadThemes(w,h);
    themesLoadedFromServer=true;
  }

  function loadThemes(w,h){
    themeArrayBase.forEach(function(t){
      var themeInstance=new ThemeInstance(t, w, h, deviceData, window[t]);
      themes.push(themeInstance);// new ThemeInstance(t, w, h, t));
    });
    console.log("Default Theme Loaded");
    // console.log(themes);
  }

	function noloadThemes(w,h){
		for(var key in themeLoader){
      // themes.push(new themeLoader[key](key, w,h));
      themes.push(new ThemeInstance(key, w,h, themeLoader[key]));
		}
    console.log("Themes Loaded");
    // console.log(themes);
	}

  this.setCurrentParams=function(absPos){
    absParamPos=absPos;
  };

  this.themeByName=function(themeName){
    var t=themes.find(function(theme){
      return theme.name===themeName;
    });
    if(!t){
      t=themes[0];
    }
    return t;
  };

	this.switchThemeByIndex=function(i){
    //exit old theme first
    if(nowTheme){
      if(typeof(nowTheme.shutdown)!=='undefined'){
        console.log("Theme shutdown");
        nowTheme.shutdown();
      } else {
        console.log("Theme has no shutdown");
      }
    }
		nowTheme=themes[i];
		console.log("Current Theme: "+nowTheme.id+" "+nowTheme.name);
		nowTheme.init();
	};

  this.themeControlsBlobs=function(){
    return isBlobController;
  };

  this.switchThemeByName=function(themeName, params){
    //exit old theme first
    console.log("Switch to theme: "+themeName);
    if(nowTheme){
      if(typeof(nowTheme.shutdown)!=='undefined'){
        console.log("Theme shutdown");
        nowTheme.shutdown();
      } else {
        console.log("Theme has no shutdown");
      }
    }
    nowTheme=this.themeByName(themeName);
    isBlobController=nowTheme.isBlobController;
    this.themeRendersBackground=nowTheme.themeRendersBackground;
    console.log("Current Theme: "+nowTheme.id+" "+nowTheme.name);
    // console.log(params);
    nowTheme.init(params);
  };

	this.run=function(blobs, ringLen, blobPos, soundOn){
    themesRingLength=ringLen;
    var themeEnding;
    if(!nowTheme){
      this.switchThemeByName('ThemeDefault');
      socket.emit('gimmeTheme',{device: id});
    }
		if(nowTheme) {
      nowTheme.runBlobs(blobs);
      themeEnding=nowTheme.run(blobPos, soundOn);
      if(!hideMeta){
        fill(200);
        textSize(20);
        noStroke();
        fill(200,200);
        text(nowTheme.name,100,100);
      }
    }
    return themeEnding;
	};
}


//*****************************
// Theme Instantiator
//*****************************

function ThemeInstance(name, w, h, dd, instantiator){
  this.id=nextThemeId++;
  this.name=name;
  this.deviceData=dd;
  var params={};
  
  var instance;

  initTheme();
  this.isBlobController=instance.hasOwnProperty('runBlobs');
  this.themeRendersBackground=instance.hasOwnProperty('renderBackground');
  console.log(this.name+" loaded");
  // console.log("renders background: "+this.themeRendersBackground);

  function initTheme(paramsIn){
    // console.log("!!!!");
    // console.log(instantiator);
    instance=new instantiator(w,h);
    params=paramsIn;
    // console.log("!!!! Params");
    // console.log(params);
  }

  this.init=function(paramsIn){
    initTheme(paramsIn);
  };

  this.runBlobs=function(blobs){
    if(this.isBlobController){
      instance.runBlobs(blobs);
    }
  };

  this.blobsByNarrative=function(blobPos){
    if(params){
      if(params.hasOwnProperty('blobs')){
        if(params.blobs.hasOwnProperty('clientMin')){
          if(params.blobs.clientMin>blobPos.length){
            for(var i=blobPos.length; i<params.blobs.clientMin; i++){
              // newClick(random(devWidth)+marginLeft+myStartX, random(devHeight));
              console.log(dd.geometry.startX);
              var x=random(w)+this.deviceData.geometry.startX+this.deviceData.geometry.marginLeft;
              var y=random(h);
              socket.emit("newBlob",{device:id, x:x, y:y});
              console.log("New blob from Narrative");
            }
          }
          if(params.blobs.clientMax<blobPos.length){
            console.log("Remove "+(blobPos.length-params.blobs.clientMax)+" blobs, as per Narrative");
            //a bit of a naughty call to an object defined at gobal scope
            //and not passed down to themes explicitly
            myBlobs.limit(params.blobs.clientMax);
          }
        }
      }
    }
  };

  this.run=function(blobPos, soundOn){
    this.blobsByNarrative(blobPos);
    return instance.run(blobPos, soundOn, params);
  };

}




//*****************************
// ThemeDefault
//*****************************


  function ThemeDefault(w,h){
  // function Filler(){
    var incX=3;
    var incY=2;
    var message="No Theme";
    textSize(w/message.length);
    var tw=textWidth(message);
    var ts=tw/message.length;
    var x=w/2-tw/2;
    var y=h*0.7;
    

    this.run=function(){
      push();
      background(120,0,20);
      textSize(ts);
      fill(200,20,120);
      text(message,x,y);
      x+=incX;
      y+=incY;
      if(x<0 || x>(w-tw)) incX*=-1;
      if(y<ts || y>height) incY*=-1;
      pop();
    };
  }






