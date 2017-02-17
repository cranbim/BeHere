// pr_themes.js
// display themes for plasma ring

//global counter for nextTheme
var nextThemeId=0;
var themesRingLength=0;

//Object for client side running the themes and swicthing
function ThemeRunner(w,h){
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
  this.themeRendersBackground=false;


  // var themeLoader={
  //   ThemeDefault: ThemeDefault,
  //   ThemePlasma1: ThemePlasma1, //Theme1,
  //   ThemeFlyThrough: ThemeFlyThrough,
  //   ThemeRepelWobble:  ThemeRepelWobble, //Theme2,
  //   ThemeBounceRings: ThemeBounceRings, //ThemeNoise1, //Theme3 //ThemeNoise1
  //   ThemeFlipper1: ThemeFlipper1,
  //   ThemePsychaRing: ThemePsychaRing,
  //   ThemeBounceChain: ThemeBounceChain,
  //   ThemeSpark: ThemeSpark,
  //   ThemeSparker: ThemeSparker,
  //   ThemeDust: ThemeDust,
  //   ThemeNoise1: ThemeNoise1, //ThemeInstance, //
  //   ThemeTVStatic: ThemeTVStatic,
  //   ThemeHairBall: ThemeHairBall,
  //   ThemeSwisher: ThemeSwisher,
  //   ThemeCracker: ThemeCracker,
  //   ThemeStrings: ThemeStrings,
  //   ThemeTextScroller: ThemeTextScroller,
  //   ThemeTheyGrowBack: ThemeTheyGrowBack,
  //   ThemeCountdown: ThemeCountdown,
  //   ThemeFlowDraw: ThemeFlowDraw,
  //   ThemeCalmRings: ThemeCalmRings,
  //   ThemeHoneyCombLight: ThemeHoneyCombLight
  // };

  var themeArrayBase=[
    "ThemeDefault"
  ];

  // var nothemesFromServer=[
  //   "ThemePlasma1",
  //   "ThemeFlyThrough",
  //   "ThemeRepelWobble",
  //   "ThemeBounceRings",
  //   "ThemeFlipper1",
  //   "ThemePsychaRing",
  //   "ThemeBounceChain",
  //   "ThemeSparker",
  //   "ThemeSpark",
  //   "ThemeDust",
  //   "ThemeNoise1",
  //   "ThemeTVStatic",
  //   "ThemeHairBall",
  //   "ThemeSwisher",
  //   "ThemeCracker",
  //   "ThemeStrings",
  //   "ThemeTextScroller",
  //   "ThemeTheyGrowBack",
  //   "ThemeCountdown",
  //   "ThemeFlowDraw",
  //   "ThemeCalmRings",
  //   "ThemeHoneyCombLight"
  // ];

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
        var themeInstance=new ThemeInstance(t, w, h, window[t]);
        themes.push(themeInstance);// new ThemeInstance(t, w, h, t));
      });
      console.log("Server Themes Loaded");
    }
    // loadThemes(w,h);
    themesLoadedFromServer=true;
  }

  function loadThemes(w,h){
    themeArrayBase.forEach(function(t){
      var themeInstance=new ThemeInstance(t, w, h, window[t]);
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

function ThemeInstance(name, w, h, instantiator){
  this.id=nextThemeId++;
  this.name=name;
  params={};
  
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
  }

  this.init=function(paramsIn){
    initTheme(paramsIn);
  };

  this.runBlobs=function(blobs){
    if(this.isBlobController){
      instance.runBlobs(blobs);
    }
  };

  this.run=function(blobPos, soundOn){
    return instance.run(blobPos, soundOn, params);
  };

}

//*****************************
// ThemeCountdown
//*****************************


function ThemeCountdown(w,h){
  var startBeat=deviceData.currentBeat;
  var lastBeat=startBeat;
  var particles=[];
  var numParticles=500;
  var attracting=false;
  var osb;
  var counterInit=10;
  var counter=99;
  var myFCount;
  var changeCol=false;
  var newCol=255;
  var params={};

  for(var i=0; i<numParticles; i++){
    particles[i]=new Particle();
  }
  osb=new OSB();
  

  this.run=function(bPos, soundOn, paramsIn){
    params=paramsIn;
    if(counter===99){
      if(params.hasOwnProperty('beat')){
        console.log("!!!"+params.beat);
        counter=counterInit-floor((lastBeat-params.beat)/2);
      }
    }
    // console.log("Theme Params "+params);
    colorMode(HSB,255);
    background((newCol+128)%255,110,100);
    particles.forEach(function(p){
      p.update(attracting);
      if(changeCol) p.changeCol(newCol);
      p.show(osb);
    });
    run();
    osb.show();
    colorMode(RGB);
    return(counter<0);
  };

  function run(){
    changeCol=false;
    if(deviceData.currentBeat-lastBeat===2){
      //console.log(deviceData.currentBeat+" "+params.beat);
      lastBeat=deviceData.currentBeat;
    // if(frameCount%60===0){
      attracting=true;
      newCol=random(255);
      myFCount=20;
    }
    if(attracting && myFCount--<0){
      attracting=false;
      osb.drawNum(counter--);
      changeCol=true;
    }
  }


  function Particle(){
    var pos=createVector(random(w), random(h));
    var noMove=createVector(0,0);
    var vel=createVector(1,0);
    var acc;
    var recentre=createVector(0,0);
    var centre=createVector(w/2,h/2);
    var move;
    var c;
    var col;
    changeCol();

    
    this.update=function(attracting){
      move=noMove;
      c=osb.getPixelsXY(pos.x, pos.y);
      acc=p5.Vector.random2D();
      acc.mult(10);
      if(attracting){
        this.attract(w/2, h/2);
      }
      vel.add(move);
      vel.add(acc);
      vel.add(recentre);
      vel.limit(c.r===255?20:8);
      pos.add(vel);
      edges();
    }
    
    
    this.attract=function(x,y){
      move=createVector(x,y);
      move.sub(pos);
      move.mult(0.3);
    }
    
    function edges(){
      // if(pos.x>w) pos.x=0;
      // if(pos.x<0) pos.x=w;
      // if(pos.y<0) pos.y=h;
      // if(pos.y>h) pos.y=0;
      if(dist(pos.x, pos.y,w/2, h/2)>h/2){
        recentre=p5.Vector.sub(centre,pos);
        recentre.mult(100);
      }else{
        recentre=createVector(0,0);
      }
        // vel.mult(-1);
        // var newPos=pos.copy();
        // var centre=createVector(w/2,h/2);
        // newPos.sub(centre);
        // newPos.setMag(w/2);
        // centre.add(newPos);
        // pos=centre;
      
    }
    
    this.changeCol=changeCol;
    
    function changeCol(ncol){
      col=ncol;
    }
    
    this.show=function(osb){
      var rad=c.r===255?w/100:w/30;
      push();
      //console.log(pos.x+" "+pos.y+" "+c.r);
      // colorMode(HSB,255);
      // if(c.r===255) noFill();
      // else 
      fill(col,200,200);
      //fill(c.r===255?255:150,150);
      noStroke();
      ellipse(pos.x, pos.y, rad,rad);
      // colorMode(RGB);
      pop();
    }
  }

  function OSB(){
    var buffer=createGraphics(w, h);
    var d=pixelDensity();
    
    buffer.background(255);
    buffer.fill(0);
    buffer.noStroke();
    buffer.textSize(h*0.7);
    var tw=buffer.textWidth("10");
    buffer.text("10",buffer.width/2-tw/2,buffer.height*0.7);
    buffer.ellipse(w/2, h/2,200,200);
    buffer.loadPixels();

    this.getPixelsXY=function(x,y){
      x=constrain(floor(x),0,buffer.width-1);
      y=constrain(floor(y),0,buffer.height-1);
      var pixelsOffset=(y*d*buffer.width*d+x*d)*4;
      // var pixelsOffset=0;
      return {
        r:pixels[pixelsOffset+0],
        g:pixels[pixelsOffset+1],
        b:pixels[pixelsOffset+2],
        a:pixels[pixelsOffset+3],
      };
    };

    this.show=function(){
      //scale(0.5);
      // image(buffer,0,0);
      // fill(255,0,0);
      // textSize(50);
      // var c=this.getPixelsXY(mouseX, mouseY);
      // console.log(c);
      // if(c)
      //   text(c.r,20,50);
    };
    
    this.drawNum=function(num){
      colorMode(RGB);
      buffer.background(255);
      buffer.fill(0);
      // buffer.stroke(0);
      buffer.noStroke();
      buffer.textSize(h*0.9);
      var tw=buffer.textWidth(num);
      //buffer.text("Hi?",100,100);
      buffer.text(num,buffer.width/2-tw/2,buffer.height*0.8);
      //buffer.ellipse(width/2, height/2,200,200);
      buffer.loadPixels();
    };
    
  }
}

//*****************************
// Theme Dust
//*****************************

  function ThemeDust(w,h){
    dusts=[];

    this.run=function(blobPos){
      while(blobPos.length>dusts.length){
        var d=new Dust();
        dusts.push(d);
      }
      dusts.forEach(function(d,i){
        d.run(blobPos[i]);
      });
    }
  }

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

//*****************************
// Theme Spark
//*****************************


  function ThemeSpark(w,h){
    sparklers=[];

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
  }


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
        ttl--;
        return ttl>0;
      };
    }
  }


