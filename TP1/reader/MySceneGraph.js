function MySceneGraph(filename, scene) {
	this.loadedOk = null;
	
	// Establish bidirectional references between scene and graph
	this.scene = scene;
	scene.graph = this;
	this.toRad = Math.PI / 180;

	// File reading 
	this.reader = new CGFXMLreader();

	/*
	 * Read the contents of the xml file, and refer to this class for loading and error handlers.
	 * After the file is read, the reader calls onXMLReady on this object.
	 * If any error occurs, the reader calls onXMLError on this object, with an error message
	 */
	this.reader.open('scenes/' + filename, this);
}

/*
 * Callback to be executed after successful reading
 */
MySceneGraph.prototype.onXMLReady = function() {
	console.log("XML Loading finished.");
	var rootElement = this.reader.xmlDoc.documentElement;

	// Here should go the calls for different functions to parse the various blocks
	var error = this.parseScene(rootElement);
	if (error != null) {
		this.onXMLError(error);
		return;
	}

	error = this.parseViews(rootElement);
	if (error != null) {
		this.onXMLError(error);
		return;
	}

	error = this.parseIllumination(rootElement);
	if (error != null) {
		this.onXMLError(error);
		return;
	}

	error = this.parseLights(rootElement);
	if (error != null) {
		this.onXMLError(error);
		return;
	}

	error = this.parseTextures(rootElement);
	if (error != null) {
		this.onXMLError(error);
		return;
	}

	error = this.parseMaterials(rootElement);
	if (error != null) {
		this.onXMLError(error);
		return;
	}

	error = this.parseTransformations(rootElement);
	if (error != null) {
		this.onXMLError(error);
		return;
	}

	error = this.parsePrimitives(rootElement);
	if (error != null) {
		this.onXMLError(error);
		return;
	}

	error = this.parseComponents(rootElement);
	if (error != null) {
		this.onXMLError(error);
		return;
	}

	// this.printGraphInfo();

	this.loadedOk = true;
	// As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
	this.scene.onGraphLoaded();
};

MySceneGraph.prototype.parseScene = function(rootElement) {
	var elems = rootElement.getElementsByTagName('scene');
	if (elems == null)
		return "The 'scene' element is missing.";

	if (elems.length != 1)
		return "Zero or more than one 'scene' element found.";

	var scene = elems[0];
	this.root = this.reader.getString(scene, 'root', true);
	this.axisLength = this.reader.getFloat(scene, 'axis_length', true);
};

MySceneGraph.prototype.parseViews = function(rootElement) {
	var elems = rootElement.getElementsByTagName('views');
	if (elems == null)
		return "The 'views' element is missing.";

	if (elems.length != 1)
		return "Zero or more than one 'views' element found.";

	var views = elems[0];
	this.defaultView = this.reader.getString(views, 'default', true);

	var perspectives = elems[0].getElementsByTagName('perspective');
	if (perspectives == null)
		return "The 'perspective' element is missing.";

	if (perspectives.length < 1)
		return "There must be at least one 'perspective' element.";

	this.viewsIndex = [];
	this.perspectives = [];
	for (var i = 0; i < perspectives.length; i++) {
		var from = [], to = [];
		var id, near, far, angle;
		var fromTag = perspectives[i].getElementsByTagName('from');
		var toTag = perspectives[i].getElementsByTagName('to');

		id = this.reader.getString(perspectives[i], 'id', true);
		near = this.reader.getFloat(perspectives[i], 'near', true);
		far = this.reader.getFloat(perspectives[i], 'far', true);
		angle = this.reader.getFloat(perspectives[i], 'angle', true);

		from['x'] = this.reader.getFloat(fromTag[0], 'x', true);
		from['y'] = this.reader.getFloat(fromTag[0], 'y', true);
		from['z'] = this.reader.getFloat(fromTag[0], 'z', true);

		to['x'] = this.reader.getFloat(toTag[0], 'x', true);
		to['y'] = this.reader.getFloat(toTag[0], 'y', true);
		to['z'] = this.reader.getFloat(toTag[0], 'z', true);

		var camera = new CGFcamera(angle, near, far, vec3.fromValues(from['x'], from['y'], from['z']), vec3.fromValues(to['x'], to['y'], to['z']));
		this.perspectives[id] = camera;
		this.viewsIndex.push(id);
	}
};

