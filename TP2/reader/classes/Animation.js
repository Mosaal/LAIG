function Animation(scene, id, span, type) {
	this.id = id;
	this.span = span;
	this.type = type;
	this.done = false;
	this.lastTime = 0;
	this.scene = scene;
}