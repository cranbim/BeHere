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


	// var themeLoader={
	// 	ThemePlasma1: ThemePlasma1, //Theme1,
	// 	ThemeRepelWobble:  ThemeRepelWobble, //Theme2,
	// 	ThemeBounceRings: ThemeBounceRings, //ThemeNoise1, //Theme3 //ThemeNoise1
 //    ThemeFlipper1: ThemeFlipper1,
 //    ThemePsychaRing: ThemePsychaRing,
 //    ThemeBounceChain: ThemeBounceChain,
 //    ThemeSparker: ThemeSparker
	// };

  var themeLoader={
    ThemePlasma1: ThemePlasma1, //Theme1,
    ThemeFlyThrough: ThemeFlyThrough,
    ThemeRepelWobble:  ThemeRepelWobble, //Theme2,
    ThemeBounceRings: ThemeBounceRings, //ThemeNoise1, //Theme3 //ThemeNoise1
    ThemeFlipper1: ThemeFlipper1,
    ThemePsychaRing: ThemePsychaRing,
    ThemeBounceChain: ThemeBounceChain,
    ThemeSparker: ThemeSparker,
    ThemeDust: ThemeDust,
    ThemeNoise1: ThemeNoise1,
    ThemeTVStatic: ThemeTVStatic,
    ThemeHairBall: ThemeHairBall,
    ThemeSwisher: ThemeSwisher,
    ThemeCracker: ThemeCracker
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
    console.log(themes);
	}

  this.themeByName=function(themeName){
    console.log("Matching"+themeName);
    var t=themes.find(function(theme){
      console.log(theme.name);
      return theme.name===themeName;
    });
    console.log(t);
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

  this.switchThemeByName=function(themeName){
    //exit old theme first
    if(nowTheme){
      if(typeof(nowTheme.shutdown)!=='undefined'){
        console.log("Theme shutdown");
        nowTheme.shutdown();
      } else {
        console.log("Theme has no shutdown");
      }
    }
    nowTheme=this.themeByName(themeName);
    console.log("Current Theme: "+nowTheme.id+" "+nowTheme.name);
    nowTheme.init();
  };

	this.test=function(){
		console.log("ThemeRunner is OK");
	};

	this.run=function(blobPos){
		if(nowTheme) nowTheme.run(blobPos);
		fill(200);
		if(nowTheme) {
      textSize(20);
      noStroke();
      fill(200,200);
      text(nowTheme.name,100,100);
    }
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
		var numDust=40;

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
    var maxSparks=20;


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
        if(random(10)<4 && sparks.length<maxSparks){
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
    var rad=random(3,12);
    travel.mult(rad/2);
    var ttlMax=50;
    var ttl=50;
    var trail=[];
    var maxTrail=10;
    var width=4;
    var alpha=255;
    // r+=random(50,150);
    // r=r%255;
    // r=255;
    
    this.show=function(){
      trail.forEach(function(spot){
        push();
        alpha=map(ttl,ttlMax,0,255,50);
        fill(color(random(150,250),mg,mb,alpha));
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


//*****************************
// Third Real Theme
//*****************************


function ThemeHypno(name, w,h){
  this.id=nextThemeId++;
  this.name=name;
  //this.lifeSpan=0;
  var hypnos=[];

  initTheme();

  function initTheme(){
    hypnos=[];
  }
  
  this.init=function(){
    initTheme();
  };

  this.run=function(blobPos){
    while(blobPos.length>hypnos.length){
      var h=new HypnoRing(w,h);
      hypnos.push(h);
    }
    // blobPos.forEach(function(p,i){
    //  dusts[i].run(p);
    // });
    hypnos.forEach(function(h,i){
			if(blobPos[i]){
				h.run(blobPos[i]);
      }
    });
  };


  function HypnoRing(w,h){

    var rings=[];
    var numRings;
    var a=0;
    var aInc;
    var rGrow=4;
    var gap=random(10,40);
    var thick=5;
    var rot=0;
    var rotInc;
    var running=true;

    rotInc=PI/random(20,50);
    numRings=floor(random(4,10));//w*1.4/2/gap;
    aInc=PI/10;
    for(var i=0; i<numRings; i++){
      var r=new Ring(gap+i*gap, PI/numRings*i);
      rings.push(r);
    }
    
    this.run=function(pos) {
      rings.forEach(function(r,i){
        r.show(pos.x, pos.y, rot+rotInc*i*10);
        if(!r.grow(a)) r.reset();
      });
      rot+=rotInc;
      if(running){
        a+=aInc;
      }
    };

    function Ring(rInit, phase){
      var x=width/2;
      var y=height/2;
      var r=rInit;
      
      this.grow=function(a){
        r+=sin(a+phase)*rGrow;//+0.5;
        return (r<=width*1.4/2);
      };
      
      this.show=function(x, y, rot){
        push();
        translate(x,y);
        stroke(200);
        strokeWeight(thick);
        noFill();
        //ellipse(0,0,r*2,r*2);
        myRing(0,0,r,rot);
        pop();
      };
      
      this.reset=function(){
        r=gap;
      };
    }

    function myRing(x,y,r,rot){
      var segs=40;
      var maxThick=10;
      var aInc=TWO_PI/segs;
      var a=0;//TWO_PI;
      push();
      translate(x,y);
      rotate(rot);
      //var px=0; var py=0;
      var px=cos(a)*r;
      var py=sin(a)*r;
      for(var i=0; i<segs; i++){
        a+=aInc;
        var rx=cos(a)*r;
        var ry=sin(a)*r;
        strokeWeight((sin(a)*maxThick+maxThick+1)*r/width*2);
        line(px,py,rx,ry);
        px=rx;
        py=ry;
      }
      pop();
    }
  }
}

//*****************************
// Forth Real Theme
//*****************************


function ThemeNoise1(name, w,h){
  this.id=nextThemeId++;
  this.name=name;
  //this.lifeSpan=0;
  var noiseSet;

  initTheme();

  function initTheme(){
    noiseSet=new NoiseStripes();
  }
  
  this.init=function(){
    initTheme();
  };

  this.run=function(blobPos){
    noiseSet.run(blobPos);
    // while(blobPos.length>noiseSet.length){
    //   var n=new noiseStripes();
    //   noiseSet.push(n);
    // }
    // blobPos.forEach(function(p,i){
    //  dusts[i].run(p);
    // });
    // noiseSet.forEach(function(n,i){
    //   n.run(blobPos[i]);
    // });
  };



  function NoiseStripes(){

    var a=0;
    var aInc=0;//0.01;
    var field;
    var lines;
    var lineWidth=5;
    var amplitude=5;
    var avgX=100;
		var avgY=100;
    var numNoiseStepsX=20;
    var numLines=20;

    field=new NoiseField(numNoiseStepsX,0.04);
    lines=new Lines(numNoiseStepsX, numLines);
    smooth();
  

    this.run=function(bPos) {
    	var nAvgX=0;
    	var nAvgY=h/2;
			var count=bPos.length;
			if(bPos){
				if(bPos.length>0){
					nAvgY=bPos.reduce(function(p,n){
						return p+n.y;
					},0)/count;
					nAvgX=bPos.reduce(function(p,n){
						return p+n.x;
					},0)/count;
					// avgX+=(nAvgX-avgX)/10;
					// avgY+=(nAvgY-avgY)/10;
				} else {
					var nAvgX=0;
    			var nAvgY=h/2;
				}
			}else {
				var nAvgX=0;
    		var nAvgY=h/2;
			}
			// if(nAvgY<1)nAvgY=h/2;
			// if(nAvgX<1)nAvgX=w/2;
			avgX+=(nAvgX-avgX)/10;
			avgY+=(nAvgY-avgY)/10;
			//console.log(">>> "+count+" >>> "+avgY);
			// refresh(avgY, avgX);
			refresh(avgX, avgY);
			//field.show();
			lines.show(field, amplitude);
			field.shift(0.1,0.5);
			field.update();
    };

    function refresh(x, y){
      var near=dist(x,0,w/2,0);
      amplitude=map(near,0,w/2,numLines*4,1);
      lineWidth=map(y,0,h,0.1,50);
    }

    function Lines(nX, nY){
      var stepX=width/nX;
      var stepY=height/nY;
      var h=nY;//floor(height/stepY);
      var w=nX;//floor(width/stepX);
      
      this.show=function(field, amp){
        push();
        translate(width/2, height/2);
        rotate(a);
        translate(-width/2, -height/2);
        translate(0,-amp*5);
        strokeWeight(lineWidth);
        stroke(255,120,0,100);
        noFill();
        for(var y=0; y<h; y++){
          beginShape();
          var f;
          for(var x=0; x<w; x++){
            f=field.noiseAtLerp(x*stepX,y*stepY);
            vertex(x*stepX,y*stepY+f*stepY*amp);
          }
          vertex(x*stepX+1,y*stepY+f*stepY*amp);
          endShape();
        }
        pop();
        a+=aInc;
      };
    }

    function NoiseField(wx, noiseLevel){
      var step=floor(width/wx);
      var w=wx; //floor((width+step)/step);
      var h=floor(height/step);
      var field=[];
      var nStep=noiseLevel;
      var nXOff=0;
      var nYOff=0;
      
      for(var y=0; y<h; y++){
        var row=[];
        for(var x=0; x<w; x++){
          var n=noise(x*nStep+nXOff, y*nStep+nYOff);
          row.push(n);
        }
        field.push(row);
      }
      
      this.noiseAt=function(x,y){
        var xf=floor(x/step);
        var yf=floor(y/step);
        return field[yf][xf];
      };
      
      this.noiseAtLerp=function(x,y){
        var xf=floor(x/step);
        var xl=x%step;
        var yf=floor(y/step);
        var yl=y%step;
        var xn, yn;
        var res=0;
        if(field){
          if(yf>=field.length) yf-=1;
          if(yf+1>=field.length)yn=yf; else yn=yf+1;
          if(yn>=field.length) yn-=1;
          if(xf>=field[yf].length) xf-=1;
          if(xf+1>=field[yn].length)xn=xf; else xn=xf+1;
          // console.log("NFx: "+step+" "+xf+" "+xl+" "+xn);
          // console.log("NFy: "+step+" "+yf+" "+yl+" "+yn);
          // console.log("NF "+field.length);
          // console.log("NF "+field[yn].length);
          // if(yf>=field.length)yf=field.length-1;
          var noiseHere=field[yf][xf];
          var noiseXNext=field[yf][xn];
          var noiseYNext=field[yn][xf];
          var lerpX=lerp(noiseHere, noiseXNext, xl/step);
          var lerpY=lerp(noiseHere, noiseYNext, yl/step);
          res=(lerpX+lerpY)/2;
        }
        return res;
      };
      
      this.update=function(){
        field=[];
        for(var y=0; y<h; y++){
          var row=[];
          for(var x=0; x<w; x++){
            var n=noise(x*nStep+nXOff, y*nStep+nYOff);
            row.push(n);
          }
          field.push(row);
        }
      };
      
      this.show=function(){
        for(var y=0; y<field.length; y++){
          for(var x=0; x<field[y].length; x++){
            var c=map(field[y][x], 0, 1, 0, 255);
            noStroke();
            fill(c);
            rect(x*step, y*step, step, step);
          }
        }
      };
      
      this.shift=function(x,y){
        nXOff+=nStep*x;
        nYOff+=nStep*y;
      };
    }
  }
}

//*****************************
// Forth Real Theme
//*****************************


function ThemeBounceRings(name, w,h){
  this.id=nextThemeId++;
  this.name=name;
  //this.lifeSpan=0;
  var ringSet;
  var aMaster=0;
  var aMInc=PI/500;

  initTheme();

  function initTheme(){
    ringSet=new RingSet();
  }
  
  this.init=function(){
    initTheme();
  };

  this.run=function(blobPos){
    ringSet.run(blobPos);
  };


  function RingSet(){
    var bouncers=[]
    var count=40;
    var thick=1;

    
    // bouncers[0]=new Bouncer(width/2, height/2, 300, 0.1, 0.9);
    // bouncers[1]=new Bouncer(width/2, height/2, 50, 0.15, 0.95);
    // bouncers[2]=new Bouncer(width/2, height/2, 100, 0.2, 0.85);
  
    this.add=function(x,y) {
      bouncers.push(new Bouncer(x,y,100,0.10,0.90));
    };

    this.run=function(blobPos) {
      while(blobPos.length>bouncers.length){
        var p=blobPos[blobPos.length-1];
        this.add(p.x, p.y);
        //bouncers.push(new Bouncer(200,200, 100, 0.15, 0.95));
      }
      if(bouncers.length>blobPos.length){
        bouncers.splice(-(bouncers.length-blobPos.length));
      }
      //text(bouncers.length,width/2, height/2);
      colorMode(HSB,255);
      thick=map(blobPos.length,0,5,5,1);
      for(var i=0; i<count; i++){
        for(var j=0; j<bouncers.length; j++){
          if(i===0) bouncers[j].update(blobPos[j]);
          bouncers[j].show(i*TWO_PI/count, thick);
        }
        // b1.show(i*TWO_PI/count);
        // b2.show(i*TWO_PI/count+TWO_PI/count/2);
        // b3.show(i*TWO_PI/count);
      }
      colorMode(RGB);
      // b.show(0);
      // b.show(PI);
      
      // b1.update();
      // b2.update();
      // b3.update();
      aMaster+=aMInc;
    };
  }

  function Bouncer(x,y, r, s, d){
    var pos=createVector(x,y);
    var vel=createVector(0,0);
    var strength=s;
    var drag=d;
    var hue=random(255);
    // var x=width/2;
    // var y=height/2;
    
    var acc=createVector(0,0);
    
    this.show=function(a, thick){
      push();
      translate(width/2,height/2);
      rotate(a+aMaster);
      translate(-width/2, -height/2);
      stroke(hue,255,255);
      strokeWeight(thick);
      noFill();//fill(255);
      translate(pos.x, pos.y);
      ellipse(0,0,r,r);
      pop();
    };
    
    this.update=function(blobPos){
      acc=createVector(blobPos.x, blobPos.y);
      acc.sub(pos);
      acc.mult(strength*0.5);
      vel.add(acc);
      vel.mult(drag);
      pos.add(vel);
      r=abs(pos.y-y);
    };
    
  }
}

function ThemePsychaRing(name, w,h){
  this.id=nextThemeId++;
  this.name=name;
  //this.lifeSpan=0;
  var pRing;

  initTheme();

  function initTheme(){
    pRing=new PsychaRing();
  }
  
  this.init=function(){
    initTheme();
  };

  this.run=function(blobPos){
    pRing.run(blobPos);
  };


  function PsychaRing(){
    var numCircles=40;
    var shift;
    var newCount=0;
    var a=0;
    var circleWidth=floor(random(width/160,width/20));
    var aSInc=PI/random(50,200);
    var numSegs=floor(random(2,10));
    var s1=new Spinner(circleWidth, 1, random(255), 1);
    var s2=new Spinner(circleWidth, 1, random(255), -1);
    
    this.run=function(){
      s1.run();
      s2.run();
      a+=aSInc;
    };
    
    
    function Spinner(circleWidth, offset, col, dir){
      var circles=[];
      var startRad=50;
      var maxRad=width*1.4;
      var count=0;
      var newCount=0;
      var growth=0;
      var grow=1;//floor(random(1,8))/2;
      
      for(var i=0; i<numCircles; i++){
        var rad=startRad+i*circleWidth*4;
        if(rad>maxRad) break;
        circles.push(new BrokenCircle(rad, circleWidth, numSegs, PI/100*i, startRad, maxRad));
      }
      count=circles.length;
      
      this.run=function(){
        growth+=grow;
        if(growth%(grow*circleWidth*4)===0){
          if(dir>0){
            var nc=new BrokenCircle(startRad, circleWidth, numSegs, -(PI/100)*(1+newCount++), startRad, maxRad);
            circles.unshift(nc);
          } else {
            var nc=new BrokenCircle(maxRad-circleWidth, circleWidth, numSegs, (PI/100)*(count++), startRad, maxRad);
            circles.push(nc);
          }
        }
        for(var i=circles.length-1; i>=0; i--){
          circles[i].show(col);
          if(!circles[i].update(offset, dir, startRad, maxRad)){
            circles.splice(i,1);
          }
        }
      }
    }
    
    
    function BrokenCircle(r, sw, numSegs, phase, startRad, maxRad){
      var numSegsRender=numSegs*2;
      var segSize=TWO_PI/numSegsRender;
      var drawing=true;
      var radialResolution=100;
      var aShift=0;
      
      
      this.show=function(c){
        push();
        colorMode(HSB,255);
        var alpha=map(r,startRad, maxRad, 20,255);
        stroke(c, 255,255, alpha);
        strokeWeight(sw);
        noFill();
        translate(width/2, height/2);
        rotate(aShift);
        for(var i=0; i<numSegsRender; i+=2){
          arc(0,0,r,r,i*segSize,(i+1)*segSize);
        }
        pop();
        colorMode(RGB,255);
      };
      
      this.update=function(offset, dir, min, max){
        r+=1*dir;
        if(r>max) return false;
        if(r<min) return false;
        //aShift+=aInc;
        aShift=sin(a+phase+offset*segSize)*PI;
        return true;
      };
    }
  }

}

function ThemeTVStatic(name, w,h){
  this.id=nextThemeId++;
  this.name=name;
  //this.lifeSpan=0;
  var ts;

  initTheme();

  function initTheme(){
    ts=new TVStatic();
  }
  
  this.init=function(){
    initTheme();
  };

  this.run=function(blobPos){
    ts.run(blobPos);
  };

  function TVStatic(){
    var numStrikes=200;
    var swipe1=0;
    var swipeH=100;
    var swipe2=height/2+swipeH/2;
    var n;
    var nOff=0;
    var nInc=0.05;
    var swipeInc=-5;
    var maxDur=500;
    var duration=maxDur;

    this.run=function() {
      if(duration>0)
        duration --;
      var fleckSize=map(duration,maxDur,0,5,200);
      //console.log(">>>>> "+fleckSize);
      
      n=noise(nOff);
      nOff+=nInc;
      background(noise(nOff+0.5)*100,150);
      noStroke();
      fill(100);
      rect(0,-swipeH/2+swipe1,width,swipeH);
      rect(0,-swipeH/2+swipe2,width,swipeH);
      swipe1+=swipeInc;
      if(swipe1>height+swipeH/2) swipe1=-swipeH/2;
      if(swipe1<-swipeH/2) swipe1=height+swipeH/2;
      swipe2+=swipeInc;
      if(swipe2>height+swipeH/2) swipe2=-swipeH/2;
      if(swipe2<-swipeH/2) swipe2=height+swipeH/2;
      for(var i=0; i<numStrikes; i++){
        var x=random(-10,width);
        var y=random(height);
        var l=random(30*n+1);
        var c=random(200,255);
        stroke(c);
        strokeWeight(noise(nOff+0.1)*fleckSize);
        line(x,y,x+l,y);
      }
    };

  }

}


function ThemeHairBall(name, w,h){
  this.id=nextThemeId++;
  this.name=name;
  //this.lifeSpan=0;
  var hb;

  initTheme();

  function initTheme(){
    hb=new HairBall();
  }
  
  this.init=function(){
    initTheme();
  };

  this.run=function(blobPos){
    hb.run(blobPos);
  };

  function HairBall(){
    var segs=[];
    var maxSegs=30;
    var len=10;
    var segRot;
    var segMaxRot;
    var hairs=[];
    var numHairs=40;
    var a=0;
    var r=100;
    var x,y;
    var startA=random(TWO_PI);
    for(var i=0; i<numHairs; i++){
      x=width/2+cos(a)*r;
      y=height/2+sin(a)*r;
      hairs[i]=new Hair(x,y,startA+a);
      a+=2*PI/numHairs;
    }


    this.run=function(){
      stroke(255);
      //b1.display();
      for(var i=0; i<hairs.length; i++){
        hairs[i].display();
      }
      fill(100);
    };

    function Hair(x,y, a){
      this.x=x;
      this.y=y;
      this.col=random(150,255);
      var noiseBase=random(1);
      var noiseY=random(1);
      var noiseInc=0.01;
      var segs=[];
      var trigger=floor(random(5));
      var numSegs=3;
      var len=10;
      var segRot;
      var segMaxRot;
      var s=new Segment2(createVector(100+i*10,100),len,a);
      segs.push(s);
      for(var i=1; i<numSegs; i++){
        var s=new Segment2(createVector(100+i*10,100),len,0);
        segs.push(s);
      }
      segRot=PI/1000;
      segMaxRot=PI/10;

      this.display=function(){
        stroke(255);
        var pos=createVector(this.x, this.y);
        var a=0;
        //noiseBase+=noiseInc;
        noiseY+=noiseInc;
        var aging;
        for(var i=0; i<segs.length; i++){
          var n=map(noise(noiseBase+i*noiseInc, noiseY),0,1,-segRot, segRot);
          segs[i].rotateMe(n);
          if(segs.length>20){
            if(i>segs.length-20){
              aging=1;
            }else{
              aging=i/(segs.length-20);
            }
          }else{
            aging=1;
          }
          //aging=i/segs.length;
          segs[i].update(pos, a, aging);
          pos=segs[i].tip;
          a=segs[i].myAngle;
          segs[i].display(this.col);
        }
         //if(frameCount%50==0) addSegBase();
         if(frameCount%5==trigger) addSegEnd();
         if(segs.length>maxSegs){
           this.x=segs[1].base.x;
           this.y=segs[1].base.y;
           segs[1].myRotation+=segs[0].myRotation;
           segs.shift();
         }
      };

      function addSegEnd(){
        var s=new Segment2(createVector(100+4*10,100),len,0);
        segs.push(s);
      }

      function addSegBase(){
      //    var a=segs[0].myAngle;
          var s=new Segment2(createVector(100*10,100),len,0);
      //    s.myRotation=a;
          segs.unshift(s);
      }
    }

    function Segment2(base, length, startA){
      this.base=base;
      this.seg=createVector(0,length);
      this.tip=p5.Vector.add(this.base,this.seg);
      this.givenAngle=0;
      this.myRotation=startA;
      this.myAngle=0;
      var myRotDir=-1;
      this.mass=0;
      this.vel=0;
      this.acc=0;
      this.hit=false;
      this.thick=1;
      this.fade=255;
      
      
      this.rotateMe=function(a){
        this.myRotation+=a*myRotDir;
      };
      
      this.update=function(pos,angle,dying){
        this.base=pos;
        this.givenAngle=angle;
        this.seg.rotate(-this.myAngle+this.givenAngle+this.myRotation);
        this.tip=p5.Vector.add(this.base,this.seg);
        this.myAngle=this.givenAngle+this.myRotation;
        this.thick+=0.05;
        this.fade=map(dying,0,1, 20,255);
      };
      
      this.display=function(col){
        push();
        translate(this.base.x, this.base.y);
        rotate(this.givenAngle);
        rotate(this.myRotation);
        //if(this.hit) stroke(255,0,0); else stroke(255);
        stroke(this.fade, this.fade);
        strokeWeight(this.thick);
        line(0,0,0,length);
        pop();
      };
      
      this.collide=function(item){
        this.hit=collideLinePoly(this.base.x, this.base.y, this.tip.x, this.tip.y, item);
        //console.log(frameCount+" "+this.hit);
        if(this.hit){
          myRotDir=-myRotDir;
        }
        return this.hit;
      };
    }
  }
}

function ThemeSwisher(name, w,h){
  this.id=nextThemeId++;
  this.name=name;
  //this.lifeSpan=0;
  var s;

  initTheme();

  function initTheme(){
    s=new SwisherSet();
  }
  
  this.init=function(){
    initTheme();
  };

  this.run=function(blobPos){
    s.run(blobPos);
  };

  
  function SwisherSet(){
    var threshold=height/2;
    var swishers=[];
    var numS=50;
    
    for(var i=0; i<numS; i++){
      swishers[i]=new Swisher(i*width/numS,height/2);
    }
    
    this.run=function(blobPos){
      swishers.forEach(function(s){
        s.update(threshold, blobPos);
        s.show();
      });
    }
  }

  function Swisher(x,y){
    var len=height;
    var lean;
    
    this.update=function(threshold,points){
      lean=0;
      points.forEach(function(p){
        var d=dist(p.x,p.y, x,y);
        if(d<threshold){
          lean+=map(d, threshold,0,0,PI/2);
        }
      });
    }
    
    this.show=function(){
      push();
      translate(x,y);
      stroke(180,120);
      strokeWeight(map(lean,0,PI,width/40,1));
      len=map(lean,0,PI,height,0)
      rotate(lean);
      rotate(random(-0.02,0.02));
      line(0,-len, 0,len);
      pop();
    }
  }
}

function ThemeSparker(name, w,h){
  this.id=nextThemeId++;
  this.name=name;
  //this.lifeSpan=0;
  var s;

  initTheme();

  function initTheme(){
    s=new Sparker();
  }
  
  this.init=function(){
    initTheme();
  };

  this.shutdown=function(){
    s.shutdown();
  }

  this.run=function(blobPos){
    s.run(blobPos);
  };

  function Sparker(){
    var sparks=[];
    var noise1=new p5.Noise('white');
    var env = new p5.Env();
    env.setADSR(0.005, 0.01, 0, 0.1);
    env.setRange(1, 0);
    noise1.start();
    noise1.amp(0);

    this.shutdown=function(){
      noise1.stop();
      console.log("********* noise stopped");
    }

    this.run=function(points){
      while (sparks.length<points.length){
        sparks.push(new Spark(20));
      }
      points.forEach(function(p, i){
        sparks[i].generate(p.x, p.y);
        sparks[i].show();
        if(random(10)<2) env.play(noise1);
      });
    };
  }

  function Spark(numSegs){
    var segs=[];
    var x, y;
    var a=0;
    
    this.generate=function(px, py){
      x=px;
      y=py;
      a=random(TWO_PI);
      segs=[];
      currX=0;
      var tLen=random(width);
      for(var i=0; i<numSegs; i++){
        var remainSegs=numSegs-1-i;
        var remainX=tLen-currX;
        var seed=remainX/remainSegs;
        segs[i]=p5.Vector.fromAngle(random(-PI/3,PI/3));
        segs[i].mult(random(seed*3));
        currX+=segs[i].x;
      }
    };
    
    this.show=function(){
      push();
      translate(x,y);
      rotate(a);
      translate(random(50),0);
      noFill();
      stroke(0,220,255);
      segs.forEach(function(s,i){
        strokeWeight(map(numSegs-i,numSegs,0,5,0.5));
        line(0,0,s.x, s.y);
        translate(s.x, s.y);
      });
      pop();
    };
  }
}


function ThemeCracker(name, w,h){
  this.id=nextThemeId++;
  this.name=name;
  //this.lifeSpan=0;
  var cracker;

  initTheme();

  function initTheme(){
    cracker=new Cracker();
  }
  
  this.init=function(){
    initTheme();
  };

  this.run=function(blobPos){
    cracker.run(blobPos);
  };


  function Cracker(){
    var numSegs=100;
    var crack;
    var count=0;
    var countMax=500;
    
    var r1=255;
    var g1=100;
    var b1=0;
    
    var rt=255;
    var gt=255;
    var bt=255;
    var r,g,b;
    
    crack=new Crack(0,height/2,numSegs);

    this.run=function(blobPos){
      crack.show(count);
      count+=4;//!!!!
      if(count>numSegs-1){
        // count=0;
        // crack.generate();
        if(crack.fragged()){
          // background(255);
          r=map(count,200,300,r1,rt);
          g=map(count,200,300,g1,gt);
          b=map(count,200,300,b1,bt);
          background(r,g,b);
          crack.showFrag();
        } else {
          crack.createFragments();
        }
      }
      if(count<500){
        // r=map(count,100,200,r1,rt);
        // g=map(count,100,200,g1,gt);
        // b=map(count,100,200,b1,bt);
        //background(r,g,b);
      } else {
        crack.generate();
        count=0;
      }
    };
    
    function Crack(x,y,numSegs){
      var thick=5;
    //  var start=createVector(x,y);
      var segs=[];
      var frag, frag2;
      var fragged=false;
      
      this.fragged=function(){
        return fragged;
      }
      
      this.generate=function(){
        fragged=false;
        currX=0;
        for(var i=0; i<numSegs; i++){
          var remainSegs=numSegs-1-i;
          var remainX=width-currX;
          var seed=remainX/remainSegs;
          segs[i]=p5.Vector.fromAngle(random(-PI/3,PI/3));
          segs[i].mult(random(seed*3));
          currX+=segs[i].x;
        }  
      };
      
      this.generate();
      
      this.show=function(showSegs){
        if(showSegs>segs.length) showSegs=segs.length;
        push();
        translate(x,y);
        for(var i=0; i<showSegs; i++){
          stroke(r1,g1,b1);
          // var w=map(i,0,numSegs,0,10);;
          //console.log(w);
          var w=1;
          strokeWeight(w);
          line(0,0,segs[i].x, segs[i].y);
          noFill();
          //fill(0,200,200);
          //ellipse(segs[i].x, segs[i].y,5,5);
          translate(segs[i].x, segs[i].y);
        }
        pop();
      }
      
      this.createFragments=function(){
        frag=new Fragment(1,segs);
        frag2=new Fragment(-1,segs);
        fragged=true;
      };
      
      this.showFrag=function(){
        frag.show();
        frag2.show();
      };
    }
    
    function Fragment(f, inVertices){
      var vertices=[];
      var yOff=f*2;
      var xOff=0;
      
      if(f==1){
        vertices[0]={x:width, y:height};
        vertices[1]={x:0, y:height};
        vertices[2]={x:0, y:height/2};
      } else {
        vertices[0]={x:width, y:0};
        vertices[1]={x:0, y:0};
        vertices[2]={x:0, y:height/2};
      }
      var cx=0;
      var cy=height/2;
      inVertices.forEach(function(v,i){
        cx+=v.x;
        cy+=v.y;
        vertices[i+3]={x:cx, y:cy};
      });
      
      this.show=function(x,y){
        //console.log(vertices);
        var speed=map(abs(yOff),0,50,0.1,1);
        push();
        translate(xOff,yOff);
        if(abs(yOff)<height/2){ 
          if(abs(yOff)>3){
            yOff+=random(5)*f*speed;
            xOff=random(3);
          } else {
            yOff+=1*f*speed;
          }
        }
        stroke(0);
        fill(0);
        translate(x,y);
        beginShape();
        vertices.forEach(function(v){
          vertex(v.x, v.y);
        });
        endShape(CLOSE);
        pop();
      }
    }
  }
}


function ThemePlasma1(name, w,h){
  this.id=nextThemeId++;
  this.name=name;
  //this.lifeSpan=0;
  var plasma;

  initTheme();

  function initTheme(){
    plasma=new PlasmaBalls();
  }
  
  this.init=function(){
    initTheme();
  };

  this.run=function(blobPos){
    plasma.run(blobPos);
  };

  function PlasmaBalls(){
    var balls=[];

    this.run=function(blobPos){
      while(balls.length<blobPos.length){
        balls.push(new PlasmaBall());
      }
      blobPos.forEach(function(b,i){
        balls[i].run(b.x, b.y);
      });
    };
  }

  function PlasmaBall(){
    var numParticles=100;
    var particles=[];
    var radMin=width/8;
    var radMax=width/3;
    var radNow=radMin;
    
    this.run=function(x,y){
      if(particles.length<numParticles){
        // var d=dist(pmouseX, pmouseY,mouseX, mouseY);
        // if(d<20){
        //   if(radNow<radMax){
        //     radNow++;
        //   }
        // } else {
        //   if(radNow>50){
        //     radNow-=5;
        //   }
        // }
        for(var i=0; i<5; i++){
          particles.push(new Particle(x,y, radNow));
        }
      }
      for(var i=particles.length-1; i>=0; i--){
        if(!particles[i].update()){
          particles.splice(i,1);
        }
        particles[i].show();
      }
    };
  }

  function Particle(x,y, rad){
    var pos=createVector(x,y);
    var vel=createVector(0,0);
    var acc;
    var ttlInit=20;
    var ttl=ttlInit;
    
    this.update=function(){
      var acc=p5.Vector.random2D();
      acc.mult(2);
      vel.add(acc);
      pos.add(vel);
      ttl--;
      return ttl>0;
    };
    
    this.show=function(){
      var r=map(ttl,0,ttlInit,0,rad);
      var a=map(ttl,0,ttlInit,50,255)
      push();
      colorMode(HSB,255);
      fill(map(ttl,ttlInit,0,100,180),map(ttl,ttlInit,0,0,200),255);
      noStroke();
      ellipse(pos.x,pos.y,r,r);
      colorMode(RGB,255);
      pop();
    }
  }

}



function ThemeStrings(name, w,h){
  this.id=nextThemeId++;
  this.name=name;
  //this.lifeSpan=0;
  var strings;

  initTheme();

  function initTheme(){
    strings=new Strings();
  }
  
  this.init=function(){
    initTheme();
  };

  this.run=function(blobPos){
    strings.run(blobPos);
  };

  function Strings(){
    var strings=[];
    var numStrings=16;
    var pitch;
    var rot=0.1;
    var rotInc=0;
    var prox=height/2;
    
    pitch=width*1.1/numStrings
    for(var i=0; i<numStrings; i++){
      strings[i]=new String(pitch*i);
    }
    rotInc=PI/1000;

    this.run=function(blobPos){
      strings.forEach(function(s){
        s.update(blobPos);
        s.show();
      });
    }

    function String(x){
      var numSegs=100;
      var a=0;
      var aInc;
      var phase=0;
      var f=0.1;
      var near;
      var nTot=0.1;
      var nCount=0;
      var c,w,p,alph;
      
      
      this.update=function(points){
        var fTot=0.1;
        nTot=1;
        nCount=0;
        if(points && points.length>0){
          points.forEach(function(p){
            // stroke(255,0,0);
            // ellipse(p.x,p.y,10,10);
            //near=prox-abs(x-p.x);
            near=prox-dist(p.x,p.y,x,height/2);
            if(near>0){
              f=map(near,prox,0,18,0.5);
              nTot+=near;
              nCount++;

            } else {
              f=0.1;
              nTot+=1;
            }
            fTot+=f;

          });
          //nTot/=points.length;
        }
        
        aInc=TWO_PI/numSegs*fTot*2;
        phase+=aInc*10;
        if(phase>TWO_PI) phase-=TWO_PI;

      }
      
      this.show=function(){
        push();
        var hue;
        colorMode(HSB,255);
        translate(x,height/2);
        rotate(rot);
        //rot+=rotInc;
        if(true){
          c=map(nTot,prox/2,0*nCount,255,0);
          hue=map(nTot,prox,0,1,30);
          w=map(nTot,prox,0,1,10);
          p=map(nTot,prox,0,1,4);
          alph=map(nTot,prox/2,0,255,100);
          // c=map(nTot,prox/2,0*nCount,255,0);
          // w=map(nTot,prox/2,0,8,25);
          // p=map(nTot,prox/2,0,1,8);
          // alph=map(nTot,prox/2,0,255,100);
        }
        stroke(hue,c,255,alph);
        strokeWeight(w);
        noFill();
        beginShape();
        var sy=-height/2;
        for(var i=0; i<numSegs; i++){
          var sx=sin(a+phase)*pitch/p;
          sy+=height/numSegs;
          vertex(sx,sy);
          a+=aInc;
        }
        endShape();
        colorMode(RGB,255);
        pop();
      }
      
    }

  }

}



function ThemeBounceChain(name, w,h){
  this.id=nextThemeId++;
  this.name=name;
  //this.lifeSpan=0;
  var bChain;

  initTheme();

  function initTheme(){
    bChain=new ChainSet();
  }
  
  this.init=function(){
    initTheme();
  };

  this.run=function(blobPos){
    bChain.run(blobPos);
  };
  

  function ChainSet(){
    var chains=[];
    var numChains=3;
    
    for(var i=0; i<numChains; i++){
      chains[i]=new Chain(random(0.05,0.2), random(0.85,0.98));
    }
    
    this.run=function(points){
      colorMode(HSB,255);
      chains.forEach(function(c){
        c.run(points);
      });
      colorMode(RGB,255);

    };
  }


  function Chain(strength, drag){
    var blobs=[];
    var numBlobs=10;
    var col=random(255);
    var rad=random(2,100);
    var opposite=1;
    if(random(10)<5) opposite*=-1;
    // var strength=0.15;
    // var drag=0.95;
    for(var i=0; i<numBlobs; i++){
      blobs[i]=new Blob(width/numBlobs*i+width/numBlobs/2,height/2);
    }
    
    this.run=function(points){
      blobs.forEach(function(b){
        b.update(points);
        b.show();
      });
    };
    
    function Blob(x,y){
      var pos=createVector(x,y);
      var threshold=height/2;
      var vel=createVector(0,0);
      //var acc=createVector(0,0);
      
      this.update=function(points){
        var dTot=0;
        points.forEach(function(p){
          var d=dist(p.x, p.y, x, y);
          if(d<threshold){
            d=(threshold-d)/2;
            //var dir=spot.y<y?1:-1;
            var dir=opposite;
            d*=opposite;
            //pos.y=d*dir;
            // acc.y=d*dir;
          } else d=0;
          dTot+=d;
        });
        // var d=dist(spot.x, spot.y, x, y);
        acc=createVector(x,0);
        // if(d<threshold){
        //   d=(threshold-d)/2;
        //   //var dir=spot.y<y?1:-1;
        //   var dir=opposite;
        //   //pos.y=d*dir;
        //   acc.y=d*dir;
        // } else acc.y=0;
        acc.y=dTot;
        acc.sub(pos);
        acc.mult(strength);
        vel.add(acc);
        vel.mult(drag);
        pos.add(vel);
      };
      
      this.show=function(){
        push();
        translate(0,height/2);
        fill(col,255,180,100);
        stroke(col,255,255,255);
        // noStroke();
        ellipse(pos.x,pos.y,rad,rad);
        pop();
      };
    }
  }

}

function ThemeRepelWobble(name, w,h){
  this.id=nextThemeId++;
  this.name=name;
  //this.lifeSpan=0;
  var bChain;

  initTheme();

  function initTheme(){
    bChain=new ChainSet();
  }
  
  this.init=function(){
    initTheme();
  };

  this.run=function(blobPos){
    bChain.run(blobPos);
  };
  

  function ChainSet(){
    var chains=[];
    var numChains=3;
    
    for(var i=0; i<numChains; i++){
      chains[i]=new Chain(random(0.05,0.2), random(0.85,0.98));
    }
    
    this.run=function(points){
      colorMode(HSB,255);
      chains.forEach(function(c){
        c.run(points);
      });
      colorMode(RGB,255);
    };
  }


  function Chain(strength, drag){
    var blobs=[];
    var numBlobs=100;
    var col=random(255);
    var rad=random(2,100);
    var opposite=1;
    var repelR=random(1,50);
    if(random(10)<5) opposite*=-1;
    for(var i=0; i<numBlobs; i++){
      blobs[i]=new Blob(width/numBlobs*i+width/numBlobs/2,height/2);
    }
    
    this.run=function(points){
      push();
      translate(0,height/2);
      noStroke();//stroke(255);
      fill(col,200,255,100);
      beginShape();
      blobs.forEach(function(b){
        b.update(points);
        // b.show();
        var pos=b.get();
        vertex(pos.x, pos.y);
      });
      for(var i=blobs.length-1; i>=0; i--){
        var pos=blobs[i].get();
        vertex(pos.x, -pos.y);
      }
      endShape(CLOSE);
      pop();
    }
    
    function Blob(x,y){
      var pos=createVector(x,y);
      var threshold=height/2;
      var vel=createVector(0,0);
      //var acc=createVector(0,0);
      
      this.update=function(points){
        var dTot=0;
        var d;
        points.forEach(function(p){
          if(p.y>height/2) p.y=height-p.y;
          var mPos=pos.copy();
          var dv=createVector(p.x, p.y);
          mPos.sub(dv);
          var dm=mPos.mag()+repelR; //distance
          if(dm<threshold+repelR){
            d=threshold-dm;
          }
          else
            d=0;
          dTot+=d;
        });
        acc=createVector(x,0);
        acc.y=dTot;
        acc.sub(pos);
        acc.mult(strength);
        vel.add(acc);
        vel.mult(drag);
        pos.add(vel);
      }
      
      this.get=function(){
        return pos;
      }
      
      this.show=function(){
        push();
        translate(0,height/2);
        fill(col,255,180,100);
        //stroke(col,255,255,255);
        // noStroke();
        ellipse(pos.x,pos.y,rad,rad);
        pop();
      }
    }
  }



}

function ThemeFlipper1(name, w,h){
  this.id=nextThemeId++;
  this.name=name;
  //this.lifeSpan=0;
  var flipset;

  initTheme();

  function initTheme(){
    flipset=new FlipSet();
  }
  
  this.init=function(){
    initTheme();
  };

  this.run=function(blobPos){
    flipset.run(blobPos);
  };


  function FlipSet(){
    var flippers=[];
    var step=50;
    var w,h;
    w=floor(width/step);
    h=floor(height/step);
    for(var y=0; y<h; y++){
      for(var x=0; x<w; x++){
        flippers.push(new FlipSpot(step/2+step*x,step/2+step*y,step));
      }
    }
    
    this.run=function(blobPos){
      flippers.forEach(function(f){
        // if(frameCount%4===0){ //reduce CPU load
        blobPos.forEach(function(p){
          f.check(p.x, p.y);
        });
        f.update();
        // }
        f.show();
      });
    };
    
    this.move=function(){
      flippers.forEach(function(f){
        //f.update();
        f.check(mouseX, mouseY);
      });
    };

    function FlipSpot(x,y,size){
      var flipping=false;
      var flipInc=0.1;
      var flipDir=1;
      var flippage=-1;
      var flipShade=1;
      var r=size/2;
      var baseCol=200;
      var highCol=255;
      var col=baseCol;
      var a=random(PI);
      var threshold=r*3;
      
      this.trigger=function(){
        flipping=true;
        flipDir=1;
      };
      
      this.untrigger=function(){
        flipping=true;
        flipDir=-1;
      };
      
      this.check=function(mx, my){
        var d=dist(mx, my, x, y);
        if(d<threshold){
          col=highCol;
          //flipShade=map(threshold-d,0,threshold,1,0);
          this.trigger();
        } else {
          col=baseCol;
          if(!flipping)
            this.untrigger();
        }
      };
      
      this.update=function(){
        this.check();
        //console.log(flipping);
        if(flipping){
          var speed=flipDir>0?2:0.25;
          flippage+=flipInc*flipDir*speed;
          //console.log(flippage);
          if(flippage<-1){
            flippage=-1;
            flipping=false;
          } else if(flippage>1*flipShade){
            //this.untrigger();
            flippage=1;
            flipping=false;
          }
        }
      };
      
      this.show=function(){
        push();
        translate(x,y);
        rotate(a);
        noStroke();
        // stroke(col);
        if(flippage<0) fill(0);
        else fill(255);
        ellipse(0,0,r*2*(1/flippage),r*2*flippage);
        pop();
      };
    }
    
  }

}

function ThemeFlyThrough(name, w,h){
  this.id=nextThemeId++;
  this.name=name;
  //this.lifeSpan=0;
  var f;

  initTheme();

  function initTheme(){
    f=new FlyThrough();
  }
  
  this.init=function(){
    initTheme();
  };

  this.run=function(blobPos){
    f.run();
  };
  

  function FlyThrough(){
    var s=[];
    var numScreens=10;
    var ind=numScreens;
    var back=0;
    var gap=1000;
    var maxBack=-numScreens*gap;
    var here=1000;
    var span=1000;
    var speed=500;
    var offR=0.05;
    var offS=0.05;
    var aspect;
    var spaceWidth;

    spaceWidth=width*2;
    aspect=width/height;
    // s1=new Screen(-100);
    for(var i=0; i<numScreens; i++){
      back=i*-gap;
      s[i]=new Screen(back, i);
    }
    
    this.run=function(){
      for(var i=s.length-1; i>=0; i--){
        s[i].showFill(i);
        if(!s[i].update(speed)){
          s.splice(i,1);
          back=here-((s.length+1)*gap);
          s.push(new Screen(back,ind++))
        }
      }
    }

    function Screen(zPos, ind){
      
      var verts=[];
      var numVerts=100;
      var maxDisp=100;
      var r=400;
      var fg=random(150,200);
      var home;
      
      build();
      
      function build(){
        home=createVector(0,0);
        var xNow=0;
        var xInc=spaceWidth/numVerts;
        var nOffR=0;
        var nOffRInc=offR;
        var nOffz=offS*ind;
        var v;
        var endV;
        v=createVector(xNow,0);
        v.y=noise(nOffR, nOffz)*r;
        nOffR+=nOffRInc;
        xNow+=xInc;
        verts[0]=v;
        for(var i=1; i<numVerts; i++){
          v=createVector(i*xInc,0);
          v.y=noise(nOffR, nOffz)*r;
          nOffR+=nOffRInc;
          verts.push(v);
          xNow+=xInc;
          var close=numVerts-i;
          verts.push(v);
        }
        home=createVector(0, verts[floor(numVerts/2)].y);
      }
      
     
      this.showFill=function(ind){
        
        push();
        translate(width/2,-height/4);
        translate(home.x, home.y);
        noStroke();
        var f=map(ind,0,numScreens,255,30);
        var a=map(zPos,-2000*numScreens,0,0,255);
        fill(fg*f/100,f,0,a);
        var scl=(maxBack-zPos)/maxBack;
        scale(scl);
        translate(-spaceWidth/2,0);
        beginShape();
        vertex(spaceWidth*5,height);
        vertex(spaceWidth*5,height*4);
        vertex(-spaceWidth*4,height*4);
        vertex(-spaceWidth*4,height);
        for(var i=0; i<verts.length; i++){
          vertex(verts[i].x, verts[i].y*2, 0);
        }
        endShape(CLOSE);
        
        pop();
        
        push();
        translate(width/2,height/2);
        stroke(255,0,0);
        noFill();
        ellipse(home.x, home.y-height/2,15,15);
        noStroke();
        fill(0,fg*f/200,f,a);
        scale(((maxBack-zPos)/maxBack)*0.7);
        rotate(PI);
        translate(-spaceWidth/2,height/2);
        beginShape();    //vertex(spaceWidth,0);
        vertex(spaceWidth*5,height);
        vertex(spaceWidth*5,height*4);
        vertex(-spaceWidth*4,height*4);
        vertex(-spaceWidth*4,height);
        for(var i=0; i<verts.length; i++){
          vertex(verts[i].x, verts[i].y/2, 0);
        }
        endShape(CLOSE);
       
        pop();
      };
      
      this.update=function(move){
        zPos+=move;
        return zPos<=here;
      }
      
      this.getZ=function(){
        return zPos;
      }
    }
  }

}