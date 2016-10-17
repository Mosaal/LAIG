function XMLscene(app, interface) {
	CGFscene.call(this);

	this.app = app;
	this.interface = interface;
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function(application) {
	CGFscene.prototype.init.call(this, application);

	this.initCamera();
	this.initLights();

	this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
	this.gl.clearDepth(100.0);
	this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
	this.gl.depthFunc(this.gl.LEQUAL);

	this.axis = new CGFaxis(this);
	this.viewIndex = 0;
};

XMLscene.prototype.initCamera = function() {
	this.camera = new CGFcamera(1.0, 1.0, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
};

XMLscene.prototype.initLights = function() {
	this.lights[0].setPosition(15, 15, 15);
	this.lights[0].setAmbient(1.0, 1.0, 1.0, 1.0);
	this.lights[0].update();
};

XMLscene.prototype.setDefaultAppearance = function() {
	this.setAmbient(0.2, 0.4, 0.8, 1.0);
	this.setDiffuse(0.2, 0.4, 0.8, 1.0);
	this.setSpecular(0.2, 0.4, 0.8, 1.0);
	this.setShininess(10.0);
};

XMLscene.prototype.initAxisOnGraphLoaded = function() {
	this.axis = new CGFaxis(this, this.graph.axisLength, 0.2);
};

XMLscene.prototype.initCameraOnGraphLoaded = function() {
	for (var i = 0; i < this.graph.perspectives.length; i++) {
		if (this.graph.perspectives[i].id == this.graph.defaultView) {
			this.viewIndex = i;
			this.camera = new CGFcamera(this.graph.perspectives[i].angle,
										this.graph.perspectives[i].near,
										this.graph.perspectives[i].far,
										vec3.fromValues(this.graph.perspectives[i].from['x'], this.graph.perspectives[i].from['y'], this.graph.perspectives[i].from['z']),
										vec3.fromValues(this.graph.perspectives[i].to['x'], this.graph.perspectives[i].to['y'], this.graph.perspectives[i].to['z']));
		}
	}
};

XMLscene.prototype.initIlluminationOnGraphLoaded = function() {
	this.setGlobalAmbientLight(this.graph.ambient['r'], this.graph.ambient['g'], this.graph.ambient['b'], this.graph.ambient['a']);
	this.gl.clearColor(this.graph.background['r'], this.graph.background['g'], this.graph.background['b'], this.graph.background['a']);
};

XMLscene.prototype.initLightsOnGraphLoaded = function() {
	for (var i = 0; i < this.graph.omnis.length; i++) {
		this.lights[i].setPosition(this.graph.omnis[i].location['x'], this.graph.omnis[i].location['y'], this.graph.omnis[i].location['z'], this.graph.omnis[i].location['w']);
		this.lights[i].setAmbient(this.graph.omnis[i].ambient['r'], this.graph.omnis[i].ambient['g'], this.graph.omnis[i].ambient['b'], this.graph.omnis[i].ambient['a']);
		this.lights[i].setDiffuse(this.graph.omnis[i].diffuse['r'], this.graph.omnis[i].diffuse['g'], this.graph.omnis[i].diffuse['b'], this.graph.omnis[i].diffuse['a']);
		this.lights[i].setSpecular(this.graph.omnis[i].specular['r'], this.graph.omnis[i].specular['g'], this.graph.omnis[i].specular['b'], this.graph.omnis[i].specular['a']);

		if (this.graph.omnis[i].enabled == true)
			this.lights[i].enable();
		else if (this.graph.omnis[i].enabled == false)
			this.lights[i].disable();

		this.lights[i].update();
	}

	for (var j = 0; j < this.graph.spots.length; j++) {
		this.lights[i + j].setSpotCutOff(this.graph.spots[i + j].angle);
		this.lights[i + j].setSpotExponent(this.graph.spots[i + j].exponent);
		this.lights[i + j].setSpotDirection(this.graph.spots[i + j].target['x'], this.graph.spots[i + j].target['y'], this.graph.spots[i + j].target['z']);
		this.lights[i + j].setPosition(this.graph.spots[i + j].location['x'], this.graph.spots[i + j].location['y'], this.graph.spots[i + j].location['z']);
		this.lights[i + j].setAmbient(this.graph.spots[i + j].ambient['r'], this.graph.spots[i + j].ambient['g'], this.graph.spots[i + j].ambient['b'], this.graph.spots[i + j].ambient['a']);
		this.lights[i + j].setDiffuse(this.graph.spots[i + j].diffuse['r'], this.graph.spots[i + j].diffuse['g'], this.graph.spots[i + j].diffuse['b'], this.graph.spots[i + j].diffuse['a']);
		this.lights[i + j].setSpecular(this.graph.spots[i + j].specular['r'], this.graph.spots[i + j].specular['g'], this.graph.spots[i + j].specular['b'], this.graph.spots[i + j].specular['a']);

		if (this.graph.spots[i + j].enabled == true)
			this.lights[i + j].enable();
		else if (this.graph.spots[i + j].enabled == false)
			this.lights[i + j].disable();

		this.lights[i + j].update();
	}
};

XMLscene.prototype.initInterfaceOnGraphLoaded = function() {
	this.app.setInterface(this.interface);

	for (var i = 0; i < this.graph.omnis.length; i++)
		this.interface.addLight(this.lights[i], this.graph.omnis[i].id, 'Omni');

	for (var j = 0; j < this.graph.spots.length; j++)
		this.interface.addLight(this.lights[i + j], this.graph.omnis[i + j].id, 'Spot');
};

// Handler called when the graph is finally loaded. 
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function() {
	this.initAxisOnGraphLoaded();
	this.initCameraOnGraphLoaded();
	this.initIlluminationOnGraphLoaded();
	this.initLightsOnGraphLoaded();
	this.initInterfaceOnGraphLoaded();
	// this.initTexturesOnGraphLoaded();
	// this.initMaterialsOnGraphLoaded();
};

XMLscene.prototype.display = function() {
	// ---- BEGIN Background, camera and axis setup
	
	// Clear image and depth buffer everytime we update the scene
	this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
	this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	// Initialize Model-View matrix as identity (no transformation
	this.updateProjectionMatrix();
	this.loadIdentity();

	// Apply transformations corresponding to the camera position relative to the origin
	this.applyViewMatrix();

	// Draw axis
	this.axis.display();

	// this.rect = new Rectangle(this, 0, 0, 1, 1);
	// this.tri = new Triangle(this, 0, 0, 0, 2, 0, 0, 0, 2, 0);
	// this.circle = new Circle(this, 2, 50);
	// this.cyl = new Cylinder(this, 1, 2, 2, 50, 50);
	// this.sphere = new Sphere(this, 1, 50, 50);
	// this.torus = new Torus(this, 1, 2, 50, 50);

	this.setDefaultAppearance();
	
	// ---- END Background, camera and axis setup

	// it is important that things depending on the proper loading of the graph
	// only get executed after the graph has loaded correctly.
	// This is one possible way to do it
	if (this.graph.loadedOk == true) {
		// start drawing from the root
		this.lights[0].update();
	};	
};

