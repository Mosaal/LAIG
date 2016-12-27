function PlayGameState(gsm, scene) {
	GameState.call(this, gsm, scene);

	this.digits = [];
	this.minLeftIndex = 0;
	this.minRightIndex = 0;
	this.secLeftIndex = 0;
	this.secRightIndex = 0;
	this.ELAPSEDTIME = 0;
	this.BEGINNINGTIME = 0;
	this.generateDigits();

	this.gameLogic = new GameLogic(this);
	this.gameLogic.init();

	this.AIMove = null;
	this.roundOver = false;
	this.moveChosen = false;
	this.countPoints = false;
	this.playersPoints = null;
	this.successfulPlay = false;

	this.gamePieces = [];
	this.gamePieces.push(null);

	this.animation = null;
	this.animationID = null;
	this.degToRad = Math.PI / 180.0;

	this.TIME = 0;
	this.BOARD1 = 1;
	this.BOARD2 = 2;
	this.BOARD3 = 3;
	this.POINTSP1 = 0;
	this.POINTSP2 = 0;
	this.CURRCLICKEDPIECE = 0;
	this.LASTCLICKEDPIECE = 0;
	this.WAITINGFORCLICK = false;

	this.generateBoard();
	this.generatePiecesP1();
	this.generatePiecesP2();

	this.hudBoard = new Plane(this.scene, 2, 1, 50, 50);
	this.turnBoard = new Plane(this.scene, 1.5, 0.5, 50, 50);
	this.minLeft = new Plane(this.scene, 0.2, 0.4, 50, 50);
	this.minRight = new Plane(this.scene, 0.2, 0.4, 50, 50);
	this.secLeft = new Plane(this.scene, 0.2, 0.4, 50, 50);
	this.secRight = new Plane(this.scene, 0.2, 0.4, 50, 50);
	this.colonBoard = new Plane(this.scene, 0.1, 0.4, 50, 50);

	this.boardTexture = new CGFappearance(this.scene);
	this.boardTexture.loadTexture("images/backBoard.png");

	this.boardPieceTexture = new CGFappearance(this.scene);
	this.boardPieceTexture.loadTexture("images/gameBoard.png");

	this.piecesP1Texture = new CGFappearance(this.scene);
	this.piecesP1Texture.loadTexture("images/player1.png");

	this.piecesP2Texture = new CGFappearance(this.scene);
	this.piecesP2Texture.loadTexture("images/player2.png");

	this.turnP1Texture = new CGFappearance(this.scene);
	this.turnP1Texture.loadTexture("images/turnP1.png");

	this.turnP2Texture = new CGFappearance(this.scene);
	this.turnP2Texture.loadTexture("images/turnP2.png");

	this.colonTexture = new CGFappearance(this.scene);
	this.colonTexture.loadTexture("images/colon.png");
}

PlayGameState.prototype = Object.create(GameState.prototype);
PlayGameState.prototype.constructor = PlayGameState;

PlayGameState.prototype.generateDigits = function() {
	for (var i = 0; i < 10; i++) {
		var temp = new CGFappearance(this.scene);
		temp.loadTexture("images/" + i + ".png");
		this.digits.push(temp);
	}
};

PlayGameState.prototype.generateBoard = function() {
	switch (this.gsm.gameSettings.board) {
		case this.BOARD1:
			this.generateBoard1();
			break;
		case this.BOARD2:
			this.generateBoard2();
			break;
		case this.BOARD3:
			this.generateBoard3();
			break;
	}
};

