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

	this.enableTextures(true);
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
	this.axis = new CGFaxis(this, this.graph.axisLength);
};

XMLscene.prototype.initCameraOnGraphLoaded = function() {
	this.camera = this.graph.perspectives[this.graph.defaultView];

	for (var i = 0; i < this.graph.viewsIndex.length; i++) {
		if (this.graph.viewsIndex[i] == this.graph.defaultView) {
			this.viewIndex = i;
			break;
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
		this.lights[i + j].setSpotCutOff(this.graph.spots[j].angle);
		this.lights[i + j].setSpotExponent(this.graph.spots[j].exponent);
		this.lights[i + j].setSpotDirection(this.graph.spots[j].target['x'], this.graph.spots[j].target['y'], this.graph.spots[j].target['z']);
		this.lights[i + j].setPosition(this.graph.spots[j].location['x'], this.graph.spots[j].location['y'], this.graph.spots[j].location['z']);
		this.lights[i + j].setAmbient(this.graph.spots[j].ambient['r'], this.graph.spots[j].ambient['g'], this.graph.spots[j].ambient['b'], this.graph.spots[j].ambient['a']);
		this.lights[i + j].setDiffuse(this.graph.spots[j].diffuse['r'], this.graph.spots[j].diffuse['g'], this.graph.spots[j].diffuse['b'], this.graph.spots[j].diffuse['a']);
		this.lights[i + j].setSpecular(this.graph.spots[j].specular['r'], this.graph.spots[j].specular['g'], this.graph.spots[j].specular['b'], this.graph.spots[j].specular['a']);

		if (this.graph.spots[j].enabled == true)
			this.lights[i + j].enable();
		else if (this.graph.spots[j].enabled == false)
			this.lights[i + j].disable();

		this.lights[i + j].update();
	}
};

XMLscene.prototype.initInterfaceOnGraphLoaded = function() {
	this.app.setInterface(this.interface);
	this.interface.setActiveCamera(this.camera);

	for (var i = 0; i < this.graph.omnis.length; i++)
		this.interface.addLight(this.lights[i], this.graph.omnis[i].id, 'Omni');

	for (var j = 0; j < this.graph.spots.length; j++)
		this.interface.addLight(this.lights[i + j], this.graph.spots[j].id, 'Spot');
};

// Handler called when the graph is finally loaded. 
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function() {
	this.initAxisOnGraphLoaded();
	this.initCameraOnGraphLoaded();
	this.initIlluminationOnGraphLoaded();
	this.initLightsOnGraphLoaded();
	this.initInterfaceOnGraphLoaded();
};

XMLscene.prototype.processGraph = function(componentID, preMaterialID, preTextureID) {
	var materialID, textureID;
	var component = this.graph.components[componentID];

	if (component.textureId == 'inherit')
		textureID = preTextureID;
	else
		textureID = component.textureId;

	if (component.materials[component.matIndex] == 'inherit')
		materialID = preMaterialID;
	else
		materialID = component.materials[component.matIndex];

	if (component.transformation != null) {
		this.setMatrix(this.matrix);
		this.multMatrix(component.transformation);
	}

	var material = this.graph.materials[materialID];
	if (component.primitive != null) {
		this.pushMatrix();

		if (textureID == 'none') {
			material.setTexture(null);
		} else {
			material.setTexture(this.graph.textures[textureID].texFile);
			material.setTextureWrap(this.graph.textures[textureID].length_s, this.graph.textures[textureID].length_t);
		}

		material.apply();
		this.graph.primitives[component.primitive].display();
		this.popMatrix();
	}

	for (var i = 0; i < component.children.length; i++) {
		this.pushMatrix();
		this.processGraph(component.children[i], materialID, textureID);
		this.popMatrix();
	}
};

XMLscene.prototype.display = function() {
	// ---- BEGIN Background, camera and axis setup
	// console.log('LEL');
	// console.log(this.graph.components);
	
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
	this.matrix = this.getMatrix();

	// this.rect = new Rectangle(this, 0, 0, 1, 1);
	// this.tri = new Triangle(this, 0, 0, 0, 2, 0, 0, 0, 2, 0);
	// this.circle = new Circle(this, 2, 50);
	// this.cyl = new Cylinder(this, 1, 2, 2, 50, 50);
	// this.sphere = new Sphere(this, 1, 50, 50);
	// this.torus = new Torus(this, 10, 12, 100, 100);

	this.setDefaultAppearance();
	
	// ---- END Background, camera and axis setup

	// it is important that things depending on the proper loading of the graph
	// only get executed after the graph has loaded correctly.
	// This is one possible way to do it
	if (this.graph.loadedOk == true) {
		for (var i = 0; i < this.lights.length; i++)
			this.lights[i].update();

		// Start drawing primitives
		var comp = this.graph.components[this.graph.root];
		this.processGraph(this.graph.root, this.graph.materials[comp.materials[comp.matIndex]], comp.textureId);
	};
};

