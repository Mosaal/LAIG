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
	this.normals = [];
	this.indices = [];
	this.vertices = [];
	this.texCoords = [];

	var deg2Rad = Math.PI/180.0;
	var h = this.top - this.base;
 	var deltaAlpha = 360.0/this.slices
 	var deltaZ = this.height/this.stacks;
 	var deltaR = h/this.stacks;

	var z = 0;
	var r = this.base;
	for (var k = 0; k <= this.stacks; k++) {
		var alpha = 0;
		for (var i = 0; i <= this.slices; i++) {
			var alphaRad = alpha*deg2Rad;

			this.vertices.push(r*Math.cos(alphaRad),r*Math.sin(alphaRad),z);

			if (i > 0 && k > 0) {
				this.indices.push((this.slices+1)*(k)+(i),(this.slices+1)*(k)+(i-1),(this.slices+1)*(k-1)+(i-1));
				this.indices.push((this.slices+1)*(k)+(i),(this.slices+1)*(k-1)+(i-1),(this.slices+1)*(k-1)+(i));
			}

			this.normals.push(h*Math.cos(alphaRad),h*Math.sin(alphaRad),-1*h); //simplified version
			this.texCoords.push(i/(this.slices), 1 -k/this.stacks);

			alpha += deltaAlpha;
		}
		
		z += deltaZ;
		r += deltaR;
	}

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};

Cylinder.prototype.display = function() {
	CGFobject.prototype.display.call(this);

	this.scene.pushMatrix();
	this.scene.translate(0, 0, this.height);
	this.topCover.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.rotate(Math.PI * this.slices, 0, 0, 1);
	this.scene.rotate(Math.PI, 0, 1, 0);
	this.baseCover.display();
	this.scene.popMatrix();
};