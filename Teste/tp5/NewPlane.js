function NewPlane(scene, dimX, dimY, partsX, partsY) {
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

NewPlane.prototype = Object.create(Patch.prototype);
NewPlane.prototype.constructor = NewPlane;

NewPlane.prototype.getName = function() {
	return 'Plane';
};