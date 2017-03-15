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
    };
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