// function ThemeBlank(name, w,h){
//   this.id=nextThemeId++;
//   this.name=name;
//   //this.lifeSpan=0;

//   initTheme();

//   function initTheme(){
//   }
  
//   this.init=function(){
//     initTheme();
//   };

//   this.run=function(){
//     this.show();
//     this.update();
//   };

//   this.show=function(){
//   };

//   this.update=function(){
//   };
// }


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





