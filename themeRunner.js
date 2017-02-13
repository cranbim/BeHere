module.exports={
	//exportname: internalName
	ThemeRunner: ThemeRunner
};

//var themeMaster=require('./themes.js');
// var narrative1=themeMaster.narrative1;
// var themeLoader=themeMaster.themeLoader;

var nextThemeId=0;

var tm=require('./themeMaster.js');


function ThemeRunner(){
	var themes=[];
	var narrative;
	var lastTheme=-1;
	var currentTheme=-1;
	var nextTheme=0;
	var nowTheme=null;
	var actualTheme=null;
	var currentThemeName="";
	var changingTheme=false;

	//var themeTTL=0;
	console.log("Theme Runner started");

	var themeMaster=new tm.ThemeMaster();
	var narrative1=themeMaster.narrative1;
	var themeLoader=themeMaster.themeLoader;

	var nextThemeId=0;

	loadThemes();
	loadNarrative();

	// function oldloadThemes(){
	// 	for(var key in themeLoader){
	// 		themes.push(new GenericServerTheme(key));
	// 		// themes.push(new themeLoader[key].func(key, themeLoader[key].ttl));
	// 	}
	// 	console.log(themes);
	// }

	this.reloadThemes=function(){
		tm=require('./themeMaster.js');
		themeMaster=new tm.ThemeMaster();
		narrative1=themeMaster.narrative1;
		themeLoader=themeMaster.themeLoader;
		loadThemes();
		loadNarrative();
		nextTheme=0;
		actualTheme.endMe();
	}

	function loadThemes(){
		themeLoader.forEach(function(theme){
			themes.push(new GenericServerTheme(theme));
		});
		console.log(themes);
	}

	function loadNarrative(){
		narrative=narrative1.sequence;
		//console.log(narrative);
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

	this.run=function(heartbeat){
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
			return {
				index: currentTheme,
				name: currentThemeName,
				params: nowTheme.params
				};
			// return currentThemeName;
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