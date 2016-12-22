function ModeGameState(gsm, scene) {
	GameState.call(this, gsm, scene);
	this.degToRad = Math.PI / 180.0;

	this.PVP = 1;
	this.PVC = 2;

	this.backBoard = new Plane(this.scene, 5, 3, 50, 50);
	this.planePVP = new Plane(this.scene, 2.0, 0.5, 50, 50);
	this.planePVC = new Plane(this.scene, 2.0, 0.5, 50, 50);

	this.boardTexture = new CGFappearance(this.scene);
	this.boardTexture.loadTexture("images/gameMode.png");

	this.texturePVP = new CGFappearance(this.scene);
	this.texturePVP.loadTexture("images/playerVsPlayer.png");

	this.texturePVC = new CGFappearance(this.scene);
	this.texturePVC.loadTexture("images/playerVsPC.png");
}

ModeGameState.prototype = Object.create(GameState.prototype);
ModeGameState.prototype.constructor = ModeGameState;

ModeGameState.prototype.update = function(deltaTime) {};

ModeGameState.prototype.display = function() {
	this.scene.pushMatrix();
		this.scene.translate(0.0, 3.0, 3.0);
		this.scene.rotate(-45 * this.degToRad, 1, 0, 0);
		this.scene.rotate(-180 * this.degToRad, 0, 0, 1);
		this.boardTexture.apply();
		this.backBoard.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(-1.1, 3.0, 3.05);
		this.scene.rotate(-45 * this.degToRad, 1, 0, 0);
		this.scene.rotate(-180 * this.degToRad, 0, 0, 1);
		this.texturePVP.apply();
		this.scene.registerForPick(this.PVP, this.planePVP);
		this.planePVP.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(1.3, 3.0, 3.05);
		this.scene.rotate(-45 * this.degToRad, 1, 0, 0);
		this.scene.rotate(-180 * this.degToRad, 0, 0, 1);
		this.texturePVC.apply();
		this.scene.registerForPick(this.PVC, this.planePVC);
		this.planePVC.display();
	this.scene.popMatrix();
};

ModeGameState.prototype.handleInput = function(pickResults) {
	switch (pickResults[0][1]) {
		case this.PVP:
			this.gsm.gameSettings.mode = this.PVP;
			this.gsm.setState(this.gsm.BOARD);
			break;
		case this.PVC:
			this.gsm.gameSettings.mode = this.PVC;
			this.gsm.setState(this.gsm.DIFFICULTY);
			break;
	}
};