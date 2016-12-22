function Box(scene) {
	CGFobject.call(this, scene);
	this.plane = new Plane(scene, 1.0, 1.0, 50, 50);
}

Box.prototype = Object.create(CGFobject.prototype);
Box.prototype.constructor = Box;

Box.prototype.display = function() {
	var degToRad = Math.PI / 180.0;

	// Front
	this.scene.pushMatrix();
		this.scene.translate(0.0, 0.0, 0.5);
		this.plane.display();
	this.scene.popMatrix();

	// Top
	this.scene.pushMatrix();
		this.scene.translate(0.0, 0.5, 0.0);
		this.scene.rotate(-90.0 * degToRad, 1, 0, 0);
		this.plane.display();
	this.scene.popMatrix();

	// Back
	this.scene.pushMatrix();
		this.scene.translate(0.0, 0.0, -0.5);
		this.scene.rotate(-180.0 * degToRad, 1, 0, 0);
		this.plane.display();
	this.scene.popMatrix();

	// Bottom
	this.scene.pushMatrix();
		this.scene.translate(0.0, -0.5, 0.0);
		this.scene.rotate(-270.0 * degToRad, 1, 0, 0);
		this.plane.display();
	this.scene.popMatrix();

	// Right
	this.scene.pushMatrix();
		this.scene.translate(0.5, 0.0, 0.0);
		this.scene.rotate(90.0 * degToRad, 0, 1, 0);
		this.plane.display();
	this.scene.popMatrix();

	// Left
	this.scene.pushMatrix();
		this.scene.translate(-0.5, 0.0, 0.0);
		this.scene.rotate(-90.0 * degToRad, 0, 1, 0);
		this.plane.display();
	this.scene.popMatrix();
};

Box.prototype.getName = function() {
	return 'Box';
};