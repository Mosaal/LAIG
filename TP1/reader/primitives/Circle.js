function Circle(scene, base, slices) {
	CGFobject.call(this, scene);

	this.base = base;
	this.slices = slices;

	this.initBuffers();
}

Circle.prototype = Object.create(CGFobject.prototype);
Circle.prototype.constructor = Circle;

Circle.prototype.initBuffers = function() {
	var alpha = 2 * Math.PI / this.slices;

	this.normals = [];
	this.indices = [];
	this.vertices = [];
	this.texCoords = [];

	this.vertices.push(0, 0, 0);
	this.normals.push(0, 0, 1);
	this.texCoords.push(0.5, 0.5);

	for (var i = 0; i < this.slices; i++) {
		if (i != 0)
			this.indices.push(0, i, i + 1);
		
		this.vertices.push(Math.cos(alpha * i) * this.base, Math.sin(alpha * i) * this.base, 0);
		this.texCoords.push(0.5 + (Math.cos(alpha * i) / 2), 0.5 - (Math.sin(alpha * i) / 2));
		this.normals.push(0, 0, 1);
	}

	this.indices.push(0, this.slices, 1);

	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
}