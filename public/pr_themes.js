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
		themeOne: ThemeDust, //Theme1,
		themeTwo:  ThemeSpark, //Theme2,
		themeThree: ThemeBounceRings, //ThemeNoise1, //Theme3 //ThemeNoise1
    themeFour: ThemeNoise1
    // ,
    // themeFive: ThemeHypno
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
		console.log("Current Theme: "+nowTheme.id+" "+nowTheme.name);
		nowTheme.init();
	};

	this.test=function(){
		console.log("ThemeRunner is OK");
	};

	this.run=function(blobPos){
		if(nowTheme) nowTheme.run(blobPos);
		fill(200);
		if(nowTheme) text(nowTheme.name,100,100);
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
      amplitude=map(near,0,w/2,numLines*2,1);
      lineWidth=map(y,0,h,0.5,20);
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
      text(bouncers.length,width/2, height/2);
      colorMode(HSB,255);
      for(var i=0; i<count; i++){
        for(var j=0; j<bouncers.length; j++){
          if(i===0) bouncers[j].update(blobPos[j]);
          bouncers[j].show(i*TWO_PI/count);
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
    
    this.show=function(a){
      push();
      translate(width/2,height/2);
      rotate(a+aMaster);
      translate(-width/2, -height/2);
      stroke(hue,255,255);
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

//surely many changes!