MySceneGraph.prototype.parseIllumination = function(rootElement) {
	var elems = rootElement.getElementsByTagName('illumination');
	if (elems == null)
		return "The 'illumination' element is missing.";

	if (elems.length != 1)
		return "Zero or more than one 'illumination' element found.";

	var illumination = elems[0];
	this.doublesided = this.reader.getBoolean(illumination, 'doublesided', true);
	this.local = this.reader.getBoolean(illumination, 'local', true);

	var ambient = illumination.getElementsByTagName('ambient');
	if (ambient == null)
		return "The 'ambient' element is missing.";

	if (ambient.length != 1)
		return "Zero or more than one 'ambient' element found.";

	this.ambient = [];
	this.ambient['r'] = this.reader.getFloat(ambient[0], 'r', true);
	this.ambient['g'] = this.reader.getFloat(ambient[0], 'g', true);
	this.ambient['b'] = this.reader.getFloat(ambient[0], 'b', true);
	this.ambient['a'] = this.reader.getFloat(ambient[0], 'a', true);

	var background = illumination.getElementsByTagName('background');
	if (background == null)
		return "The 'background' element is missing.";

	if (background.length != 1)
		return "Zero or more than one 'background' element found.";

	this.background = [];
	this.background['r'] = this.reader.getFloat(background[0], 'r', true);
	this.background['g'] = this.reader.getFloat(background[0], 'g', true);
	this.background['b'] = this.reader.getFloat(background[0], 'b', true);
	this.background['a'] = this.reader.getFloat(background[0], 'a', true);
};

