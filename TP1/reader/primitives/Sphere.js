var degToRad = Math.PI / 180.0;

function Sphere(scene, radius, slices, stacks) {
	CGFobject.call(this, scene);

	this.radius = radius;
	this.slices = slices;
	this.stacks = stacks;

	this.initBuffers();
};

Sphere.prototype = Object.create(CGFobject.prototype);
Sphere.prototype.constructor = Sphere;

Sphere.prototype.initBuffers = function() {
	this.normals = [];
	this.indices = [];
	this.vertices = [];
	this.texCoords = [];

	var angH = 360 / this.slices;
	var angV = 180 / this.stacks;
	var angHor = angH * degToRad;
	var angVer = angV * degToRad;

	for (var i = 0; i < this.stacks + 1; i++) {
		for (var j = 0; j < this.slices + 1; j++) {
			this.normals.push(
								Math.cos(j * angHor) * Math.sin(i * angVer),
								Math.sin(j * angHor) * Math.sin(i * angVer),
								Math.cos(i * angVer)
							 );
			this.vertices.push(
								this.radius * Math.cos(j * angHor) * Math.cos(i * angVer - Math.PI / 2),
								this.radius * Math.sin(j * angHor) * Math.cos(i * angVer - Math.PI / 2),
								this.radius * Math.sin(i * angVer - Math.PI / 2)
							  );
			this.texCoords.push(j / this.slices, i / this.stacks);
		}
	}

	for (var i = 0; i < this.stacks; i++) {
		for (var j = 0; j < this.slices; j++) {
			this.indices.push(
								j + 1 + (i + 1) * (this.slices + 1),
								j + i * (this.slices + 1),
								j + 1 + i * (this.slices + 1)
							 );
			this.indices.push(
								j + i * (this.slices + 1),
								j + 1 + (i + 1) * (this.slices + 1),
								j + (i + 1) * (this.slices + 1)
							 );
		}
	}

	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};