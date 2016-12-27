function BoardGameState(gsm, scene) {
	GameState.call(this, gsm, scene);
	this.degToRad = Math.PI / 180.0;

	this.BOARD1 = 1;
	this.BOARD2 = 2;
	this.BOARD3 = 3;

	this.backBoard = new Plane(this.scene, 5, 3, 50, 50);
	this.planeBoard1 = new Plane(this.scene, 1, 1.2, 50, 50);
	this.planeBoard2 = new Plane(this.scene, 1, 1.2, 50, 50);
	this.planeBoard3 = new Plane(this.scene, 1.5, 1.0, 50, 50);

	this.boardTexture = new CGFappearance(this.scene);
	this.boardTexture.loadTexture("images/boardMode.png");

	this.textureBoard1 = new CGFappearance(this.scene);
	this.textureBoard1.loadTexture("images/board1.png");

	this.textureBoard2 = new CGFappearance(this.scene);
	this.textureBoard2.loadTexture("images/board2.png");

	this.textureBoard3 = new CGFappearance(this.scene);
	this.textureBoard3.loadTexture("images/board3.png");
}

BoardGameState.prototype = Object.create(GameState.prototype);
BoardGameState.prototype.constructor = BoardGameState;

BoardGameState.prototype.update = function(deltaTime) {};

BoardGameState.prototype.display = function() {};

BoardGameState.prototype.displayHUD = function() {
	this.scene.pushMatrix();
		this.scene.translate(0.0, 0.0, -4.0);
		this.scene.rotate(-180 * this.degToRad, 0, 0, 1);
		this.boardTexture.apply();
		this.backBoard.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(-1.4, 0.0, -3.95);
		this.scene.rotate(-180 * this.degToRad, 0, 0, 1);
		this.textureBoard1.apply();
		this.scene.registerForPick(this.BOARD1, this.planeBoard1);
		this.planeBoard1.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(-0.22, 0.0, -3.95);
		this.scene.rotate(-180 * this.degToRad, 0, 0, 1);
		this.textureBoard2.apply();
		this.scene.registerForPick(this.BOARD2, this.planeBoard2);
		this.planeBoard2.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(1.2, 0.0, -3.95);
		this.scene.rotate(-180 * this.degToRad, 0, 0, 1);
		this.textureBoard3.apply();
		this.scene.registerForPick(this.BOARD3, this.planeBoard3);
		this.planeBoard3.display();
	this.scene.popMatrix();
};

BoardGameState.prototype.handleInput = function(pickResults) {
	switch (pickResults[0][1]) {
		case this.BOARD1:
			this.gsm.gameSettings.board = this.BOARD1;
			this.gsm.setState(this.gsm.PLAY);
			break;
		case this.BOARD2:
			this.gsm.gameSettings.board = this.BOARD2;
			this.gsm.setState(this.gsm.PLAY);
			break;
		case this.BOARD3:
			this.gsm.gameSettings.board = this.BOARD3;
			this.gsm.setState(this.gsm.PLAY);
			break;
		default:
			console.error("The selection of this Object is ignored!");
	}
};