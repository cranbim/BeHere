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
      textFont('monospace');
      textSize(300);//myH*0.7);
      var txtSize=floor(textWidth(myText));
      //console.log(txtSize+" "+myW);
      var buffSize=txtSize;//+myW*2;
      //console.log(buffSize);
      var offX=0;
      
      var buffer=createGraphics(buffSize, myH);
      buffer.background(0);
      buffer.fill(100);
      buffer.stroke(200,40,40);
      buffer.strokeWeight(20);
      buffer.textFont('monospace');
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
  