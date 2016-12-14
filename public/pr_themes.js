// pr_themes.js
// display themes for plasma ring


//Object for client side running the themes and swicthing
function ThemeRunner(w,h){
	console.log("New theme runner "+w+" "+h);
	var themes=[];
	var currentTheme=-1;
	var nextTheme=0;
	var lastTheme=-1;
	var nowTheme=null;

	var themeTTL=0;

	loadThemes(w,h);

	function loadThemes(w,h){
		themes[0]=new Theme1(w,h);
		themes[1]=new Theme1(w,h);
		themes[2]=new Theme1(w,h);
	}

	this.test=function(){
		console.log("ThemeRunner is OK");
	};

	this.run=function(){
		if(themeTTL<=0){
			//loadnexttheme
			lastTheme=currentTheme;
			currentTheme=nextTheme;
			nextTheme++;
			if(nextTheme>=themes.length) nextTheme=0;
			nowTheme=themes[currentTheme];
			nowTheme.init();
			themeTTL=nowTheme.lifeSpan;
		}
		nowTheme.run();
		themeTTL--;
	};
}

function Theme1(w,h){
	this.lifeSpan=500; //frames or what?
	console.log("New Theme1 "+w+" "+h);
	//theme specific vars
	var maxR=width*0.6;
	var rInc=maxR/this.lifeSpan*4;
	var rNow=10;
	var echoes=[];
	var maxEchoes=20;
	var alpha=255;
	//var r,g,b;
	var r=random(10,250);
	var g=random(10,250);
	var b=random(10,250);
	
	initTheme();

  function initTheme(){
    rNow=10;
	  echoes=[];
	  maxEchoes=20;
	  alpha=255;
	  // r=random(10,250);
	  // g=random(10,250);
	  // b=random(10,250);
  }
  
  this.init=function(){
    initTheme();
  }

	this.run=function(){
		this.show();
		this.update();
	};

	this.show=function(){
		noFill();
		push();
		translate(w/2, h/2);
		echoes.forEach(function(e, i){
			alpha=map(i,0,maxEchoes,100,255);
			stroke(r,g,b, alpha);
			ellipse(0,0,e*2,e*2);
		});
		pop();
	};

	this.update=function(){
		if(echoes.length>=maxEchoes){
			echoes.shift();
		}
		echoes.push(rNow);
		rNow+=rInc;
		if(rNow>maxR || rNow<0) rInc*=-1;
	};
}