PlayGameState.prototype.generateBoard1 = function() {
	this.gamePieces.push(new GamePiece(new Point3(-1.55, 0.0, -0.9), 'boardPiece', new Cylinder(this.scene, 1.0, 1.0, 0.1, 6, 1)));
	this.gamePieces.push(new GamePiece(new Point3(0.0, 0.0, -1.8), 'boardPiece', new Cylinder(this.scene, 1.0, 1.0, 0.1, 6, 1)));
	this.gamePieces.push(new GamePiece(new Point3(1.55, 0.0, -0.9), 'boardPiece', new Cylinder(this.scene, 1.0, 1.0, 0.1, 6, 1)));
	this.gamePieces.push(new GamePiece(new Point3(-1.55, 0.0, 0.9), 'boardPiece', new Cylinder(this.scene, 1.0, 1.0, 0.1, 6, 1)));
	this.gamePieces.push(new GamePiece(new Point3(0.0, 0.0, 0.0), 'boardPiece', new Cylinder(this.scene, 1.0, 1.0, 0.1, 6, 1)));
	this.gamePieces.push(new GamePiece(new Point3(1.55, 0.0, 0.9), 'boardPiece', new Cylinder(this.scene, 1.0, 1.0, 0.1, 6, 1)));
	this.gamePieces.push(new GamePiece(new Point3(-1.55, 0.0, 2.7), 'boardPiece', new Cylinder(this.scene, 1.0, 1.0, 0.1, 6, 1)));
	this.gamePieces.push(new GamePiece(new Point3(0.0, 0.0, 1.8), 'boardPiece', new Cylinder(this.scene, 1.0, 1.0, 0.1, 6, 1)));
	this.gamePieces.push(new GamePiece(new Point3(1.55, 0.0, 2.7), 'boardPiece', new Cylinder(this.scene, 1.0, 1.0, 0.1, 6, 1)));
};

PlayGameState.prototype.generateBoard2 = function() {
	this.gamePieces.push(new GamePiece(new Point3(-1.55, 0.0, -0.9), 'boardPiece', new Cylinder(this.scene, 1.0, 1.0, 0.1, 6, 1)));
	this.gamePieces.push(new GamePiece(new Point3(0.0, 0.0, -1.8), 'boardPiece', new Cylinder(this.scene, 1.0, 1.0, 0.1, 6, 1)));
	this.gamePieces.push(new GamePiece(new Point3(1.55, 0.0, -2.7), 'boardPiece', new Cylinder(this.scene, 1.0, 1.0, 0.1, 6, 1)));
	this.gamePieces.push(new GamePiece(new Point3(-1.55, 0.0, 0.9), 'boardPiece', new Cylinder(this.scene, 1.0, 1.0, 0.1, 6, 1)));
	this.gamePieces.push(new GamePiece(new Point3(0.0, 0.0, 0.0), 'boardPiece', new Cylinder(this.scene, 1.0, 1.0, 0.1, 6, 1)));
	this.gamePieces.push(new GamePiece(new Point3(1.55, 0.0, -0.9), 'boardPiece', new Cylinder(this.scene, 1.0, 1.0, 0.1, 6, 1)));
	this.gamePieces.push(new GamePiece(new Point3(-1.55, 0.0, 2.7), 'boardPiece', new Cylinder(this.scene, 1.0, 1.0, 0.1, 6, 1)));
	this.gamePieces.push(new GamePiece(new Point3(0.0, 0.0, 1.8), 'boardPiece', new Cylinder(this.scene, 1.0, 1.0, 0.1, 6, 1)));
	this.gamePieces.push(new GamePiece(new Point3(1.55, 0.0, 0.9), 'boardPiece', new Cylinder(this.scene, 1.0, 1.0, 0.1, 6, 1)));
};

PlayGameState.prototype.generateBoard3 = function() {
	this.gamePieces.push(new GamePiece(new Point3(-3.1, 0.0, 0.0), 'boardPiece', new Cylinder(this.scene, 1.0, 1.0, 0.1, 6, 1)));
	this.gamePieces.push(new GamePiece(new Point3(-1.55, 0.0, -0.9), 'boardPiece', new Cylinder(this.scene, 1.0, 1.0, 0.1, 6, 1)));
	this.gamePieces.push(new GamePiece(new Point3(0.0, 0.0, -1.8), 'boardPiece', new Cylinder(this.scene, 1.0, 1.0, 0.1, 6, 1)));
	this.gamePieces.push(new GamePiece(new Point3(-1.55, 0.0, 0.9), 'boardPiece', new Cylinder(this.scene, 1.0, 1.0, 0.1, 6, 1)));
	this.gamePieces.push(new GamePiece(new Point3(0.0, 0.0, 0.0), 'boardPiece', new Cylinder(this.scene, 1.0, 1.0, 0.1, 6, 1)));
	this.gamePieces.push(new GamePiece(new Point3(1.55, 0.0, -0.9), 'boardPiece', new Cylinder(this.scene, 1.0, 1.0, 0.1, 6, 1)));
	this.gamePieces.push(new GamePiece(new Point3(0.0, 0.0, 1.8), 'boardPiece', new Cylinder(this.scene, 1.0, 1.0, 0.1, 6, 1)));
	this.gamePieces.push(new GamePiece(new Point3(1.55, 0.0, 0.9), 'boardPiece', new Cylinder(this.scene, 1.0, 1.0, 0.1, 6, 1)));
	this.gamePieces.push(new GamePiece(new Point3(3.1, 0.0, 0.0), 'boardPiece', new Cylinder(this.scene, 1.0, 1.0, 0.1, 6, 1)));
};

