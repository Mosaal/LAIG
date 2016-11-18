function Piramide(scene) {
	CGFobject.call(this, scene);

	this.scene = scene;
	this.tri = new Triangle(scene, -0.5, 0.0, 0.0,
								   0.5, 0.0, 0.0,
								   0.0, 0.5 * Math.sqrt(3), 0.0);
}

Piramide.prototype = Object.create(CGFobject.prototype);
Piramide.prototype.constructor = Piramide;

Piramide.prototype.display = function() {
	var degToRad = Math.PI / 180.0;

	// Front
	this.scene.pushMatrix();
		this.scene.translate(0.0, 0.0, 0.5);
		this.scene.rotate(-35.5 * degToRad, 1, 0, 0);
		this.tri.display();
	this.scene.popMatrix();

	// Right
	this.scene.pushMatrix();
		this.scene.translate(0.5, 0.0, 0.0);
		this.scene.rotate(35.5 * degToRad, 0, 0, 1);
		this.scene.rotate(90 * degToRad, 0, 1, 0);
		this.tri.display();
	this.scene.popMatrix();

	// Back
	this.scene.pushMatrix();
		this.scene.translate(0.0, 0.0, -0.5);
		this.scene.rotate(35.5 * degToRad, 1, 0, 0);
		this.scene.rotate(180 * degToRad, 0, 1, 0);
		this.tri.display();
	this.scene.popMatrix();

	// Left
	this.scene.pushMatrix();
		this.scene.translate(-0.5, 0.0, 0.0);
		this.scene.rotate(-35.5 * degToRad, 0, 0, 1);
		this.scene.rotate(270 * degToRad, 0, 1, 0);
		this.tri.display();
	this.scene.popMatrix();
};