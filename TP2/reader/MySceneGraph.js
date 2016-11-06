function MySceneGraph(filename, scene) {
	this.loadedOk = null;
	
	// Establish bidirectional references between scene and graph
	this.scene = scene;
	scene.graph = this;

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
 * @return {void}
 */
MySceneGraph.prototype.onXMLReady = function() {
	console.log("XML Loading finished.");
	var rootElement = this.reader.xmlDoc.documentElement;

	try {
		this.checkOrder(rootElement);
		this.parseScene(rootElement);
		this.parseViews(rootElement);
		this.parseIllumination(rootElement);
		this.parseLights(rootElement);
		this.parseTextures(rootElement);
		this.parseMaterials(rootElement);
		this.parseTransformations(rootElement);
		this.parseAnimations(rootElement);
		this.parsePrimitives(rootElement);
		this.parseComponents(rootElement);
	} catch (error) {
		this.onXMLError(error);
		return;
	}

	this.loadedOk = true;
	// this.printGraphInfo();
	// As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
	this.scene.onGraphLoaded();
};

/**
 * Checks the order of the elements in the .dsx file
 * @param  {documentElement} rootElement
 * @return {void}
 */
MySceneGraph.prototype.checkOrder = function(rootElement) {
	if (rootElement.children[0].tagName != 'scene')
		throw "The 'scene' element should be the first element in the .dsx file.";
	else if (rootElement.children[1].tagName != 'views')
		throw "The 'views' element should be the second element in the .dsx file.";
	else if (rootElement.children[2].tagName != 'illumination')
		throw "The 'illumination' element should be the third element in the .dsx file.";
	else if (rootElement.children[3].tagName != 'lights')
		throw "The 'lights' element should be the fourth element in the .dsx file.";
	else if (rootElement.children[4].tagName != 'textures')
		throw "The 'textures' element should be the fifth element in the .dsx file.";
	else if (rootElement.children[5].tagName != 'materials')
		throw "The 'materials' element should be the sixth element in the .dsx file.";
	else if (rootElement.children[6].tagName != 'transformations')
		throw "The 'transformations' element should be the seventh element in the .dsx file.";
	else if (rootElement.children[7].tagName != 'animations')
		throw "The 'animations' element should be the eighth element in the .dsx file.";
	else if (rootElement.children[8].tagName != 'primitives')
		throw "The 'primitives' element should be the ninth element in the .dsx file.";
	else if (rootElement.children[9].tagName != 'components')
		throw "The 'components' element should be the ninth element in the .dsx file.";
};

/**
 * Reads and stores the information from the 'scene' element
 * @param  {documentElement} rootElement
 * @return {void}
 */
MySceneGraph.prototype.parseScene = function(rootElement) {
	var elems = rootElement.getElementsByTagName('scene');
	if (elems == null)
		throw "The 'scene' element is missing.";

	if (elems.length != 1)
		throw "Zero or more than one 'scene' element found.";

	var scene = elems[0];
	this.root = this.reader.getString(scene, 'root', true);
	this.axisLength = this.reader.getFloat(scene, 'axis_length', true);
};

/**
 * Reads and stores the information from the 'views' element
 * @param  {documentElement} rootElement
 * @return {void}
 */
MySceneGraph.prototype.parseViews = function(rootElement) {
	var elems = rootElement.getElementsByTagName('views');
	if (elems == null)
		throw "The 'views' element is missing.";

	if (elems.length != 1)
		throw "Zero or more than one 'views' element found.";

	var views = elems[0];
	this.defaultView = this.reader.getString(views, 'default', true);

	var perspectives = elems[0].getElementsByTagName('perspective');
	if (perspectives == null)
		throw "The 'perspective' element is missing.";

	if (perspectives.length < 1)
		throw "There must be at least one 'perspective' element.";

	this.viewsIndex = [];
	this.perspectives = [];
	for (var i = 0; i < perspectives.length; i++) {
		var from = [], to = [];
		var id, near, far, angle;

		var fromTag = perspectives[i].getElementsByTagName('from');
		var toTag = perspectives[i].getElementsByTagName('to');

		if (fromTag.length != 1)
			throw "There must be exactly one 'from' element inside each 'perspective' element.";
		else if (toTag.length != 1)
			throw "There must be exactly one 'to' element inside each 'perspective' element.";

		id = this.reader.getString(perspectives[i], 'id', true);
		near = this.reader.getFloat(perspectives[i], 'near', true);
		far = this.reader.getFloat(perspectives[i], 'far', true);
		angle = this.reader.getFloat(perspectives[i], 'angle', true) * this.scene.degToRad;

		from['x'] = this.reader.getFloat(fromTag[0], 'x', true);
		from['y'] = this.reader.getFloat(fromTag[0], 'y', true);
		from['z'] = this.reader.getFloat(fromTag[0], 'z', true);

		to['x'] = this.reader.getFloat(toTag[0], 'x', true);
		to['y'] = this.reader.getFloat(toTag[0], 'y', true);
		to['z'] = this.reader.getFloat(toTag[0], 'z', true);

		var camera = new CGFcamera(angle, near, far, vec3.fromValues(from['x'], from['y'], from['z']), vec3.fromValues(to['x'], to['y'], to['z']));
		
		this.checkRepeated(id, this.perspectives, 'perspectives');
		this.perspectives[id] = camera;
		this.viewsIndex.push(id);
	}
};

/**
 * Reads and stores the information from the 'illumination' element
 * @param  {documentElement} rootElement
 * @return {void}
 */
MySceneGraph.prototype.parseIllumination = function(rootElement) {
	var elems = rootElement.getElementsByTagName('illumination');
	if (elems == null)
		throw "The 'illumination' element is missing.";

	if (elems.length != 1)
		throw "Zero or more than one 'illumination' element found.";

	var illumination = elems[0];
	this.doublesided = this.reader.getBoolean(illumination, 'doublesided', true);
	this.local = this.reader.getBoolean(illumination, 'local', true);

	var ambient = illumination.getElementsByTagName('ambient');
	if (ambient == null)
		throw "The 'ambient' element is missing.";

	if (ambient.length != 1)
		throw "There must be exactly one 'ambient' element inside the 'illumination' element.";

	this.ambient = [];
	this.ambient['r'] = this.reader.getFloat(ambient[0], 'r', true);
	this.ambient['g'] = this.reader.getFloat(ambient[0], 'g', true);
	this.ambient['b'] = this.reader.getFloat(ambient[0], 'b', true);
	this.ambient['a'] = this.reader.getFloat(ambient[0], 'a', true);

	var background = illumination.getElementsByTagName('background');
	if (background == null)
		throw "The 'background' element is missing.";

	if (background.length != 1)
		throw "There must be exactly one 'background' element inside the 'illumination' element.";

	this.background = [];
	this.background['r'] = this.reader.getFloat(background[0], 'r', true);
	this.background['g'] = this.reader.getFloat(background[0], 'g', true);
	this.background['b'] = this.reader.getFloat(background[0], 'b', true);
	this.background['a'] = this.reader.getFloat(background[0], 'a', true);
};

/**
 * Reads and stores the information from the 'lights' element
 * @param  {documentElement} rootElement
 * @return {void}
 */
MySceneGraph.prototype.parseLights = function(rootElement) {
	var elems = rootElement.getElementsByTagName('lights');
	if (elems == null)
		throw "The 'lights' element is missing.";

	if (elems.length != 1)
		throw "Zero or more than one 'lights' element found.";

	var omnis = elems[0].getElementsByTagName('omni');
	var spots = elems[0].getElementsByTagName('spot');
	if (omnis.length == 0 && spots.length == 0)
		throw "Both 'omni' and 'spot' elements are missing. There must be at least one 'omni' or 'spot' element.";

	this.omnis = [];
	for (var i = 0; i < omnis.length; i++) {
		var omni = new Omni(this.reader.getString(omnis[i], 'id', true),
							this.reader.getBoolean(omnis[i], 'enabled', true));

		var location = omnis[i].getElementsByTagName('location');
		var ambient = omnis[i].getElementsByTagName('ambient');
		var diffuse = omnis[i].getElementsByTagName('diffuse');
		var specular = omnis[i].getElementsByTagName('specular');

		if (location.length != 1 || ambient.length != 1 || diffuse.length != 1 || specular.length != 1)
			throw "There must be exactly one 'location', one 'ambient', one 'diffuse' and one 'specular' elements inside a 'omni' element.";

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
							this.reader.getFloat(spots[i], 'angle', true) * this.scene.degToRad,
							this.reader.getFloat(spots[i], 'exponent', true));

		var target = spots[i].getElementsByTagName('target');
		var location = spots[i].getElementsByTagName('location');
		var ambient = spots[i].getElementsByTagName('ambient');
		var diffuse = spots[i].getElementsByTagName('diffuse');
		var specular = spots[i].getElementsByTagName('specular');

		if (target.length != 1 || location.length != 1 || ambient.length != 1 || diffuse.length != 1 || specular.length != 1)
			throw "There must be exactly one 'target', one 'location', one 'ambient', one 'diffuse' and one 'specular' elements inside a 'spot' element.";

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

	this.checkRepeatedLights();
};

/**
 * Reads and stores the information from the 'textures' element
 * @param  {documentElement} rootElement
 * @return {void}
 */
MySceneGraph.prototype.parseTextures = function(rootElement) {
	var elems = rootElement.getElementsByTagName('textures');
	if (elems == null)
		throw "The 'textures' element is missing.";

	if (elems.length != 1)
		throw "Zero or more than one 'textures' element found.";

	var textures = elems[0].getElementsByTagName('texture');
	if (textures.length == 0)
		throw "There must be at least one 'texture' element.";

	this.textures = [];
	for (var i = 0; i < textures.length; i++) {
		var texture = new Texture(this.reader.getString(textures[i], 'id', true),
								  this.reader.getString(textures[i], 'file', true),
								  this.reader.getFloat(textures[i], 'length_s', true),
								  this.reader.getFloat(textures[i], 'length_t', true));
		texture.texFile = new CGFtexture(this.scene, texture.file);

		this.checkRepeated(this.reader.getString(textures[i], 'id', true), this.textures, 'textures');
		this.textures[this.reader.getString(textures[i], 'id', true)] = texture;
	}
};

/**
 * Reads and stores the information from the 'materials' element
 * @param  {documentElement} rootElement
 * @return {void}
 */
MySceneGraph.prototype.parseMaterials = function(rootElement) {
	var elems = rootElement.getElementsByTagName('materials');
	if (elems == null)
		throw "The 'materials' element is missing.";

	var materials = elems[0].getElementsByTagName('material');
	if (materials == null)
		throw "The 'material' element is missing.";

	if (materials.length < 1)
		throw "There must be at least one 'material' element.";

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

		if (emissionTag.length != 1 || ambientTag.length != 1 || diffuseTag.length != 1 || specularTag.length != 1 || shininessTag.length != 1)
			throw "There must be exactly one 'emission', one 'ambient', one 'diffuse', one 'specular' and one 'shininess' elements inside each 'material' element.";

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

		this.checkRepeated(id, this.materials, 'materials');
		this.materials[id] = material;
	}
};

