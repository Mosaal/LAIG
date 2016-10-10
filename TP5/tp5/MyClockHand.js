/**
 * MyClockHand
 * @constructor
 */
function MyClockHand(scene) {
	CGFobject.call(this, scene);
    this.ang = 0;
	this.initBuffers();
};

MyClockHand.prototype = Object.create(CGFobject.prototype);
MyClockHand.prototype.constructor = MyClockHand;

MyClockHand.prototype.initBuffers = function() {
	this.vertices = [
        0.0, 0.0, 0.0,
        0.05, 0.0, 0.0,
        0.0, 1.0, 0.0,
        -0.05, 0.0, 0.0
    ];

	this.indices = [
        0, 1, 2,
        0, 2, 3
	];

	this.normals = [
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 1.0
	];

	this.texCoords = [
    	0.5, 1,
    	1, 1,
    	0.5, 0.0,
    	1, 0.0
	];

	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
}

MyClockHand.prototype.setAngle = function(angle) {
	this.ang = angle;
}