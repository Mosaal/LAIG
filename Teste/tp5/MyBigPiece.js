/**
 * MyCylinder
 * @constructor
 */
 function MyBigPiece(scene, stacks) {
    CGFobject.call(this,scene);
   
    this.slices = 1;
    this.stacks = stacks;
 
    this.initBuffers();
 };
 
 MyBigPiece.prototype = Object.create(CGFobject.prototype);
 MyBigPiece.prototype.constructor = MyBigPiece;
 
 MyBigPiece.prototype.initBuffers = function() {
    /*
    * TODO:
    * Replace the following lines in order to build a prism with a **single mesh**.
    *
    * How can the vertices, indices and normals arrays be defined to
    * build a prism with varying number of slices and stacks?
    */
 
var degToRad = Math.PI / 180.0;
    var angulo = 0;
    var sizeOfPrism = 1;
    var stacksDim = sizeOfPrism/this.stacks;
    this.vertices = [];
    this.normals = [];
    this.indices = [];
 
   var ytext = 0;
   var xtext = 0;
//stacks e slices
var total = this.slices;
var aux = sizeOfPrism;
for (var i = 0; i<=this.stacks;i++)
{ 
         this.vertices.push(Math.cos(angulo), Math.sin(angulo), 0);
         this.normals.push(0, -1, 0); 
         this.vertices.push(Math.cos(angulo), Math.sin(angulo), 1);
         this.normals.push(0, 1, 0);
         this.vertices.push(Math.cos(angulo)+1, Math.sin(angulo)+1, 0);
        this.normals.push(0, -1, 0);
        this.vertices.push(Math.cos(angulo+1), Math.sin(angulo)+1, 1);
        this.normals.push(0, 1, 0);

        angulo+=degToRad*(360/this.slices);
        i++;
    }

angulo=0;
var k=0;

for (var k = 1; k<=this.slices-1;k++){
        
        this.indices.push(k+1);
        this.indices.push(k+3);
        this.indices.push(k+7);

        this.indices.push(k);
        this.indices.push(k+2);
        this.indices.push(k+7);

        this.indices.push(k+0);
        this.indices.push(k+1);
        this.indices.push(k+5);

        this.indices.push(k);
        this.indices.push(k+4);
        this.indices.push(k+5);

        this.indices.push(k);
        this.indices.push(k+4);
        this.indices.push(k+6);

        this.indices.push(k+6);
        this.indices.push(k+2);
        this.indices.push(k);

        this.indices.push(k+6);
        this.indices.push(k+7);
        this.indices.push(k+3);

        this.indices.push(k+3);
        this.indices.push(k+2);
        this.indices.push(k+6);


        angulo+=degtoRad * (360/this.slices);
        i++;
        k+=8;


}


  /* 
for (var i = 0; i<=this.stacks;i++)
{
        angulo = 0;
        xtext = 0;
        for (var k = 1; k<=this.slices;k++){
            var toNormal = angulo;

            this.vertices.push(Math.cos(angulo), Math.sin(angulo), aux);
            this.normals.push(Math.cos(angulo), Math.sin(angulo), 0); 
            //this.texCoords.push(xtext,ytext);

            angulo += degToRad * (360/this.slices);
            xtext += this.patchLengthXText;

    //total é o numero de vertices
            total += 1;
        }
        aux -= stacksDim;
        ytext += this.patchLengthYText;
    }
 
 var last = 0;
 var next = last + this.slices;
for (var i = 1; i<=this.stacks;i++){
        for (var k = 1; k<=this.slices;k++){
               
            if(k != this.slices){  
            this.indices.push(last);
            this.indices.push(next);
            this.indices.push(next+1);
        
            this.indices.push(last);
            this.indices.push(next + 1);
            this.indices.push(last +1);}
            
            else {
                 this.indices.push(last);
            this.indices.push(next);
            this.indices.push(next+1 - this.slices);
        
            this.indices.push(next + 1 - this.slices);
            this.indices.push(last - this.slices +1);
            this.indices.push(last);
            }
            last++;
            next++;
        }
        aux -= stacksDim;
    }
*/
    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
 };