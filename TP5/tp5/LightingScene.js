var degToRad = Math.PI / 180.0;

var BOARD_WIDTH = 6.0;
var BOARD_HEIGHT = 4.0;

var BOARD_A_DIVISIONS = 30;
var BOARD_B_DIVISIONS = 100;

var SUN_SIZE = 20;
var EARTH_SIZE = 1;

function LightingScene() {
	CGFscene.call(this);
}

LightingScene.prototype = Object.create(CGFscene.prototype);
LightingScene.prototype.constructor = LightingScene;

LightingScene.prototype.init = function(application) {
	CGFscene.prototype.init.call(this, application);

	this.initCameras();

	this.initLights();

	this.gl.clearColor(0.1, 0.1, 0.1, 1.0);
	this.gl.clearDepth(100.0);
	this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
	this.gl.depthFunc(this.gl.LEQUAL);

	this.axis = new CGFaxis(this, 0.0, 0.0);

	//Texturas
	this.enableTextures(true);
	this.sunAppearance = new CGFappearance(this);
	this.sunAppearance.loadTexture("resources/images/sun.png");

	this.mercuryAppearance = new CGFappearance(this);
	this.mercuryAppearance.loadTexture("resources/images/mercury.png");

	this.venusAppearance = new CGFappearance(this);
	this.venusAppearance.loadTexture("resources/images/venus.png");

	this.earthAppearance = new CGFappearance(this);
	this.earthAppearance.loadTexture("resources/images/blue.png");

	this.moonAppearance = new CGFappearance(this);
	this.moonAppearance.loadTexture("resources/images/moon.png");

	this.marsAppearance = new CGFappearance(this);
	this.marsAppearance.loadTexture("resources/images/mars.png");

	this.jupiterAppearance = new CGFappearance(this);
	this.jupiterAppearance.loadTexture("resources/images/jupiter.png");

	this.saturnAppearance = new CGFappearance(this);
	this.saturnAppearance.loadTexture("resources/images/saturn.png");

	this.uranusAppearance = new CGFappearance(this);
	this.uranusAppearance.loadTexture("resources/images/uranus.png");

	this.neptuneAppearance = new CGFappearance(this);
	this.neptuneAppearance.loadTexture("resources/images/neptune.png");

	// this.floorAppearance = new CGFappearance(this);
	// this.floorAppearance.loadTexture("resources/images/Oval.jpg");

	// this.windowAppearance = new CGFappearance(this);
	// this.windowAppearance.loadTexture("resources/images/window.png");
	// this.windowAppearance.setTextureWrap("CLAMP_TO_EDGE","CLAMP_TO_EDGE");

	// this.clockAppearance = new CGFappearance(this);
	// this.clockAppearance.loadTexture("resources/images/clock.png");

	// this.secAppearance = new CGFappearance(this);
	// this.secAppearance.loadTexture("resources/images/red.png");

	// this.minHourAppearance = new CGFappearance(this);
	// this.minHourAppearance.loadTexture("resources/images/black.png");

	// Scene elements
	// this.clock = new MyClock(this);
	// this.table = new MyTable(this);
	// this.leg = new Leg(this);
	// this.floor = new MyQuad(this, 0.0, 10.0, 0.0, 12.0);
	// this.leftWall = new MyQuad(this, 1.5, -0.5, 1.5, -0.5);
	// this.wall = new Plane(this);
	// this.boardA = new Plane(this, BOARD_A_DIVISIONS, BOARD_WIDTH, BOARD_HEIGHT);
	// this.boardB = new Plane(this, BOARD_B_DIVISIONS, BOARD_WIDTH, BOARD_HEIGHT);
	// this.prism = new MyPrism(this, 10, 8);
	// this.cylinder = new MyCylinder(this, 10, 8);

	// Scene elements - TEMP
	this.sun = new MySphere(this, 1, 100, 100);
	this.mercury = new MySphere(this, 1, 100, 100);
	this.venus = new MySphere(this, 1, 100, 100);
	this.earth = new MySphere(this, 1, 100, 100);
	this.moon = new MySphere(this, 1, 100, 100);
	this.mars = new MySphere(this, 1, 100, 100);
	this.jupiter = new MySphere(this, 1, 100, 100);
	this.saturn = new MySphere(this, 1, 100, 100);
	this.uranus = new MySphere(this, 1, 100, 100);
	this.neptune = new MySphere(this, 1, 100, 100);

	// Materials
	// this.materialDefault = new CGFappearance(this);
	
	// this.materialA = new CGFappearance(this);
	// this.materialA.setAmbient(0.3,0.3,0.3,1);
	// this.materialA.setDiffuse(0.6,0.6,0.6,1);
	// this.materialA.setSpecular(0,0,0.8,1);
	// this.materialA.setShininess(120);

	// this.materialB = new CGFappearance(this);
	// this.materialB.setAmbient(0.3,0.3,0.3,1);
	// this.materialB.setDiffuse(0.6,0.6,0.6,1);
	// this.materialB.setSpecular(0.8,0.8,0.8,1);	
	// this.materialB.setShininess(120);
	
	// this.materialC = new CGFappearance(this);
	// this.materialC.setAmbient(0.55,0.27,0.07,1);
	// this.materialC.setDiffuse(0.55,0.27,0.07,1);
	// this.materialC.setSpecular(0.55,0.27,0.07,1);	
	// this.materialC.setShininess(120);

	// this.materialD = new CGFappearance(this);
	// this.materialD.setAmbient(0.3,0.3,0.3,1);
	// this.materialD.setDiffuse(0.5,0.5,0.5,1);
	// this.materialD.setSpecular(0.7,0.7,0.7,1);	
	// this.materialD.setShininess(120);

	// this.slidesAppearance = new CGFappearance(this);
	// this.slidesAppearance.loadTexture("resources/images/slides.png");
	// this.slidesAppearance.setDiffuse(0.8, 0.8, 0.8, 1);
	// this.slidesAppearance.setSpecular(0.1, 0.1, 0.1, 1);	
	// this.slidesAppearance.setShininess(20);
	// this.slidesAppearance.setTextureWrap("CLAMP_TO_EDGE","CLAMP_TO_EDGE");

	// this.boardAppearance = new CGFappearance(this);
	// this.boardAppearance.loadTexture("resources/images/board.png");
	// this.boardAppearance.setDiffuse(0.7, 0.7, 0.7, 1);
	// this.boardAppearance.setSpecular(0.5, 0.5, 0.5, 1);	
	// this.boardAppearance.setShininess(130);
	// this.boardAppearance.setTextureWrap("CLAMP_TO_EDGE","CLAMP_TO_EDGE");

	// this.setUpdatePeriod(100);
};

