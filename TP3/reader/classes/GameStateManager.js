function GameStateManager(scene) {
	// GAME STATES
	this.MODE = 0;
	this.DIFFICULTY = 1;
	this.BOARD = 2;
	this.PLAY = 3;
	this.END = 4;

	// VARS
	this.scene = scene;
	this.gameState = null;
	this.gameSettings = { mode: 0, difficulty: 0, board: 0 };
	this.gameInfo = { pointsP1: 0, pointsP2: 0, elapsedTime: 0 };
}

GameStateManager.prototype.setState = function(state) {
	if (this.gameState != null)
		this.gameState = null;

	switch (state) {
		case this.MODE:
			this.gameState = new ModeGameState(this, this.scene);
			break;
		case this.DIFFICULTY:
			this.gameState = new DifficultyGameState(this, this.scene);
			break;
		case this.BOARD:
			this.gameState = new BoardGameState(this, this.scene);
			break;
		case this.PLAY:
			this.gameState = new PlayGameState(this, this.scene);
			break;
		case this.END:
			this.gameState = new EndGameState(this, this.scene);
			break;
	}
};

GameStateManager.prototype.update = function(deltaTime) {
	this.gameState.update(deltaTime);
};

GameStateManager.prototype.display = function() {
	this.gameState.display();
};

GameStateManager.prototype.displayHUD = function() {
	this.gameState.displayHUD();
};

GameStateManager.prototype.handleInput = function(pickResults) {
	this.gameState.handleInput(pickResults);
};