MySceneGraph.prototype.parseLights = function(rootElement) {
	var elems = rootElement.getElementsByTagName('lights');
	if (elems == null)
		return "The 'lights' element is missing.";

	if (elems.length != 1)
		return "Zero or more than one 'lights' element found.";

	var omnis = elems[0].getElementsByTagName('omni');
	var spots = elems[0].getElementsByTagName('spot');
	if (omnis.length == 0 && spots.length == 0)
		return "Both 'omni' and 'spot' elements are missing. There must be at least one 'omni' or 'spot' element.";

	this.omnis = [];
	for (var i = 0; i < omnis.length; i++) {
		var omni = new Omni(this.reader.getString(omnis[i], 'id', true), this.reader.getBoolean(omnis[i], 'enabled', true));

		var location = omnis[i].getElementsByTagName('location');
		var ambient = omnis[i].getElementsByTagName('ambient');
		var diffuse = omnis[i].getElementsByTagName('diffuse');
		var specular = omnis[i].getElementsByTagName('specular');

		if (location.length != 1 || ambient.length != 1 || diffuse.length != 1 || specular.length != 1)
			return "There must be exactly one 'location', one 'ambient', one 'diffuse' and one 'specular' elements inside a 'omni' element.";

		omni.location['x'] = this.reader.getFloat(location[0], 'x', true);
		omni.location['y'] = this.reader.getFloat(location[0], 'y', true);
		omni.location['z'] = this.reader.getFloat(location[0], 'z', true);
		omni.location['w'] = this.reader.getFloat(location[0], 'w', true);

		omni.ambient['r'] = this.reader.getFloat(ambient[0], 'r', true);
		omni.ambient['g'] = this.reader.getFloat(ambient[0], 'g', true);
		omni.ambient['b'] = this.reader.getFloat(ambient[0], 'b', true);
		omni.ambient['a'] = this.reader.getFloat(ambient[0], 'a', true);

		omni.diffuse['r'] = this.reader.getFloat(diffuse[0], 'r', true);
		omni.diffuse['g'] = this.reader.getFloat(diffuse[0], 'g', true);
		omni.diffuse['b'] = this.reader.getFloat(diffuse[0], 'b', true);
		omni.diffuse['a'] = this.reader.getFloat(diffuse[0], 'a', true);

		omni.specular['r'] = this.reader.getFloat(specular[0], 'r', true);
		omni.specular['g'] = this.reader.getFloat(specular[0], 'g', true);
		omni.specular['b'] = this.reader.getFloat(specular[0], 'b', true);
		omni.specular['a'] = this.reader.getFloat(specular[0], 'a', true);

		this.omnis.push(omni);
	}

	this.spots = [];
	for (var i = 0; i < spots.length; i++) {
		var spot = new Spot(this.reader.getString(spots[i], 'id', true),
							this.reader.getBoolean(spots[i], 'enabled', true),
							this.reader.getFloat(spots[i], 'angle', true),
							this.reader.getFloat(spots[i], 'exponent', true));

		var target = spots[i].getElementsByTagName('target');
		var location = spots[i].getElementsByTagName('location');
		var ambient = spots[i].getElementsByTagName('ambient');
		var diffuse = spots[i].getElementsByTagName('diffuse');
		var specular = spots[i].getElementsByTagName('specular');

		if (target.length != 1 || location.length != 1 || ambient.length != 1 || diffuse.length != 1 || specular.length != 1)
			return "There must be exactly one 'target', one 'location', one 'ambient', one 'diffuse' and one 'specular' elements inside a 'spot' element.";

		spot.target['x'] = this.reader.getFloat(target[0], 'x', true);
		spot.target['y'] = this.reader.getFloat(target[0], 'y', true);
		spot.target['z'] = this.reader.getFloat(target[0], 'z', true);

		spot.location['x'] = this.reader.getFloat(location[0], 'x', true);
		spot.location['y'] = this.reader.getFloat(location[0], 'y', true);
		spot.location['z'] = this.reader.getFloat(location[0], 'z', true);

		spot.ambient['r'] = this.reader.getFloat(ambient[0], 'r', true);
		spot.ambient['g'] = this.reader.getFloat(ambient[0], 'g', true);
		spot.ambient['b'] = this.reader.getFloat(ambient[0], 'b', true);
		spot.ambient['a'] = this.reader.getFloat(ambient[0], 'a', true);

		spot.diffuse['r'] = this.reader.getFloat(diffuse[0], 'r', true);
		spot.diffuse['g'] = this.reader.getFloat(diffuse[0], 'g', true);
		spot.diffuse['b'] = this.reader.getFloat(diffuse[0], 'b', true);
		spot.diffuse['a'] = this.reader.getFloat(diffuse[0], 'a', true);

		spot.specular['r'] = this.reader.getFloat(specular[0], 'r', true);
		spot.specular['g'] = this.reader.getFloat(specular[0], 'g', true);
		spot.specular['b'] = this.reader.getFloat(specular[0], 'b', true);
		spot.specular['a'] = this.reader.getFloat(specular[0], 'a', true);

		this.spots.push(spot);
	}
};

MySceneGraph.prototype.parseTextures = function(rootElement) {
	var elems = rootElement.getElementsByTagName('textures');
	if (elems == null)
		return "The 'textures' element is missing.";

	if (elems.length != 1)
		return "Zero or more than one 'textures' element found.";

	var textures = elems[0].getElementsByTagName('texture');
	if (textures.length == 0)
		return "There must be at least one 'texture' element.";

	this.textures = [];
	for (var i = 0; i < textures.length; i++) {
		var texture = new Texture(this.reader.getString(textures[i], 'id', true),
								  this.reader.getString(textures[i], 'file', true),
								  this.reader.getFloat(textures[i], 'length_s', true),
								  this.reader.getFloat(textures[i], 'length_t', true));
		texture.texFile = new CGFtexture(this.scene, texture.file);
		this.textures[this.reader.getString(textures[i], 'id', true)] = texture;
	}
};