/**
 * Reads and stores the information from the 'transformations' element
 * @param  {documentElement} rootElement
 * @return {void}
 */
MySceneGraph.prototype.parseTransformations = function(rootElement) {
	var elems = rootElement.getElementsByTagName('transformations');
	if (elems == null)
		throw "The 'transformations' element is missing.";

	if (elems.length != 1)
		throw "Zero or more than one 'transformations' element found.";

	var transformations = elems[0].getElementsByTagName('transformation');
	if (transformations == null)
		throw "The 'transformation' element is missing.";

	if (transformations.length < 1)
		throw "There must be at least one 'transformation' element.";

	this.transformations = [];
	for (var i = 0; i < transformations.length; i++) {
		var transformation = [];
		var id = this.reader.getString(transformations[i], 'id', true);

		for (var j = 0; j < transformations[i].children.length; j++) {
			var temp;

			switch (transformations[i].children[j].tagName) {
				case 'rotate':
					var axis, angle;
					temp = new Array(3);

					axis = this.reader.getItem(transformations[i].children[j], 'axis', [ 'x', 'y', 'z' ], true);
					angle = this.reader.getFloat(transformations[i].children[j], 'angle', true);

					temp['axis'] = axis;
					temp['angle'] = angle;
					temp['type'] = 'rotate';
					break;
				case 'translate':
					var x, y, z;
					temp = new Array(4);

					x = this.reader.getFloat(transformations[i].children[j], 'x', true);
					y = this.reader.getFloat(transformations[i].children[j], 'y', true);
					z = this.reader.getFloat(transformations[i].children[j], 'z', true);

					temp['x'] = x;
					temp['y'] = y;
					temp['z'] = z;
					temp['type'] = 'translate';
					break;
				case 'scale':
					var x, y, z;
					temp = new Array(4);

					x = this.reader.getFloat(transformations[i].children[j], 'x', true);
					y = this.reader.getFloat(transformations[i].children[j], 'y', true);
					z = this.reader.getFloat(transformations[i].children[j], 'z', true);

					temp['x'] = x;
					temp['y'] = y;
					temp['z'] = z;
					temp['type'] = 'scale';
					break;
				default:
					throw "Invalid transformation element.";
			}

			transformation.push(temp);
		}

		this.checkRepeated(id, this.transformations, 'transformations');
		this.transformations[id] = transformation;
	}
};