PlayGameState.prototype.generatePiecesP1 = function() {
	this.gamePieces.push(new GamePiece(new Point3(-3.5, 0.0, 3.7), 'sp', new Cylinder(this.scene, 0.2, 0.2, 0.1, 100, 1)));
	this.gamePieces.push(new GamePiece(new Point3(-4.0, 0.0, 3.7), 'sp', new Cylinder(this.scene, 0.2, 0.2, 0.1, 100, 1)));
	this.gamePieces.push(new GamePiece(new Point3(-4.5, 0.0, 3.7), 'sp', new Cylinder(this.scene, 0.2, 0.2, 0.1, 100, 1)));
	this.gamePieces.push(new GamePiece(new Point3(-3.5, 0.0, 2.9), 'mp', new Cylinder(this.scene, 0.4, 0.4, 0.1, 100, 1)));
	this.gamePieces.push(new GamePiece(new Point3(-4.4, 0.0, 2.9), 'mp', new Cylinder(this.scene, 0.4, 0.4, 0.1, 100, 1)));
	this.gamePieces.push(new GamePiece(new Point3(-5.3, 0.0, 2.9), 'mp', new Cylinder(this.scene, 0.4, 0.4, 0.1, 100, 1)));
	this.gamePieces.push(new GamePiece(new Point3(-3.5, 0.0, 1.7), 'bp', new BigPiece(this.scene)));
	this.gamePieces.push(new GamePiece(new Point3(-4.8, 0.0, 1.7), 'bp', new BigPiece(this.scene)));
	this.gamePieces.push(new GamePiece(new Point3(-6.1, 0.0, 1.7), 'bp', new BigPiece(this.scene)));
};

PlayGameState.prototype.generatePiecesP2 = function() {
	this.gamePieces.push(new GamePiece(new Point3(3.5, 0.0, -3.7), 'sp', new Cylinder(this.scene, 0.2, 0.2, 0.1, 100, 1)));
	this.gamePieces.push(new GamePiece(new Point3(4.0, 0.0, -3.7), 'sp', new Cylinder(this.scene, 0.2, 0.2, 0.1, 100, 1)));
	this.gamePieces.push(new GamePiece(new Point3(4.5, 0.0, -3.7), 'sp', new Cylinder(this.scene, 0.2, 0.2, 0.1, 100, 1)));
	this.gamePieces.push(new GamePiece(new Point3(3.5, 0.0, -2.9), 'mp', new Cylinder(this.scene, 0.4, 0.4, 0.1, 100, 1)));
	this.gamePieces.push(new GamePiece(new Point3(4.4, 0.0, -2.9), 'mp', new Cylinder(this.scene, 0.4, 0.4, 0.1, 100, 1)));
	this.gamePieces.push(new GamePiece(new Point3(5.3, 0.0, -2.9), 'mp', new Cylinder(this.scene, 0.4, 0.4, 0.1, 100, 1)));
	this.gamePieces.push(new GamePiece(new Point3(3.5, 0.0, -1.7), 'bp', new BigPiece(this.scene)));
	this.gamePieces.push(new GamePiece(new Point3(4.8, 0.0, -1.7), 'bp', new BigPiece(this.scene)));
	this.gamePieces.push(new GamePiece(new Point3(6.1, 0.0, -1.7), 'bp', new BigPiece(this.scene)));
};

