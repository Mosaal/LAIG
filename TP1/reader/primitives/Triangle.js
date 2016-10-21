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
	
	var a = Math.sqrt(Math.pow(this.x1 - this.x2, 2) + Math.pow(this.y1 - this.y2, 2) + Math.pow(this.z1 - this.z2, 2));
	var b = Math.sqrt(Math.pow(this.x2 - this.x3, 2) + Math.pow(this.y2 - this.y3, 2) + Math.pow(this.z2 - this.z3, 2));
	var c = Math.sqrt(Math.pow(this.x3 - this.x1, 2) + Math.pow(this.y3 - this.y1, 2) + Math.pow(this.z3 - this.z1, 2));

	var cosA = (-Math.pow(a, 2) + Math.pow(b, 2) + Math.pow(c, 2)) / (2 * b * c);
	var cosB = (Math.pow(a, 2) - Math.pow(b, 2) + Math.pow(c, 2)) / (2 * c * a);
	var cosC = (Math.pow(a, 2) + Math.pow(b, 2) - Math.pow(c, 2)) / (2 * a * b);
	var sinC = Math.sqrt(1 - Math.pow(cosC, 2));

	this.texCoords = [
		a - b * cosC, b * sinC,
		0, 0,
		a, 0
	];

	this.normals = [
		0, 0, 1,
		0, 0, 1,
		0, 0, 1
	];

	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};