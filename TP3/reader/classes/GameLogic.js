function GameLogic(gameState) {
	this.gameState = gameState;

	this.TIME = 0;
	this.TURN = 1;

	this.SP = 'sp';
	this.MP = 'mp';
	this.BP = 'bp';

	this.PVP = 1;
	this.PVC = 2;
	this.EASY = 1;
	this.HARD = 2;
	this.BOARD1 = 1;
	this.BOARD2 = 2;
	this.BOARD3 = 3;

	this.MODE = gameState.gsm.gameSettings.mode;
	this.BOARD = gameState.gsm.gameSettings.board;
	this.DIFFICULTY = gameState.gsm.gameSettings.difficulty;
}

GameLogic.prototype.init = function() {
	// Reset game
	this.sendPrologRequest("retract_everything");
	this.sendPrologRequest("assert_everything");

	// Set game settings
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

GameLogic.prototype.switchTurn = function() {
	this.sendPrologRequest("switch_turn");
};

GameLogic.prototype.roundOver = function() {
	this.sendPrologRequest("round_over", this.gameState, "ROUND");
};

GameLogic.prototype.countPoints = function() {
	// this.sendPrologRequest("count_points_players");
};

GameLogic.prototype.getPointsByPlayer = function(player) {
	// if (player == 1)
		// this.sendPrologRequest("get_points_player");
	// else if (player == 2)
		// this.sendPrologRequest("get_points_player");
};

GameLogic.prototype.chooseAIPlay = function() {
	// this.sendPrologRequest("choose_move", this.gameState, "AIPLAY");
};

GameLogic.prototype.placePiece = function(piece, pos) {
	if (!piece.onBoard) {
		piece.onBoard = true;
		piece.posOnBoard = pos;
		this.sendPrologRequest("place_piece_mod(" + piece.type + "," + pos + ")", this.gameState, "PLAY");
	}
};

GameLogic.prototype.movePiece = function(piece1, piece2) {
	if (piece1.onBoard && piece2.onBoard) {
		if (piece1.type == this.SP && piece2.type == this.MP) {
			this.sendPrologRequest("move_piece_mod(" + piece1.posOnBoard + "," + piece2.posOnBoard + ")", this.gameState, "PLAY");
			piece1.posOnBoard = piece2.posOnBoard;
		} else if (piece1.type == this.MP && piece2.type == this.BP) {
			this.sendPrologRequest("move_piece_mod(" + piece1.posOnBoard + "," + piece2.posOnBoard + ")", this.gameState, "PLAY");
			piece1.posOnBoard = piece2.posOnBoard;
		} else if (piece1.type == this.BP && piece2.type == this.SP) {
			this.sendPrologRequest("move_piece_mod(" + piece1.posOnBoard + "," + piece2.posOnBoard + ")", this.gameState, "PLAY");
			piece1.posOnBoard = piece2.posOnBoard;
		}
	}
};

GameLogic.prototype.sendPrologRequest = function(requestString, gameState, condition) {
	var requestPort = 8081;
	var request = new XMLHttpRequest();
	request.open('GET', 'http://localhost:' + requestPort + '/' + requestString, true);

	console.log("Sending ProLog Request: " + requestString);
	
	request.onload = function(data) {
		if (gameState != null && data.target.response != 'Bad Request') {
			if (condition == "PLAY") {
				gameState.successfulPlay = true;
			} else if (condition == "AIPLAY") {
				// do something
			} else if (condition == "ROUND") {
				gameState.roundOver = true;
			}
		}
		console.log("ProLog request successful. Reply: " + data.target.response);
	};
	request.onerror = function() {
		console.log("Error! Waiting for ProLog response.");
	};

	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	request.send();
};