LightingScene.prototype.initCameras = function() {
	this.camera = new CGFcamera(1.0, 0.1, 1000, vec3.fromValues(0, 0, 500), vec3.fromValues(0, 0, 0));
};

LightingScene.prototype.initLights = function() {
	this.setGlobalAmbientLight(1.0, 1.0, 1.0, 1.0);

	// this.shader.bind();
	
	// Positions for four lights
	this.lights[0].setPosition(400, 0, 0, 1.0);
	this.lights[1].setPosition(0, 150, 0, 1.0);
	this.lights[2].setPosition(0, 0, 150, 1.0);
	this.lights[3].setPosition(-200, 0, 0, 1.0);
	this.lights[4].setPosition(0, -150, 0, 1.0);
	this.lights[5].setPosition(0, 0, -150, 1.0);

	for (var i = 0; i < 6; i++) {
		this.lights[i].setAmbient(1.0, 1.0, 1.0, 1.0);
		this.lights[i].setDiffuse(1.0, 1.0, 1.0, 1.0);
		this.lights[i].setSpecular(1.0, 1.0, 1.0, 1.0);
		this.lights[i].enable();
	}

	// this.lights[1].setAmbient(0, 0, 0, 1);
	// this.lights[1].setDiffuse(1.0, 1.0, 1.0, 1.0);
	// this.lights[1].enable();

	// this.lights[2].setAmbient(0, 0, 0, 1);
	// this.lights[2].setDiffuse(1.0, 1.0, 1.0, 1.0);
	// this.lights[2].setSpecular(1.0, 1.0, 1.0, 1.0);
	// this.lights[2].setConstantAttenuation(0.0);
	// this.lights[2].setLinearAttenuation(1.0);
	// this.lights[2].setQuadraticAttenuation(0.0);
	// this.lights[2].enable();

	// this.lights[3].setAmbient(0, 0, 0, 1);
	// this.lights[3].setDiffuse(1.0, 1.0, 1.0, 1.0);
	// this.lights[3].setSpecular(1.0, 1.0, 0.0, 1.0);
	// this.lights[3].setConstantAttenuation(0.0);
	// this.lights[3].setLinearAttenuation(1.0);
	// this.lights[3].setQuadraticAttenuation(0.2);
	// this.lights[3].enable();

	// this.lights[4].enable();
	// this.lights[5].enable();
	// this.lights[6].enable();

	// this.lights[0].setPosition(55, 0, 0, 1.0);
	// this.lights[1].setPosition(0, 55, 0, 1.0);
	// this.lights[2].setPosition(0, 0, 55, 1.0);
	// this.lights[3].setPosition(-55, 0, 0, 1.0);
	// this.lights[4].setPosition(0, -55, 0, 1.0);
	// this.lights[5].setPosition(0, 0, -55, 1.0);
	// this.lights[6].setPosition(55, 55, 55, 1.0);
	// this.lights[7].setPosition(55, -55, 55, 1.0);
	// this.lights[8].setPosition(55, 55, -55, 1.0);
	// this.lights[9].setPosition(55, -55, -55, 1.0);
	// this.lights[10].setPosition(-55, 55, -55, 1.0);
	// this.lights[11].setPosition(-55, -55, -55, 1.0);
	// this.lights[12].setPosition(-55, 55, 55, 1.0);
	// this.lights[13].setPosition(-55, -55, 55, 1.0);

	// this.shader.unbind();
};

