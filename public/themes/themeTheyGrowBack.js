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