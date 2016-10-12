function Torus(scene, inner, outter, slices, loops) {
    CGFobject.call(this, scene);

    this.inner = inner;
    this.outter = outter;
    this.slices = slices;
    this.loops = loops;

    this.initBuffers();
};

Torus.prototype = Object.create(CGFobject.prototype);
Torus.prototype.constructor = Torus;

Torus.prototype.initBuffers = function() {
    this.normals = [];
    this.indices = [];
    this.vertices = [];
    this.texCoords = [];

    var ang_0 = (2 * Math.PI) / this.slices;
    var ang_1 = (2 * Math.PI) / this.loops;
    var x1, y1, z1, x, y, z, u, v;

    for (var j = 0; j <= this.loops; j++) {
        for (var i = 0; i <= this.slices; i++) {
            x1 = (this.outter + this.inner * Math.cos(ang_0 * i)) * Math.cos(ang_1 * j);
            y1 = (this.outter + this.inner * Math.cos(ang_0 * i)) * Math.sin(ang_1 * j);
            z1 = this.inner * Math.sin(ang_0 * i);
            u = 1 - (i / this.slices);
            v = 1 - (j / this.loops);

            this.vertices.push(x1, y1, z1);
            this.normals.push(x1, y1, z1);
            this.texCoords.push(u, v);
        }
    }

    for (j = 0; j < this.loops; j++) {
        for (i = 0; i < this.slices ; i++) {
            x = (this.loops + 1) * j + i;
            y = (1 + this.loops) * (j + 1) + i;
            z = (j * (this.loops + 1)) + 1 + i;
            this.indices.push(x, y, z);
            this.indices.push(z, y, y + 1);
        }
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};