function Vehicle(scene) {
	CGFobject.call(this, scene);
	this.initBuffers();
}

Vehicle.prototype = Object.create(CGFobject.prototype);
Vehicle.prototype.constructor = Vehicle;

Vehicle.prototype.initBuffers = function() {
	this.normals = [];
	this.indices = [];
	this.vertices = [];
	this.texCoords = [];

	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};

Vehicle.prototype.getName = function() {
	return 'Vehicle';
};