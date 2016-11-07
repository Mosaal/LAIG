function Patch(scene, orderU, orderV, partsU, partsV, controlPoints) {
	CGFobject.call(this, scene);

	this.orderU = orderU;
	this.orderV = orderV;
	this.partsU = partsU;
	this.partsV = partsV;
	this.controlPoints = controlPoints;

	this.initBuffers();
}

Patch.prototype = Object.create(CGFobject.prototype);
Patch.prototype.constructor = Patch;

Patch.prototype.initBuffers = function() {
	this.normals = [];
	this.indices = [];
	this.vertices = [];
	this.texCoords = [];

	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};

Patch.prototype.getName = function() {
	return 'Patch';
};