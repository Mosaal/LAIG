function Chessboard(scene, du, dv, su, sv, colors, textureref) {
	CGFobject.call(this, scene);

	this.du = du;
	this.dv = dv;
	this.su = su;
	this.sv = sv;
	this.colors = colors;
	this.textureref = textureref;

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