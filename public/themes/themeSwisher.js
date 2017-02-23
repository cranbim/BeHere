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
    };
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
