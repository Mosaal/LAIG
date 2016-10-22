function Torus(scene, inner, outer, slices, loops) {
    CGFobject.call(this, scene);

    this.inner = inner;
    this.outer = outer;
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

    var angSlice = 0;
    var angSliceIncrement = (2*Math.PI)/this.slices;
    var angLoop = 0;
    var angLoopIncrement = (2*Math.PI)/this.loops;
    var radius = (this.outer - this.inner) / 2;
    var t = 0;
    var tIncrement = 1/(this.slices);
    var s = 1;
    var sIncrement = -1/(this.loops);
    
    for (var i = 0; i <= this.loops; i++) {
        for (var j = 0; j <= this.slices; j++) {   
            var distToCenter = this.inner + radius * (1 + Math.cos(angLoop));   
            var height = radius * Math.sin(angLoop);
            var vertex = vec3.fromValues(Math.cos(angSlice) * distToCenter, Math.sin(angSlice) * distToCenter, height); 
            this.vertices.push(vertex[0], vertex[1], vertex[2]);

            var centerDist = this.inner + radius;
            var center = vec3.fromValues(Math.cos(angSlice) * centerDist, Math.sin(angSlice) * centerDist, 0);
            var normal = vec3.create();
            vec3.subtract(normal, vertex, center);
            this.normals.push(normal[0], normal[1], normal[2]);
            
            if (i > 0 && j > 0) {
                let A = (this.slices+1)*(i)+(j);
                let B = (this.slices+1)*(i-1)+(j-1);
                let C = (this.slices+1)*(i)+(j-1);
                let D = (this.slices+1)*(i-1)+(j);

                this.indices.push(A, C, B);
                this.indices.push(A, B, D);
            }

            this.texCoords.push(t, s);

            t += tIncrement;
            angSlice += angSliceIncrement;
        }

        t = 0;
        angSlice = 0;
        
        s += sIncrement;
        angLoop += angLoopIncrement;
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};

Torus.prototype.getName = function() {
    return 'Torus';
};