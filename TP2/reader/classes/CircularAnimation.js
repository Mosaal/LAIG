function CircularAnimation(scene, id, span, type, centerx, centery, centerz, radius, startang, rotang) {
	Animation.call(this, scene, id, span, type);
	
	this.radius = radius;
	this.rotang = rotang;
	this.centerx = centerx;
	this.centery = centery;
	this.centerz = centerz;
	this.startang = startang;
	this.velocity = this.rotang / this.span;
}

CircularAnimation.prototype = Object.create(Animation.prototype);
CircularAnimation.prototype.constructor = CircularAnimation;

CircularAnimation.prototype.applyAnimation = function(currTime, component) {
	var degToRad = Math.PI / 180.0;

	if (currTime > this.span) {
		currTime = this.span;

		if (component.animationIndex < component.animations.length)
			component.animationIndex++;

		this.scene.time = 0;
		this.scene.elapsedTime = 0;
	}

	var currPosition = this.velocity * currTime;
	var currAngle = this.startang + currPosition;

	this.scene.translate(this.centerx, this.centery, this.centerz);
	this.scene.rotate(currAngle, 0, 1, 0);
	this.scene.translate(this.radius, 0, 0);
};