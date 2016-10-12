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

	this.loadedOk=true;
	
	// As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
	this.scene.onGraphLoaded();
};

MySceneGraph.prototype.parseScene = function(rootElement) {
	var elems = rootElement.getElementsByTagName('scene');
	if (elems == null)
		return "The 'scene' element is missing.";

	if (elems.length > 1)
		return "More than one 'scene' element found.";

	var scene = elems[0];
	this.root = this.reader.getString(scene, 'root', true);
	this.axisLength = this.reader.getFloat(scene, 'axis_length', true);

	console.log("scene: { root = " + this.root + ", axis_length = " + this.axisLength + " }");
};

MySceneGraph.prototype.parseViews = function(rootElement) {
	var elems = rootElement.getElementsByTagName('views');
	if (elems == null)
		return "The 'views' element is missing.";

	if (elems.length > 1)
		return "More than one 'views' element found.";

	var views = elems[0];
	this.defaultView = this.reader.getString(views, 'default', true);

	var perspectives = elems[0].getElementsByTagName('perspective');
	if (perspectives == null)
		return "The 'perspective' element is missing.";

	if (perspectives.length < 1)
		return "There must be at least one 'perspective' element.";

	this.perspectives = [];
	for (var i = 0; i < perspectives.length; i++) {
		var temp = new Array(6);
		temp['id'] = this.reader.getString(perspectives[i], 'id', true);
		temp['near'] = this.reader.getFloat(perspectives[i], 'near', true);
		temp['far'] = this.reader.getFloat(perspectives[i], 'far', true);
		temp['angle'] = this.reader.getFloat(perspectives[i], 'angle', true);

		temp['from'] = new Array(3);
		var from = perspectives[i].getElementsByTagName('from');
		temp['from']['x'] = this.reader.getFloat(from[0], 'x', true);
		temp['from']['y'] = this.reader.getFloat(from[0], 'y', true);
		temp['from']['z'] = this.reader.getFloat(from[0], 'z', true);

		temp['to'] = new Array(3);
		var to = perspectives[i].getElementsByTagName('to');
		temp['to']['x'] = this.reader.getFloat(to[0], 'x', true);
		temp['to']['y'] = this.reader.getFloat(to[0], 'y', true);
		temp['to']['z'] = this.reader.getFloat(to[0], 'z', true);

		this.perspectives.push(temp);
	}

	console.log("views: { default = " + this.defaultView + " }");
	for (var j = 0; j < this.perspectives.length; j++) {
		console.log("\tperspective: { id = " + this.perspectives[j]['id'] + ", near = " + this.perspectives[j]['near'] + ", far = " + this.perspectives[j]['far'] + ", angle = " + this.perspectives[j]['angle'] + " }");
		console.log("\t\tfrom: { x = " + this.perspectives[j]['from']['x'] + ", y = " + this.perspectives[j]['from']['y'] + ", z = " + this.perspectives[j]['from']['z'] + " }");
		console.log("\t\tto: { x = " + this.perspectives[j]['to']['x'] + ", y = " + this.perspectives[j]['to']['y'] + ", z = " + this.perspectives[j]['to']['z'] + " }");
	}
};

