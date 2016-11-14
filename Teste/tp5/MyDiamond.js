/**
 * MyDiamond
 * @constructor
 */
function MyDiamond(scene, slices) {
	CGFobject.call(this, scene);

	this.slices = slices;

	this.initBuffers();
};

MyDiamond.prototype = Object.create(CGFobject.prototype);
MyDiamond.prototype.constructor = MyDiamond;

MyDiamond.prototype.initBuffers = function() {
	var deg2rad = Math.PI / 180.0;
	var ang = 360 / this.slices;
	var a_rad = ang * deg2rad;

	this.normals = [];
	this.indices = [];
	this.vertices = [];

	// TOP HALF
	this.vertices.push(0, 1, 0);
	this.normals.push(0, 0, 1);
	for (var i = 0; i < this.slices; i++) {
		this.vertices.push(Math.cos(a_rad * i) / 2, 0, Math.sin(a_rad * i) / 2);
		this.normals.push(0, 0, 1);

		if (i != this.slices - 1)
			this.indices.push(i + 2, i + 1, 0);
		else
			this.indices.push(1, i + 1, 0);
	}

	// BOTTOM HALF
	this.vertices.push(0, -1, 0);
	this.normals.push(0, 0, 1);
	for (var j = 0; j < this.slices; j++) {
		if (j != this.slices - 1)
			this.indices.push(this.slices + 1, j + 1, j + 2);
		else
			this.indices.push(this.slices + 1, j + 1, 1);
	}

	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
}