/**
 * Reads and stores the information from the 'animations' element
 * @param  {documentElement} rootElement
 * @return {void}
 */
MySceneGraph.prototype.parseAnimations = function(rootElement) {
	var elems = rootElement.getElementsByTagName('animations');
	if (elems == null)
		throw "The 'animations' element is missing.";

	if (elems.length != 1)
		throw "Zero or more than one 'animations' element found.";

	this.animations = [];
	var animations = elems[0].getElementsByTagName('animation');
	for (var i = 0; i < animations.length; i++) {
		var animation;
		var id, span, type;

		id = this.reader.getString(animations[i], 'id', true);
		span = this.reader.getFloat(animations[i], 'span', true);
		type = this.reader.getString(animations[i], 'type', true);

		switch (type) {
			case 'linear':
				var temp = [];
				var controlPoints = animations[i].getElementsByTagName('controlpoint');

				for (var j = 0; j < controlPoints.length; j++) {
					var point = new Point3(this.reader.getFloat(controlPoints[j], 'x', true),
										   this.reader.getFloat(controlPoints[j], 'y', true),
										   this.reader.getFloat(controlPoints[j], 'z', true));
					temp.push(point);
				}

				animation = new LinearAnimation(id, span, type, temp);
				break;
			case 'circular':
				var center, radius, startang, rotang;

				center = this.reader.getVector3(animations[i], 'center', true);
				var point = new Point3(center[0], center[1], center[2]);

				radius = this.reader.getFloat(animations[i], 'radius', true);
				startang = this.reader.getFloat(animations[i], 'startang', true);
				rotang = this.reader.getFloat(animations[i], 'rotang', true);

				animation = new CircularAnimation(id, span, type, point, radius, startang, rotang);
				break;
			default:
				throw "Invalid value in 'type' attribute in one of the 'animation' elements.";
		}

		this.animations[id] = animation;
	}
};

