function SubtleMeta(w,h){
	var maxBright=100;
	var minBright=10;
	var fade=100;
	var fadeA=0;
	var fadeAInc=PI/100;
	var colCycle=50;
	var colInc=1;

	this.show=function(pos,id){
		push();
		textSize(h/20);
		fill(colCycle,fade);
		noStroke();
		//console.log(pos, typeof(pos));
		if(typeof(pos)==="number")
			text(pos,w*3/5,h-h/10);
		if(id)
			text(id,w*4/5,h-h/10);
		fadeA+=fadeAInc;
		if(fadeA>TWO_PI) fadeA-=TWO_PI;
		fade=sin(fadeA)*maxBright/2+maxBright/2+minBright;
		colCycle+=colInc;
		if(colCycle>200 || colCycle<50) colInc*=-1;
		pop();
	};

}