MySceneGraph.prototype.parseIllumination = function(rootElement) {
	var elems = rootElement.getElementsByTagName('illumination');
	if (elems == null)
		return "The 'illumination' element is missing.";

	if (elems.length > 1)
		return "More than one 'illumination' element found.";

	var illumination = elems[0];
	this.doublesided = this.reader.getBoolean(illumination, 'doublesided', true);
	this.local = this.reader.getBoolean(illumination, 'local', true);

	elems = illumination.getElementsByTagName('ambient');
	if (elems == null)
		return "The 'ambient' element is missing.";

	if (elems.length > 1)
		return "More than one 'ambient' element found.";

	this.ambient = [];
	var ambient = elems[0];
	this.ambient['r'] = this.reader.getFloat(ambient, 'r', true);
	this.ambient['g'] = this.reader.getFloat(ambient, 'g', true);
	this.ambient['b'] = this.reader.getFloat(ambient, 'b', true);
	this.ambient['a'] = this.reader.getFloat(ambient, 'a', true);

	elems = illumination.getElementsByTagName('background');
	if (elems == null)
		return "The 'background' element is missing.";

	if (elems.length > 1)
		return "More than one 'background' element found.";

	this.background = [];
	var background = elems[0];
	this.background['r'] = this.reader.getFloat(background, 'r', true);
	this.background['g'] = this.reader.getFloat(background, 'g', true);
	this.background['b'] = this.reader.getFloat(background, 'b', true);
	this.background['a'] = this.reader.getFloat(background, 'a', true);

	console.log("illumination: { doublesided = " + this.doublesided + ", local = " + this.local + " }");
	console.log("\tambient: { r = " + this.ambient['r'] + ", g = " + this.ambient['g'] + ", b = " + this.ambient['b'] + ", a = " + this.ambient['a'] + " }");
	console.log("\tbackground: { r = " + this.background['r'] + ", g = " + this.background['g'] + ", b = " + this.background['b'] + ", a = " + this.background['a'] + " }");
};