/**
 * Reads and stores the information from the 'primitives' element
 * @param  {documentElement} rootElement
 * @return {void}
 */
MySceneGraph.prototype.parsePrimitives = function(rootElement) {
	var elems = rootElement.getElementsByTagName('primitives');
	if (elems == null)
		throw "The 'primitives' element is missing.";

	if (elems.length != 1)
		throw "Zero or more than one 'primitives' element found.";

	var primitives = elems[0].getElementsByTagName('primitive');
	if (primitives == null)
		throw "The 'primitive' element is missing.";

	if (primitives.length < 1)
		throw "There must be at least one 'primitive' element.";

	this.primitives = [];
	for (var i = 0; i < primitives.length; i++) {
		var primitive;
		var id = this.reader.getString(primitives[i], 'id', true);

		if (primitives[i].children.length != 1)
			throw "There can be only one 'rectangle', one 'triangle', one 'cylinder', one 'sphere' or one 'torus' element inside each 'primitive' element.";

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
				throw "There can be only one 'rectangle', one 'triangle', one 'cylinder', one 'sphere' or one 'torus' element inside each 'primitive' element.";
		}

		this.checkRepeated(id, this.primitives, 'primitives');
		this.primitives[id] = primitive;
	}
};

/**
 * Reads and stores the information from the 'components' element
 * @param  {documentElement} rootElement
 * @return {void}
 */