//*****************************
// Theme HypnoRIng
//*****************************


function ThemeHypno(name, w,h){
  // this.id=nextThemeId++;
  // this.name=name;
  // //this.lifeSpan=0;
  // var hypnos=[];

  // initTheme();

  // function initTheme(){
  //   hypnos=[];
  // }
  
  // this.init=function(){
  //   initTheme();
  // };

  // this.run=function(blobPos){
  //   while(blobPos.length>hypnos.length){
  //     var h=new HypnoRing(w,h);
  //     hypnos.push(h);
  //   }
  //   // blobPos.forEach(function(p,i){
  //   //  dusts[i].run(p);
  //   // });
  //   hypnos.forEach(function(h,i){
		// 	if(blobPos[i]){
		// 		h.run(blobPos[i]);
  //     }
  //   });
  // };


  // function HypnoRing(w,h){

  //   var rings=[];
  //   var numRings;
  //   var a=0;
  //   var aInc;
  //   var rGrow=4;
  //   var gap=random(10,40);
  //   var thick=5;
  //   var rot=0;
  //   var rotInc;
  //   var running=true;

  //   rotInc=PI/random(20,50);
  //   numRings=floor(random(4,10));//w*1.4/2/gap;
  //   aInc=PI/10;
  //   for(var i=0; i<numRings; i++){
  //     var r=new Ring(gap+i*gap, PI/numRings*i);
  //     rings.push(r);
  //   }
    
  //   this.run=function(pos) {
  //     rings.forEach(function(r,i){
  //       r.show(pos.x, pos.y, rot+rotInc*i*10);
  //       if(!r.grow(a)) r.reset();
  //     });
  //     rot+=rotInc;
  //     if(running){
  //       a+=aInc;
  //     }
  //   };

  //   function Ring(rInit, phase){
  //     var x=width/2;
  //     var y=height/2;
  //     var r=rInit;
      
  //     this.grow=function(a){
  //       r+=sin(a+phase)*rGrow;//+0.5;
  //       return (r<=width*1.4/2);
  //     };
      
  //     this.show=function(x, y, rot){
  //       push();
  //       translate(x,y);
  //       stroke(200);
  //       strokeWeight(thick);
  //       noFill();
  //       //ellipse(0,0,r*2,r*2);
  //       myRing(0,0,r,rot);
  //       pop();
  //     };
      
  //     this.reset=function(){
  //       r=gap;
  //     };
  //   }

  //   function myRing(x,y,r,rot){
  //     var segs=40;
  //     var maxThick=10;
  //     var aInc=TWO_PI/segs;
  //     var a=0;//TWO_PI;
  //     push();
  //     translate(x,y);
  //     rotate(rot);
  //     //var px=0; var py=0;
  //     var px=cos(a)*r;
  //     var py=sin(a)*r;
  //     for(var i=0; i<segs; i++){
  //       a+=aInc;
  //       var rx=cos(a)*r;
  //       var ry=sin(a)*r;
  //       strokeWeight((sin(a)*maxThick+maxThick+1)*r/width*2);
  //       line(px,py,rx,ry);
  //       px=rx;
  //       py=ry;
  //     }
  //     pop();
  //   }
  // }
}




