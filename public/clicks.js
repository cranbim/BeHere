//Plasma Ring 
//Dave Webb, Cranbim 2016, 2017
//clicks.js 
//Objects to manage clicks and visuals

/*****************************************
  Click response code
  ******************************************/

function runClicks(){
  for(var i=clicks.length-1; i>=0; i--){
    clicks[i].show();
    if(!clicks[i].update()) clicks.splice(i,1);
  }
}

function newClick(x,y){
  var c=new Click(x-myStartX-marginLeft,y);
  clicks.push(c);
  //statusBar.trigger("blob",0,10);
  socket.emit("newBlob",{device:id, x:x, y:y});
}

/*****************************************
  Click object constructor
  ******************************************/

function Click(x,y){
  var r=5;
  var rInc=3;
  var alpha=255;
  var ttl=30;

  this.show=function(){
    push();
    translate(x,y);
    stroke(0,150,230, alpha);
    strokeWeight(10);
    noFill();
    ellipse(0,0,r*2,r*2);
    strokeWeight(5);
    ellipse(0,0,r,r);
    pop();
  };

  this.update=function(){
    r+=rInc;
    ttl--;
    alpha=map(ttl,30,0,250,20);
    return ttl>0;
  };
}