MySceneGraph.prototype.parseComponents = function(rootElement) {
	var elems = rootElement.getElementsByTagName('components');
	if (elems == null)
		throw "The 'components' element is missing.";

	if (elems.length != 1)
		throw "Zero or more than one 'components' element found.";

	var components = elems[0].getElementsByTagName('component');
	if (components == null)
		throw "The 'component' element is missing.";

	if (components.length < 1)
		throw "There must be at least one 'component' element.";

	this.components = [];
	for (var i = 0; i < components.length; i++) {
		var id = this.reader.getString(components[i], 'id', true);
		var texture = components[i].getElementsByTagName('texture');

		if (texture.length != 1)
			throw "There can only be one 'texture' element inside each 'component' element.";

		var textureID = this.reader.getString(texture[0], 'id', true);
		var component = new Component(id, textureID);

		var transformation = components[i].getElementsByTagName('transformation');
		var materials = components[i].getElementsByTagName('materials');
		var children = components[i].getElementsByTagName('children');

		if (transformation.length != 1)
			throw "There can only be one 'transformation' element inside each 'component' element.";
		else if (materials.length != 1)
			throw "There can only be one 'materials' element inside each 'component' element.";
		else if (children.length != 1)
			throw "There can only be one 'children' element inside each 'component' element.";

		for (var j = 0; j < materials[0].children.length; j++)
			component.materials.push(this.reader.getString(materials[0].children[j], 'id', true));

		for (var j = 0; j < children[0].children.length; j++) {
			if (children[0].children[j].tagName == 'primitiveref')
				component.primitives.push(this.reader.getString(children[0].children[j], 'id', true));
			else if (children[0].children[j].tagName == 'componentref')
				component.children.push(this.reader.getString(children[0].children[j], 'id', true));
		}

		var matrix = [], tag = false, trans = false;
		for (var j = 0; j < transformation[0].children.length; j++) {
			var temp;

			switch (transformation[0].children[j].tagName) {
				case 'transformationref':
					if (trans == false) {
						tag = true;
						matrix = this.transformations[this.reader.getString(transformation[0].children[j], 'id', true)];
					} else {
						throw "There must be a 'transformationref' element or explicit transformations, NOT both.";
					}
					break;
				case 'rotate':
					if (tag == false) {
						trans = true;
						var axis, angle;
						temp = new Array(3);

						axis = this.reader.getItem(transformation[0].children[j], 'axis', [ 'x', 'y', 'z' ], true);
						angle = this.reader.getFloat(transformation[0].children[j], 'angle', true);

						temp['axis'] = axis;
						temp['angle'] = angle;
						temp['type'] = 'rotate';
						matrix.push(temp);
					} else {
						throw "There must be a 'transformationref' element or explicit transformations, NOT both.";
					}
					break;
				case 'translate':
					if (tag == false) {
						trans = true;
						var x, y, z;
						temp = new Array(4);

						x = this.reader.getFloat(transformation[0].children[j], 'x', true);
						y = this.reader.getFloat(transformation[0].children[j], 'y', true);
						z = this.reader.getFloat(transformation[0].children[j], 'z', true);

						temp['x'] = x;
						temp['y'] = y;
						temp['z'] = z;
						temp['type'] = 'translate';
						matrix.push(temp);
					} else {
						throw "There must be a 'transformationref' element or explicit transformations, NOT both.";
					}
					break;
				case 'scale':
					if (tag == false) {
						trans = true;
						var x, y, z;
						temp = new Array(4);

						x = this.reader.getFloat(transformation[0].children[j], 'x', true);
						y = this.reader.getFloat(transformation[0].children[j], 'y', true);
						z = this.reader.getFloat(transformation[0].children[j], 'z', true);

						temp['x'] = x;
						temp['y'] = y;
						temp['z'] = z;
						temp['type'] = 'scale';
						matrix.push(temp);
					} else {
						throw "There must be a 'transformationref' element or explicit transformations, NOT both.";
					}
					break;
				default:
					throw "Invalid transformation element.";
			}
		}

		if (transformation[0].children.length > 0)
			component.transformation = matrix;

		this.checkRepeated(id, this.components, 'components');
		this.components[id] = component;
	}
};

