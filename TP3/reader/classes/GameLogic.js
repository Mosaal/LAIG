function GameLogic(gameSettings) {
	this.TIME = 0;
	this.TURN = 1;

	this.PVP = 1;
	this.PVC = 2;
	this.EASY = 1;
	this.HARD = 2;
	this.BOARD1 = 1;
	this.BOARD2 = 2;
	this.BOARD3 = 3;

	this.SMALLPIECESP1 = 3;
	this.MEDIUMPIECESP1 = 3;
	this.BIGPIECESP1 = 3;

	this.SMALLPIECESP2 = 3;
	this.MEDIUMPIECESP2 = 3;
	this.BIGPIECESP2 = 3;

	this.MODE = gameSettings.mode;
	this.BOARD = gameSettings.board;
	this.DIFFICULTY = gameSettings.difficulty;
}

GameLogic.prototype.init = function() {
	if (this.MODE == this.PVP) {
		this.sendPrologRequest("game_mode(l)");
	} else if (this.MODE == this.PVC) {
		this.sendPrologRequest("game_mode(c)");
	}

	if (this.DIFFICULTY == this.EASY) {
		this.sendPrologRequest("difficulty(e)");
	} else if (this.DIFFICULTY == this.HARD) {
		this.sendPrologRequest("difficulty(h)");
	}

	if (this.BOARD == this.BOARD1) {
		this.sendPrologRequest("chosen_board(1)");
	} else if (this.BOARD == this.BOARD2) {
		this.sendPrologRequest("chosen_board(2)");
	} else if (this.BOARD == this.BOARD3) {
		this.sendPrologRequest("chosen_board(3)");
	}
};

GameLogic.prototype.sendPrologRequest = function(requestString) {
	var requestPort = 8081;
	var request = new XMLHttpRequest();
	request.open('GET', 'http://localhost:' + requestPort + '/' + requestString, true);

	console.log("Sending ProLog Request: " + requestString);
	
	request.onload = function(data){console.log("ProLog request successful. Reply: " + data.target.response);};
	request.onerror = function(){console.log("Error waiting for ProLog response");};

	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	request.send();
};