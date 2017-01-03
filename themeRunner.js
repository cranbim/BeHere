module.exports={
	//exportname: internalName
	ThemeRunner: ThemeRunner
};

var nextThemeId=0;

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
		themes[0]=new Theme(10);
		themes[1]=new Theme(10);
		themes[2]=new Theme(10);
	}

	this.buildMetaData=function(){
		var meta={};
		meta.themes=[];
		themes.forEach(function(t){
			var theme={
				id: t.id,
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
		}
	};

	function switchTheme(){
		lastTheme=currentTheme;
		currentTheme=nextTheme;
		nextTheme++;
		if(nextTheme>=themes.length) nextTheme=0;
		nowTheme=themes[currentTheme];
		nowTheme.init();
	}
}


function Theme(ttl){
	this.id=nextThemeId++;
	this.ttl=ttl;
	console.log("New Theme: "+this.id);

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