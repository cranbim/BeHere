//CHANGED

//129 connected

	// statusMessage.html("Connected");
 //  geometry.html("Width "+myWidth+" startX:"+myStartX+" endX:"+myEndX);
  // button.mouseClicked(joinMe);
  // attachButton.mouseClicked(attachMe);

 //146 disconnected
 // button.html("Nothing");

 //179 keypressed
  //  if(hideMeta) metaDiv.hide();
  // else metaDiv.show();

  //222 setSTartX
    // geometry.html("Width "+myWidth+" startX:"+myStartX+" endX:"+myEndX);

//236 updateringpos
  // position.html(data.pos);

  //262 render offers
    if(!offersList){
    console.log("create offers list");
    offersList=createElement('ul');
    offersList.parent(offersDiv);
  }
  var oListTemp=selectAll('li',offersList);
  oListTemp.forEach(function(li){
    li.remove();
  });
  offers.forEach(function (offer){
    var offerString="Offer to attach between "+offer.prev+" and "+offer.next+" expires in:"+(offer.expires-Date.now());
    var li=createElement('li');
    li.parent(offersList);
    var el=createP(offerString);
    var acceptOfferButton=createButton("accept offer");
    li.child(el);
    li.child(acceptOfferButton);
    acceptOfferButton.mouseClicked(handleAcceptOffer);
    acceptOfferButton.attribute("data-offer",offer.id);
  });

  //287 handle accpet offer
//not copied

//306 attached to ring
//   statusMessage.html('Attached to Ring '+data.ring);
//   // attachButton.html('detach');
//   detachButton.show();
//   attachButton.hide();
//   permitButton.show();
//   // detachButton.mouseClicked(detachFromRing);
//   // permitButton.mouseClicked(permitAttacher);

// //331 process detach
//   statusMessage.html('Joined, but detached');
//   attachButton.html('detach');
//   detachButton.hide();
//   permitButton.hide();
//   attachButton.show();
//   geometry.html("Width "+myWidth);

// //349 setId
//   idnum.html(id);

//361 joinme
//  ,,,,
//FINISHED


//ORIGINAL

//129 connected
statusMessage.html("Connected");
  geometry.html("Width "+myWidth+" startX:"+myStartX+" endX:"+myEndX);
  button.mouseClicked(joinMe);
  attachButton.mouseClicked(attachMe);

 //146 disconnected
 button.html("Nothing");

 //179 keypressed
   if(hideMeta) metaDiv.hide();
  else metaDiv.show();

  //222 setSTartX
    geometry.html("Width "+myWidth+" startX:"+myStartX+" endX:"+myEndX);

//236 updateringpos
  position.html(data.pos);

  //262 render offers
    if(!offersList){
    console.log("create offers list");
    offersList=createElement('ul');
    offersList.parent(offersDiv);
  }
  var oListTemp=selectAll('li',offersList);
  oListTemp.forEach(function(li){
    li.remove();
  });
  offers.forEach(function (offer){
    var offerString="Offer to attach between "+offer.prev+" and "+offer.next+" expires in:"+(offer.expires-Date.now());
    var li=createElement('li');
    li.parent(offersList);
    var el=createP(offerString);
    var acceptOfferButton=createButton("accept offer");
    li.child(el);
    li.child(acceptOfferButton);
    acceptOfferButton.mouseClicked(handleAcceptOffer);
    acceptOfferButton.attribute("data-offer",offer.id);
  });

  //287 handle accpet offer
//not copied

//306 attached to ring
  statusMessage.html('Attached to Ring '+data.ring);
  // attachButton.html('detach');
  detachButton.show();
  attachButton.hide();
  permitButton.show();
  detachButton.mouseClicked(detachFromRing);
  permitButton.mouseClicked(permitAttacher);

//331 process detach
  statusMessage.html('Joined, but detached');
  attachButton.html('detach');
  detachButton.hide();
  permitButton.hide();
  attachButton.show();
  geometry.html("Width "+myWidth);

//349 setId
  idnum.html(id);

//361 joinme
    p5Hidden=false;
    p5canvas.show();
    button.html('un-Join');
    connectionStatus=1;
    statusMessage.html('Joined');
    attachButton.show();

   p5Hidden=true;
    p5canvas.hide();
    button.html('Join');
    connectionStatus=0;
    statusMessage.html('Connected');
    attachButton.hide();    

//383 attachme
	  statusMessage.html('Requested attachment to Ring');