MySceneGraph.prototype.parseMaterials = function(rootElement) {
	var elems = rootElement.getElementsByTagName('materials');
	if (elems == null)
		return "The 'materials' element is missing.";

	var materials = elems[0].getElementsByTagName('material');
	if (materials == null)
		return "The 'material' element is missing.";

	if (materials.length < 1)
		return "There must be at least one 'material' element.";

	this.materials = [];
	for (var i = 0; i < materials.length; i++) {
		var material = new CGFappearance(this.scene);

		var id, shininess;
		var emission = [], ambient = [], diffuse = [], specular = [];

		var emissionTag = materials[i].getElementsByTagName('emission');
		var ambientTag = materials[i].getElementsByTagName('ambient');
		var diffuseTag = materials[i].getElementsByTagName('diffuse');
		var specularTag = materials[i].getElementsByTagName('specular');
		var shininessTag = materials[i].getElementsByTagName('shininess');

		id = this.reader.getString(materials[i], 'id', true);

		emission['r'] = this.reader.getFloat(emissionTag[0], 'r', true);
		emission['g'] = this.reader.getFloat(emissionTag[0], 'g', true);
		emission['b'] = this.reader.getFloat(emissionTag[0], 'b', true);
		emission['a'] = this.reader.getFloat(emissionTag[0], 'a', true);

		ambient['r'] = this.reader.getFloat(ambientTag[0], 'r', true);
		ambient['g'] = this.reader.getFloat(ambientTag[0], 'g', true);
		ambient['b'] = this.reader.getFloat(ambientTag[0], 'b', true);
		ambient['a'] = this.reader.getFloat(ambientTag[0], 'a', true);

		diffuse['r'] = this.reader.getFloat(diffuseTag[0], 'r', true);
		diffuse['g'] = this.reader.getFloat(diffuseTag[0], 'g', true);
		diffuse['b'] = this.reader.getFloat(diffuseTag[0], 'b', true);
		diffuse['a'] = this.reader.getFloat(diffuseTag[0], 'a', true);

		specular['r'] = this.reader.getFloat(specularTag[0], 'r', true);
		specular['g'] = this.reader.getFloat(specularTag[0], 'g', true);
		specular['b'] = this.reader.getFloat(specularTag[0], 'b', true);
		specular['a'] = this.reader.getFloat(specularTag[0], 'a', true);

		shininess = this.reader.getFloat(shininessTag[0], 'value', true);

		material.setEmission(emission['r'], emission['g'], emission['b'], emission['a']);
		material.setAmbient(ambient['r'], ambient['g'], ambient['b'], emission['a']);
		material.setDiffuse(diffuse['r'], diffuse['g'], diffuse['b'], diffuse['a']);
		material.setSpecular(specular['r'], specular['g'], specular['b'], specular['a']);
		material.setShininess(shininess);

		this.materials[id] = material;
	}
};

MySceneGraph.prototype.parseTransformations = function(rootElement) {
	var elems = rootElement.getElementsByTagName('transformations');
	if (elems == null)
		return "The 'transformations' element is missing.";

	if (elems.length != 1)
		return "Zero or more than one 'transformations' element found.";

	var transformations = elems[0].getElementsByTagName('transformation');
	if (transformations == null)
		return "The 'transformation' element is missing.";

	if (transformations.length < 1)
		return "There must be at least one 'transformation' element.";

	this.transformations = [];
	for (var i = 0; i < transformations.length; i++) {
		var matrix = mat4.create();
		var id = this.reader.getString(transformations[i], 'id', true);

		for (var j = 0; j < transformations[i].children.length; j++) {
			switch (transformations[i].children[j].tagName) {
				case 'rotate':
					var coord = [];
					var axis, angle;

					axis = this.reader.getItem(transformations[i].children[j], 'axis', [ 'x', 'y', 'z' ], true);
					angle = this.reader.getFloat(transformations[i].children[j], 'angle', true) * this.toRad;

					if (axis == 'x')
						coord = [1, 0, 0];
					else if (axis == 'y')
						coord = [0, 1, 0];
					else if (axis == 'z')
						coord = [0, 0, 1];

					mat4.rotate(matrix, matrix, angle, coord);
					break;
				case 'translate':
					var x, y, z;
					var coord = [];

					x = this.reader.getFloat(transformations[i].children[j], 'x', true);
					y = this.reader.getFloat(transformations[i].children[j], 'y', true);
					z = this.reader.getFloat(transformations[i].children[j], 'z', true);
					coord = [ x, y, z ];

					mat4.translate(matrix, matrix, coord);
					break;
				case 'scale':
					var x, y, z;
					var coord = [];

					x = this.reader.getFloat(transformations[i].children[j], 'x', true);
					y = this.reader.getFloat(transformations[i].children[j], 'y', true);
					z = this.reader.getFloat(transformations[i].children[j], 'z', true);
					coord = [ x, y, z ];

					mat4.scale(matrix, matrix, coord);
					break;
				default:
					return "Invalid transformation tag name.";
			}
		}

		this.transformations[id] = matrix;
	}
};

