module.exports={
	//exportname: internalName
	ThemeRunner: ThemeRunner
};

var nextThemeId=0;

var themeLoader={
	themeOne: {
		func: Theme1,
		ttl: 10
	},
	themeTwo: {
		func: Theme2,
		ttl: 10
	},
	themeThree: {
		func: Theme3,
		ttl: 5
	},
};

function ThemeRunner(){
	var themes=[];
	var lastTheme=-1;
	var currentTheme=-1;
	var nextTheme=0;
	var nowTheme=null;

	//var themeTTL=0;
	console.log("Theme Runner instantiated");
	loadThemes();

	function loadThemes(){
		// themes[0]=new Theme(10);
		// themes[1]=new Theme(10);
		// themes[2]=new Theme(10);
		for(var key in themeLoader){
			themes.push(new themeLoader[key].func(key, themeLoader[key].ttl));
		}
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

	this.run=function(){
		if(!nowTheme){
			switchTheme();
		}
		if(!nowTheme.run()){
			switchTheme();
			return currentTheme;
		}
		return -1;
	};

	function switchTheme(){
		lastTheme=currentTheme;
		currentTheme=nextTheme;
		nextTheme++;
		if(nextTheme>=themes.length) nextTheme=0;
		nowTheme=themes[currentTheme];
		console.log(themes[currentTheme].name);
		nowTheme.init();
	}
}



function Theme1(name, ttl){
	this.id=nextThemeId++;
	this.name=name;
	this.ttl=ttl;
	console.log("New Theme: "+this.id+" "+this.name);

	this.init=function(){
		this.ttl=ttl;
		console.log("Theme "+this.id+" loaded and initialised");
	};

	this.run=function(){
		this.ttl--;
		if(true/*this.ttl%10===0*/){
			console.log("Theme "+this.id+" ttl: "+this.ttl);
		}
		return this.ttl>0;
	};
}

function Theme2(name, ttl){
	this.id=nextThemeId++;
	this.name=name;
	this.ttl=ttl;
	console.log("New Theme: "+this.id+" "+this.name);

	this.init=function(){
		this.ttl=ttl;
		console.log("Theme "+this.id+" loaded and initialised");
	};

	this.run=function(){
		this.ttl--;
		if(true/*this.ttl%10===0*/){
			console.log("Theme "+this.id+" ttl: "+this.ttl);
		}
		return this.ttl>0;
	};
}

function Theme3(name, ttl){
	this.id=nextThemeId++;
	this.name=name;
	this.ttl=ttl;
	console.log("New Theme: "+this.id+" "+this.name);

	this.init=function(){
		this.ttl=ttl;
		console.log("Theme "+this.id+" loaded and initialised");
	};

	this.run=function(){
		this.ttl--;
		if(true/*this.ttl%10===0*/){
			console.log("Theme "+this.id+" ttl: "+this.ttl);
		}
		return this.ttl>0;
	};
}

