function Plane(scene, dimX, dimY, partsX, partsY) {
	var X = dimX / 2;
	var Y = dimY / 2;

	var controlPoints = [
		[
			[-X, -Y, 0, 1],
			[-X, Y, 0, 1]
		],
		[
			[X, -Y, 0, 1],
			[X, Y, 0, 1]
		]
	];

	Patch.call(this, scene, 1, 1, partsX, partsY, controlPoints);
}

Plane.prototype = Object.create(Patch.prototype);
Plane.prototype.constructor = Plane;

Plane.prototype.getName = function() {
	return 'Plane';
};