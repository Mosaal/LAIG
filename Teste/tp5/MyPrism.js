/**
 * MyPrism
 * @constructor
 */
function MyPrism(scene, slices, stacks) {
	CGFobject.call(this,scene);

	this.slices=slices;
	this.stacks=stacks;

	this.initBuffers();
};

MyPrism.prototype = Object.create(CGFobject.prototype);
MyPrism.prototype.constructor = MyPrism;

MyPrism.prototype.initBuffers = function() {
	/*
	 * TODO:
	 * Replace the following lines in order to build a prism with a **single mesh**.
	 *
	 * How can the vertices, indices and normals arrays be defined to
	 * build a prism with varying number of slices and stacks?
	 */

	var deg2rad = Math.PI / 180.0;
	var ang = 360 / this.slices;
	var a_rad = ang * deg2rad;
	var aux = a_rad / 2;

	//vertices, normals e indices
	this.vertices = [];
	this.normals = [];
	this.indices = [];

	for (var j = 0; j < this.stacks; j++) {
		
		for (var i = 0; i < this.slices; i++) {
			this.vertices.push(Math.cos(a_rad * i), Math.sin(a_rad * i), j);
			this.normals.push(Math.cos(aux + a_rad * i), Math.sin(aux + a_rad * i), 0);
			this.vertices.push(Math.cos(a_rad * i), Math.sin(a_rad * i), j);
			this.normals.push(Math.cos(-aux + a_rad * i), Math.sin(-aux + a_rad * i), 0);
		}

		for (var i = 0; i < this.slices; i++) {
			this.vertices.push(Math.cos(a_rad * i), Math.sin(a_rad * i), j + 1);
			this.normals.push(Math.cos(aux + a_rad * i), Math.sin(aux + a_rad * i), 0);
			this.vertices.push(Math.cos(a_rad * i), Math.sin(a_rad * i), j + 1);
			this.normals.push(Math.cos(-aux + a_rad * i), Math.sin(-aux + a_rad * i), 0);
		}
	}

	for (var j = 0; j < this.stacks; j++) {

		for (var i = 0; i < 2 * this.slices - 2; i += 2) {
			this.indices.push(j * this.slices * 4 + i);
			this.indices.push(j * this.slices * 4 + i + 3);
			this.indices.push(j * this.slices * 4 + i + 3 + 2 * this.slices);
			this.indices.push(j * this.slices * 4 + i + 3 + 2 * this.slices);
			this.indices.push(j * this.slices * 4 + i + 2 * this.slices);
			this.indices.push(j * this.slices * 4 + i);
		}

		this.indices.push(j * this.slices * 4 + 2 * this.slices - 2);
		this.indices.push(j * this.slices * 4 + 1);
		this.indices.push(j * this.slices * 4 + 2 * this.slices + 1);
		this.indices.push(j * this.slices * 4 + 2 * this.slices + 1);
		this.indices.push(j * this.slices * 4 + 2 * 2 * this.slices - 2);
		this.indices.push(j * this.slices * 4 + 2 * this.slices - 2);
	}

	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};