MySceneGraph.prototype.parsePrimitives = function(rootElement) {
	var elems = rootElement.getElementsByTagName('primitives');
	if (elems == null)
		return "The 'primitives' element is missing.";

	if (elems.length != 1)
		return "Zero or more than one 'primitives' element found.";

	var primitives = elems[0].getElementsByTagName('primitive');
	if (primitives == null)
		return "The 'primitive' element is missing.";

	if (primitives.length < 1)
		return "There must be at least one 'primitive' element.";

	this.primitives = [];
	for (var i = 0; i < primitives.length; i++) {
		var primitive;
		var id = this.reader.getString(primitives[i], 'id', true);

		switch (primitives[i].children[0].tagName) {
			case 'rectangle':
				var x1, y1, x2, y2;

				x1 = this.reader.getFloat(primitives[i].children[0], 'x1', true);
				y1 = this.reader.getFloat(primitives[i].children[0], 'y1', true);
				x2 = this.reader.getFloat(primitives[i].children[0], 'x2', true);
				y2 = this.reader.getFloat(primitives[i].children[0], 'y2', true);

				primitive = new Rectangle(this.scene, x1, y1, x2, y2);
				break;
			case 'triangle':
				var x1, y1, z1, x2, y2, z2, x3, y3, z3;

				x1 = this.reader.getFloat(primitives[i].children[0], 'x1', true);
				y1 = this.reader.getFloat(primitives[i].children[0], 'y1', true);
				z1 = this.reader.getFloat(primitives[i].children[0], 'z1', true);
				x2 = this.reader.getFloat(primitives[i].children[0], 'x2', true);
				y2 = this.reader.getFloat(primitives[i].children[0], 'y2', true);
				z2 = this.reader.getFloat(primitives[i].children[0], 'z2', true);
				x3 = this.reader.getFloat(primitives[i].children[0], 'x3', true);
				y3 = this.reader.getFloat(primitives[i].children[0], 'y3', true);
				z3 = this.reader.getFloat(primitives[i].children[0], 'z3', true);

				primitive = new Triangle(this.scene, x1, y1, z1, x2, y2, z2, x3, y3, z3);
				break;
			case 'cylinder':
				var base, top, height, slices, stacks;

				base = this.reader.getFloat(primitives[i].children[0], 'base', true);
				top = this.reader.getFloat(primitives[i].children[0], 'top', true);
				height = this.reader.getFloat(primitives[i].children[0], 'height', true);
				slices = this.reader.getInteger(primitives[i].children[0], 'slices', true);
				stacks = this.reader.getInteger(primitives[i].children[0], 'stacks', true);

				primitive = new Cylinder(this.scene, base, top, height, slices, stacks);
				break;
			case 'sphere':
				var radius, slices, stacks;

				radius = this.reader.getFloat(primitives[i].children[0], 'radius', true);
				slices = this.reader.getInteger(primitives[i].children[0], 'slices', true);
				stacks = this.reader.getInteger(primitives[i].children[0], 'stacks', true);

				primitive = new Sphere(this.scene, radius, slices, stacks);
				break;
			case 'torus':
				var inner, outer, slices, loops;

				inner = this.reader.getFloat(primitives[i].children[0], 'inner', true);
				outer = this.reader.getFloat(primitives[i].children[0], 'outer', true);
				slices = this.reader.getInteger(primitives[i].children[0], 'slices', true);
				loops = this.reader.getInteger(primitives[i].children[0], 'loops', true);

				primitive = new Torus(this.scene, inner, outer, slices, loops);
				break;
			default:
				return "There can be only one 'rectangle', one 'triangle', one 'cylinder', one 'sphere' or one 'torus' element inside each 'primitive' element.";
		}

		this.primitives[id] = primitive;
	}
};

