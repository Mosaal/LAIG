function Patch(scene, orderU, orderV, partsU, partsV, controlPoints, plane) {
	var knotsU = this.createKnots(orderU);
	var knotsV = this.createKnots(orderV);

	if (plane) {
		var nurbsSurface = new CGFnurbsSurface(orderU, orderV, knotsU, knotsV, controlPoints);
		getSurfacePoint = function(u, v) {
			return nurbsSurface.getPoint(u, v);
		};

		CGFnurbsObject.call(this, scene, getSurfacePoint, partsU, partsV);
	} else {
		var cp = this.calculateControlPoints(orderU, orderV, controlPoints);

		var nurbsSurface = new CGFnurbsSurface(orderU, orderV, knotsU, knotsV, cp);
		getSurfacePoint = function(u, v) {
			return nurbsSurface.getPoint(u, v);
		};

		CGFnurbsObject.call(this, scene, getSurfacePoint, partsU, partsV);
	}
}

Patch.prototype = Object.create(CGFnurbsObject.prototype);
Patch.prototype.constructor = Patch;

Patch.prototype.createKnots = function(order) {
	var temp = [];

	for (var i = 0; i <= order; i++)
		temp.push(0);

	for (var j = 0; j <= order; j++)
		temp.push(1);

	return temp;
};

Patch.prototype.calculateControlPoints = function(orderU, orderV, controlPoints) {
	var index = 0, result = [];

	for (var u = 0; u <= orderU; u++) {
		var uArr = [];

		for (var v = 0; v <= orderV; v++) {
			var vArr = [];
			vArr.push(controlPoints[index].x, controlPoints[index].y, controlPoints[index].z, 1.0);
			uArr.push(vArr);
			index++;
		}

		result.push(uArr);
	}
	
	return result;
};

Patch.prototype.getName = function() {
	return 'Patch';
};