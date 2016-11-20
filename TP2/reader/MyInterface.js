function MyInterface() {
	CGFinterface.call(this);
}

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;

MyInterface.prototype.init = function(application) {
	CGFinterface.prototype.init.call(this, application);

	this.gui = new dat.GUI();

	this.animations = this.gui.addFolder("Animations");
	this.animations.open();

	this.lights = this.gui.addFolder("Lights");
	this.lights.open();

	return true;
};

/**
 * Adds the control to the light received
 * @param {Light} light
 * @param {string} type
 * @param {int} index
 */
MyInterface.prototype.addLight = function(light, type, index) {
	this.lights.add(light, 'enabled').name(type + " #" + index);
};

MyInterface.prototype.addLoopState = function(loop) {
	this.animations.add(loop, 'loop').name('Loop');
};

MyInterface.prototype.processKeyDown = function(event) {
	if (event.which == 86 || event.which == 118) {
		if (this.scene.viewIndex == this.scene.graph.viewsIndex.length - 1)
			this.scene.viewIndex = 0;
		else
			this.scene.viewIndex++;

		this.scene.camera = this.scene.graph.perspectives[this.scene.graph.viewsIndex[this.scene.viewIndex]];
		this.setActiveCamera(this.scene.camera);
	} else if (event.which == 77 || event.which == 109) {
		for (var id in this.scene.graph.components) {
			if (this.scene.graph.components[id].materials.length > 1) {
				if (this.scene.graph.components[id].matIndex == this.scene.graph.components[id].materials.length - 1)
					this.scene.graph.components[id].matIndex = 0;
				else
					this.scene.graph.components[id].matIndex++;
			}
		}
	}
};