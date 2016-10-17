function MySceneGraph(filename, scene) {
	this.loadedOk = null;
	
	// Establish bidirectional references between scene and graph
	this.scene = scene;
	scene.graph=this;

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

	this.perspectives = [];
	for (var i = 0; i < perspectives.length; i++) {
		var perspective = new Perspective(this.reader.getString(perspectives[i], 'id', true),
										  this.reader.getFloat(perspectives[i], 'near', true),
										  this.reader.getFloat(perspectives[i], 'far', true),
										  this.reader.getFloat(perspectives[i], 'angle', true));

		var from = perspectives[i].getElementsByTagName('from');
		if (from.length != 1)
			return "There must be exactly one 'from' and one 'to' elements inside a 'perspective' element.";
		
		perspective.from['x'] = this.reader.getFloat(from[0], 'x', true);
		perspective.from['y'] = this.reader.getFloat(from[0], 'y', true);
		perspective.from['z'] = this.reader.getFloat(from[0], 'z', true);

		var to = perspectives[i].getElementsByTagName('to');
		if (to.length != 1)
			return "There must be exactly one 'from' and one 'to' elements inside a 'perspective' element.";

		perspective.to['x'] = this.reader.getFloat(to[0], 'x', true);
		perspective.to['y'] = this.reader.getFloat(to[0], 'y', true);
		perspective.to['z'] = this.reader.getFloat(to[0], 'z', true);

		this.perspectives.push(perspective);
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
		this.textures.push(texture);
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
		var shininess = materials[i].getElementsByTagName('shininess');
		var material = new Material(this.reader.getString(materials[i], 'id', true), this.reader.getFloat(shininess[0], 'value', true));

		var emission = materials[i].getElementsByTagName('emission');
		var ambient = materials[i].getElementsByTagName('ambient');
		var diffuse = materials[i].getElementsByTagName('diffuse');
		var specular = materials[i].getElementsByTagName('specular');
		var shininess = materials[i].getElementsByTagName('shininess');

		if (emission.length != 1 || ambient.length != 1 || diffuse.length != 1 || specular.length != 1 || shininess.length != 1)
			return "There must be exactly one 'emission', one 'ambient', one 'diffuse', one 'specular' and one 'shininess' elements inside a 'material' element.";

		material.emission['r'] = this.reader.getFloat(emission[0], 'r', true);
		material.emission['g'] = this.reader.getFloat(emission[0], 'g', true);
		material.emission['b'] = this.reader.getFloat(emission[0], 'b', true);
		material.emission['a'] = this.reader.getFloat(emission[0], 'a', true);

		material.ambient['r'] = this.reader.getFloat(ambient[0], 'r', true);
		material.ambient['g'] = this.reader.getFloat(ambient[0], 'g', true);
		material.ambient['b'] = this.reader.getFloat(ambient[0], 'b', true);
		material.ambient['a'] = this.reader.getFloat(ambient[0], 'a', true);

		material.diffuse['r'] = this.reader.getFloat(diffuse[0], 'r', true);
		material.diffuse['g'] = this.reader.getFloat(diffuse[0], 'g', true);
		material.diffuse['b'] = this.reader.getFloat(diffuse[0], 'b', true);
		material.diffuse['a'] = this.reader.getFloat(diffuse[0], 'a', true);

		material.specular['r'] = this.reader.getFloat(specular[0], 'r', true);
		material.specular['g'] = this.reader.getFloat(specular[0], 'g', true);
		material.specular['b'] = this.reader.getFloat(specular[0], 'b', true);
		material.specular['a'] = this.reader.getFloat(specular[0], 'a', true);

		this.materials.push(material);
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
		var transformation = new Transformation(this.reader.getString(transformations[i], 'id', true));

		if (transformations[i].children.length == 0)
			return "There must be at least one 'rotate', one 'scale' or one 'translate' element inside a 'transformation' element.";

		for (var j = 0; j < transformations[i].children.length; j++) {
			var temp;

			if (transformations[i].children[j].tagName == 'rotate') {
				temp = new Array(3);
				temp['type'] = 'rotate';
				temp['axis'] = this.reader.getItem(transformations[i].children[j], 'axis', [ 'x', 'y', 'z' ], true);
				temp['angle'] = this.reader.getFloat(transformations[i].children[j], 'angle', true);
			} else if (transformations[i].children[j].tagName == 'translate') {
				temp = new Array(4);
				temp['type'] = 'translate';
				temp['x'] = this.reader.getFloat(transformations[i].children[j], 'x', true);
				temp['y'] = this.reader.getFloat(transformations[i].children[j], 'y', true);
				temp['z'] = this.reader.getFloat(transformations[i].children[j], 'z', true);
			} else if (transformations[i].children[j].tagName == 'scale') {
				temp = new Array(4);
				temp['type'] = 'scale';
				temp['x'] = this.reader.getFloat(transformations[i].children[j], 'x', true);
				temp['y'] = this.reader.getFloat(transformations[i].children[j], 'y', true);
				temp['z'] = this.reader.getFloat(transformations[i].children[j], 'z', true);
			}

			transformation.transformations.push(temp);
		}

		this.transformations.push(transformation);
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
		if (primitives[i].children.length > 1)
			return "There can be only one primitive inside each 'primitive' element.";
		
		var primitive = new Primitive(this.reader.getString(primitives[i], 'id', true));
		if (primitives[i].children[0].tagName == 'rectangle') {
			primitive.type = 'rectangle';
			primitive.data = new Array(4);
			primitive.data['x1'] = this.reader.getFloat(primitives[i].children[0], 'x1', true);
			primitive.data['y1'] = this.reader.getFloat(primitives[i].children[0], 'y1', true);
			primitive.data['x2'] = this.reader.getFloat(primitives[i].children[0], 'x2', true);
			primitive.data['y2'] = this.reader.getFloat(primitives[i].children[0], 'y2', true);
		} else if (primitives[i].children[0].tagName == 'triangle') {
			primitive.type = 'triangle';
			primitive.data = new Array(9);
			primitive.data['x1'] = this.reader.getFloat(primitives[i].children[0], 'x1', true);
			primitive.data['y1'] = this.reader.getFloat(primitives[i].children[0], 'y1', true);
			primitive.data['z1'] = this.reader.getFloat(primitives[i].children[0], 'z1', true);
			primitive.data['x2'] = this.reader.getFloat(primitives[i].children[0], 'x2', true);
			primitive.data['y2'] = this.reader.getFloat(primitives[i].children[0], 'y2', true);
			primitive.data['z2'] = this.reader.getFloat(primitives[i].children[0], 'z2', true);
			primitive.data['x3'] = this.reader.getFloat(primitives[i].children[0], 'x3', true);
			primitive.data['y3'] = this.reader.getFloat(primitives[i].children[0], 'y3', true);
			primitive.data['z3'] = this.reader.getFloat(primitives[i].children[0], 'z3', true);
		} else if (primitives[i].children[0].tagName == 'cylinder') {
			primitive.type = 'cylinder';
			primitive.data = new Array(5);
			primitive.data['base'] = this.reader.getFloat(primitives[i].children[0], 'base', true);
			primitive.data['top'] = this.reader.getFloat(primitives[i].children[0], 'top', true);
			primitive.data['height'] = this.reader.getFloat(primitives[i].children[0], 'height', true);
			primitive.data['slices'] = this.reader.getInteger(primitives[i].children[0], 'slices', true);
			primitive.data['stacks'] = this.reader.getInteger(primitives[i].children[0], 'stacks', true);
		} else if (primitives[i].children[0].tagName == 'sphere') {
			primitive.type = 'sphere';
			primitive.data = new Array(3);
			primitive.data['radius'] = this.reader.getFloat(primitives[i].children[0], 'radius', true);
			primitive.data['slices'] = this.reader.getInteger(primitives[i].children[0], 'slices', true);
			primitive.data['stacks'] = this.reader.getInteger(primitives[i].children[0], 'stacks', true);
		} else if (primitives[i].children[0].tagName == 'torus') {
			primitive.type = 'torus';
			primitive.data = new Array(4);
			primitive.data['inner'] = this.reader.getFloat(primitives[i].children[0], 'inner', true);
			primitive.data['outer'] = this.reader.getFloat(primitives[i].children[0], 'outer', true);
			primitive.data['slices'] = this.reader.getInteger(primitives[i].children[0], 'slices', true);
			primitive.data['loops'] = this.reader.getInteger(primitives[i].children[0], 'loops', true);
		} else {
			return "There can be only one 'rectangle', one 'triangle', one 'cylinder', one 'sphere' or one 'torus' element inside each 'primitive' element.";
		}

		this.primitives.push(primitive);
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
		var texture = components[i].getElementsByTagName('texture');
		if (texture.length != 1)
			return "The 'texture' element inside 'component' is missing.";

		var component = new Component(this.reader.getString(components[i], 'id', true), this.reader.getString(texture[0], 'id', true));

		var transformation = components[i].getElementsByTagName('transformation');
		var materials = components[i].getElementsByTagName('materials');
		var children = components[i].getElementsByTagName('children');

		if (transformation.length != 1 || materials.length != 1 || children.length != 1)
			return "There must be exactly one 'transformation', one 'materials', one 'texture' and one 'children' elements inside a 'component' element.";

		if (materials[0].children.length == 0)
			return "There must be at least one 'material' element inside the 'materials' element of each 'component' element.";

		for (var j = 0; j < materials[0].children.length; j++)
			component.materials.push(this.reader.getString(materials[0].children[j], 'id', true));

		if (children[0].children.length == 0)
			return "There must be at least one 'componentref' and/or 'primitiveref' inside the 'children' element.";

		for (var j = 0; j < children[0].children.length; j++) {
			var temp = new Array(2);
			temp['id'] = this.reader.getString(children[0].children[j], 'id', true);

			if (children[0].children[j].tagName == 'componentref')
				temp['type'] = 'component';
			else if (children[0].children[j].tagName == 'primitiveref')
				temp['type'] = 'primitive';

			component.children.push(temp);
		}

		var temp;
		var tag = false, trans = false;
		for (var j = 0; j < transformation[0].children.length; j++) {
			if (transformation[0].children[j].tagName == 'transformationref') {
				tag = true;
				if (trans == true)
					return "ERROR";

				component.transformations.push(this.reader.getString(transformation[0].children[j], 'id', true));
			} else if (transformation[0].children[j].tagName == 'rotate') {
				trans = true;
				if (tag == true)
					return "ERROR";

				temp = new Array(3);
				temp['type'] = 'rotate';
				temp['axis'] = this.reader.getItem(transformations[i].children[j], 'axis', [ 'x', 'y', 'z' ], true);
				temp['angle'] = this.reader.getFloat(transformations[i].children[j], 'angle', true);
			} else if (transformation[0].children[j].tagName == 'scale') {
				trans = true;
				if (tag == true)
					return "ERROR";

				temp = new Array(4);
				temp['type'] = 'scale';
				temp['x'] = this.reader.getFloat(transformations[i].children[j], 'x', true);
				temp['y'] = this.reader.getFloat(transformations[i].children[j], 'y', true);
				temp['z'] = this.reader.getFloat(transformations[i].children[j], 'z', true);
			} else if (transformation[0].children[j].tagName == 'translate') {
				trans = true;
				if (tag == true)
					return "ERROR";

				temp = new Array(4);
				temp['type'] = 'translate';
				temp['x'] = this.reader.getFloat(transformations[i].children[j], 'x', true);
				temp['y'] = this.reader.getFloat(transformations[i].children[j], 'y', true);
				temp['z'] = this.reader.getFloat(transformations[i].children[j], 'z', true);
			}

			component.transformations.push(temp);
		}

		this.components.push(component);
	}
};