PlayGameState.prototype.update = function(deltaTime) {
	if (this.BEGINNINGTIME == 0)
		this.BEGINNINGTIME = deltaTime;

	this.TIME = deltaTime;
	this.ELAPSEDTIME = (deltaTime - this.BEGINNINGTIME) / 1000;
	this.ELAPSEDTIME = Math.floor(this.ELAPSEDTIME);
	this.calculateTimerIndexes();

	if (this.successfulPlay) {
		this.successfulPlay = false;
		this.gameLogic.switchTurn();
		this.gameLogic.roundOver();

		var incY = 0.1;
		if (this.gamePieces[this.LASTCLICKEDPIECE].type == 'bp' && this.gamePieces[this.CURRCLICKEDPIECE].type == 'sp')
			incY = 0.0;

		this.animationID = this.LASTCLICKEDPIECE;
		this.generateAnimation(this.gamePieces[this.LASTCLICKEDPIECE].pos, this.gamePieces[this.CURRCLICKEDPIECE].pos, incY);
		this.setNewPosition(this.gamePieces[this.LASTCLICKEDPIECE], this.gamePieces[this.CURRCLICKEDPIECE], incY);
	}

	if (this.gsm.gameSettings.mode == this.gameLogic.PVC && this.gameLogic.TURN == 2 && !this.moveChosen
		&& !this.roundOver && !this.scene.switchTurnP1 && !this.scene.switchTurnP2 && this.animation == null) {
		this.moveChosen = true;
		this.gameLogic.chooseAIPlay();
		this.gameLogic.switchTurn();
		this.gameLogic.roundOver();
	}

	if (this.moveChosen && this.AIMove != null) {
		var subString = '';
		for (var i = 12; i < this.AIMove.length - 1; i++)
			subString += this.AIMove[i];

		var values = subString.split(",");
		if (values[0][0] != "_" && values[1][0] != "_") {
			var pieceID = this.getNextAvailablePiece(values[0]);
			this.gamePieces[pieceID].onBoard = true;
			this.gamePieces[pieceID].posOnBoard = parseInt(values[1]);

			this.animationID = pieceID;
			this.generateAnimation(this.gamePieces[pieceID].pos, this.gamePieces[parseInt(values[1])].pos, 0.1);
			this.setNewPosition(this.gamePieces[pieceID], this.gamePieces[parseInt(values[1])], 0.1);
		} else if (values[2][0] != "_" && values[3][0] != "_") {
			var piece1ID = this.getPieceOnPosition(parseInt(values[2]));
			var piece2ID = this.getPieceOnPosition(parseInt(values[3]));
			this.gamePieces[piece1ID].posOnBoard = this.gamePieces[piece2ID].posOnBoard;

			var incY = 0.1;
			if (this.gamePieces[piece1ID].type == 'bp' && this.gamePieces[piece2ID].type == 'sp')
				incY = 0.0;

			console.log(this.gamePieces[piece1ID].type + ', ' + this.gamePieces[piece2ID].type + ', ' + incY);
			this.animationID = piece1ID;
			this.generateAnimation(this.gamePieces[piece1ID].pos, this.gamePieces[piece2ID].pos, incY);
			this.setNewPosition(this.gamePieces[piece1ID], this.gamePieces[piece2ID], incY);
		}

		this.AIMove = null;
		this.moveChosen = false;
	}

	if (this.roundOver && !this.countPoints) {
		this.countPoints = true;
		this.gameLogic.countPoints();
	}

	if (this.roundOver && this.animation == null && this.playersPoints != null
		&& !this.scene.switchTurnP1 && !this.scene.switchTurnP2) {
		var subString = '';
		for (var i = 7; i < this.playersPoints.length - 1; i++)
			subString += this.playersPoints[i];

		this.gsm.gameInfo.pointsP1 = parseInt(subString.split(",")[0]);
		this.gsm.gameInfo.pointsP2 = parseInt(subString.split(",")[1]);
		this.gsm.gameInfo.elapsedTime = this.ELAPSEDTIME;
		this.gsm.setState(this.gsm.END);
	}
};

PlayGameState.prototype.display = function() {
	this.displayBoard();
	this.displayPiecesP1();
	this.displayPiecesP2();
};

PlayGameState.prototype.displayBoard = function() {
	this.boardPieceTexture.apply();

	for (var i = 1; i < 10; i++) {
		this.scene.pushMatrix();
			this.scene.translate(this.gamePieces[i].pos.x, this.gamePieces[i].pos.y, this.gamePieces[i].pos.z);
			this.scene.rotate(-90 * this.degToRad, 1, 0, 0);
			this.scene.registerForPick(i, this.gamePieces[i].primitive);
			this.gamePieces[i].primitive.display();
		this.scene.popMatrix();
	}
};

