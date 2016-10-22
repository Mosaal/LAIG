function Rectangle(scene, x1, y1, x2, y2) {
	CGFobject.call(this, scene);

	this.x1 = x1;
	this.y1 = y1;
	this.x2 = x2;
	this.y2 = y2;

	this.initBuffers();
}

Rectangle.prototype = Object.create(CGFobject.prototype);
Rectangle.prototype.constructor = Rectangle;

Rectangle.prototype.initBuffers = function() {
	this.vertices = [
		this.x1, this.y1, 0,
		this.x2, this.y1, 0,
		this.x2, this.y2, 0,
		this.x1, this.y2, 0
	];

	this.indices = [
		0, 1, 2,
		0, 2, 3
	];
	
	this.normals = [
		0, 0, 1,
		0, 0, 1,
		0, 0, 1,
		0, 0, 1
	];

	this.texCoords = [
		0, 1,
		this.x2 - this.x1, 1,
		this.x2 - this.x1, 1 - (this.y2 - this.y1),
		0, 1 - (this.y2 - this.y1)
	];

	this.baseTexCoords = [
		0, 1,
		this.x2 - this.x1, 1,
		this.x2 - this.x1, this.y2 - this.y1,
		0, this.y2 - this.y1
	];

	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};

Rectangle.prototype.setTextureCoords = function(length_s, length_t) {
	this.texCoords = [
		0, 1,
		this.baseTexCoords[2] / length_s, 1,
		this.baseTexCoords[4] / length_s, 1 - (this.baseTexCoords[5] / length_t),
		0, 1 - (this.baseTexCoords[7] / length_t)
	];

	this.updateTexCoordsGLBuffers();
};

Rectangle.prototype.getName = function() {
    return 'Rectangle';
};