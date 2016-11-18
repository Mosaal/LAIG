function Chessboard(scene, du, dv, su, sv, colors, texture) {
	CGFobject.call(this, scene);

	var c1 = colors[0];
	var c2 = colors[1];
	var cs = colors[2];

	this.board = new Plane(scene, 1, 1, du * 4, dv * 4);
	this.shader = new CGFshader(scene.gl, "shaders/chessboard.vert", "shaders/chessboard.frag");

	this.shader.setUniformsValues({du: du});
	this.shader.setUniformsValues({dv: dv});
	this.shader.setUniformsValues({su: su});
	this.shader.setUniformsValues({sv: sv});
	this.shader.setUniformsValues({c1: vec4.fromValues(c1['r'], c1['g'], c1['b'], c1['a'])});
	this.shader.setUniformsValues({c2: vec4.fromValues(c2['r'], c2['g'], c2['b'], c2['a'])});
	this.shader.setUniformsValues({cs: vec4.fromValues(cs['r'], cs['g'], cs['b'], cs['a'])});

	this.appearance = new CGFappearance(scene);
	this.appearance.setTexture(texture.texFile);
}

Chessboard.prototype = Object.create(CGFobject.prototype);
Chessboard.prototype.constructor = Chessboard;

Chessboard.prototype.display = function() {
	this.appearance.apply();
	this.scene.setActiveShader(this.shader);
	this.board.display();
	this.scene.setActiveShader(this.scene.defaultShader);
};

Chessboard.prototype.getName = function() {
	return 'Chessboard';
};