MySceneGraph.prototype.parseLights = function(rootElement) {
	var elems = rootElement.getElementsByTagName('lights');
	if (elems == null)
		return "The 'lights' element is missing.";

	if (elems.length > 1)
		return "More than one 'lights' element found.";

	var omnis = elems[0].getElementsByTagName('omni');
	var spots = elems[0].getElementsByTagName('spot');
	if (omnis == null && spots == null)
		return "Both 'omni' and 'spot' elements are missing. There must be at least on 'omni' or 'spot' element.";

	this.omnis = [];
	for (var i = 0; i < omnis.length; i++) {
		var temp = new Array(6);
		temp['id'] = this.reader.getString(omnis[i], 'id', true);
		temp['enabled'] = this.reader.getBoolean(omnis[i], 'enabled', true);

		temp['location'] = new Array(4);
		var location = omnis[i].getElementsByTagName('location');
		temp['location']['x'] = this.reader.getFloat(location[0], 'x', true);
		temp['location']['y'] = this.reader.getFloat(location[0], 'y', true);
		temp['location']['z'] = this.reader.getFloat(location[0], 'z', true);
		temp['location']['w'] = this.reader.getFloat(location[0], 'w', true);

		temp['ambient'] = new Array(4);
		var ambient = omnis[i].getElementsByTagName('ambient');
		temp['ambient']['r'] = this.reader.getFloat(ambient[0], 'r', true);
		temp['ambient']['g'] = this.reader.getFloat(ambient[0], 'g', true);
		temp['ambient']['b'] = this.reader.getFloat(ambient[0], 'b', true);
		temp['ambient']['a'] = this.reader.getFloat(ambient[0], 'a', true);

		temp['diffuse'] = new Array(4);
		var diffuse = omnis[i].getElementsByTagName('diffuse');
		temp['diffuse']['r'] = this.reader.getFloat(diffuse[0], 'r', true);
		temp['diffuse']['g'] = this.reader.getFloat(diffuse[0], 'g', true);
		temp['diffuse']['b'] = this.reader.getFloat(diffuse[0], 'b', true);
		temp['diffuse']['a'] = this.reader.getFloat(diffuse[0], 'a', true);

		temp['specular'] = new Array(4);
		var specular = omnis[i].getElementsByTagName('specular');
		temp['specular']['r'] = this.reader.getFloat(specular[0], 'r', true);
		temp['specular']['g'] = this.reader.getFloat(specular[0], 'g', true);
		temp['specular']['b'] = this.reader.getFloat(specular[0], 'b', true);
		temp['specular']['a'] = this.reader.getFloat(specular[0], 'a', true);

		this.omnis.push(temp);
	}

	this.spots = [];
	for (var i = 0; i < spots.length; i++) {
		var temp = new Array(9);
		temp['id'] = this.reader.getString(spots[i], 'id', true);
		temp['enabled'] = this.reader.getBoolean(spots[i], 'enabled', true);
		temp['angle'] = this.reader.getFloat(spots[i], 'angle', true);
		temp['exponent'] = this.reader.getFloat(spots[i], 'exponent', true);

		temp['target'] = new Array(3);
		var target = spots[i].getElementsByTagName('target');
		temp['target']['x'] = this.reader.getFloat(target[0], 'x', true);
		temp['target']['y'] = this.reader.getFloat(target[0], 'y', true);
		temp['target']['z'] = this.reader.getFloat(target[0], 'z', true);

		temp['location'] = new Array(3);
		var location = spots[i].getElementsByTagName('location');
		temp['location']['x'] = this.reader.getFloat(location[0], 'x', true);
		temp['location']['y'] = this.reader.getFloat(location[0], 'y', true);
		temp['location']['z'] = this.reader.getFloat(location[0], 'z', true);

		temp['ambient'] = new Array(4);
		var ambient = spots[i].getElementsByTagName('ambient');
		temp['ambient']['r'] = this.reader.getFloat(ambient[0], 'r', true);
		temp['ambient']['g'] = this.reader.getFloat(ambient[0], 'g', true);
		temp['ambient']['b'] = this.reader.getFloat(ambient[0], 'b', true);
		temp['ambient']['a'] = this.reader.getFloat(ambient[0], 'a', true);

		temp['diffuse'] = new Array(4);
		var diffuse = spots[i].getElementsByTagName('diffuse');
		temp['diffuse']['r'] = this.reader.getFloat(diffuse[0], 'r', true);
		temp['diffuse']['g'] = this.reader.getFloat(diffuse[0], 'g', true);
		temp['diffuse']['b'] = this.reader.getFloat(diffuse[0], 'b', true);
		temp['diffuse']['a'] = this.reader.getFloat(diffuse[0], 'a', true);

		temp['specular'] = new Array(4);
		var specular = spots[i].getElementsByTagName('specular');
		temp['specular']['r'] = this.reader.getFloat(specular[0], 'r', true);
		temp['specular']['g'] = this.reader.getFloat(specular[0], 'g', true);
		temp['specular']['b'] = this.reader.getFloat(specular[0], 'b', true);
		temp['specular']['a'] = this.reader.getFloat(specular[0], 'a', true);

		this.spots.push(temp);
	}

	console.log("lights");
	for (var j = 0; j < this.omnis.length; j++) {
		console.log("\tomni: { id = " + this.omnis[j]['id'] + ", enabled = " + this.omnis[j]['enabled'] + " }");
		console.log("\t\tlocation: { x = " + this.omnis[j]['location']['x'] + ", y = " + this.omnis[j]['location']['y'] + ", z = " + this.omnis[j]['location']['z'] + ", w = " + this.omnis[j]['location']['w'] + " }");
		console.log("\t\tambient: { x = " + this.omnis[j]['ambient']['r'] + ", y = " + this.omnis[j]['ambient']['g'] + ", z = " + this.omnis[j]['ambient']['b'] + ", w = " + this.omnis[j]['ambient']['a'] + " }");
		console.log("\t\tdiffuse: { x = " + this.omnis[j]['diffuse']['r'] + ", y = " + this.omnis[j]['diffuse']['g'] + ", z = " + this.omnis[j]['diffuse']['b'] + ", w = " + this.omnis[j]['diffuse']['a'] + " }");
		console.log("\t\tspecular: { x = " + this.omnis[j]['specular']['r'] + ", y = " + this.omnis[j]['specular']['g'] + ", z = " + this.omnis[j]['specular']['b'] + ", w = " + this.omnis[j]['specular']['a'] + " }");
	}

	for (var k = 0; k < this.spots.length; k++) {
		console.log("\tspot: { id = " + this.spots[k]['id'] + ", enabled = " + this.spots[k]['enabled'] + ", angle = " + this.spots[k]['angle'] + ", exponent = " + this.spots[k]['exponent'] + " }");
		console.log("\t\ttarget: { x = " + this.spots[k]['target']['x'] + ", y = " + this.spots[k]['target']['y'] + ", z = " + this.spots[k]['target']['z'] + " }");
		console.log("\t\tlocation: { x = " + this.spots[k]['location']['x'] + ", y = " + this.spots[k]['location']['y'] + ", z = " + this.spots[k]['location']['z'] + " }");
		console.log("\t\tambient: { x = " + this.spots[k]['ambient']['r'] + ", y = " + this.spots[k]['ambient']['g'] + ", z = " + this.spots[k]['ambient']['b'] + ", w = " + this.spots[k]['ambient']['a'] + " }");
		console.log("\t\tdiffuse: { x = " + this.spots[k]['diffuse']['r'] + ", y = " + this.spots[k]['diffuse']['g'] + ", z = " + this.spots[k]['diffuse']['b'] + ", w = " + this.spots[k]['diffuse']['a'] + " }");
		console.log("\t\tspecular: { x = " + this.spots[k]['specular']['r'] + ", y = " + this.spots[k]['specular']['g'] + ", z = " + this.spots[k]['specular']['b'] + ", w = " + this.spots[k]['specular']['a'] + " }");
	}
};

