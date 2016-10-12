function Cylinder(scene, base, top, height, slices, stacks) {
	CGFobject.call(this, scene);

	this.base = base;
	this.top = top;
	this.height = height;
	this.slices = slices;
	this.stacks = stacks;

	this.topCover = new Circle(scene, this.top, this.slices);
	this.baseCover = new Circle(scene, this.base, this.slices);

	this.initBuffers();
}

Cylinder.prototype = Object.create(CGFobject.prototype);
Cylinder.prototype.constructor = Cylinder;

Cylinder.prototype.initBuffers = function() {
	var deg2rad = Math.PI / 180.0;
	var ang = 360 / this.slices;
	var a_rad = ang * deg2rad;
	var aux = a_rad / 2;
	var razao = (this.top - this.base) / this.stacks;
	var z_norm = (this.top - this.base) / Math.sqrt((this.top - this.base) * (this.top - this.base) + this.height * this.height);

	this.normals = [];
	this.indices = [];
	this.vertices = [];
	this.texCoords = [];

	for(var j = 0; j < this.stacks + 1; j++) {
		for(var i = 0; i < this.slices + 1; i++) { 
			this.vertices.push(Math.cos(a_rad * i) * this.base + Math.cos(a_rad * i) * (razao * j),
							   Math.sin(a_rad * i) * this.base + Math.sin(a_rad * i) * (razao * j),
							   (j / this.stacks) * this.height);
			this.normals.push(Math.cos(a_rad * i),
							  Math.sin(a_rad * i),
							  -z_norm);
			this.texCoords.push((-ang * i) / 360, j / this.stacks);
		}
	}

	for(var j = 0; j < this.stacks; j++) {
		for(var i = 0; i < this.slices; i++) {
			this.indices.push(i + j * (this.slices + 1),
							  i + j * (this.slices + 1) + 1,
							  i + (j + 1) * (this.slices + 1) + 1);
			this.indices.push(i + j * (this.slices + 1),
							  i + (j + 1) * (this.slices + 1) + 1,
							  i + (j + 1) * (this.slices + 1));
		}
	}

	this.scene.pushMatrix();
		this.scene.translate(0, 0, this.height);
		this.topCover.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.rotate(Math.PI * this.slices, 0, 0, 1);
		this.scene.rotate(Math.PI, 0, 1, 0);
		this.baseCover.display();
	this.scene.popMatrix();

	this.primitiveType = this.scene.gl.TRIANGLES;
	this.initGLBuffers();
}