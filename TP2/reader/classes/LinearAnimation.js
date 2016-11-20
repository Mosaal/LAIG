function LinearAnimation(scene, id, span, type, controlPoints) {
	Animation.call(this, scene, id, span, type);

	this.distances = [];
	this.totalDistance = 0;
	this.controlPoints = controlPoints;

	for (var i = 0; i < this.controlPoints.length - 1; i++) {
		var dis = this.calculateDistance(this.controlPoints[i], this.controlPoints[i + 1]);
		this.distances.push(dis);
		this.totalDistance += dis;
	}

	this.currDist = 0;
	this.currControlPoint = 0;
	this.currPosition = controlPoints[0];
	this.currAngle = this.calculateAngle(controlPoints[0], controlPoints[1]);

	this.velocity = this.totalDistance / this.span;
}

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;

LinearAnimation.prototype.applyAnimation = function(currTime) {
	if (this.lastTime == 0)
		this.lastTime = currTime;

	var deltaTime = (currTime - this.lastTime) / 1000;

	this.lastTime = currTime;
	this.currDist += this.velocity * deltaTime;

	if (this.currDist > this.distances[this.currControlPoint]) {
		if (this.currControlPoint == this.controlPoints.length - 2) {
			this.done = true;
		} else {
			this.currDist = 0;
			this.currControlPoint++;
			this.currAngle = this.calculateAngle(this.controlPoints[this.currControlPoint], this.controlPoints[this.currControlPoint + 1]);
		}
	}

	var dis = this.currDist / this.distances[this.currControlPoint];
	var x = this.controlPoints[this.currControlPoint + 1].x * dis + ((1 - dis) * this.controlPoints[this.currControlPoint].x);
	var y = this.controlPoints[this.currControlPoint + 1].y * dis + ((1 - dis) * this.controlPoints[this.currControlPoint].y);
	var z = this.controlPoints[this.currControlPoint + 1].z * dis + ((1 - dis) * this.controlPoints[this.currControlPoint].z);

	this.scene.translate(x, y, z);
	this.scene.rotate(this.currAngle, 0, 1, 0);
};

LinearAnimation.prototype.resetAnimation = function() {
	this.done = false;
	this.lastTime = 0;
	this.currDist = 0;
	this.currControlPoint = 0;
	this.currPosition = this.controlPoints[0];
	this.currAngle = this.calculateAngle(this.controlPoints[0], this.controlPoints[1]);
};

LinearAnimation.prototype.calculateDistance = function(p1, p2) {
	return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2) + Math.pow(p2.z - p1.z, 2));
};

LinearAnimation.prototype.calculateAngle = function(p1, p2) {
	return Math.atan2(p2.x - p1.x, p2.z - p1.z);
};