MySceneGraph.prototype.parseTextures = function(rootElement) {
	var elems = rootElement.getElementsByTagName('textures');
	if (elems == null)
		return "The 'textures' element is missing.";

	if (elems.length > 1)
		return "More than one 'textures' element found.";

	var textures = elems[0].getElementsByTagName('texture');
	if (textures == null)
		return "The 'texture' element is missing.";

	if (textures.length < 1)
		return "There must be at least one 'texture' element.";

	this.textures = [];
	for (var i = 0; i < textures.length; i++) {
		var temp = new Array(4);
		temp['id'] = this.reader.getString(textures[i], 'id', true);
		temp['file'] = this.reader.getString(textures[i], 'file', true);
		temp['length_s'] = this.reader.getFloat(textures[i], 'length_s', true);
		temp['length_t'] = this.reader.getFloat(textures[i], 'length_t', true);

		this.textures.push(temp);
	}

	console.log("textures");
	for (var j = 0; j < this.textures.length; j++)
		console.log("\ttexture: { id = " + this.textures[j]['id'] + ", file = " + this.textures[j]['file'] + ", length_s = " + this.textures[j]['length_s'] + ", length_t = " + this.textures[j]['length_t'] + " }");
};

MySceneGraph.prototype.parseMaterials = function(rootElement) {
	var elems = rootElement.getElementsByTagName('materials');
	if (elems == null)
		return "The 'materials' element is missing.";

	var materials = elems[0].getElementsByTagName('material');
	if (elems == null)
		return "The 'material' element is missing.";

	if (materials.length < 1)
		return "There must be at least one 'material' element.";

	this.materials = [];
	for (var i = 0; i < materials.length; i++) {
		var temp = [];
		temp['id'] = this.reader.getString(materials[i], 'id', true);

		temp['emission'] = new Array(4);
		var emission = materials[i].getElementsByTagName('emission');
		temp['emission']['r'] = this.reader.getFloat(emission[0], 'r', true);
		temp['emission']['g'] = this.reader.getFloat(emission[0], 'g', true);
		temp['emission']['b'] = this.reader.getFloat(emission[0], 'b', true);
		temp['emission']['a'] = this.reader.getFloat(emission[0], 'a', true);

		temp['ambient'] = new Array(4);
		var ambient = materials[i].getElementsByTagName('ambient');
		temp['ambient']['r'] = this.reader.getFloat(ambient[0], 'r', true);
		temp['ambient']['g'] = this.reader.getFloat(ambient[0], 'g', true);
		temp['ambient']['b'] = this.reader.getFloat(ambient[0], 'b', true);
		temp['ambient']['a'] = this.reader.getFloat(ambient[0], 'a', true);

		temp['diffuse'] = new Array(4);
		var diffuse = materials[i].getElementsByTagName('diffuse');
		temp['diffuse']['r'] = this.reader.getFloat(diffuse[0], 'r', true);
		temp['diffuse']['g'] = this.reader.getFloat(diffuse[0], 'g', true);
		temp['diffuse']['b'] = this.reader.getFloat(diffuse[0], 'b', true);
		temp['diffuse']['a'] = this.reader.getFloat(diffuse[0], 'a', true);

		temp['specular'] = new Array(4);
		var specular = materials[i].getElementsByTagName('specular');
		temp['specular']['r'] = this.reader.getFloat(specular[0], 'r', true);
		temp['specular']['g'] = this.reader.getFloat(specular[0], 'g', true);
		temp['specular']['b'] = this.reader.getFloat(specular[0], 'b', true);
		temp['specular']['a'] = this.reader.getFloat(specular[0], 'a', true);

		var shininess = materials[i].getElementsByTagName('shininess');
		temp['shininessValue'] = this.reader.getFloat(shininess[0], 'value', true);

		this.materials.push(temp);
	}

	console.log("materials");
	for (var j = 0; j < this.materials.length; j++) {
		console.log("\tmaterial: { id = " + this.materials[j]['id'] + " }");
		console.log("\t\temission: { r = " + this.materials[j]['emission']['r'] + ", g = " + this.materials[j]['emission']['g'] + ", b = " + this.materials[j]['emission']['b'] + ", a = " + this.materials[j]['emission']['a'] + " }");
		console.log("\t\tambient: { r = " + this.materials[j]['ambient']['r'] + ", g = " + this.materials[j]['ambient']['g'] + ", b = " + this.materials[j]['ambient']['b'] + ", a = " + this.materials[j]['ambient']['a'] + " }");
		console.log("\t\tdiffuse: { r = " + this.materials[j]['diffuse']['r'] + ", g = " + this.materials[j]['diffuse']['g'] + ", b = " + this.materials[j]['diffuse']['b'] + ", a = " + this.materials[j]['diffuse']['a'] + " }");
		console.log("\t\tspecular: { r = " + this.materials[j]['specular']['r'] + ", g = " + this.materials[j]['specular']['g'] + ", b = " + this.materials[j]['specular']['b'] + ", a = " + this.materials[j]['specular']['a'] + " }");
		console.log("\t\tshininess: { value = " + this.materials[j]['shininessValue'] + " }");
	}
};

