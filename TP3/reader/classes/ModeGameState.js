function ModeGameState(gsm, scene) {
	GameState.call(this, gsm, scene);
	this.degToRad = Math.PI / 180.0;

	this.backBoard = new Plane(this.scene, 5, 3, 50, 50);
	this.planes = [ new Plane(this.scene, 2, 1, 50, 50), new Plane(this.scene, 2, 1, 50, 50) ];

	this.boardTexture = new CGFappearance(this.scene);
	this.boardTexture.loadTexture("images/backBoard.png");

	/*this.planeTexture0 = new CGFappearance(this);
	this.planeTexture0.loadTexture("../images/lul.png");

	this.planeTexture1 = new CGFappearance(this);
	this.planeTexture1.loadTexture("../images/lel.png");*/
}

ModeGameState.prototype.update = function(deltaTime) {

};

ModeGameState.prototype.display = function() {
	this.scene.pushMatrix();
		this.scene.translate(0.0, 4.0, 4.0);
		this.scene.rotate(-45 * this.degToRad, 1, 0, 0);
		this.scene.rotate(-180 * this.degToRad, 0, 0, 1);
		this.boardTexture.apply();
		this.backBoard.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.planes[0].display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.planes[1].display();
	this.scene.popMatrix();
};

ModeGameState.prototype.handleInput = function() {
	
};