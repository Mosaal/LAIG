function Vehicle(scene) {
	CGFobject.call(this, scene);

	this.scene = scene;
	this.piramide = new Piramide(scene);
	this.plane = new Plane(scene, 0.5, 1, 50, 50);
	this.wing1 = new Triangle(scene, 0.0, 0.0, 0.0,
									 0.5, 0.0, 0.0,
									 0.0, 1.0, 0.0);
	this.wing2 = new Triangle(scene, -0.5, 0.0, 0.0,
									 0.0, 0.0, 0.0,
									 0.0, 1.0, 0.0);
}

Vehicle.prototype = Object.create(CGFobject.prototype);
Vehicle.prototype.constructor = Vehicle;

Vehicle.prototype.display = function() {
	var degToRad = Math.PI / 180.0;

	// Head
	this.scene.pushMatrix();
		this.scene.translate(0.0, 0.0, 0.5);
		this.scene.rotate(90 * degToRad, 1, 0, 0);
		this.scene.scale(0.5, 0.5, 0.5);
		this.piramide.display();
	this.scene.popMatrix();

	// Plane top
	this.scene.pushMatrix();
		this.scene.translate(0.0, 0.25, 0.0);
		this.scene.rotate(-90 * degToRad, 1, 0, 0);
		this.plane.display();
	this.scene.popMatrix();

	// Plane bottom
	this.scene.pushMatrix();
		this.scene.translate(0.0, -0.25, 0.0);
		this.scene.rotate(90 * degToRad, 1, 0, 0);
		this.plane.display();
	this.scene.popMatrix();

	// Plane left
	this.scene.pushMatrix();
		this.scene.translate(-0.25, 0.0, 0.0);
		this.scene.rotate(90 * degToRad, 0, 0, 1);
		this.scene.rotate(-90 * degToRad, 1, 0, 0);
		this.plane.display();
	this.scene.popMatrix();

	// Plane right
	this.scene.pushMatrix();
		this.scene.translate(0.25, 0.0, 0.0);
		this.scene.rotate(-90 * degToRad, 0, 0, 1);
		this.scene.rotate(-90 * degToRad, 1, 0, 0);
		this.plane.display();
	this.scene.popMatrix();

	// Plane back
	this.scene.pushMatrix();
		this.scene.translate(0.0, 0.0, -0.5);
		this.scene.scale(1.0, 0.5, 1.0);
		this.scene.rotate(180 * degToRad, 1, 0, 0);
		this.plane.display();
	this.scene.popMatrix();

	// Wing left top
	this.scene.pushMatrix();
		this.scene.translate(-0.25, 0.0, -0.5);
		this.scene.rotate(90 * degToRad, 1, 0, 0);
		this.scene.rotate(180 * degToRad, 0, 1, 0);
		this.wing1.display();
	this.scene.popMatrix();

	// Wing left bottom
	this.scene.pushMatrix();
		this.scene.translate(-0.25, 0.0, -0.5);
		this.scene.rotate(90 * degToRad, 1, 0, 0);
		this.wing2.display();
	this.scene.popMatrix();

	// Wing right top
	this.scene.pushMatrix();
		this.scene.translate(0.25, 0.0, -0.5);
		this.scene.rotate(90 * degToRad, 1, 0, 0);
		this.scene.rotate(180 * degToRad, 0, 1, 0);
		this.wing2.display();
	this.scene.popMatrix();

	// Wing right bottom
	this.scene.pushMatrix();
		this.scene.translate(0.25, 0.0, -0.5);
		this.scene.rotate(90 * degToRad, 1, 0, 0);
		this.wing1.display();
	this.scene.popMatrix();
};

Vehicle.prototype.getName = function() {
	return 'Vehicle';
};