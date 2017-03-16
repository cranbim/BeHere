//Plasma Ring 
//Dave Webb, Cranbim 2016, 2017
//blobs.js 
//Objects to manage blobs

/*****************************************
  MyBlobs and integral Blob objects
  ******************************************/
function AllBlobs(){
  var prev=500;
  var next=500;

  this.allBlobs=[];
  this.allCount=0;
  this.allTotalX=0;
  this.allTotalY=0;
  this.allAvgX=0;
  this.allAvgY=0;
  this.prevCount=0;
  this.prevTotalX=0;
  this.prevTotalY=0;
  this.prevAvgX=0;
  this.prevAvgY=0;

  this.reset=function(){
    this.allBlobs=[];
    this.allCount=0;
    this.allTotalX=0;
    this.allTotalY=0;
    this.allAvgX=0;
    this.allAvgY=0;
    this.prevCount=0;
    this.prevTotalX=0;
    this.prevTotalY=0;
    this.prevAvgX=0;
    this.prevAvgY=0;
  };

  this.addBlob=function(blob){
    this.allCount++;
    this.allTotalX+=blob.x;
    this.allAvgX=this.allTotalX/this.allCount;
    this.allTotalY+=blob.y;
    this.allAvgY=this.allTotalY/this.allCount;
    this.allBlobs.push({x:blob.x, y:blob.y});
    if(blob.x>(myStartX-prev) && blob.x<myStartX){
      this.prevCount++;
      this.prevTotalX+=blob.x;
      this.prevTotalY+=blob.y;
      this.prevAvgX=this.prevTotalX/this.prevCount;
      this.prevAvgY=this.prevTotalY/this.prevCount;
    }
  };

  this.writeAll=function(){
    console.log("AllBlobs "+this.allCount+" avX:"+this.allAvgX+" avY:"+this.allAvgY);
    console.log("All prev"+this.prevCount+" avX:"+this.prevAvgX+" avY:"+this.prevAvgY);
  };
}


