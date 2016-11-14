/**
 * MySquare
 * @constructor
 */
function MySquare(scene, angle) {
	CGFobject.call(this, scene);

	this.betaAngle = angle;
	this.alphaAngle = 90 - angle;

	this.initBuffers();
};

MySquare.prototype = Object.create(CGFobject.prototype);
MySquare.prototype.constructor = MySquare;

MySquare.prototype.initBuffers = function() {
	var betaRad = (this.betaAngle * Math.PI) / 180.0;
	var alphaRad = (this.alphaAngle * Math.PI) / 180.0;

	console.log('a: sin: ' + Math.sin(alphaRad) + '; cos: ' + Math.cos(alphaRad));
	console.log('b: sin: ' + Math.sin(betaRad) + '; cos: ' + Math.cos(betaRad));

	this.vertices = [
		0, 0, 0,
		1, 0, 0,
		0, 1, 0,
		1, 1, 0
	];

	this.indices = [
		0, 1, 2,
		3, 2, 1
	];

	this.normals = [
		0, 0, 1,
		0, 0, 1,
		0, 0, 1,
		0, 0, 1
	];

	this.texCoords = [
		0, 0,
		Math.cos(betaRad), Math.sin(betaRad), // 1, 0
		Math.cos(alphaRad), Math.sin(alphaRad), // 0, 1
		1 - Math.sin(betaRad), 1 + Math.sin(betaRad) // 1, 1
	];

	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
};