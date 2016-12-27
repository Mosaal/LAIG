/**
 * MyClock
 * @constructor
 */
function MyCurveBezier(scene,p0,p1,p2,p3) {
	CGFobject.call(this, scene);
	this.controlpoints[0]=p0;
	this.controlpoints[1]=p1;
	this.controlpoints[2]=p2;
	this.controlpoints[3]=p3;
	this.initBuffers();
};

MyCurveBezier.prototype = Object.create(CGFobject.prototype);
MyCurveBezier.prototype.constructor = MyCurveBezier;

MyCurveBezier.prototype.display = function() {
	this.vertices=[];
	for (var t = 0 ; t !=1; t+=1/3) {
		var p=[];

			p= [(1-t)^3*controlpoints[0][0]+3*t*(1-t)^2*controlpoints[1][0]+3*t^2*(1-t)*controlpoints[2][0]+t^3*controlpoints[3][0],
			    (1-t)^3*controlpoints[0][1]+3*t*(1-t)^2*controlpoints[1][1]+3*t^2*(1-t)*controlpoints[2][1]+t^3*controlpoints[3][1],
			    (1-t)^3*controlpoints[0][2]+3*t*(1-t)^2*controlpoints[1][2]+3*t^2*(1-t)*controlpoints[2][2]+t^3*controlpoints[3][2]]};


        this.vertices.add(p);
	}
	
}

