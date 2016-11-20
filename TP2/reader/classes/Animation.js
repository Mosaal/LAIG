function Animation(scene, id, span, type) {
	this.id = id;
	this.span = span;
	this.type = type;
	this.lastTime = -1;
	this.scene = scene;
}