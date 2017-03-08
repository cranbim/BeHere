function ThemeTransition(w,h){
  var col1=[255,255,255];
  var col2=[0,0,0];
  var col3=[255,20,120];
  
  var col=[0,0,0];
  var ttlInit=200;
  var ttlMid=floor(ttlInit/2);
  var ttl=ttlInit;
  var startC, endC;
  var startTTL, endTTL;
  var initialised=false;
  
  this.run=function(bPos, soundOn, paramsIn){
    if(!initialised){
      col1=paramsIn.cols[0];
      col2=paramsIn.cols[1];
      col3=paramsIn.cols[2];
      ttlInit=paramsIn.ttl[0];
      ttlMid=paramsIn.ttl[1];
      ttl=ttlInit;
      initialised=true;
    }
    // startTTL=
    // startC=
    for(var i=0; i<3; i++){
      col[i]=map(ttl, ttl>ttlMid? ttlInit: ttlMid, ttl>ttlMid? ttlMid: 0, ttl>ttlMid? col1[i]: col2[i], ttl>ttlMid? col2[i]: col3[i]);
    }
    this.show();
    ttl--;
    return ttl<0;
  };
  
  this.renderBackground=function(){
    background(40,2);
  };
  
  this.show=function(){
    background(col[0], col[1], col[2]);
  };
  
}