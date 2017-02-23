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