function MyBlobs(){
  blobs=[];

  this.getBlobs=function(){
    return blobs;
  };

  this.addBlob=function(data){
    var b=new Blob(data);
    blobs.push(b);
  };

  this.exists=function(data){
    return blobs.find(function(blob){
      return data.id===blob.id;
    });
  };

  this.runPlusMove=function(showBlobs){
    for(var i=blobs.length-1; i>=0; i--){
      if(showBlobs) blobs[i].show();
      blobs[i].update();
      if(!blobs[i].life()){
        blobs.splice(i,1);
      }
    }
  };

  this.runOnly=function(showBlobs){
    for(var i=blobs.length-1; i>=0; i--){
      // if(showBlobs) blobs[i].show();
      // blobs[i].update();
      if(!blobs[i].life()){
        blobs.splice(i,1);
      }
    }
  };

  this.getPos=function(){
    bPos=[];
    blobs.forEach(function(b){
      bPos.push({
        x:b.pos.x-myStartX-marginLeft,
        y:b.pos.y,
        vel: {x: b.vel.x, y: b.vel.y}
      });
    });
    return bPos;
  };

  this.empty=function(){
    blobs=[];
  };

  this.howMany=function(){
    return blobs.length;
  };

  function Blob(data){
    this.id=data.id;
    this.bloboid=new Bloboid(this.id);
    this.ttl=data.ttl;
    this.x=data.x;
    this.y=data.y;
    this.pos=createVector(this.x,this.y);
    this.vel=createVector(1,0);
    if(data.vel){
      this.vel=createVector(data.vel.x, data.vel.y);
    }
    this.prevailing=createVector(5,0);
    var rr=0; var rg=255; var rb=150;
    var er=255; var eg=0; var eb=0;
    var drag=0.98;
    var lim=width/40;
    var steer=5;
    var maxTTL=1000;



    this.oldshow=function(){
      push();
      translate(this.x-myStartX, this.y);
      stroke(255,0,150);
      if(this.ttl>100){
        fill(0,255,150);
      } else {
        fill(255,0,0);
      }
      ellipse(0,0,30,30);
      pop();
    };

    this.show=function(green){
      this.bloboid.addPoint(this.x-myStartX-marginLeft, this.y);
      var ra=map(this.ttl, maxTTL, 100, 0, 255);
      var ga=255-ra;
      var ba=0;
      if(green){
        ra=0; ga=255; ba=0;
      }
      var flicker=false;
      if(this.ttl<200){
        flicker=true;
        ra=255;
        ga=0;
      }
      this.bloboid.run(ra,ga,rb, flicker, this.ttl);
    };

    this.update=function(){
      this.pos=createVector(this.x,this.y);
      var acc=p5.Vector.fromAngle(random(-TWO_PI, TWO_PI));
      acc.mult(steer);
      this.vel.mult(drag);
      this.vel.add(acc);
      this.vel.add(this.prevailing);
      this.vel.limit(lim);
      this.pos.add(this.vel);
      this.x=this.pos.x;
      this.y=this.pos.y;
      // this.x+=xInc;
      // this.ttl--;
      // if(this.x>=myEndX || this.x<myStartX){
      //   console.log("blob "+this.id+" just exited");
      //   socket.emit('blobUpdate',{
      //     id:this.id,
      //     x:this.x,
      //     y:this.y,
      //     vel: {x: this.vel.x, y: this.vel.y},
      //     ttl:this.ttl
      //   });
      // }
      if(this.y<0) this.y=height;
      if(this.y>height) this.y=0;
      // if(this.ttl%30<1) socket.emit('blobUpdate',{
      //   id:this.id,
      //    x:this.x,
      //    y:this.y,
      //    vel: {x: this.vel.x, y: this.vel.y},
      //    ttl:this.ttl
      //  });
      // return this.x>=myStartX && this.x<myEndX && this.ttl>0;
    };

    this.life=function(){
      this.ttl--;
      if(this.x>=myEndX || this.x<myStartX){
        console.log("blob "+this.id+" just exited");
        socket.emit('blobUpdate',{
          id:this.id,
          x:this.x,
          y:this.y,
          vel: {x: this.vel.x, y: this.vel.y},
          ttl:this.ttl
        });
      }
      if(this.ttl%30<1){
        socket.emit('blobUpdate',{
          id:this.id,
          x:this.x,
          y:this.y,
          vel: {x: this.vel.x, y: this.vel.y},
          ttl:this.ttl
        });
      }
      return this.x>=myStartX && this.x<myEndX && this.ttl>0;
    };

  }


  function Bloboid(id){
    var x, y;
    var trail=[];
    var maxTrail=3;
    
    this.run=function(r1,g1,b1, flicker, ttl){
      //this.addPoint(x,y);
      this.showTrail(r1,g1,b1, flicker, ttl);
    };
    
    this.addPoint=function(x,y){
      if(trail.length>maxTrail){
        trail.splice(0,1);
      }
      trail.push({x:x, y:y});
    };
    
    this.showTrail=function(r1,g1,b1, flicker, ttl){
      push();
      for(var i=0; i<trail.length; i++){
        var r=trail.length-i;
        // r*=r;
        r=2*i;
        // noFill();
        strokeWeight(1);
        fill(r1,g1,b1,map(i,0,trail.length, 10,255));
        stroke(r1,g1,b1,map(i,0,trail.length, 10,255));
        if(flicker){
          noFill();
          // if(i%2===0){
          //   noFill();
          // }
        }
        ellipse(trail[i].x, trail[i].y, r,r );
      }
      var x=trail[trail.length-1].x;
      var y=trail[trail.length-1].y;
      var relPos=floor((x+myStartX)/ringLength*100);
      // console.log(myStartX+" "+x+" "+ringLength+" "+relPos);
      //fill(255);
      if(!hideMeta){
        textSize(14);
        stroke(0);
        strokeWeight(1);
        fill(200,200);
        text(id,x+15,y-15);
        text((relPos+"%"),x+15,y);
        text(ttl,x+15,y+15);
      }
      pop();
    };
  }
}