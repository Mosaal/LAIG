function Perspective(id, near, far, angle, from, to) {
	this.id = id;
	this.near = near;
	this.far = far;
	this.angle = angle;
	this.from = new Array(3);
	this.to = new Array(3);
}

function Omni(id, enabled) {
	this.id = id;
	this.enabled = enabled;
	this.location = new Array(4);
	this.ambient = new Array(4);
	this.diffuse = new Array(4);
	this.specular = new Array(4);
}

function Spot(id, enabled, angle, exponent) {
	this.id = id;
	this.enabled = enabled;
	this.angle = angle;
	this.exponent = exponent;
	this.target = new Array(3);
	this.location = new Array(3);
	this.ambient = new Array(4);
	this.diffuse = new Array(4);
	this.specular = new Array(4);
}

function Texture(id, file, length_s, length_t) {
	this.id = id;
	this.file = file;
	this.length_s = length_s;
	this.length_t = length_t;
}

function Material(id, shininess) {
	this.id = id;
	this.emission = new Array(4);
	this.ambient = new Array(4);
	this.diffuse = new Array(4);
	this.specular = new Array(4);
	this.shininess = shininess;
}

function Transformation(id) {
	this.id = id;
	this.transformations = [];
}

function Primitive(id) {
	this.id = id;
	this.type = '';
	this.data = [];
}

function Component(id, textureId) {
	this.id = id;
	this.transformations = [];
	this.materials = [];
	this.children = [];
	this.textureId = textureId;
}