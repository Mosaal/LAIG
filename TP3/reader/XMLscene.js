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

	this.currTime = 0;
	this.viewIndex = 0;
	this.cameraRadius = 0;
	this.switchTurnP1 = false;
	this.switchTurnP2 = false;
	this.cameraCurrAngle = 90;
	this.degToRad = Math.PI / 180.0;

	this.gsm = new GameStateManager(this);
	this.gsm.setState(this.gsm.MODE);

	this.setPickEnabled(true);
	this.enableTextures(true);
	this.setUpdatePeriod(1000 / 120);
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

/**
 * Initializes the axis once the graph has loaded
 * @return {void}
 */
XMLscene.prototype.initAxisOnGraphLoaded = function() {
	this.axis = new CGFaxis(this, this.graph.axisLength);
};

/**
 * Initializes the camera once the graph has loaded
 * @return {void}
 */
XMLscene.prototype.initCameraOnGraphLoaded = function() {
	this.camera = this.graph.perspectives[this.graph.defaultView];
	this.cameraRadius = this.camera.position[2];

	for (var i = 0; i < this.graph.viewsIndex.length; i++) {
		if (this.graph.viewsIndex[i] == this.graph.defaultView) {
			this.viewIndex = i;
			break;
		}
	}
};

/**
 * Initializes the scene's illumination once the graph has loaded
 * @return {void}
 */
XMLscene.prototype.initIlluminationOnGraphLoaded = function() {
	this.setGlobalAmbientLight(this.graph.ambient['r'], this.graph.ambient['g'], this.graph.ambient['b'], this.graph.ambient['a']);
	this.gl.clearColor(this.graph.background['r'], this.graph.background['g'], this.graph.background['b'], this.graph.background['a']);
};

/**
 * Initializes the lights once the graph has loaded
 * @return {void}
 */
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

/**
 * Initializes the interface once the graph has loaded
 * @return {void}
 */
XMLscene.prototype.initInterfaceOnGraphLoaded = function() {
	this.app.setInterface(this.interface);

	// for (var i = 0; i < this.graph.omnis.length; i++)
		// this.interface.addLight(this.lights[i], 'Omni', i);

	// for (var j = 0; j < this.graph.spots.length; j++)
		// this.interface.addLight(this.lights[i + j], 'Spot', j);
};

/**
 * Handler called when the graph is finally loaded
 * As loading is asynchronous, this may be called already after the application has started the run loop
 * @return {void}
 */
XMLscene.prototype.onGraphLoaded = function() {
	this.initAxisOnGraphLoaded();
	this.initCameraOnGraphLoaded();
	this.initIlluminationOnGraphLoaded();
	this.initLightsOnGraphLoaded();
	this.initInterfaceOnGraphLoaded();
};

/**
 * Applys the transformations stored in the received array
 * @param  {Array} transformations
 * @return {void}
 */
XMLscene.prototype.applyTransformations = function(transformations) {
	if (transformations != null) {
		for (var i = 0; i < transformations.length; i++) {
			switch (transformations[i]['type']) {
				case 'rotate':
					if (transformations[i]['axis'] == 'x')
						this.rotate(transformations[i]['angle'] * this.degToRad, 1, 0, 0);
					else if (transformations[i]['axis'] == 'y')
						this.rotate(transformations[i]['angle'] * this.degToRad, 0, 1, 0);
					else if (transformations[i]['axis'] == 'z')
						this.rotate(transformations[i]['angle'] * this.degToRad, 0, 0, 1);
					break;
				case 'translate':
					this.translate(transformations[i]['x'], transformations[i]['y'], transformations[i]['z']);
					break;
				case 'scale':
					this.scale(transformations[i]['x'], transformations[i]['y'], transformations[i]['z']);
					break;
			}
		}
	}
};

XMLscene.prototype.applyAnimations = function(animations) {
	if (animations != null) {
		for (var i = 0; i < animations.length; i++) {
			if (animations[i].done == false) {
				animations[i].applyAnimation(this.currTime);
				break;
			}
		}
	}
};

/**
 * Display's the scene starting by the root of the graph
 * @param  {string} componentID Component to be processed
 * @param  {string} preMaterialID Previous material used
 * @param  {string} preTextureID Previous texture used
 * @return {void}
 */