/**
 * Checks if the element repeats itself in the given array
 * @param  {string} element
 * @param  {Array} array
 * @param  {string} arrayName
 * @return {void}
 */
MySceneGraph.prototype.checkRepeated = function(element, array, arrayName) {
	for (var id in array) {
		if (element == id)
			throw "The id '" + element + "' repeats itself in the " + arrayName + " list.";
	}
};

/**
 * Checks if there are any lights with repeated ids
 * @return {void}
 */
MySceneGraph.prototype.checkRepeatedLights = function() {
	for (var i = 0; i < this.omnis.length; i++) {
		for (var j = 0; j < this.omnis.length; j++) {
			if (i != j) {
				if (this.omnis[i].id == this.omnis[j].id)
					throw "There can not be lights with repeated id's.";
			}
		}
	}

	for (var i = 0; i < this.spots.length; i++) {
		for (var j = 0; j < this.spots.length; j++) {
			if (i != j) {
				if (this.spots[i].id == this.spots[j].id)
					throw "There can not be lights with repeated id's.";
			}
		}
	}

	for (var i = 0; i < this.omnis.length; i++) {
		for (var j = 0; j < this.spots.length; j++) {
			if (this.omnis[i].id == this.spots[j].id)
				throw "There can not be lights with repeated id's.";
		}
	}
};

/**
 * Prints the graph's information
 * @return {void}
 */
MySceneGraph.prototype.printGraphInfo = function() {
	// Print scene info
	console.log("SCENE: { root = " + this.root + ", axis_length = " + this.axisLength + " }");

	// Print views info
	console.log("VIEWS: { default = " + this.defaultView + " }");
	console.log(this.perspectives);

	// Print illumination info
	console.log("ILLUMINATION: { doublesided = " + this.doublesided + ", local = " + this.local + " }");
	console.log(this.ambient);
	console.log(this.background);

	// Print lights info
	console.log("LIGHTS");
	console.log(this.omnis);
	console.log(this.spots);

	// Print textures info
	console.log('TEXTURES');
	console.log(this.textures);

	// Print materials info
	console.log('MATERIALS');
	console.log(this.materials);

	// Print transformations info
	console.log('TRANSFORMATIONS');
	console.log(this.transformations);

	// Print animations info
	console.log('ANIMATIONS');
	console.log(this.animations);

	// Print primitives info
	console.log('PRIMITIVES');
	console.log(this.primitives);

	// Print primitives info
	console.log('COMPONENTS');
	console.log(this.components);
};

/*
 * Callback to be executed on any read error
 */
MySceneGraph.prototype.onXMLError = function(message) {
 	console.error("XML Loading Error: " + message);	
 	this.loadedOk = false;
};