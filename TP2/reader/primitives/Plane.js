function Plane(scene) {
	CGFobject.call(this, scene);

	this.initBuffers();
}

Plane.prototype = Object.create(CGFobject.prototype);
Plane.prototype.constructor = Plane;

Plane.prototype.initBuffers = function() {
	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};