MySceneGraph.prototype.parseTransformations = function(rootElement) {
	var elems = rootElement.getElementsByTagName('transformations');
	if (elems == null)
		return "The 'transformations' element is missing.";

	if (elems.length > 1)
		return "More than one 'transformations' element found.";

	var transformations = elems[0].getElementsByTagName('transformation');
	if (transformations == null)
		return "The 'transformation' element is missing.";

	if (transformations.length < 1)
		return "There must be at least one 'transformation' element.";

	this.transformations = [];
	for (var i = 0; i < transformations.length; i++) {
		var temp = new Array(transformations[i].children.length + 1);
		temp['id'] = this.reader.getString(transformations[i], 'id', true);

		var rotate = transformations[i].getElementsByTagName('rotate');
		if (rotate != null) {
			for (var j = 0; j < rotate.length; j++) {
				temp['rotate#' + j] = new Array(2);
				temp['rotate#' + j]['axis'] = this.reader.getItem(rotate[j], 'axis', [ 'x', 'y', 'z' ], true);
				temp['rotate#' + j]['angle'] = this.reader.getFloat(rotate[j], 'angle', true);
			}
		}

		var scale = transformations[i].getElementsByTagName('scale');
		if (scale != null) {
			for (var j = 0; j < scale.length; j++) {
				temp['scale#' + j] = new Array(3);
				temp['scale#' + j]['x'] = this.reader.getFloat(scale[j], 'x', true);
				temp['scale#' + j]['y'] = this.reader.getFloat(scale[j], 'y', true);
				temp['scale#' + j]['z'] = this.reader.getFloat(scale[j], 'z', true);
			}
		}

		var translate = transformations[i].getElementsByTagName('translate');
		if (translate != null) {
			for (var j = 0; j < translate.length; j++) {
				temp['translate#' + j] = new Array(3);
				temp['translate#' + j]['x'] = this.reader.getFloat(translate[j], 'x', true);
				temp['translate#' + j]['y'] = this.reader.getFloat(translate[j], 'y', true);
				temp['translate#' + j]['z'] = this.reader.getFloat(translate[j], 'z', true);
			}
		}

		this.transformations.push(temp);
	}

	console.log("transformations");
	for (var k = 0; k < this.transformations.length; k++) {
		console.log("\ttransformation: { id = " + this.transformations[k]['id'] + " }");
		for (var l = 0; l < this.transformations[k].length; l++) {
			if (this.transformations[k]['rotate#' + l] != null)
				console.log("\t\trotate: { axis = " + this.transformations[k]['rotate#' + l]['axis'] + ", angle = " + this.transformations[k]['rotate#' + l]['angle'] + " }");

			if (this.transformations[k]['scale#' + l] != null)
				console.log("\t\tscale: { x = " + this.transformations[k]['scale#' + l]['x'] + ", y = " + this.transformations[k]['scale#' + l]['y'] + ", z = " + this.transformations[k]['scale#' + l]['z'] + " }");

			if (this.transformations[k]['translate#' + l] != null)
				console.log("\t\ttranslate: { x = " + this.transformations[k]['translate#' + l]['x'] + ", y = " + this.transformations[k]['translate#' + l]['y'] + ", z = " + this.transformations[k]['translate#' + l]['z'] + " }");
		}
	}
};

