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

    this.normals = [
		0, 0, 1,
		0, 0, 1,
		0, 0, 1
	];

	var properties = this.makeProperties(this.makeVector(this.x3, this.y3, this.z3, this.x2, this.y2, this.z2),
										 this.makeVector(this.x3, this.y3, this.z3, this.x1, this.y1, this.z1));

	this.texCoords = [
		properties[0] - (properties[1] * Math.cos(properties[2])), 1 - (properties[1] * Math.sin(properties[2])),
		0, 1,
		properties[0], 1
	];

	this.baseTexCoords = [
		properties[0] - (properties[1] * Math.cos(properties[2])), properties[1] * Math.sin(properties[2]),
		0, 1,
		properties[0], 1
	];

	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};

/**
 * Returns a new vector
 * @param  {float} xf
 * @param  {float} yf
 * @param  {float} zf
 * @param  {float} xs
 * @param  {float} ys
 * @param  {float} zs
 * @return {float}
 */
Triangle.prototype.makeVector = function(xf, yf, zf, xs, ys, zs) {
	return new Point3(xs - xf, ys - yf, zs - zf);
};

/**
 * Returns the length of the received vector
 * @param  {Point3} vec
 * @return {float}
 */
Triangle.prototype.calculateLength = function(vec) {
	return Math.sqrt((vec.x * vec.x) + (vec.y * vec.y) + (vec.z * vec.z));
};

/**
 * Returns the cross product of the received vectors
 * @param  {Point3} vec1
 * @param  {Point3} vec2
 * @return {float}
 */
Triangle.prototype.dotProduct = function(vec1, vec2) {
	return (vec1.x * vec2.x) + (vec1.y * vec2.y) + (vec1.z * vec2.z);
};

/**
 * Returns the properties of the texCoords for the Triangle
 * @param  {Point3} vec1
 * @param  {Point3} vec2
 * @return {Array}
 */
Triangle.prototype.makeProperties = function(vec1, vec2) {
	var length1 = this.calculateLength(vec1);
	var length2 = this.calculateLength(vec2);
	var dot = this.dotProduct(vec1, vec2);
	var angle = Math.acos(dot / (length1 * length2));

	return [length1, length2, angle];
};

/**
 * @param {float} length_s Amplification factor along the length of the Rectangle
 * @param {float} length_t Amplification factor along the width of the Rectangle
 */
Triangle.prototype.setTextureCoords = function(length_s, length_t) {
	this.texCoords = [
		this.baseTexCoords[0] / length_s, 1 - (this.baseTexCoords[1] / length_t),
		0, 1,
		this.baseTexCoords[4] / length_s, 1
	];

	this.updateTexCoordsGLBuffers();
};

/**
 * Returns the name of the primitive
 * @return {string}
 */
Triangle.prototype.getName = function() {
    return 'Triangle';
};