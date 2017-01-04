// pr_themes.js
// display themes for plasma ring

var nextThemeId=0;

//Object for client side running the themes and swicthing
function ThemeRunner(w,h){
	console.log("New theme runner "+w+" "+h);
	var themes=[];
	var currentTheme=-1;
	var nextTheme=0;
	var lastTheme=-1;
	var nowTheme=null;

	var themeTTL=0;


	var themeLoader={
		themeOne: ThemeDust,
		themeTwo: ThemeSpark,
		themeThree: Theme3
	};

	loadThemes(w,h);


	function loadThemes(w,h){
		// themes[0]=new Theme1(w,h);
		// themes[1]=new Theme2(w,h);
		// themes[2]=new Theme3(w,h);
		for(var key in themeLoader){
			themes.push(new themeLoader[key](key, w,h));
			console.log(themes.length+" "+key);
		}
	}

	this.switchTheme=function(i){
		nowTheme=themes[i];
		nowTheme.init();
	};

	this.test=function(){
		console.log("ThemeRunner is OK");
	};

	this.run=function(blobPos){
		if(nowTheme) nowTheme.run(blobPos);
	};
}

function Theme1(name, w,h){
	this.id=nextThemeId++;
	this.name=name;
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
  }
  
  this.init=function(){
    initTheme();
  };

	this.run=function(blobPos){
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

function Theme2(name, w,h){
	this.id=nextThemeId++;
	this.name=name;
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
  }
  
  this.init=function(){
    initTheme();
  };

	this.run=function(blobPos){
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
			rectMode(CENTER);
			rect(0,0,e*2,e*2);
			//ellipse(0,0,e*2,e*2);
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

function Theme3(name, w,h){
	this.id=nextThemeId++;
	this.name=name;
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
  }
  
  this.init=function(){
    initTheme();
  };

	this.run=function(blobPos){
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
			ellipse(0,0,e*2,e/2);
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

//*****************************
// First Real Theme
//*****************************

function ThemeDust(name, w,h){
  this.id=nextThemeId++;
  this.name=name;
  //this.lifeSpan=0;
  var dusts=[];
  //var points=[{x:100,y:100},{x:200,y:100}];

  initTheme();

  function initTheme(){
    dusts=[];
    //dusts[1]=new Dust();
    // for(var i=0; i<numDust; i++){
    //   dust[i]=new Mote(w/2, h/2);
    // }
  }
  
  this.init=function(){
    initTheme();
  };

  this.run=function(blobPos){
		while(blobPos.length>dusts.length){
			var d=new Dust();
			dusts.push(d);
		}
		// blobPos.forEach(function(p,i){
		// 	dusts[i].run(p);
		// });
		dusts.forEach(function(d,i){
			d.run(blobPos[i]);
		});
  };

  function Dust(){
		var dust=[];
		var numDust=50;

		this.run=function(p){
			if(p){
				if(dust.length<numDust){
					dust.push(new Mote(p.x,p.y));
				}
			}
			for(var i=dust.length-1; i>=0; i--){
				dust[i].show();
				if(!dust[i].update()){
					dust.splice(i,1);
				}
			}
};
  }

  function Mote(x,y){
    var numSprinkles=5;
    var vel=p5.Vector.random2D();
    var acc=createVector(0,-0.1);
    var pos=createVector(x,y);
    var drag=0.95;
    var r=1;
    var grow=1;
    var initVel=2;
    var maxR=random(20,40)+10;
    var col=random(10)<4?255:180;
    vel.mult(initVel);
    
    // for(var i=0; i<numSprinkles; i++){
      
    // }
    
    this.update=function(){
      vel.mult(drag);
      vel.add(acc);
      pos.add(vel);
      r+=grow;
      return (r<=maxR);
    };
    
    this.show=function(){
      push();
      translate(pos.x, pos.y);
      stroke(col, map(r,0,maxR*2,255,10));
      noFill();
      if(r<maxR*0.25){
        ellipse(0,0,r*2,r*2);
      } else {
        for(var i=0; i<numSprinkles; i++){
          rotate(TWO_PI/numSprinkles);
          ellipse(r,0,r/5,r/5);
          if(r>maxR*0.75){
            ellipse(r,0,r/10*r/10,r/10*r/10);
          }
        }
      }
      pop();
    };

  }
  
}

//*****************************
// Second Real Theme
//*****************************


function ThemeSpark(name, w,h){
  this.id=nextThemeId++;
  this.name=name;
  //this.lifeSpan=0;
  var sparklers=[];

  initTheme();

  function initTheme(){
    sparklers=[];
  }
  
  this.init=function(){
    initTheme();
  };

  this.run=function(blobPos){
    while(blobPos.length>sparklers.length){
      var s=new Sparkler();
      sparklers.push(s);
    }
    // blobPos.forEach(function(p,i){
    //  dusts[i].run(p);
    // });
    sparklers.forEach(function(s,i){
      s.run(blobPos[i]);
    });
  };



  function Sparkler(){
    var sparks=[];
    var r,g,b,rt,gt,bt;
    var nx, ny, px, py;


    r=100; g=80; b=200;
    rt=50; gt=255; bt=0;

    this.run=function(bpos){
      for(var i=sparks.length-1; i>=0; i--){
        sparks[i].show();
        if(!sparks[i].run()) sparks.splice(i,1);
      }
      shiftCol();
      if(bpos){
        px=nx; py=ny;
        nx=bpos.x; ny=bpos.y;
        if(random(10)<4){
          var travel=createVector(nx, ny);
          travel.sub(px, py);
          var pos=createVector(nx, ny);
          var s=new Spark(pos, travel, r, g, b);
          sparks.push(s);
        }
      }
    };



    function shiftCol(){
      r+=(rt-r)/10;
      if(abs(rt-r)<2) rt=random(100,255);
      g+=(gt-g)/10;
      if(abs(gt-g)<2) gt=random(100,255);
      r+=(bt-b)/10;
      if(abs(bt-b)<2) bt=random(100,255);
    }

  }

  function Spark(pos, travel, mr, mg, mb){
    travel.normalize();
    var rad=random(0.5,5);
    travel.mult(rad/2);
    var ttl=100;
    var trail=[];
    var maxTrail=20;
    var width=4;
    var alpha=255;
    // r+=random(50,150);
    // r=r%255;
    // r=255;
    
    this.show=function(){
      trail.forEach(function(spot){
        push();
        alpha=map(ttl,100,0,255,50);
        fill(color(random(50,200),mg,mb,alpha));
        //fill(255,alpha);
        noStroke();
        translate(spot.pos.x, spot.pos.y);
        ellipse(0,0,rad,rad);
        pop();
      });
    };
    
    this.run=function(){
      var p=pos.copy();
      var spot={
        pos:p
      };
      trail.unshift(spot);
      if(trail.length>maxTrail) trail.pop();
      if(ttl<maxTrail){
        trail.pop();
      } else {
        pos.add(travel);
        if(random(10)<4){
          var v=p5.Vector.random2D().mult(2);
          pos.add(v);
        }
      }
      //pos.x+=1;
      ttl--;
      return ttl>0;
    };
  }
}


