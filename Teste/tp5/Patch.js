function Patch(scene, orderU, orderV, partsU, partsV, controlPoints) {
	var knotsU = this.createKnots(orderU);
	var knotsV = this.createKnots(orderV);

	var nurbsSurface = new CGFnurbsSurface(orderU, orderV, knotsU, knotsV, controlPoints);
	getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};

	CGFnurbsObject.call(this, scene, getSurfacePoint, partsU, partsV);
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

Patch.prototype.getName = function() {
	return 'Patch';
};