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

