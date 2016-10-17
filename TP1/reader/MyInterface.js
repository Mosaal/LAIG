function MyInterface() {
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

MyInterface.prototype.addLight = function(light, id, type) {
	this.lights.add(light, 'enabled').name(type + ": " + id);
};

MyInterface.prototype.processKeyDown = function(event) {
	if (event.which == 86 || event.which == 118) {
		if (this.scene.viewIndex == this.scene.graph.perspectives.length - 1)
			this.scene.viewIndex = 0;
		else
			this.scene.viewIndex++;

		this.scene.camera.fov = this.scene.graph.perspectives[this.scene.viewIndex].angle;
		this.scene.camera.near = this.scene.graph.perspectives[this.scene.viewIndex].near;
		this.scene.camera.far = this.scene.graph.perspectives[this.scene.viewIndex].far;
		this.scene.camera.setPosition(vec3.fromValues(this.scene.graph.perspectives[this.scene.viewIndex]['from']['x'], this.scene.graph.perspectives[this.scene.viewIndex]['from']['y'], this.scene.graph.perspectives[this.scene.viewIndex]['from']['z']));
		this.scene.camera.setTarget(vec3.fromValues(this.scene.graph.perspectives[this.scene.viewIndex]['to']['x'], this.scene.graph.perspectives[this.scene.viewIndex]['to']['y'], this.scene.graph.perspectives[this.scene.viewIndex]['to']['z']));
		this.setActiveCamera(this.scene.camera);
	} // else if m/M
};