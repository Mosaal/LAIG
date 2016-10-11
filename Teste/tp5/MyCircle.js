/**
 * MyCircle
 * @constructor
 */
function MyCircle(scene, slices) {
	CGFobject.call(this, scene);

	this.slices = slices;

	this.initBuffers();
};

MyCircle.prototype = Object.create(CGFobject.prototype);
MyCircle.prototype.constructor = MyCircle;

MyCircle.prototype.initBuffers = function() {
	var deg2rad = Math.PI / 180.0;
	var ang = 360 / this.slices;
	var a_rad = ang * deg2rad;

	this.vertices = [];
	this.normals = [];
	this.indices = [];
	this.texCoords = [];

	this.vertices.push(0, 0, 0);
	this.normals.push(0, 0, 1);
	this.texCoords.push(0.5, 0.5);
	for (var i = 0; i < this.slices; i++) {
		this.vertices.push(Math.cos(a_rad * i), Math.sin(a_rad * i), 0);
		this.normals.push(0, 0, 1);
		this.texCoords.push(0.5+(Math.cos(a_rad * i)/2), 0.5-(Math.sin(a_rad * i)/2));
	}

	for (var i = 1; i < this.slices; i++) {
		this.indices.push(0);
		this.indices.push(i);
		this.indices.push(i+1);
	}
	this.indices.push(0);
	this.indices.push(this.slices);
	this.indices.push(1);

	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
}