MySceneGraph.prototype.printGraphInfo = function() {
	// Print scene info
	console.log("scene: { root = " + this.root + ", axis_length = " + this.axisLength + " }");

	// Print views info
	console.log("views: { default = " + this.defaultView + " }");
	for (var j = 0; j < this.perspectives.length; j++) {
		console.log("\tperspective: { id = " + this.perspectives[j].id + ", near = " + this.perspectives[j].near + ", far = " + this.perspectives[j].far + ", angle = " + this.perspectives[j].angle + " }");
		console.log("\t\tfrom: { x = " + this.perspectives[j].from['x'] + ", y = " + this.perspectives[j].from['y'] + ", z = " + this.perspectives[j].from['z'] + " }");
		console.log("\t\tto: { x = " + this.perspectives[j].to['x'] + ", y = " + this.perspectives[j].to['y'] + ", z = " + this.perspectives[j].to['z'] + " }");
	}

	// Print illumination info
	console.log("illumination: { doublesided = " + this.doublesided + ", local = " + this.local + " }");
	console.log("\tambient: { r = " + this.ambient['r'] + ", g = " + this.ambient['g'] + ", b = " + this.ambient['b'] + ", a = " + this.ambient['a'] + " }");
	console.log("\tbackground: { r = " + this.background['r'] + ", g = " + this.background['g'] + ", b = " + this.background['b'] + ", a = " + this.background['a'] + " }");

	// Print lights info
	console.log("lights");
	for (var j = 0; j < this.omnis.length; j++) {
		console.log("\tomni: { id = " + this.omnis[j].id + ", enabled = " + this.omnis[j].enabled + " }");
		console.log("\t\tlocation: { x = " + this.omnis[j].location['x'] + ", y = " + this.omnis[j].location['y'] + ", z = " + this.omnis[j].location['z'] + ", w = " + this.omnis[j].location['w'] + " }");
		console.log("\t\tambient: { x = " + this.omnis[j].ambient['r'] + ", y = " + this.omnis[j].ambient['g'] + ", z = " + this.omnis[j].ambient['b'] + ", w = " + this.omnis[j].ambient['a'] + " }");
		console.log("\t\tdiffuse: { x = " + this.omnis[j].diffuse['r'] + ", y = " + this.omnis[j].diffuse['g'] + ", z = " + this.omnis[j].diffuse['b'] + ", w = " + this.omnis[j].diffuse['a'] + " }");
		console.log("\t\tspecular: { x = " + this.omnis[j].specular['r'] + ", y = " + this.omnis[j].specular['g'] + ", z = " + this.omnis[j].specular['b'] + ", w = " + this.omnis[j].specular['a'] + " }");
	}

	for (var k = 0; k < this.spots.length; k++) {
		console.log("\tspot: { id = " + this.spots[k].id + ", enabled = " + this.spots[k].enabled + ", angle = " + this.spots[k].angle + ", exponent = " + this.spots[k].exponent + " }");
		console.log("\t\ttarget: { x = " + this.spots[k].target['x'] + ", y = " + this.spots[k].target['y'] + ", z = " + this.spots[k].target['z'] + " }");
		console.log("\t\tlocation: { x = " + this.spots[k].location['x'] + ", y = " + this.spots[k].location['y'] + ", z = " + this.spots[k].location['z'] + " }");
		console.log("\t\tambient: { x = " + this.spots[k].ambient['r'] + ", y = " + this.spots[k].ambient['g'] + ", z = " + this.spots[k].ambient['b'] + ", w = " + this.spots[k].ambient['a'] + " }");
		console.log("\t\tdiffuse: { x = " + this.spots[k].diffuse['r'] + ", y = " + this.spots[k].diffuse['g'] + ", z = " + this.spots[k].diffuse['b'] + ", w = " + this.spots[k].diffuse['a'] + " }");
		console.log("\t\tspecular: { x = " + this.spots[k].specular['r'] + ", y = " + this.spots[k].specular['g'] + ", z = " + this.spots[k].specular['b'] + ", w = " + this.spots[k].specular['a'] + " }");
	}

	// Print textures info
	console.log("textures");
	for (var j = 0; j < this.textures.length; j++)
		console.log("\ttexture: { id = " + this.textures[j].id + ", file = " + this.textures[j].file + ", length_s = " + this.textures[j].length_s + ", length_t = " + this.textures[j].length_t + " }");

	// Print materials info
	console.log("materials");
	for (var j = 0; j < this.materials.length; j++) {
		console.log("\tmaterial: { id = " + this.materials[j].id + " }");
		console.log("\t\temission: { r = " + this.materials[j].emission['r'] + ", g = " + this.materials[j].emission['g'] + ", b = " + this.materials[j].emission['b'] + ", a = " + this.materials[j].emission['a'] + " }");
		console.log("\t\tambient: { r = " + this.materials[j].ambient['r'] + ", g = " + this.materials[j].ambient['g'] + ", b = " + this.materials[j].ambient['b'] + ", a = " + this.materials[j].ambient['a'] + " }");
		console.log("\t\tdiffuse: { r = " + this.materials[j].diffuse['r'] + ", g = " + this.materials[j].diffuse['g'] + ", b = " + this.materials[j].diffuse['b'] + ", a = " + this.materials[j].diffuse['a'] + " }");
		console.log("\t\tspecular: { r = " + this.materials[j].specular['r'] + ", g = " + this.materials[j].specular['g'] + ", b = " + this.materials[j].specular['b'] + ", a = " + this.materials[j].specular['a'] + " }");
		console.log("\t\tshininess: { value = " + this.materials[j].shininess + " }");
	}

	// Print transformations info
	console.log("transformations");
	for (var k = 0; k < this.transformations.length; k++) {
		console.log("\ttransformation: { id = " + this.transformations[k].id + " }");
		for (var l = 0; l < this.transformations[k].transformations.length; l++) {
			if (this.transformations[k].transformations[l].type == 'rotate')
				console.log("\t\trotate: { axis = " + this.transformations[k].transformations[l]['axis'] + ", angle = " + this.transformations[k].transformations[l]['angle'] + " }");
			else if (this.transformations[k].transformations[l].type == 'translate')
				console.log("\t\ttranslate: { x = " + this.transformations[k].transformations[l]['x'] + ", y = " + this.transformations[k].transformations[l]['y'] + ", z = " + this.transformations[k].transformations[l]['z'] + " }");
			else if (this.transformations[k].transformations[l].type == 'scale')
				console.log("\t\tscale: { x = " + this.transformations[k].transformations[l]['x'] + ", y = " + this.transformations[k].transformations[l]['y'] + ", z = " + this.transformations[k].transformations[l]['z'] + " }");
		}
	}

	// Print primitives info
	console.log("primitives");
	for (var j = 0; j < this.primitives.length; j++) {
		console.log("\tprimitive: { id = " + this.primitives[j].id + " }");
		if (this.primitives[j].type == 'rectangle')
			console.log("\t\trectangle: { x1 = " + this.primitives[j].data['x1'] + ", y1 = " + this.primitives[j].data['y1'] + ", x2 = " + this.primitives[j].data['x2'] + ", y2 = " + this.primitives[j].data['y2'] + " }");
		else if (this.primitives[j].type == 'triangle')
			console.log("\t\ttriangle: { x1 = " + this.primitives[j].data['x1'] + ", y1 = " + this.primitives[j].data['y1'] + ", z1 = " + this.primitives[j].data['z1'] + ", x2 = " + this.primitives[j].data['x2'] + ", y2 = " + this.primitives[j].data['y2'] + ", z2 = " + this.primitives[j].data['z2'] + ", x3 = " + this.primitives[j].data['x3'] + ", y3 = " + this.primitives[j].data['y3'] + ", z3 = " + this.primitives[j].data['z3'] + " }");
		else if (this.primitives[j].type == 'cylinder')
			console.log("\t\tcylinder: { base = " + this.primitives[j].data['base'] + ", top = " + this.primitives[j].data['top'] + ", height = " + this.primitives[j].data['height'] + ", slices = " + this.primitives[j].data['slices'] + ", stacks = " + this.primitives[j].data['stacks'] + " }");
		else if (this.primitives[j].type == 'sphere')
			console.log("\t\tsphere: { radius = " + this.primitives[j].data['radius'] + ", slices = " + this.primitives[j].data['slices'] + ", stacks = " + this.primitives[j].data['stacks'] + " }");
		else if (this.primitives[j].type == 'torus')
			console.log("\t\ttorus: { inner = " + this.primitives[j].data['inner'] + ", outer = " + this.primitives[j].data['outer'] + ", slices = " + this.primitives[j].data['slices'] + ", loops = " + this.primitives[j].data['loops'] + " }");
	}

	// Print components info
	// console.log("components");
	// for (var k = 0; k < this.components.length; k++) {
	// 	console.log("\tcomponent: { id = " + this.components[k]['id'] + " }");

	// 	console.log("\t\ttransformation")
	// 	for (var l = 0; l < this.components[k]['transformation'].length; l++) {
	// 		if (this.components[k]['transformation']['id#' + l] != null)
	// 			console.log("\t\t\ttransformationref: { id = " + this.components[k]['transformation']['id#' + l] + " }");
			
	// 		if (this.components[k]['transformation']['rotate#' + l] != null)
	// 			console.log("\t\t\trotate: { axis = " + this.components[k]['transformation']['rotate#' + l]['axis'] + ", angle = " + this.components[k]['transformation']['rotate#' + l]['angle'] + " }");
			
	// 		if (this.components[k]['transformation']['scale#' + l] != null)
	// 			console.log("\t\t\tscale: { x = " + this.components[k]['transformation']['scale#' + l]['x'] + ", y = " + this.components[k]['transformation']['scale#' + l]['y'] + ", z = " + this.components[k]['transformation']['scale#' + l]['z'] + " }");
			
	// 		if (this.components[k]['transformation']['translate#' + l] != null)
	// 			console.log("\t\t\ttranslate: { x = " + this.components[k]['transformation']['translate#' + l]['x'] + ", y = " + this.components[k]['transformation']['translate#' + l]['y'] + ", z = " + this.components[k]['transformation']['translate#' + l]['z'] + " }");
	// 	}

	// 	console.log("\t\tmaterials")
	// 	for (var l = 0; l < this.components[k]['materials'].length; l++)
	// 		console.log("\t\t\tmaterial: { id = " + this.components[k]['materials']['id#' + l] + " }");

	// 	console.log("\t\ttexture: { id = " + this.components[k]['textureId'] + " }");

	// 	console.log("\t\tchildren")
	// 	for (var l = 0; l < this.components[k]['children'].length; l++) {
	// 		if (this.components[k]['children']['type#' + l] == 'primitive')
	// 			console.log("\t\t\tprimitiveref: { id = " + this.components[k]['children']['id#' + l] + " }");
	// 		else if (this.components[k]['children']['type#' + l] == 'component')
	// 			console.log("\t\t\tcomponentref: { id = " + this.components[k]['children']['id#' + l] + " }");
	// 	}
	// }
}

/*
 * Callback to be executed on any read error
 */
MySceneGraph.prototype.onXMLError = function(message) {
 	console.error("XML Loading Error: " + message);	
 	this.loadedOk=false;
};