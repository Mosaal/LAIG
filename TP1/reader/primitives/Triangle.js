function Triangle(scene, x1, y1, z1, x2, y2, z2, x3, y3, z3) {
	CGFobject.call(this, scene);

	this.x1 = x1;
	this.y1 = y1;
	this.z1 = z1;
	this.x2 = x2;
	this.y2 = y2;
	this.z2 = z2;
	this.x3 = x3;
	this.y3 = y3;
	this.z3 = z3;

	this.initBuffers();
}

Triangle.prototype = Object.create(CGFobject.prototype);
Triangle.prototype.constructor = Triangle;

Triangle.prototype.initBuffers = function() {
	this.vertices = [
		this.x1, this.y1, this.z1,
		this.x2, this.y2, this.z2,
		this.x3, this.y3, this.z3
	];

	this.indices = [
		0, 1, 2
	];

	var v12 = [this.x2 - this.x1, this.y2 - this.y1, this.z2 - this.z1];
	var v13 = [this.x3 - this.x1, this.y3 - this.y1, this.z3 - this.z1];
	var vNorm = this.crossProduct(v12, v13);

    this.normals = [
		vNorm[0], vNorm[1], vNorm[2],
		vNorm[0], vNorm[1], vNorm[2],
		vNorm[0], vNorm[1], vNorm[2]
	];

	var a = Math.sqrt(Math.pow(this.x1 - this.x3, 2) + Math.pow(this.y1 - this.y3, 2) + Math.pow(this.z1 - this.z3, 2));
	var b = Math.sqrt(Math.pow(this.x2 - this.x1, 2) + Math.pow(this.y2 - this.y1, 2) + Math.pow(this.z2 - this.z1, 2));
	var c = Math.sqrt(Math.pow(this.x3 - this.x2, 2) + Math.pow(this.y3 - this.y2, 2) + Math.pow(this.z3 - this.z2, 2));

	var cosA = (-Math.pow(a, 2) + Math.pow(b, 2) + Math.pow(c, 2)) / (2 * b * c);
	var cosB = (Math.pow(a, 2) - Math.pow(b, 2) + Math.pow(c, 2)) / (2 * a * c);
	var cosC = (Math.pow(a, 2) + Math.pow(b, 2) - Math.pow(c, 2)) / (2 * a * b);
	var sinB = Math.sin(Math.acos(cosB));

	this.texCoords = [
		c - (a * cosB), a * sinB,
		0, 0,
		c, 0
	];

	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};

Triangle.prototype.crossProduct = function(v1, v2) {
	return [v1[1]*v2[2] - v1[2]*v2[1], v1[2]*v2[0] - v1[0]*v2[2], v1[0]*v2[1] - v1[1]*v2[0]];
};