//*****************************
// Theme Noise1
//*****************************


  function ThemeNoise1(w,h){
  // function NoiseStripes(){

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

//*****************************
// ThemeBounceRings
//*****************************


  function ThemeBounceRings(w,h){

  // function RingSet(){
    var bouncers=[]
    var count=40;
    var thick=1;

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
       }
      colorMode(RGB);
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
      rotate(a);
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

//*****************************
// ThemePsychaRing
//*****************************


  function ThemePsychaRing(w,h){

  // function PsychaRing(){
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
    // }
    
    
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

//*****************************
// ThemeTVStatic
//*****************************


  function ThemeTVStatic(w,h){
  // function TVStatic(){
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

//*****************************
// ThemeHairBall
//*****************************

  function ThemeHairBall(w,h){
  // function HairBall(){
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


//*****************************
// ThemeSwisher
//*****************************


  function ThemeSwisher(w,h){
  // function SwisherSet(){
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


//*****************************
// ThemeSparker
//*****************************


  function ThemeSparker(w,h){
  // function Sparker(){
    var sparks=[];
    var noise1=new p5.Noise('white');
    var env = new p5.Env();
    env.setADSR(0.005, 0.01, 0, 0.1);
    env.setRange(1, 0);
    noise1.start();
    noise1.amp(0);

    this.shutdown=function(){
      noise1.stop();
      noise1.amp(0);
      console.log("********* noise stopped");
    };

    this.run=function(points, soundOn){
      if(!soundOn){
        noise1.stop();
      } else {
        noise1.start();
      }
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


//*****************************
// ThemeTheyGrowBack
//*****************************

function ThemeTheyGrowBack(){
  var soundOn=false;
  const G=0.4;
  var gravity=createVector(0,G);
  const damping=0.98;
  const drag=0.99;
  var fallers=[];
  const numFallers=100;//200
  var knocks=[];
  var soundLoaded=0;
  var numSounds=15;
  const fallThreshold=0.6;
  var noKnockAvail=0;
  
  for(var i=0; i<numSounds; i++){
    knocks[i]=loadSound('./assets/coathanger.wav', function(){soundLoaded++;});
  }

  for(var i=0; i<numFallers; i++){
    fallers.push(new Faller(random(width), random(-100,height-50), random(5,20),random(60,200)));
  }
  
  this.run=function(bPos, soundIsOn){
    soundOn=soundIsOn;
    fallers.forEach(function(f){
      f.show();
      bPos.forEach(function(pos){
        f.isKnocked(pos.x, pos.y);
        ellipse(pos.x, pos.y,10,10);
      });
      f.update();
    });
  };
  
  function findFreeKnock(){
    var knock; 
    knocks.forEach(function(k){
      if(!k.isPlaying()){
        knock=k;
      }
    });
    return knock;
  }

  function Faller(x, y, w, h){
    var grown=0;
    var nearlyH=h*0.95;
    var pos=createVector(x,y);
    var vel=createVector(0,0);
    var acc=createVector(0,0);
    var falling=false;
    var knocked=false;
    var aAcc=0;
    var aVel=0;
    var angle=0;
    var recentlyKnocked=0;
    var fallSound=true;
    
    this.applyAngForce=function(force){
      aVel+=force;
    };
    
    this.applyForce=function(force){
      acc.add(force);
    };
    
  
  
    this.isKnocked=function(px, py){
      if(px>=x-w/2 && px<= x+w/2 && py>y && py<y+h){
        forceMag=(py-y)/h;
        if(recentlyKnocked===0){
          if(soundLoaded===numSounds){
            var knock=findFreeKnock();
            if(knock && soundOn){
              knock.play(0,(1-forceMag)/6+0.7,0.1);//(1-forceMag)/6+1
            }else{
              noKnockAvail++;
              // console.log(noKnockAvail);
            }
          }else{
          }
          recentlyKnocked=20;
        }
        force=-(x-px)/20;
        this.applyAngForce(force*forceMag/2);
        
        knocked=true;
      } else {
        knocked=false;
      }
    };
  
    
    this.update=function(){
      if(recentlyKnocked>0){
        recentlyKnocked--;
      }    
      if(grown<h){
        grown+=(h-grown)/40;
      }
      if(true){
        aAcc = (-1 * gravity.y / h) * sin(angle);
        aVel += aAcc;
        angle += aVel;
        aVel *= damping;
        if(abs(angle)>fallThreshold){
          falling=true;
          if(soundLoaded===numSounds && fallSound){
            var knock=findFreeKnock();
            if(knock && soundOn){
              knock.play(0,random(0.3,0.8),0.2);
            }else{
              noKnockAvail++;
              // console.log(noKnockAvail);
            }
            fallSound=false;
          }
        }
      }
      if(falling){
        this.applyForce(gravity);
        vel.add(acc);
        vel.mult(drag);
        pos.add(vel);
        acc.mult(0);
      }
      if(pos.y>height+h || pos.y<0-h || pos.x<0-w || pos.x>width+w){
        pos=createVector(x,y);
        vel=createVector(0,0);
        falling=false;
        fallSound=true;
        grown=0;
        aVel=0;
        angle=PI/8;
      }
    };
    
    this.show=function(){
      push();
      //rectMode(CENTER);
      translate(pos.x, pos.y);
      rotate(angle);
      var col=map(abs(angle)%PI,0,PI/2,255,0);
      if(falling){
        fill(255-col,0,0,150);
      } else {
        fill(255,col,col,100);
      }
      noStroke();
      // fill(255,100);
      ellipseMode(CORNER);
      ellipse(-grown/20,0,grown/10,grown);
      //rect(-grown/20,0,grown/10,grown);
      pop();
    };
  }
  
}

//*****************************
// ThemeCracker
//*****************************


  function ThemeCracker(w,h){
  // function Cracker(){
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
      return (count>500);
 
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


//*****************************
// ThemePlasma1
//*****************************


  function ThemePlasma1(w,h){
  // function PlasmaBalls(){
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


//*****************************
// ThemeStrings
//*****************************


  function ThemeStrings(w,h){
  // function Strings(){
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


//*****************************
// ThemeBounceChain
//*****************************

  
  function ThemeBounceChain(w,h){

  // function ChainSet(){
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
        acc=createVector(x,0);
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


//*****************************
// ThemeRepelWobble
//*****************************

  
  function ThemeRepelWobble(w,h){
  // function ChainSet(){
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
      };
      
      this.get=function(){
        return pos;
      };
      
      this.show=function(){
        push();
        translate(0,height/2);
        fill(col,255,180,100);
        //stroke(col,255,255,255);
        // noStroke();
        ellipse(pos.x,pos.y,rad,rad);
        pop();
      };
    }
  }

//*****************************
// ThemeFlipper
//*****************************


  function ThemeFlipper1(w,h){

  // function FlipSet(){
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


//*****************************
// ThemeFlyThrough
//*****************************

  
  function ThemeFlyThrough(w,h){
  // function FlyThrough(){
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
        var scl=(maxBack-zPos)/maxBack*2;
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
      };
      
      this.getZ=function(){
        return zPos;
      };
    }
  }

//*****************************
// ThemeCrapTextScroller
//*****************************


  function getGlobalParamPos(span){
    var relPos=0;
    if(globalParams[2]){
      var p2=globalParams[2];
      var ellapsedSinceRefresh=(Date.now()-p2.myTimeStamp);
      var newVal;
      newVal=p2.last+ellapsedSinceRefresh*p2.stepPerMS;
      relPos=span+newVal%span;
    }
    return relPos;
  }
  


  function ThemeTextScroller(w,h){
    var textSet=false;
  // function CrapTextScroll(){
    // var o=new OSB(w,h,"My God! It's full of stars.... ");
    var o=null;
    var ringsWithinBuffCount=0;

    this.run=function(bPos, soundOn, paramsIn){
    //this.run=function(){
      // var textPos=absParamPos;
      // var off=myStartX-textPos;
      // o.show(width, off);
      if(!textSet){
        o=new OSB(w,h,paramsIn.messages[0]);
        textSet=true;
      }else{
        o.show(w);
      }
    };
  
    function mapParamToBuffSize(bs, sx){
      // var bs=floor(buffSize/scl);

      var newVal=(absParamPos-sx)%bs;
      // var over=floor(bs/themesRingLength);
      
      //newVal=absParamPos;
      return newVal;
    }

    function OSB(w,h,myText){
      var scl=1;
      var myH=floor(h*scl);
      var myW=floor(w*scl);
      textSize(300);//myH*0.7);
      var txtSize=floor(textWidth(myText));
      //console.log(txtSize+" "+myW);
      var buffSize=txtSize;//+myW*2;
      //console.log(buffSize);
      var offX=0;
      
      var buffer=createGraphics(buffSize, myH);
      buffer.background(0);
      buffer.fill(255);
      buffer.noStroke(0);
      buffer.textSize(300);//myH*0.7);
      buffer.text(myText,0,(myH-300)/2+300*0.7);
      
      
      this.show=function(chunkW){//(chunkW, offX){
        var newRelPos=buffSize-mapParamToBuffSize(floor(buffSize/scl), myStartX);
        // var newRelPos=getGlobalParamPos(floor(buffSize/scl));
        //var textPos=absParamPos;
        var offX=newRelPos;//+myStartX;
        //console.log("OSB buffsize:"+buffSize+" app:"+floor(absParamPos)+" nrp: "+floor(newRelPos)+" offX:"+floor(offX));
        // if(frameCount%10===0) console.log(">>>>> "+newRelPos);
        myOffX=floor(offX*scl);//%buffSize;
        if(myOffX<0){
          myOffX+=buffSize;
        }
        if(myOffX>buffSize){
          myOffX-=buffSize;
        }
        //console.log(floor(absParamPos)+" "+floor(newRelPos)+" "+myOffX+" "+buffSize);
        // console.log(buffSize+" "+newRelPos+" "+offX+" "+myOffX);
        var chunk;
        var ch=floor(chunkW*scl);
        var ch2;
        if(myOffX+ch>buffSize){
          ch2=myOffX+ch-buffSize;
          ch=ch-ch2;
          chunk=buffer.get(myOffX,0,ch,myH);
          var chunk2=buffer.get(0,0,ch2,myH);
          push();
          scale(1/scl);
          image(chunk,0,0);
          // fill(100,255,0);
          // stroke(255,0,0);
          // strokeWeight(2);
          // rect(0,0,ch,myH);
          // fill(100,0,255);
          // rect(ch,0,ch2,myH);
          image(chunk2,ch,0);
          pop();

        }else{
          chunk=buffer.get(myOffX,0,ch,myH);
          push();
          scale(1/scl);
          image(chunk,0,0);
          pop();
        }
      };
    }
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


//*****************************
// ThemeFlowDraw
//*****************************


function ThemeFlowDraw(w,h){
  var flowfield;
  var fieldForce=5;
  var step=40;
  var particles=[];
  var numParticles=5;
  var threshold=10;
  var touching=false;
  var showField=false;
  var noiseSeedVal=0;
  var params={};

  flowfield=new Flowfield(step);
  for(var i=0; i<numParticles; i++){
    particles[i]=new Particle(random(w),h/2);
  }
  //background(0);
  particles.push(new Particle(random(w),h/2, true));
  background(0);

  this.run=function(bPos, soundOn, paramsIn){
    params=paramsIn;
    if(noiseSeedVal===0){
      noiseSeedVal=params.seed;
      flowfield.initNoise(noiseSeedVal);
    }
    this.renderBackground();
    // background(0,2);
    flowfield.update();
    if(touching){
  //    flowfield.obstruct(mouseX, mouseY);
      flowfield.randomShift();
    }
    if(showField){
      flowfield.show();
    }
    for(var i=0; i<10; i++){
      particles.forEach(function(p){
        p.follow(flowfield);
        p.show();
      })
    }
    // fill(255);
    // text(floor(frameRate()),20,h-20);
  };

  this.runBlobs=function(blobs){
    // console.log("Blob count: "+blobs.howMany());
    var myBlobs=blobs.getBlobs();
    myBlobs.forEach(function(b){
      b.show(true);
      b.update();
    })
    // console.log("I am running the Blobs now!");
  };

  this.renderBackground=function(){
    background(40,2);
  }



  function Flowfield(step){
    var field;
    var wf=floor(w/step);
    var hf=floor(h/step);
    var xOff=0;
    var xOffInc=0.05;
    var yOff=0;
    var yOffInc=0.05;
    var xShift=0.01;
    var yShift=0;
    noiseSeed(10);

    this.initNoise=function(newSeed){
      noiseSeed(newSeed);
    }

    
    this.update=function(){
      field=[];
      for(var y=0; y<hf; y++){
        var row=[];
        for(var x=0; x<wf; x++){
          xOff=(Date.now()%33)*xShift;
          row[x]=noise(xOff+(myStartX+x)*xOffInc, yOff+y*yOffInc);
        }
        field[y]=row;
      }
      //xOff+=xShift;
      yOff+=yShift;
    };
    
    this.update();
    
    this.flowAt=function(tx, ty){
      if(field){
        var x=constrain(floor(tx/step),0,wf-1);
        var y=constrain(floor(ty/step),0,hf-1);
        if(field[y]){
          // console.log(field.length+" "+field[y].length+" "+tx+" "+x+", "+ty+" "+y);
          return field[y][x];
        }
      }
    }
    
    this.obstruct=function(tx,ty){
      var txs=floor(tx/step);
      var tys=floor(ty/step);
      console.log(tx+" "+txs);
      for(var y=0; y<hf; y++){
        for(var x=0; x<wf; x++){
          var d=dist(txs,tys, x, y);
          if(d<threshold){
            var v=createVector(txs,tys);
            var spot=createVector(x,y);
            spot.sub(v);
            spot.normalize();
            var val=map(spot.heading(),-PI/2, PI/2,0,1);
            field[y][x]=val;
          }
        }
      }
    }
    
    this.randomShift=function(){
      xOff+=random(1);
    }
    
    this.show=function(){
      push();
      for(var y=0; y<hf; y++){
        for(var x=0; x<wf; x++){
          var c=map(field[y][x],0,1,0,255);
          fill(c);
          noStroke();
          //rect(x*step,y*step,step,step);
          
          var a=map(field[y][x],0,1,-PI,PI);
          push();
          translate(x*step+step/2,y*step+step/2);
          rotate(a);
          stroke(255);
          strokeWeight(0.5);
          noFill();
          line(-step/2,0,step/2,0);
          pop();
        }
      }
      pop();
    }
  }
  
  function Particle(x,y,special){
    this.special=special;
    var pos=createVector(x,y);
    var vel=createVector(0,0);
    var acc;
    var lim=5;
    var prev;
    var sw=0;
    var swa=0;
    var swainc=PI/random(50,200);
    console.log(special);
    
    this.follow=function(flow){
      // console.log(" "+this.special);
      prev=pos.copy();
      acc=p5.Vector.fromAngle(map(flow.flowAt(pos.x, pos.y),0,1,-PI, PI));
      acc.mult(fieldForce);
      vel.add(acc);
      if(special){
        vel.limit(lim*2);
      } else {
        vel.limit(lim);
      }
      pos.add(vel);
      edges();
    };
    
    function edges(){
      if(pos.x>w){
        pos.x=0;
        prev.x=0;
        vel=p5.Vector.random2D();
      } 
      if(pos.x<0){
        pos.x=w-1;
        prev.x=w-1;
        vel=p5.Vector.random2D();
      } 
      if(pos.y>h){
        pos.y=0;
        prev.y=0;
        vel=p5.Vector.random2D();
      } 
      if(pos.y<0){
        pos.y=h-1;
        prev.y=h-1;
        vel=p5.Vector.random2D();
      } 
    }
    
    this.show=function(){
      swa+=swainc;
      sw=sin(swa)*10+5;
      noFill();
      if(special){
        strokeWeight(2);
        stroke(250,0,0);
        line(prev.x, prev.y, pos.x, pos.y);
      } else {
        strokeWeight(sw);
        stroke(0,200,255,100);
        line(prev.x, prev.y, pos.x, pos.y);
      }
      // strokeWeight(3);
      // stroke(255);
      // line(prev.x, prev.y, pos.x, pos.y);
  
    }
  }
}

//*****************************
// ThemeCalmRings
//*****************************



function ThemeCalmRings(w,h){
  
  var rings=[];
  var numRings=5;
  var ror;
  for(var i=0; i<numRings; i++){
    rings[i]=new Ring(h/2+i*10);
  }
  ror=new RingOfRings(25);

  this.run=function(){
    rings.forEach(function(ring){
      ring.show();
      ring.update();
    });
    ror.run();
  }

  function RingOfRings(qtyR){
    var rot=TWO_PI/qtyR;
    var maxiRad=100;
    var miniRad=20;
    var colr=random(250,255);
    var pulseA=0;
    var pulseAInc=PI/100;
    
    
    this.run=function(){
      var miniMod=miniRad*2*cos(pulseA*2)+miniRad;
      var maxiMod=sin(pulseA)*maxiRad+maxiRad*2;
      // strokeWeight(miniMod*1.2);
      // stroke(0);
      // ellipse(width/2,height/2,maxiMod*2, maxiMod*2);
  
      for(var i=0; i<qtyR; i++){
        this.show(rot*i, pulseA, maxiMod, miniMod);
      }
      pulseA+=pulseAInc;
    }
    
    this.show=function(myRot, pulser,maxiMod, miniMod){
      push();
      translate(w/2, h/2);
      rotate(myRot+pulser+sin(pulser)*PI/2);
      fill(miniMod*3+60,0,0);
      //strokeWeight(2);
      noStroke();
      //stroke(colr,0,0);
      ellipse(maxiMod,0,miniMod, miniMod);
      stroke(miniMod*3+60,0,0);
      noFill();
      var echoRingRad=sin(pulser);
      strokeWeight(miniMod/10);
      ellipse(maxiMod,0,miniMod*2*echoRingRad+miniMod, miniMod*2*echoRingRad+miniMod);
      pop();
    }
    
  }
  
  function Ring(r){
    var rad=r;
    var pulseA=random(PI);
    var pulseAInc=PI/random(80,150);
    var sw;
    var colr=floor(random(100,255));
    var colb=floor(random(0,colr));
    
    this.show=function(){
      noFill();
      stroke(colr,0,colb,150);
      strokeWeight(sw*1.2);
      ellipse(w/2, h/2, rad*2, rad*2);
      stroke(colr,0,0);
      strokeWeight(sw);
      ellipse(w/2, h/2, rad*2, rad*2);
    }
    
    this.update=function(){
      pulse=sin(pulseA);
      pulseA+=pulseAInc;
      rad=pulse*r/2+r/2;
      sw=cos(pulseA)*r/5+r/5;
    }
  }

}

//*****************************
// ThemeHoneyCombLight
//*****************************


function ThemeHoneyCombLight(ww, wh){
  var w,h;
  var step=50;
  var hStep;
  var dots=[];
  var a=0;
  var aInc;
  var rMult=1;
  var shiftA=0;
  var shiftAInc;
  var shiftPhaseInc=0;//PI/100;
  var shiftDisplace=20;
  var centre;
  
  shiftAInc=-PI/20;
  centre =createVector(ww/2, wh/2);
  aInc=PI/1000;
  //background(0);
  hStep=sin(PI/3)*step;
  w=floor(ww/step/sin(PI/6));
  h=floor(wh/step/sin(PI/6));
  yPos=hStep/2;
  for(var y=0; y<h; y++){
    yPos+=hStep;
    xPos=(y%2)*step/2;
    for(var x=0; x<w; x++){
      xPos+=step;
      if((x-(y%2))%3!==0){
        var d=new Dot(xPos, yPos);
        // stroke(255);
        // ellipse(xPos,yPos,step,step);
        dots.push(d);
      }
    }
  }
  
  this.run=function(bPos){
    dots.forEach(function(dot){
      dot.update(bPos);
      //dot.shift(shiftA, shiftDisplace, shiftPhaseInc);
      dot.show();
    });
    shiftA+=shiftAInc;
    rMult=0;
    bPos.forEach(function(b){
      var d=dist(b.x, b.y, ww/2, wh/2);
      if(d<wh/8)
        rMult+=map(wh/8-d,0,wh/8,1,4);
      else
        rMult=+1;
    });
    
  }

  function Dot(x,y){
    var alph;
    var r;
    var  shiftX=0;
    var shiftY=0;
    var trail=[];
    var maxTrail=5;
    
    this.noupdate=function(tx, ty){
      var d=dist(x+shiftX,y+shiftY,tx,ty);
      var invD=ww-d;
      
        if(d<ww/2)
          r=map(d,0,ww/2,step,2);
        else
          r=1;
        alph=map(d, 0, ww, 255,100);
      // r*=rMult;
      
    }
    
    this.update=function(blobPos){
      r=1;
      alph=1;
      
      blobPos.forEach(function(b){
        var d=dist(x+shiftX,y+shiftY,b.x, b.y);
        var invD=ww-d;
        if(d<ww/2)
          r+=map(d,0,ww/2,step,2);
        else
          r+=0;
        alph+=map(d, 0, ww, 255,100);
      });
    }
    
    this.shift=function(shiftAngle, shiftDisplace, phaseInc){
      var d=dist(x,y,centre.x, centre.y);
      var shiftPhase=d*PI/100;//TWO_PI*(d%shiftDisplace)/shiftDisplace;
      var sinAngle=sin(shiftAngle+shiftPhase)*shiftDisplace;
      var pos=createVector(x,y);
      pos.sub(centre);
      pos.normalize();
      var m=pos.mag();
      pos.setMag(m+sinAngle);
      //pos.mult(sinAngle);
      shiftX=pos.x;
      shiftY=pos.y;
    }
    
    this.show=function(){
      noStroke();
      fill(255,0,0,alph);
      ellipse(x+shiftX-5,y+shiftY+3,r,r);
      fill(0,255,0,alph);
      ellipse(x+shiftX,y+shiftY-5,r,r);
      fill(0,0,255,alph);
      ellipse(x+shiftX+5,y+shiftY+3,r,r);
      fill(255,255);
      ellipse(x+shiftX,y+shiftY,r*rMult,r*rMult);
    }
    
  }
}