PlayGameState.prototype.displayPiecesP1 = function() {
	this.piecesP1Texture.apply();

	for (var i = 10; i < 19; i++) {
		this.scene.pushMatrix();
			this.applyTransformations(i, this.gamePieces[i].pos);
			this.scene.rotate(-90 * this.degToRad, 1, 0, 0);
			this.scene.registerForPick(i, this.gamePieces[i].primitive);
			this.gamePieces[i].primitive.display();
		this.scene.popMatrix();
	}
};

PlayGameState.prototype.displayPiecesP2 = function() {
	this.piecesP2Texture.apply();

	for (var i = 19; i < 28; i++) {
		this.scene.pushMatrix();
			this.applyTransformations(i, this.gamePieces[i].pos);
			this.scene.rotate(-90 * this.degToRad, 1, 0, 0);
			this.scene.registerForPick(i, this.gamePieces[i].primitive);
			this.gamePieces[i].primitive.display();
		this.scene.popMatrix();
	}
};

PlayGameState.prototype.displayHUD = function() {
	this.scene.pushMatrix();
		this.scene.translate(0.0, 2.8, -6.0);
		this.scene.rotate(-180 * this.degToRad, 0, 0, 1);
		this.boardTexture.apply();
		this.hudBoard.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(0.0, 3.05, -6.0);
		this.scene.rotate(-180 * this.degToRad, 0, 0, 1);
		
		if (this.gameLogic.TURN == 1)
			this.turnP1Texture.apply();
		else if (this.gameLogic.TURN == 2)
			this.turnP2Texture.apply();

		this.turnBoard.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(-0.4, 2.55, -6.0);
		this.scene.rotate(-180 * this.degToRad, 0, 0, 1);
		this.digits[this.minLeftIndex].apply();
		this.minLeft.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(-0.2, 2.55, -6.0);
		this.scene.rotate(-180 * this.degToRad, 0, 0, 1);
		this.digits[this.minRightIndex].apply();
		this.minRight.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(0.0, 2.55, -6.0);
		this.scene.rotate(-180 * this.degToRad, 0, 0, 1);
		this.colonTexture.apply();
		this.colonBoard.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(0.2, 2.55, -6.0);
		this.scene.rotate(-180 * this.degToRad, 0, 0, 1);
		this.digits[this.secLeftIndex].apply();
		this.secLeft.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(0.4, 2.55, -6.0);
		this.scene.rotate(-180 * this.degToRad, 0, 0, 1);
		this.digits[this.secRightIndex].apply();
		this.secRight.display();
	this.scene.popMatrix();
};

PlayGameState.prototype.calculateTimerIndexes = function() {
	var outMin = [], outSec = [];
	var min = Math.floor(this.ELAPSEDTIME / 60);
	var sec = Math.floor(this.ELAPSEDTIME % 60);
	var minStr = min.toString(), secStr = sec.toString();

	for (var i = 0; i < minStr.length; i++)
		outMin.push(minStr[i]);

	for (var i = 0; i < secStr.length; i++)
		outSec.push(secStr[i]);

	if (minStr.length > 1) {
		this.minLeftIndex = parseInt(outMin[0]);
		this.minRightIndex = parseInt(outMin[1]);
	} else {
		this.minLeftIndex = 0;
		this.minRightIndex = parseInt(outMin[0]);
	}

	if (secStr.length > 1) {
		this.secLeftIndex = parseInt(secStr[0]);
		this.secRightIndex = parseInt(secStr[1]);
	} else {
		this.secLeftIndex = 0;
		this.secRightIndex = parseInt(secStr[0]);
	}
};

PlayGameState.prototype.applyTransformations = function(ID, position) {
	if (this.animation != null && this.animationID == ID) {
		if (this.animation.done == false) {
			this.animation.applyAnimation(this.TIME);
		} else {
			this.animation = null;
			this.animationID = null;
			this.scene.translate(position.x, position.y, position.z);

			if (this.gameLogic.TURN == 1) {
				this.gameLogic.TURN = 2;
				this.scene.switchTurnP2 = true;
			} else if (this.gameLogic.TURN == 2) {
				this.gameLogic.TURN = 1;
				this.scene.switchTurnP1 = true;
			}
		}
	} else {
		this.scene.translate(position.x, position.y, position.z);
	}
};

