function Chessboard(scene, du, dv, su, sv, texture, c1, c2, cs) {
	CGFobject.call(this, scene);

	this.du = du;
	this.dv = dv;
	this.su = su;
	this.sv = sv;
	this.c1 = c1;
	this.c2 = c2;
	this.cs = cs;
	this.scene = scene;
	this.texture = texture;

	this.board = new NewPlane(scene, 1, 1, du * 4, dv * 4);
	this.shader = new CGFshader(scene.gl, "shaders/chessboard.vert", "shaders/chessboard.frag");

	this.shader.setUniformsValues({du: du});
	this.shader.setUniformsValues({dv: dv});
	this.shader.setUniformsValues({su: su});
	this.shader.setUniformsValues({sv: sv});
	this.shader.setUniformsValues({c1: vec4.fromValues(c1[0], c1[1], c1[2], c1[3])});
	this.shader.setUniformsValues({c2: vec4.fromValues(c2[0], c2[1], c2[2], c2[3])});
	this.shader.setUniformsValues({cs: vec4.fromValues(cs[0], cs[1], cs[2], cs[3])});

	this.appearance = new CGFappearance(scene);
	this.appearance.loadTexture(texture);
}

Chessboard.prototype = Object.create(CGFobject.prototype);
Chessboard.prototype.constructor = Chessboard;

Chessboard.prototype.display = function() {
	this.appearance.apply();
	this.scene.setActiveShader(this.shader);
	this.board.display();
	this.scene.setActiveShader(this.scene.defaultShader);
};