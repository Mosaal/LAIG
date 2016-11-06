function LinearAnimation(id, span, type, controlPoints) {
	Animation.call(this, id, span, type);

	this.controlPoints = controlPoints;
}