MySceneGraph.prototype.parsePrimitives = function(rootElement) {
	var elems = rootElement.getElementsByTagName('primitives');
	if (elems == null)
		return "The 'primitives' element is missing.";

	if (elems.length > 1)
		return "More than one 'primitives' element found.";

	var primitives = elems[0].getElementsByTagName('primitive');
	if (primitives == null)
		return "The 'primitive' element is missing.";

	if (primitives.length < 1)
		return "There must be at least one 'primitive' element.";

	this.primitives = [];
	for (var i = 0; i < primitives.length; i++) {
		if (primitives[i].children.length > 1)
			return "There can be only one primitive inside each 'primitive' element.";
		
		var temp;
		if (primitives[i].children[0].tagName == 'rectangle') {
			temp = new Array(6);
			temp['type'] = 'rectangle';
			temp['id'] = this.reader.getString(primitives[i], 'id', true);
			temp['x1'] = this.reader.getFloat(primitives[i].children[0], 'x1', true);
			temp['y1'] = this.reader.getFloat(primitives[i].children[0], 'y1', true);
			temp['x2'] = this.reader.getFloat(primitives[i].children[0], 'x2', true);
			temp['y2'] = this.reader.getFloat(primitives[i].children[0], 'y2', true);
		} else if (primitives[i].children[0].tagName == 'triangle') {
			temp = new Array(11);
			temp['type'] = 'triangle';
			temp['id'] = this.reader.getString(primitives[i], 'id', true);
			temp['x1'] = this.reader.getFloat(primitives[i].children[0], 'x1', true);
			temp['y1'] = this.reader.getFloat(primitives[i].children[0], 'y1', true);
			temp['z1'] = this.reader.getFloat(primitives[i].children[0], 'z1', true);
			temp['x2'] = this.reader.getFloat(primitives[i].children[0], 'x2', true);
			temp['y2'] = this.reader.getFloat(primitives[i].children[0], 'y2', true);
			temp['z2'] = this.reader.getFloat(primitives[i].children[0], 'z2', true);
			temp['x3'] = this.reader.getFloat(primitives[i].children[0], 'x3', true);
			temp['y3'] = this.reader.getFloat(primitives[i].children[0], 'y3', true);
			temp['z3'] = this.reader.getFloat(primitives[i].children[0], 'z3', true);
		} else if (primitives[i].children[0].tagName == 'cylinder') {
			temp = new Array(7);
			temp['type'] = 'cylinder';
			temp['id'] = this.reader.getString(primitives[i], 'id', true);
			temp['base'] = this.reader.getFloat(primitives[i].children[0], 'base', true);
			temp['top'] = this.reader.getFloat(primitives[i].children[0], 'top', true);
			temp['height'] = this.reader.getFloat(primitives[i].children[0], 'height', true);
			temp['slices'] = this.reader.getInteger(primitives[i].children[0], 'slices', true);
			temp['stacks'] = this.reader.getInteger(primitives[i].children[0], 'stacks', true);
		} else if (primitives[i].children[0].tagName == 'sphere') {
			temp = new Array(5);
			temp['type'] = 'sphere';
			temp['id'] = this.reader.getString(primitives[i], 'id', true);
			temp['radius'] = this.reader.getFloat(primitives[i].children[0], 'radius', true);
			temp['slices'] = this.reader.getInteger(primitives[i].children[0], 'slices', true);
			temp['stacks'] = this.reader.getInteger(primitives[i].children[0], 'stacks', true);
		} else if (primitives[i].children[0].tagName == 'torus') {
			temp = new Array(6);
			temp['type'] = 'torus';
			temp['id'] = this.reader.getString(primitives[i], 'id', true);
			temp['inner'] = this.reader.getFloat(primitives[i].children[0], 'inner', true);
			temp['outer'] = this.reader.getFloat(primitives[i].children[0], 'outer', true);
			temp['slices'] = this.reader.getInteger(primitives[i].children[0], 'slices', true);
			temp['loops'] = this.reader.getInteger(primitives[i].children[0], 'loops', true);
		}

		this.primitives.push(temp);
	}

	console.log("primitives");
	for (var j = 0; j < this.primitives.length; j++) {
		console.log("\tprimitive: { id = " + this.primitives[j]['id'] + " }");
		if (this.primitives[j]['type'] == 'rectangle')
			console.log("\t\trectangle: { x1 = " + this.primitives[j]['x1'] + ", y1 = " + this.primitives[j]['y1'] + ", x2 = " + this.primitives[j]['x2'] + ", y2 = " + this.primitives[j]['y2'] + " }");
		else if (this.primitives[j]['type'] == 'triangle')
			console.log("\t\ttriangle: { x1 = " + this.primitives[j]['x1'] + ", y1 = " + this.primitives[j]['y1'] + ", z1 = " + this.primitives[j]['z1'] + ", x2 = " + this.primitives[j]['x2'] + ", y2 = " + this.primitives[j]['y2'] + ", z2 = " + this.primitives[j]['z2'] + ", x3 = " + this.primitives[j]['x3'] + ", y3 = " + this.primitives[j]['y3'] + ", z3 = " + this.primitives[j]['z3'] + " }");
		else if (this.primitives[j]['type'] == 'cylinder')
			console.log("\t\tcylinder: { base = " + this.primitives[j]['base'] + ", top = " + this.primitives[j]['top'] + ", height = " + this.primitives[j]['height'] + ", slices = " + this.primitives[j]['slices'] + ", stacks = " + this.primitives[j]['stacks'] + " }");
		else if (this.primitives[j]['type'] == 'sphere')
			console.log("\t\tsphere: { radius = " + this.primitives[j]['radius'] + ", slices = " + this.primitives[j]['slices'] + ", stacks = " + this.primitives[j]['stacks'] + " }");
		else if (this.primitives[j]['type'] == 'torus')
			console.log("\t\ttorus: { inner = " + this.primitives[j]['inner'] + ", outer = " + this.primitives[j]['outer'] + ", slices = " + this.primitives[j]['slices'] + ", loops = " + this.primitives[j]['loops'] + " }");
	}
};

