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

