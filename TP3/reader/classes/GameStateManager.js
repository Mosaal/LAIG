function GameStateManager(scene) {
	this.MODE = 0;
	this.DIFFICULTY = 1;
	this.BOARD = 2;
	this.PLAY = 3;
	this.END = 4;
	this.scene = scene;
	this.gameState = null;
}

GameStateManager.prototype.setState = function(state) {
	if (this.gameState != null)
		this.gameState = null;

	switch (state) {
		case this.MODE:
			this.gameState = new ModeGameState(this, this.scene);
			break;
		case this.DIFFICULTY:
			break;
		case this.BOARD:
			break;
		case this.PLAY:
			break;
		case this.END:
			break;
	}
};

GameStateManager.prototype.update = function(deltaTime) {
	this.gameState.update(deltaTime);
};

GameStateManager.prototype.display = function() {
	this.gameState.display();
};