PlayGameState.prototype.allowInput = function() {
	return this.LASTCLICKEDPIECE != null && this.CURRCLICKEDPIECE != null && this.animation == null
			&& !this.roundOver && !this.scene.switchTurnP1 && !this.scene.switchTurnP2;
};

PlayGameState.prototype.handleInput = function(pickResults) {
	if (pickResults[0][1] >= 300) {
		console.error("The selection of this Object is ignored!");
		return;
	}

	this.CURRCLICKEDPIECE = pickResults[0][1];
	var currClick = this.pieceClicked(this.CURRCLICKEDPIECE);
	var lastClick = this.pieceClicked(this.LASTCLICKEDPIECE);

	if (this.allowInput()) {
		if (this.gsm.gameSettings.mode == this.gameLogic.PVP) {
			if (!this.WAITINGFORCLICK) {
				this.WAITINGFORCLICK = true;
				this.LASTCLICKEDPIECE = this.CURRCLICKEDPIECE;
			} else {
				this.WAITINGFORCLICK = false;

				if (this.gameLogic.TURN == 1) {
					if (lastClick == 'pieceP1' && currClick == 'boardPiece') {
						this.gameLogic.placePiece(this.gamePieces[this.LASTCLICKEDPIECE], this.CURRCLICKEDPIECE);
					} else if (lastClick == 'pieceP1' && currClick == 'pieceP2') {
						this.gameLogic.movePiece(this.gamePieces[this.LASTCLICKEDPIECE], this.gamePieces[this.CURRCLICKEDPIECE]);
					}
				} else if (this.gameLogic.TURN == 2) {
					if (lastClick == 'pieceP2' && currClick == 'boardPiece') {
						this.gameLogic.placePiece(this.gamePieces[this.LASTCLICKEDPIECE], this.CURRCLICKEDPIECE);
					} else if (lastClick == 'pieceP2' && currClick == 'pieceP1') {
						this.gameLogic.movePiece(this.gamePieces[this.LASTCLICKEDPIECE], this.gamePieces[this.CURRCLICKEDPIECE]);
					}
				}
			}
		} else if (this.gsm.gameSettings.mode == this.gameLogic.PVC) {
			if (!this.WAITINGFORCLICK) {
				this.WAITINGFORCLICK = true;
				this.LASTCLICKEDPIECE = this.CURRCLICKEDPIECE;
			} else {
				this.WAITINGFORCLICK = false;

				if (this.gameLogic.TURN == 1) {
					if (lastClick == 'pieceP1' && currClick == 'boardPiece') {
						this.gameLogic.placePiece(this.gamePieces[this.LASTCLICKEDPIECE], this.CURRCLICKEDPIECE);
					} else if (lastClick == 'pieceP1' && currClick == 'pieceP2') {
						this.gameLogic.movePiece(this.gamePieces[this.LASTCLICKEDPIECE], this.gamePieces[this.CURRCLICKEDPIECE]);
					}
				}
			}
		}
	}
};

PlayGameState.prototype.getPieceOnPosition = function(pos) {
	for (var i = 10; i < 28; i++) {
		if (this.gamePieces[i].posOnBoard == pos && this.gamePieces[i].onBoard)
			return i;
	}
};

PlayGameState.prototype.getNextAvailablePiece = function(type) {
	for (var i = 19; i < 28; i++) {
		if (this.gamePieces[i].type == type && !this.gamePieces[i].onBoard)
			return i;
	}
};

PlayGameState.prototype.generateAnimation = function(begin, end, incY) {
	var cP = [ new Point3(begin.x, begin.y, begin.z), new Point3(begin.x, begin.y + 1.0, begin.z),
			   new Point3(end.x, end.y + 1.0, end.z), new Point3(end.x, end.y + incY, end.z) ];
	this.animation = new LinearAnimation(this.scene, 'animation', 3.0, 'linear', cP);
};

PlayGameState.prototype.setNewPosition = function(piece1, piece2, incY) {
	piece1.pos.x = piece2.pos.x;
	piece1.pos.y = piece2.pos.y + incY;
	piece1.pos.z = piece2.pos.z;
};

PlayGameState.prototype.pieceClicked = function(ID) {
	if (ID >= 1 && ID < 10) {
		return 'boardPiece';
	} else if (ID >= 10 && ID < 19) {
		return 'pieceP1';
	} else if (ID >= 19 && ID < 28) {
		return 'pieceP2';
	}
};