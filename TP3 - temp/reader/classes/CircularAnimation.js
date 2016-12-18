function CircularAnimation(scene, id, span, type, centerx, centery, centerz, radius, startang, rotang) {
	Animation.call(this, scene, id, span, type);
	this.degToRad = Math.PI / 180.0;

	this.radius = radius;
	this.centerx = centerx;
	this.centery = centery;
	this.centerz = centerz;

	this.rotang = rotang * this.degToRad;
	this.angle = startang * this.degToRad;
	this.startang = startang * this.degToRad;
	this.finalAng = this.startang + this.rotang;

	this.velocity = this.rotang / this.span;
}

CircularAnimation.prototype = Object.create(Animation.prototype);
CircularAnimation.prototype.constructor = CircularAnimation;

CircularAnimation.prototype.applyAnimation = function(currTime) {
	if (this.lastTime == 0) {
		this.lastTime = currTime;
	} else {
		var deltaTime = (currTime - this.lastTime) / 1000;

		this.lastTime = currTime;
		this.angle += this.velocity * deltaTime;

		if (Math.abs(this.angle) >= Math.abs(this.finalAng))
			this.done = true;
	}

	this.scene.translate(this.centerx, this.centery, this.centerz);
	this.scene.rotate(this.angle, 0, 1, 0);
	this.scene.translate(this.radius, 0, 0);
};

CircularAnimation.prototype.resetAnimation = function() {
	this.done = false;
	this.lastTime = 0;
	this.angle = this.startang;
};