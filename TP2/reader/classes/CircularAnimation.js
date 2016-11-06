function CircularAnimation(id, span, type, center, radius, startang, rotang) {
	Animation.call(this, id, span, type);
	
	this.center = center;
	this.radius = radius;
	this.startang = startang;
	this.rotang = rotang;
}