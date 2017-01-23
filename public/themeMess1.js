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


function ThemeTextScroller(name, w,h){
  this.id=nextThemeId++;
  this.name=name;
  //this.lifeSpan=0;
  var ts;

  initTheme();

  function initTheme(){
    ts=new CrapTextScroll();
  }
  
  this.init=function(){
    initTheme();
  };

  this.run=function(blobPos){
    ts.run();
  };
  

  function CrapTextScroll(){
    var o=new OSB(w,h,"hello my friends, the time has come");
    
    this.run=function(){
      o.show(width, off);
    };
  }

  function OSB(w,h,myText){
    var scl=1;
    var myH=floor(h*scl);
    var myW=floor(w*scl);
    textSize(myH*0.7);
    var txtSize=floor(textWidth(myText));
    //console.log(txtSize+" "+myW);
    var buffSize=txtSize+myW*2;
    //console.log(buffSize);
    var offX=0;
    
    var buffer=createGraphics(buffSize, myH);
    buffer.background(0);
    buffer.fill(255);
    buffer.noStroke(0);
    buffer.textSize(myH*0.7);
    buffer.text(myText,myW,myH*0.7);
    
    
    this.show=function(chunkW, offX){
      myOffX=floor(offX*scl)%buffSize;
      while(myOffX<0){
        myOffX+=buffSize;
      }
      console.log(buffSize+" "+offX+" "+myOffX);
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
    
    this.showWhole=function(){
      push();
      translate(0,200);
      scale(0.1);
      image(buffer,10,0);
      pop();
    }
  }

}