MySceneGraph.prototype.parseComponents = function(rootElement) {
	var elems = rootElement.getElementsByTagName('components');
	if (elems == null)
		return "The 'components' element is missing.";

	if (elems.length > 1)
		return "More than one 'components' element found.";

	var components = elems[0].getElementsByTagName('component');
	if (components == null)
		return "The 'component' element is missing.";

	if (components.length < 1)
		return "There must be at least one 'component' element.";

	this.components = [];
	for (var i = 0; i < components.length; i++) {
		var temp = new Array(5);
		temp['id'] = this.reader.getString(components[i], 'id', true);

		var texture = components[i].getElementsByTagName('texture');
		temp['textureId'] = this.reader.getString(texture[0], 'id', true);

		var aux;
		var transformation = components[i].getElementsByTagName('transformation');
		aux = new Array(transformation[0].children.length);
		for (var j = 0; j < transformation[0].children.length; j++) {
			aux['id#' + j] = this.reader.getString(transformation[0].children[j], 'id', true);
		}
		temp['transformation'] = aux;

		var materials = components[i].getElementsByTagName('materials');
		aux = new Array(materials[0].children.length);
		for (var j = 0; j < materials[0].children.length; j++) {
			aux['id#' + j] = this.reader.getString(materials[0].children[j], 'id', true);
		}
		temp['materials'] = aux;

		var children = components[i].getElementsByTagName('children');
		aux = new Array(children[0].children.length * 2);
		for (var j = 0; j < children[0].children.length; j++) {
			aux['id#' + j] = this.reader.getString(children[0].children[j], 'id', true);

			if (children[0].children[j].tagName == 'componentref')
				aux['type#' + j] = 'component';
			else if (children[0].children[j].tagName == 'primitiveref')
				aux['type#' + j] = 'primitive';
		}
		temp['children'] = aux;

		this.components.push(temp);
	}

	console.log("components");
	for (var k = 0; k < this.components.length; k++) {
		console.log("\tcomponent: { id = " + this.components[k]['id'] + " }");

		console.log("\t\ttransformation")
		for (var l = 0; l < this.components[k]['transformation'].length; l++)
			console.log("\t\t\ttransformationref: { id = " + this.components[k]['transformation']['id#' + l] + " }");

		console.log("\t\tmaterials")
		for (var l = 0; l < this.components[k]['materials'].length; l++)
			console.log("\t\t\tmaterial: { id = " + this.components[k]['materials']['id#' + l] + " }");

		console.log("\t\ttexture: { id = " + this.components[k]['textureId'] + " }");

		console.log("\t\tchildren")
		for (var l = 0; l < this.components[k]['children'].length; l++) {
			if (this.components[k]['children']['type#' + l] == 'primitive')
				console.log("\t\t\tprimitiveref: { id = " + this.components[k]['children']['id#' + l] + " }");
			else if (this.components[k]['children']['type#' + l] == 'component')
				console.log("\t\t\tcomponentref: { id = " + this.components[k]['children']['id#' + l] + " }");
		}
	}
};