XMLscene.prototype.processGraph = function(componentID, preMaterialID, preTextureID) {
	var materialID, textureID;
	var component = this.graph.components[componentID];

	if (component == null) {
		console.error("XMLscene: Component undefined.");
		return;
	}

	if (component.textureId == 'inherit')
		textureID = preTextureID;
	else
		textureID = component.textureId;

	if (component.materials[component.matIndex] == 'inherit')
		materialID = preMaterialID;
	else
		materialID = component.materials[component.matIndex];

	this.pushMatrix();
	this.applyTransformations(component.transformation);
	this.applyAnimations(component.animations);

	var material = this.graph.materials[materialID];
	for (var i = 0; i < component.primitives.length; i++) {
		if (textureID == 'none') {
			material.setTexture(null);
		} else {
			material.setTexture(this.graph.textures[textureID].texFile);

			var primType = this.graph.primitives[component.primitives[i]].getName();
			if (primType == 'Triangle' || primType == 'Rectangle') {
				this.graph.primitives[component.primitives[i]].setTextureCoords(this.graph.textures[textureID].length_s,
																				this.graph.textures[textureID].length_t);
			}
		}

		material.apply();
		this.registerForPick(300 + i, component.primitives[i]);
		this.graph.primitives[component.primitives[i]].display();
	}

	for (var i = 0; i < component.children.length; i++)
		this.processGraph(component.children[i], materialID, textureID);

	this.popMatrix();
};

XMLscene.prototype.update = function(currTime) {
	this.gsm.update(currTime);
};

XMLscene.prototype.updateLights = function() {
	for (var i = 0; i < this.lights.length; i++)
		this.lights[i].update();
};

XMLscene.prototype.switchView = function() {
	if (this.switchTurnP1)
		this.switchViewP1();
	if (this.switchTurnP2)
		this.switchViewP2();
};

XMLscene.prototype.switchViewP1 = function() {
	if (this.cameraCurrAngle < 90) {
		var pos = this.camera.position;
		var newAngle = ++this.cameraCurrAngle * this.degToRad;
		this.camera.setPosition(vec3.fromValues(this.cameraRadius * Math.cos(newAngle), pos[1], this.cameraRadius * Math.sin(newAngle)));
	} else {
		this.switchTurnP1 = false;
	}
};

XMLscene.prototype.switchViewP2 = function() {
	if (this.cameraCurrAngle > -90) {
		var pos = this.camera.position;
		var newAngle = --this.cameraCurrAngle * this.degToRad;
		this.camera.setPosition(vec3.fromValues(this.cameraRadius * Math.cos(newAngle), pos[1], this.cameraRadius * Math.sin(newAngle)));
	} else {
		this.switchTurnP2 = false;
	}
};

XMLscene.prototype.logPicking = function() {
	if (this.pickMode == false) {
		if (this.pickResults != null && this.pickResults.length > 0) {
			this.gsm.handleInput(this.pickResults);
			this.pickResults.splice(0, this.pickResults.length);
		}		
	}
};

XMLscene.prototype.display = function() {
	// ---- BEGIN Background, camera and axis setup
	this.logPicking();
	this.clearPickRegistration();

	// Clear image and depth buffer everytime we update the scene
	this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
	this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
	this.gl.enable(this.gl.DEPTH_TEST);

	// Initialize Model-View matrix as identity (no transformation
	this.updateProjectionMatrix();
	this.loadIdentity();

	// Elements that are not affected by the camera (HUD)
	this.gsm.displayHUD();

	// Apply transformations corresponding to the camera position relative to the origin
	this.applyViewMatrix();

	// Draw axis
	if (this.graph.axisLength > 0)
		this.axis.display();

	// Orbit camera
	this.switchView();
	// this.interface.setActiveCamera(this.camera);

	// ---- END Background, camera and axis setup
	// it is important that things depending on the proper loading of the graph
	// only get executed after the graph has loaded correctly.
	// This is one possible way to do it
	if (this.graph.loadedOk) {
		// Update lights according to the cameras position
		this.updateLights();
		// Display current game state
		this.gsm.display();
		// Display scene
		var comp = this.graph.components[this.graph.root];
		this.processGraph(this.graph.root, comp.materials[comp.matIndex], comp.textureId);
	}
};