LightingScene.prototype.updateLights = function() {
	for (i = 0; i < this.lights.length; i++)
		this.lights[i].update();
}

LightingScene.prototype.getPlanetSize = function(percentage) {
	var res = (percentage * EARTH_SIZE) / 100;
	return res;
}

LightingScene.prototype.display = function() {
	// this.shader.bind();

	// ---- BEGIN Background, camera and axis setup

	// Clear image and depth buffer everytime we update the scene
	this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
	this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	// Initialize Model-View matrix as identity (no transformation)
	this.updateProjectionMatrix();
	this.loadIdentity();

	// Apply transformations corresponding to the camera position relative to the origin
	this.applyViewMatrix();

	// Update all lights used
	this.updateLights();

	// Draw axis
	this.axis.display();

	// this.materialDefault.apply();

	// Sun
	this.pushMatrix();
		this.rotate(90 * degToRad, 1, 0, 0);
		this.translate(-175, 0, 0);
		this.scale(100, 100, 100);
		this.sunAppearance.apply();
		this.sun.display();
	this.popMatrix();

	// Mercury
	this.pushMatrix();
		this.rotate(90 * degToRad, 1, 0, 0);
		this.translate(-25, 0, 0);
		this.scale(0.4, 0.4, 0.4);
		this.mercuryAppearance.apply();
		this.mercury.display();
	this.popMatrix();

	// Venus
	this.pushMatrix();
		this.rotate(90 * degToRad, 1, 0, 0);
		this.translate(25, 0, 0);
		this.scale(0.95, 0.95, 0.95);
		this.venusAppearance.apply();
		this.venus.display();
	this.popMatrix();

	// Earth
	this.pushMatrix();
		this.rotate(90 * degToRad, 1, 0, 0);
		this.translate(75, 0, 0);
		this.scale(EARTH_SIZE, EARTH_SIZE, EARTH_SIZE);
		this.earthAppearance.apply();
		this.earth.display();
	this.popMatrix();

	// Moon
	this.pushMatrix();
		this.rotate(90 * degToRad, 1, 0, 0);
		this.translate(80, 0, 0);
		this.scale(0.3, 0.3, 0.3);
		this.moonAppearance.apply();
		this.moon.display();
	this.popMatrix();

	// Mars
	this.pushMatrix();
		this.rotate(90 * degToRad, 1, 0, 0);
		this.translate(125, 0, 0);
		this.scale(0.5, 0.5, 0.5);
		this.marsAppearance.apply();
		this.mars.display();
	this.popMatrix();

	// Jupiter
	this.pushMatrix();
		this.rotate(90 * degToRad, 1, 0, 0);
		this.translate(175, 0, 0);
		this.scale(11, 11, 11);
		this.jupiterAppearance.apply();
		this.jupiter.display();
	this.popMatrix();

	// Saturn
	this.pushMatrix();
		this.rotate(90 * degToRad, 1, 0, 0);
		this.translate(225, 0, 0);
		this.scale(9.5, 9.5, 9.5);
		this.saturnAppearance.apply();
		this.saturn.display();
	this.popMatrix();

	// Uranus
	this.pushMatrix();
		this.rotate(90 * degToRad, 1, 0, 0);
		this.translate(275, 0, 0);
		this.scale(4, 4, 4);
		this.uranusAppearance.apply();
		this.uranus.display();
	this.popMatrix();

	// Neptune
	this.pushMatrix();
		this.rotate(90 * degToRad, 1, 0, 0);
		this.translate(325, 0, 0);
		this.scale(3.9, 3.9, 3.9);
		this.neptuneAppearance.apply();
		this.neptune.display();
	this.popMatrix();

	// ---- END Background, camera and axis setup

	// ---- BEGIN Primitive drawing section

	// Plane Wall
	// this.pushMatrix();
	// 	this.translate(7.5, 4, 0);
	// 	this.scale(15, 8, 0.2);
	// 	this.wall.display();
	// this.popMatrix();
	
	// // Floor
	// this.pushMatrix();
	// 	this.translate(7.5, 0, 7.5);
	// 	this.rotate(-90 * degToRad, 1, 0, 0);
	// 	this.scale(15, 15, 0.2);
	// 	this.floorAppearance.apply();
	// 	this.floor.display();
	// this.popMatrix();

	// // Left Wall
	// this.pushMatrix();
	// 	this.translate(0, 4, 7.5);
	// 	this.rotate(90 * degToRad, 0, 1, 0);
	// 	this.scale(15, 8, 0.2);
	// 	this.windowAppearance.apply();
	// 	this.leftWall.display();
	// this.popMatrix();

	// //Legs1
	// this.pushMatrix();
	// 	this.translate(5, 0, 8);
	// 	this.materialD.apply();
	// 	this.leg.display();
	// this.popMatrix();

	// //Legs2
	// this.pushMatrix();
	// 	this.translate(12, 0, 8);
	// 	this.materialD.apply();
	// 	this.leg.display();
	// this.popMatrix();

	// // First Table
	// this.pushMatrix();
	// 	this.translate(5, 0, 8);
	// 	this.materialC.apply();
	// 	this.table.display(this.tableAppearance);
	// this.popMatrix();

	// // Second Table
	// this.pushMatrix();
	// 	this.translate(12, 0, 8);
	// 	this.materialC.apply();
	// 	this.table.display(this.tableAppearance);
	// this.popMatrix();

	// // Board A
	// this.pushMatrix();
	// 	this.translate(4, 4.5, 0.2);
	// 	this.scale(BOARD_WIDTH, BOARD_HEIGHT, 1);
	// 	this.slidesAppearance.apply();
	// 	this.boardA.display();
	// this.popMatrix();

	// // Board B
	// this.pushMatrix();
	// 	this.translate(10.5, 4.5, 0.2);
	// 	this.scale(BOARD_WIDTH, BOARD_HEIGHT, 1);
	// 	this.boardAppearance.apply();
	// 	this.boardB.display();
	// this.popMatrix();

	// // Clock
	// this.pushMatrix();
	// 	this.clock.display(this.clockAppearance, this.secAppearance, this.minHourAppearance);
	// this.popMatrix();

	// ---- END Primitive drawing section

	// this.shader.unbind();
};

LightingScene.prototype.update = function(currTime) {
	this.clock.update(currTime);
}