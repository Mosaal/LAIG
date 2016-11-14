function CircularAnimation(id, span, type, centerx, centery, centerz, radius, startang, rotang) {
	Animation.call(this, id, span, type);
	
	this.centerx = centerx;
	this.centery = centery;
	this.centerz = centerz;
	this.radius = radius;
	this.startang = startang;
	this.rotang = rotang;
}

CircularAnimation.prototype.animate = function() {

};