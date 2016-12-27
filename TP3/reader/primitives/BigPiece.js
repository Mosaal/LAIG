function BigPiece(scene) {
	this.scene = scene;
	this.degToRad = Math.PI / 180.0;

	this.ring = new Ring(this.scene, 100, 0.6, 0.2);
	this.inner = new CylinderWithoutCovers(this.scene, 0.2, 0.2, 0.1, 100, 1);
	this.outter = new CylinderWithoutCovers(this.scene, 0.6, 0.6, 0.1, 100, 1);
}

BigPiece.prototype.display = function() {
	// Top
	this.scene.pushMatrix();
		this.ring.display();
	this.scene.popMatrix();

	// Bottom
	this.scene.pushMatrix();
		this.scene.translate(0.0, 0.0, 0.1);
		this.scene.rotate(-180 * this.degToRad, 0, 1, 0);
		this.ring.display();
	this.scene.popMatrix();

	// Inner
	this.scene.pushMatrix();
		this.scene.scale(-1.0, 1.0, 1.0);
		this.inner.display();
	this.scene.popMatrix();

	// Outter
	this.scene.pushMatrix();
		this.outter.display();
	this.scene.popMatrix();
};