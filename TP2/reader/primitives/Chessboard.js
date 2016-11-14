function Chessboard(scene) {
	CGFobject.call(this, scene);
	this.initBuffers();
}

Chessboard.prototype = Object.create(CGFobject.prototype);
Chessboard.prototype.constructor = Chessboard;

Chessboard.prototype.initBuffers = function() {
	this.normals = [];
	this.indices = [];
	this.vertices = [];
	this.texCoords = [];

	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};

Chessboard.prototype.getName = function() {
	return 'Chessboard';
};