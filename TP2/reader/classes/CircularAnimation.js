function CircularAnimation(id, span, type, centerx, centery, centerz, radius, startang, rotang) {
	Animation.call(this, id, span, type);
	var degToRad = Math.PI / 180.0;
	
	this.centerx = centerx;
	this.centery = centery;
	this.centerz = centerz;
	this.radius = radius;
	this.startang = startang * degToRad;
	this.rotang = rotang * degToRad;
}

CircularAnimation.prototype = Object.create(Animation.prototype);
CircularAnimation.prototype.constructor = CircularAnimation;

CircularAnimation.prototype.getTransformation = function(deltaTime) {
	var transf = mat4.create();
	
	mat4.translate(transf, transf, vec3.fromValues(this.centerx, this.centery, this.centerz));
	if (deltaTime > this.span)
		mat4.rotate(transf, transf, this.startAng + this.rotAng, [0, 1, 0]);
	else
		mat4.rotate(transf, transf, this.startAng + (deltaTime / this.span) * this.rotAng, [0, 1, 0]);
	mat4.translate(transf, transf, [this.radius, 0, 0]);

	//if(this.rotAng > 0)
		//mat4.rotate(transf, transf, Math.PI, [0, 1, 0]);

	return transf;
};