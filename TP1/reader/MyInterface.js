function MyInterface(scene) {
	CGFinterface.call(this);
}

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;

MyInterface.prototype.init = function(application) {
	CGFinterface.prototype.init.call(this, application);

	this.gui = new dat.GUI();
	this.lights = this.gui.addFolder("Lights");
	this.lights.open();

	return true;
};

MyInterface.prototype.addLight = function(index) {
	// Add lights as they are created
}

MyInterface.prototype.processKeyDown = function(event) {
	if (event.which == 86 || event.which == 118) {
		console.log("Pressed v/V");
	}
}