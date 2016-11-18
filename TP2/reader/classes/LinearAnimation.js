function LinearAnimation(scene, id, span, type, controlPoints) {
	Animation.call(this, scene, id, span, type);

	this.angle = 0;
	this.distances = [];
	this.totalDistance = 0;
	this.controlPoints = controlPoints;

	for (var i = 0; i < this.controlPoints.length - 1; i++) {
		var dis = this.calculateDistance(this.controlPoints[i], this.controlPoints[i + 1]);
		this.distances.push(dis);
		this.totalDistance += dis;
	}

	this.velocity = this.totalDistance / this.span;
}

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;

LinearAnimation.prototype.applyAnimation = function(currTime, component) {
	if (currTime > this.span) {
		currTime = this.span;

		if (component.animationIndex < component.animations.length)
			component.animationIndex++;

		this.scene.time = 0;
		this.scene.elapsedTime = 0;
	}

	this.currPosition = this.velocity * currTime;

	var i = 0;
	while (this.currPosition > this.distances[i] && i < this.distances.length)
		i++;

	var p1 = this.controlPoints[i];
	var p2 = this.controlPoints[i + 1];

	var lastSegment;
	if (i == 0)
		lastSegment = 0;
	else
		lastSegment = this.distances[i - 1];

	var offset = (this.currPosition - lastSegment) / (this.distances[i] - lastSegment);

	var x = (p2.x - p1.x) * offset + p1.x;
	var y = (p2.y - p1.y) * offset + p1.y;
	var z = (p2.z - p1.z) * offset + p1.z;

	var rotAngle = Math.atan((p2.x - p1.x) / (p2.z - p1.z));

	if (p2.z - p1.z < 0)
		rotAngle += Math.PI;

	if (p2.x - p1.x == 0 && p2.z - p1.z == 0)
		rotAngle = this.angle;

	this.angle = rotAngle;
	this.scene.translate(x, y, z);
	this.scene.rotate(rotAngle, 0, 1, 0);
};

LinearAnimation.prototype.calculateDistance = function(p1, p2) {
	return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2) + Math.pow(p2.z - p1.z, 2));
};