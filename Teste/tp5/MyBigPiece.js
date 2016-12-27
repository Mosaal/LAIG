/**
 * MyCylinder
 * @constructor
 */
 function MyBigPiece(scene, slices) {
    CGFobject.call(this,scene);
   
    this.stacks = 1;
    this.slices = slices;
 
    this.initBuffers();
 };
 
 MyBigPiece.prototype = Object.create(CGFobject.prototype);
 MyBigPiece.prototype.constructor = MyBigPiece;
 
 MyBigPiece.prototype.initBuffers = function() {

 
var degToRad = Math.PI / 180.0;
    var angulo = 0;
    this.vertices = [];
    this.normals = [];
    this.indices = [];
 
for (var i = 0; i<=this.slices;i++)
{ 
         this.vertices.push(Math.cos(angulo), Math.sin(angulo), 0);
         this.normals.push(0, -1, 0); 
         this.vertices.push(Math.cos(angulo), Math.sin(angulo), 1);
         this.normals.push(0, 1, 0);
         this.vertices.push(Math.cos(angulo)+Math.cos(angulo), Math.sin(angulo)+Math.sin(angulo), 0);
        this.normals.push(0, -1, 0);
        this.vertices.push(Math.cos(angulo)+Math.cos(angulo), Math.sin(angulo)+Math.sin(angulo), 1);
        this.normals.push(0, 1, 0);

        angulo+=degToRad*(360/this.slices);
    }

var k=0;
for (var i = 0; i<this.slices;i++){
        
        this.indices.push(k+1);
        this.indices.push(k+3);
        this.indices.push(k+7);

        this.indices.push(k+7);
        this.indices.push(k+5);
        this.indices.push(k+1);



        this.indices.push(k+7);
        this.indices.push(k+3);
        this.indices.push(k+2);

        this.indices.push(k+2);
        this.indices.push(k+6);
        this.indices.push(k+7);





        this.indices.push(k+6);
        this.indices.push(k+2);
        this.indices.push(k);

        this.indices.push(k);
        this.indices.push(k+4);
        this.indices.push(k+6);



        this.indices.push(k+0);
        this.indices.push(k+1);
        this.indices.push(k+5);

        this.indices.push(k+5);
        this.indices.push(k+4);
        this.indices.push(k);
        k+=4;

};


    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
 };