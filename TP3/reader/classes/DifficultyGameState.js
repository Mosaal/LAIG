function DifficultyGameState(gsm, scene) {
	GameState.call(this, gsm, scene);
	this.degToRad = Math.PI / 180.0;

	this.EASY = 1;
	this.HARD = 2;

	this.backBoard = new Plane(this.scene, 5, 3, 50, 50);
	this.planeEasy = new Plane(this.scene, 2.0, 0.5, 50, 50);
	this.planeHard = new Plane(this.scene, 2.0, 0.5, 50, 50);

	this.boardTexture = new CGFappearance(this.scene);
	this.boardTexture.loadTexture("images/difficultyMode.png");

	this.textureEasy = new CGFappearance(this.scene);
	this.textureEasy.loadTexture("images/easyDiff.png");

	this.textureHard = new CGFappearance(this.scene);
	this.textureHard.loadTexture("images/hardDiff.png");
}

DifficultyGameState.prototype = Object.create(GameState.prototype);
DifficultyGameState.prototype.constructor = DifficultyGameState;

DifficultyGameState.prototype.update = function(deltaTime) {};

DifficultyGameState.prototype.display = function() {};

DifficultyGameState.prototype.displayHUD = function() {
	this.scene.pushMatrix();
		this.scene.translate(0.0, 0.0, -4.0);
		this.scene.rotate(-180 * this.degToRad, 0, 0, 1);
		this.boardTexture.apply();
		this.backBoard.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(-1.1, 0.0, -3.95);
		this.scene.rotate(-180 * this.degToRad, 0, 0, 1);
		this.textureEasy.apply();
		this.scene.registerForPick(this.EASY, this.planeEasy);
		this.planeEasy.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(1.1, 0.0, -3.95);
		this.scene.rotate(-180 * this.degToRad, 0, 0, 1);
		this.textureHard.apply();
		this.scene.registerForPick(this.HARD, this.planeHard);
		this.planeHard.display();
	this.scene.popMatrix();
};

DifficultyGameState.prototype.handleInput = function(pickResults) {
	switch (pickResults[0][1]) {
		case this.EASY:
			this.gsm.gameSettings.difficulty = this.EASY;
			this.gsm.setState(this.gsm.BOARD);
			break;
		case this.HARD:
			this.gsm.gameSettings.difficulty = this.HARD;
			this.gsm.setState(this.gsm.BOARD);
			break;
	}
};