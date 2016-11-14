function NewPlane(scene, dimX, dimY, partsX, partsY) {
	CGFobject.call(this, scene);

	this.dimX = dimX;
	this.dimY = dimY;
	this.partsX = partsX;
	this.partsY = partsY;

	this.initBuffers();
}

NewPlane.prototype = Object.create(CGFobject.prototype);
NewPlane.prototype.constructor = NewPlane;

NewPlane.prototype.initBuffers = function() {
	this.normals = [];
	this.indices = [];
	this.vertices = [];
	this.texCoords = [];

	var incX = this.dimX / this.partsX;
	var incY = this.dimY / this.partsY;

	var Y = -1 * this.dimY / 2;
	for (var y = 0; y <= this.partsY; y++) {
		var X = -1 * this.dimX / 2;
		for (var x = 0; x <= this.partsX; x++) {
			this.normals.push(0, 0, 1);
			this.vertices.push(X, Y, 0);
			X += incX;
		}
		Y += incY;
	}

	var indice = 0;
	for (var i = 0; i < this.partsY; i++) {
		for (var j = 0; j < this.partsX; j++) {
			this.indices.push(indice, indice + 1, this.partsX + indice + 1);
			this.indices.push(this.partsX + indice + 2, this.partsX + indice + 1, indice + 1);
			indice++;
		}
		indice++;
	}

	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};

NewPlane.prototype.getName = function() {
	return 'Plane';
};