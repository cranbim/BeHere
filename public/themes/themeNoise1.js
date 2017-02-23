//*****************************
// Theme Noise1
//*****************************


  function ThemeNoise1(w,h){
  // function NoiseStripes(){

    var a=0;
    var aInc=0;//0.01;
    var field;
    var lines;
    var lineWidth=5;
    var amplitude=5;
    var avgX=100;
		var avgY=100;
    var numNoiseStepsX=20;
    var numLines=20;

    field=new NoiseField(numNoiseStepsX,0.04);
    lines=new Lines(numNoiseStepsX, numLines);
    smooth();
  

    this.run=function(bPos) {
    	var nAvgX=0;
    	var nAvgY=h/2;
			var count=bPos.length;
			if(bPos){
				if(bPos.length>0){
					nAvgY=bPos.reduce(function(p,n){
						return p+n.y;
					},0)/count;
					nAvgX=bPos.reduce(function(p,n){
						return p+n.x;
					},0)/count;
					// avgX+=(nAvgX-avgX)/10;
					// avgY+=(nAvgY-avgY)/10;
				} else {
					var nAvgX=0;
    			var nAvgY=h/2;
				}
			}else {
				var nAvgX=0;
    		var nAvgY=h/2;
			}
			// if(nAvgY<1)nAvgY=h/2;
			// if(nAvgX<1)nAvgX=w/2;
			avgX+=(nAvgX-avgX)/10;
			avgY+=(nAvgY-avgY)/10;
			//console.log(">>> "+count+" >>> "+avgY);
			// refresh(avgY, avgX);
			refresh(avgX, avgY);
			//field.show();
			lines.show(field, amplitude);
			field.shift(0.1,0.5);
			field.update();
    };

    function refresh(x, y){
      var near=dist(x,0,w/2,0);
      amplitude=map(near,0,w/2,numLines*4,1);
      lineWidth=map(y,0,h,0.1,50);
    }

    function Lines(nX, nY){
      var stepX=width/nX;
      var stepY=height/nY;
      var h=nY;//floor(height/stepY);
      var w=nX;//floor(width/stepX);
      
      this.show=function(field, amp){
        push();
        translate(width/2, height/2);
        rotate(a);
        translate(-width/2, -height/2);
        translate(0,-amp*5);
        strokeWeight(lineWidth);
        stroke(255,120,0,100);
        noFill();
        for(var y=0; y<h; y++){
          beginShape();
          var f;
          for(var x=0; x<w; x++){
            f=field.noiseAtLerp(x*stepX,y*stepY);
            vertex(x*stepX,y*stepY+f*stepY*amp);
          }
          vertex(x*stepX+1,y*stepY+f*stepY*amp);
          endShape();
        }
        pop();
        a+=aInc;
      };
    }

    function NoiseField(wx, noiseLevel){
      var step=floor(width/wx);
      var w=wx; //floor((width+step)/step);
      var h=floor(height/step);
      var field=[];
      var nStep=noiseLevel;
      var nXOff=0;
      var nYOff=0;
      
      for(var y=0; y<h; y++){
        var row=[];
        for(var x=0; x<w; x++){
          var n=noise(x*nStep+nXOff, y*nStep+nYOff);
          row.push(n);
        }
        field.push(row);
      }
      
      this.noiseAt=function(x,y){
        var xf=floor(x/step);
        var yf=floor(y/step);
        return field[yf][xf];
      };
      
      this.noiseAtLerp=function(x,y){
        var xf=floor(x/step);
        var xl=x%step;
        var yf=floor(y/step);
        var yl=y%step;
        var xn, yn;
        var res=0;
        if(field){
          if(yf>=field.length) yf-=1;
          if(yf+1>=field.length)yn=yf; else yn=yf+1;
          if(yn>=field.length) yn-=1;
          if(xf>=field[yf].length) xf-=1;
          if(xf+1>=field[yn].length)xn=xf; else xn=xf+1;
          var noiseHere=field[yf][xf];
          var noiseXNext=field[yf][xn];
          var noiseYNext=field[yn][xf];
          var lerpX=lerp(noiseHere, noiseXNext, xl/step);
          var lerpY=lerp(noiseHere, noiseYNext, yl/step);
          res=(lerpX+lerpY)/2;
        }
        return res;
      };
      
      this.update=function(){
        field=[];
        for(var y=0; y<h; y++){
          var row=[];
          for(var x=0; x<w; x++){
            var n=noise(x*nStep+nXOff, y*nStep+nYOff);
            row.push(n);
          }
          field.push(row);
        }
      };
      
      this.show=function(){
        for(var y=0; y<field.length; y++){
          for(var x=0; x<field[y].length; x++){
            var c=map(field[y][x], 0, 1, 0, 255);
            noStroke();
            fill(c);
            rect(x*step, y*step, step, step);
          }
        }
      };
      
      this.shift=function(x,y){
        nXOff+=nStep*x;
        nYOff+=nStep*y;
      };
    }
  }