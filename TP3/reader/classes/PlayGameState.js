function PlayGameState(gsm, scene) {
	GameState.call(this, gsm, scene);

	this.success = false;
	this.gameLogic = new GameLogic(this);
	this.gameLogic.init();

	this.gamePieces = [];
	this.gamePieces.push(null);

	this.animation = null;
	this.animationID = null;
	this.degToRad = Math.PI / 180.0;

	this.TIME = 0;
	this.BOARD1 = 1;
	this.BOARD2 = 2;
	this.BOARD3 = 3;
	this.CURRCLICKEDPIECE = 0;
	this.LASTCLICKEDPIECE = 0;
	this.WAITINGFORCLICK = false;

	this.generateBoard();
	this.generatePiecesP1();
	this.generatePiecesP2();

	this.timerBoard = new Plane(this.scene, 2.5, 1, 50, 50);
	this.pointsP1Board = new Plane(this.scene, 2, 1, 50, 50);
	this.pointsP2Board = new Plane(this.scene, 2, 1, 50, 50);

	this.boardTexture = new CGFappearance(this.scene);
	this.boardTexture.loadTexture("images/backBoard.png");

	this.boardPieceTexture = new CGFappearance(this.scene);
	this.boardPieceTexture.loadTexture("images/gameBoard.png");

	this.piecesP1Texture = new CGFappearance(this.scene);
	this.piecesP1Texture.loadTexture("images/player1.png");

	this.piecesP2Texture = new CGFappearance(this.scene);
	this.piecesP2Texture.loadTexture("images/player2.png");
}

PlayGameState.prototype = Object.create(GameState.prototype);
PlayGameState.prototype.constructor = PlayGameState;

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
	this.gamePieces.push(new GamePiece(new Point3(-3.5, 0.0, 1.7), 'bp', new Cylinder(this.scene, 0.6, 0.6, 0.1, 100, 1)));
	this.gamePieces.push(new GamePiece(new Point3(-4.8, 0.0, 1.7), 'bp', new Cylinder(this.scene, 0.6, 0.6, 0.1, 100, 1)));
	this.gamePieces.push(new GamePiece(new Point3(-6.1, 0.0, 1.7), 'bp', new Cylinder(this.scene, 0.6, 0.6, 0.1, 100, 1)));
};

PlayGameState.prototype.generatePiecesP2 = function() {
	this.gamePieces.push(new GamePiece(new Point3(3.5, 0.0, -3.7), 'sp', new Cylinder(this.scene, 0.2, 0.2, 0.1, 100, 1)));
	this.gamePieces.push(new GamePiece(new Point3(4.0, 0.0, -3.7), 'sp', new Cylinder(this.scene, 0.2, 0.2, 0.1, 100, 1)));
	this.gamePieces.push(new GamePiece(new Point3(4.5, 0.0, -3.7), 'sp', new Cylinder(this.scene, 0.2, 0.2, 0.1, 100, 1)));
	this.gamePieces.push(new GamePiece(new Point3(3.5, 0.0, -2.9), 'mp', new Cylinder(this.scene, 0.4, 0.4, 0.1, 100, 1)));
	this.gamePieces.push(new GamePiece(new Point3(4.4, 0.0, -2.9), 'mp', new Cylinder(this.scene, 0.4, 0.4, 0.1, 100, 1)));
	this.gamePieces.push(new GamePiece(new Point3(5.3, 0.0, -2.9), 'mp', new Cylinder(this.scene, 0.4, 0.4, 0.1, 100, 1)));
	this.gamePieces.push(new GamePiece(new Point3(3.5, 0.0, -1.7), 'bp', new Cylinder(this.scene, 0.6, 0.6, 0.1, 100, 1)));
	this.gamePieces.push(new GamePiece(new Point3(4.8, 0.0, -1.7), 'bp', new Cylinder(this.scene, 0.6, 0.6, 0.1, 100, 1)));
	this.gamePieces.push(new GamePiece(new Point3(6.1, 0.0, -1.7), 'bp', new Cylinder(this.scene, 0.6, 0.6, 0.1, 100, 1)));
};

PlayGameState.prototype.update = function(deltaTime) {
	this.TIME = deltaTime;

	if (this.success) {
		this.success = false;
		this.gameLogic.switchTurn();
		this.animationID = this.LASTCLICKEDPIECE;
		this.generateAnimation(this.gamePieces[this.LASTCLICKEDPIECE].pos, this.gamePieces[this.CURRCLICKEDPIECE].pos, 0.1);
		this.setNewPosition(this.gamePieces[this.LASTCLICKEDPIECE], this.gamePieces[this.CURRCLICKEDPIECE], 0.1);
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
	this.boardTexture.apply();

	this.scene.pushMatrix();
		this.scene.translate(0.0, 2.8, -6.0);
		this.scene.rotate(-180 * this.degToRad, 0, 0, 1);
		this.timerBoard.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(-5.1, 2.8, -6.0);
		this.scene.rotate(-180 * this.degToRad, 0, 0, 1);
		this.pointsP1Board.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(5.1, 2.8, -6.0);
		this.scene.rotate(-180 * this.degToRad, 0, 0, 1);
		this.pointsP1Board.display();
	this.scene.popMatrix();
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
	return this.CURRCLICKEDPIECE != null && this.animation == null && !this.scene.switchTurnP1 && !this.scene.switchTurnP2;
};

PlayGameState.prototype.handleInput = function(pickResults) {
	this.CURRCLICKEDPIECE = pickResults[0][1];
	var currClick = this.pieceClicked(this.CURRCLICKEDPIECE);
	var lastClick = this.pieceClicked(this.LASTCLICKEDPIECE);

	if (this.allowInput()) {
		if (!this.WAITINGFORCLICK) {
			this.WAITINGFORCLICK = true;
			this.LASTCLICKEDPIECE = this.CURRCLICKEDPIECE;
		} else {
			this.WAITINGFORCLICK = false;

			if (this.gsm.gameSettings.mode == this.gameLogic.PVP) {
				if (lastClick == 'pieceP1' && currClick == 'boardPiece' && this.gameLogic.TURN == 1) {
					this.gameLogic.placePiece(this.gamePieces[this.LASTCLICKEDPIECE], this.CURRCLICKEDPIECE);
				} else if (lastClick == 'pieceP2' && currClick == 'boardPiece' && this.gameLogic.TURN == 2) {
					this.gameLogic.placePiece(this.gamePieces[this.LASTCLICKEDPIECE], this.CURRCLICKEDPIECE);
				} else if (lastClick == 'pieceP1' && currClick == 'pieceP2' && this.gameLogic.TURN == 1) {
					this.gameLogic.movePiece(this.gamePieces[this.LASTCLICKEDPIECE], this.gamePieces[this.CURRCLICKEDPIECE]);
				} else if (lastClick == 'pieceP2' && currClick == 'pieceP1' && this.gameLogic.TURN == 2) {
					this.gameLogic.movePiece(this.gamePieces[this.LASTCLICKEDPIECE], this.gamePieces[this.CURRCLICKEDPIECE]);
				}
			}
		}
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