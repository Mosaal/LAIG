function Point3(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
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
	this.texFile = null;
}

function Component(id, textureId) {
	this.id = id;
	this.matIndex = 0;
	this.children = [];
	this.materials = [];
	this.primitives = [];
	this.textureId = textureId;
	this.transformation = null;
}

function Child(id, type) {
	this.id = id;
	this.type = type;
}