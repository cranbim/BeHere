module.exports={
	//exportname: internalName
	ThemeRunner: ThemeRunner
};

//var themeMaster=require('./themes.js');
// var narrative1=themeMaster.narrative1;
// var themeLoader=themeMaster.themeLoader;

var nextThemeId=0;

//var tm=require('./themeMaster.js');

var fs = require('fs');



function ThemeRunner(){
	var self=this;
	var themes=[];
	var themesLoaded=false;
	var allThemes;
	var firstLoad=true;
	var narrative;
	var lastTheme=-1;
	var currentTheme=-1;
	var nextTheme=0;
	var nowTheme=null;
	var actualTheme=null;
	var currentThemeName="";
	var changingTheme=false;

	this.themeLoader=[];

	//var themeTTL=0;
	console.log("Theme Runner started");

	var nextThemeId=0;

	loadThemes();
	loadNarrative();


	this.reloadThemes=function(){
		themesLoaded=false;
		loadNarrative();
	};


	function loadThemes(){
		fs.readFile('./themes.json', readThemes);
	}

	function loadNarrative(){
		fs.readFile('./narrative.json', readNarrative);
	}

	function readThemes(err, data) {
    if (err) throw err;
    var tm = JSON.parse(data);
    allThemes=tm.themeLoader;
    self.themeLoader=allThemes;
    allThemes.forEach(function(theme){
			themes.push(new GenericServerTheme(theme));
		});
	}

	function readNarrative(err,data){
    if (err) throw err;
    var tm = JSON.parse(data);
    narrative=tm.narrative1.sequence;
    themesLoaded=true;
    if(firstLoad){
    	firstLoad=false;
    } else {
	    nextTheme=0;
			actualTheme.endMe();
		}		
	}


	function getThemeByName(name){
		console.log(name);
		var found=themes.find(function(t){
			return t.name===name;
		});
		console.log(found);
		return found;
		//handle unmatched name with a generic theme???
	}

	this.getThemes=function(){
		var themeList=[];
		themes.forEach(function(t){
			themeList.push(t.id);
		});
		return themeList;
	};

	this.buildMetaData=function(){
		var meta={};
		meta.themes=[];
		themes.forEach(function(t){
			var theme={
				id: t.id,
				name: t.name,
				other: "stuff"
			};
			meta.themes.push(theme);
		});
		meta.current={
			index: currentTheme,
			ttl: nowTheme.ttl
		};
		return meta;
	};

	this.buildNarrativeData=function(){
		var meta={};
		meta.themes=[];
		narrative.forEach(function(t){
			var theme={
				name: t.name,
				duration: t.duration,
				other: "stuff"
			};
			meta.themes.push(theme);
		});
		meta.current={
			name: currentThemeName,
			ttl: actualTheme.ttl
		};
		return meta;
	};

	this.clientDrivenSwitch=function(){
		if(!changingTheme){
			console.log("Client forcing theme end");
			changingTheme=true;
			actualTheme.endMe();
		}
	};

	this.run=function(heartbeat, parameters){
		if(themesLoaded){
			if(!actualTheme){
				switchTheme();
			}
			if(!actualTheme.run()){
				///at end of counter theme life
				if(nowTheme.params.hasOwnProperty('beat')){
					nowTheme.params.beat=true;
				}
				switchTheme();
				//at start of counter theme life
				if(nowTheme.params.hasOwnProperty('beat')){
					if(nowTheme.params.beat===true) nowTheme.params.beat=heartbeat;
				}
				if(nowTheme.params.hasOwnProperty('seed')){
					nowTheme.params.seed=1+Date.now()%100;
				}
				if(nowTheme.params.hasOwnProperty('resetParamLoop')){
					if(nowTheme.params.resetParamLoop){
						parameters.reset(2);
						//nowTheme.params.resetParamLoop=false;
					}
				}
				return {
					index: currentTheme,
					name: currentThemeName,
					params: nowTheme.params
					};
				// return currentThemeName;
			}
		} else {
			console.log("Themes not loaded yet");
		}
		return {index: -1, name:"none"};
	};

	this.getCurrentTheme=function(heartbeat){
		if(actualTheme){
			//this is specific to one theme, so need away to embed it in theme def
			if(nowTheme.params.hasOwnProperty('beat')){
				if(nowTheme.params.beat===true) nowTheme.params.beat=heartbeat;
			}
			return {
				index: currentTheme,
				name: currentThemeName,
				params: nowTheme.params
				};
		}	else {
			return {index: -1, name:"none"};
		}
	};

	// function OLDswitchTheme(){
	// 	lastTheme=currentTheme;
	// 	currentTheme=nextTheme;
	// 	nextTheme++;
	// 	if(nextTheme>=themes.length) nextTheme=0;
	// 	nowTheme=themes[currentTheme];
	// 	currentThemeName=nowTheme.name;
	// 	console.log("Switch theme to" + currentThemeName);
	// 	nowTheme.init();
	// 	changingTheme=false;
	// }

	function switchTheme(){
		lastTheme=currentTheme;
		currentTheme=nextTheme;
		nextTheme++;
		if(nextTheme>=narrative.length) nextTheme=0;
		nowTheme=narrative[currentTheme];
		currentThemeName=nowTheme.name;
		console.log("Switch theme to" + currentThemeName);
		actualTheme=getThemeByName(currentThemeName);
		actualTheme.init(nowTheme.duration, nowTheme.params);
		// changingTheme=false;
		setTimeout(delayedClearThemeChange,500);
	}
}

function delayedClearThemeChange(){
	changingTheme=false;
}


function GenericServerTheme(name){
	this.id=nextThemeId++;
	this.name=name;
	this.ttl=0;
	console.log("New Theme: "+this.id+" "+this.name);

	this.init=function(duration, themeParams){
		this.ttl=duration;
		if(themeParams.beat){

			//somehow send parameter to the client
		}
		console.log("Theme "+this.id+" loaded and initialised");
	};

	this.endMe=function(){
		this.ttl=0;
	};

	this.run=function(){
		this.ttl--;
		if(true/*this.ttl%10===0*/){
			console.log("Theme "+this.id+" ttl: "+this.ttl);
		}
		return this.ttl>0;
	};
}


// 