/*
 * Example of method that parses elements of one block and stores information in a specific data structure
 */
MySceneGraph.prototype.parseGlobalsExample = function(rootElement) {
 	var elems =  rootElement.getElementsByTagName('globals');
 	if (elems == null) {
 		return "globals element is missing.";
 	}

 	if (elems.length != 1) {
 		return "either zero or more than one 'globals' element found.";
 	}

	// various examples of different types of access
	var globals = elems[0];
	this.background = this.reader.getRGBA(globals, 'background');
	this.drawmode = this.reader.getItem(globals, 'drawmode', ["fill","line","point"]);
	this.cullface = this.reader.getItem(globals, 'cullface', ["back","front","none", "frontandback"]);
	this.cullorder = this.reader.getItem(globals, 'cullorder', ["ccw","cw"]);

	console.log("Globals read from file: {background=" + this.background + ", drawmode=" + this.drawmode + ", cullface=" + this.cullface + ", cullorder=" + this.cullorder + "}");

	var tempList=rootElement.getElementsByTagName('list');

	if (tempList == null  || tempList.length==0) {
		return "list element is missing.";
	}
	
	this.list=[];
	// iterate over every element
	var nnodes=tempList[0].children.length;
	for (var i=0; i< nnodes; i++)
	{
		var e=tempList[0].children[i];

		// process each element and store its information
		this.list[e.id]=e.attributes.getNamedItem("coords").value;
		console.log("Read list item id "+ e.id+" with value "+this.list[e.id]);
	};
};

/*
 * Callback to be executed on any read error
 */
MySceneGraph.prototype.onXMLError = function(message) {
 	console.error("XML Loading Error: " + message);	
 	this.loadedOk=false;
};