MySceneGraph.prototype.parseComponents = function(rootElement) {
	var elems = rootElement.getElementsByTagName('components');
	if (elems == null)
		return "The 'components' element is missing.";

	if (elems.length != 1)
		return "Zero or more than one 'components' element found.";

	var components = elems[0].getElementsByTagName('component');
	if (components == null)
		return "The 'component' element is missing.";

	if (components.length < 1)
		return "There must be at least one 'component' element.";

	this.components = [];
	for (var i = 0; i < components.length; i++) {
		var id = this.reader.getString(components[i], 'id', true);
		var texture = components[i].getElementsByTagName('texture');
		var textureID = this.reader.getString(texture[0], 'id', true);
		var component = new Component(id, textureID);

		var transformation = components[i].getElementsByTagName('transformation');
		var materials = components[i].getElementsByTagName('materials');
		var children = components[i].getElementsByTagName('children');

		for (var j = 0; j < materials[0].children.length; j++)
			component.materials.push(this.reader.getString(materials[0].children[j], 'id', true));

		for (var j = 0; j < children[0].children.length; j++) {
			if (children[0].children[j].tagName == 'primitiveref')
				component.primitive = this.reader.getString(children[0].children[j], 'id', true);
			else if (children[0].children[j].tagName == 'componentref')
				component.children.push(this.reader.getString(children[0].children[j], 'id', true));
		}

		var matrix = mat4.create();
		for (var j = 0; j < transformation[0].children.length; j++) {
			switch (transformation[0].children[j].tagName) {
				case 'transformationref':
					matrix = this.transformations[this.reader.getString(transformation[0].children[j], 'id', true)];
					break;
				case 'rotate':
					var coord = [];
					var axis, angle;

					axis = this.reader.getItem(transformation[0].children[j], 'axis', [ 'x', 'y', 'z' ], true);
					angle = this.reader.getFloat(transformation[0].children[j], 'angle', true) * this.toRad;

					if (axis == 'x')
						coord = [1, 0, 0];
					else if (axis == 'y')
						coord = [0, 1, 0];
					else if (axis == 'z')
						coord = [0, 0, 1];

					mat4.rotate(matrix, matrix, angle, coord);
					break;
				case 'translate':
					var x, y, z;
					var coord = [];

					x = this.reader.getFloat(transformation[0].children[j], 'x', true);
					y = this.reader.getFloat(transformation[0].children[j], 'y', true);
					z = this.reader.getFloat(transformation[0].children[j], 'z', true);
					coord = [ x, y, z ];

					mat4.translate(matrix, matrix, coord);
					break;
				case 'scale':
					var x, y, z;
					var coord = [];

					x = this.reader.getFloat(transformation[0].children[j], 'x', true);
					y = this.reader.getFloat(transformation[0].children[j], 'y', true);
					z = this.reader.getFloat(transformation[0].children[j], 'z', true);
					coord = [ x, y, z ];

					mat4.scale(matrix, matrix, coord);
					break;
				default:
					return "Invalid transformation tag name.";
			}
		}

		if (transformation[0].children.length > 0)
			component.transformation = matrix;

		this.components[id] = component;
	}
};

MySceneGraph.prototype.printGraphInfo = function() {
	// Print scene info
	console.log("scene: { root = " + this.root + ", axis_length = " + this.axisLength + " }");

	// Print views info
	console.log("views: { default = " + this.defaultView + " }");
	console.log(this.perspectives);

	// Print illumination info
	console.log("illumination: { doublesided = " + this.doublesided + ", local = " + this.local + " }");
	console.log(this.ambient);
	console.log(this.background);

	// Print lights info
	console.log("lights");
	console.log(this.omnis);
	console.log(this.spots);

	// Print textures info
	console.log('textures');
	console.log(this.textures);

	// Print materials info
	console.log('materials');
	console.log(this.materials);

	// Print transformations info
	console.log('transformations');
	console.log(this.transformations);

	// Print primitives info
	console.log('primitives');
	console.log(this.primitives);

	// Print primitives info
	console.log('components');
	console.log(this.components);
};

/*
 * Callback to be executed on any read error
 */
MySceneGraph.prototype.onXMLError = function(message) {
 	console.error("XML Loading Error: " + message);	
 	this.loadedOk = false;
};