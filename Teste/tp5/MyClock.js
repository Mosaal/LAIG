/**
 * MyClock
 * @constructor
 */
function MyClock(scene) {
	CGFobject.call(this, scene);

	this.mycircle = new MyCircle(this.scene);
	this.mycircle.initBuffers();

	this.mycylinder = new MyCylinder(this.scene, 12, 1);
	this.mycylinder.initBuffers();

	this.secClockhand = new MyClockHand(this.scene);
	this.secClockhand.setAngle(-270);
	this.secClockhand.initBuffers();

	this.minClockhand = new MyClockHand(this.scene);
	this.minClockhand.setAngle(-180);
	this.minClockhand.initBuffers();

	this.hourClockhand = new MyClockHand(this.scene);
	this.hourClockhand.setAngle(-90);
	this.hourClockhand.initBuffers();

	this.previousDate = 0;
};

MyClock.prototype = Object.create(CGFobject.prototype);
MyClock.prototype.constructor = MyClock;

MyClock.prototype.display = function(clockAppearence, secAppearance, minHourAppearance) {
	var degToRad = Math.PI / 180.0;

	this.scene.pushMatrix();
		this.scene.translate(7.25, 7.25, 0);
		this.scene.scale(0.65, 0.65, 0.2);
		this.mycylinder.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(7.25, 7.25, 0.2);
		this.scene.scale(0.65, 0.65, 1);
		clockAppearence.apply();
		this.mycircle.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(7.25, 7.25, 0.22);
		this.scene.rotate(this.hourClockhand.ang*degToRad, 0, 0, 1);
		this.scene.scale(1, 0.25, 1);
		minHourAppearance.apply();
		this.hourClockhand.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(7.25, 7.25, 0.22);
		this.scene.rotate(this.minClockhand.ang*degToRad, 0, 0, 1);
		this.scene.scale(1, 0.45, 1);
		minHourAppearance.apply();
		this.minClockhand.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(7.25, 7.25, 0.23);
		this.scene.rotate(this.secClockhand.ang*degToRad, 0, 0, 1);
		this.scene.scale(1, 0.62, 1);
		secAppearance.apply();
		this.secClockhand.display();
	this.scene.popMatrix();
}

MyClock.prototype.update = function(currTime) {
 	var angNew;
	var timePassed = (currTime - this.previousDate)/1000;
	if(this.oldDate != 0) {
		angNew = this.secClockhand.ang - (timePassed * 6);
		if(Math.abs(angNew) > 360)
			angNew = angNew % 360;
		this.secClockhand.setAngle(angNew);
		angNew = this.minClockhand.ang - (timePassed * 6/60);
		if(Math.abs(angNew) > 360)
			angNew = angNew % 360;
		this.minClockhand.setAngle(angNew);
		angNew = this.hourClockhand.ang - (timePassed * 30/60/60);
		if(Math.abs(angNew) > 360)
			angNew = angNew % 360;
		this.hourClockhand.setAngle(angNew);
	}
	this.previousDate = currTime;
 }