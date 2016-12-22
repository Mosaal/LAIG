function PlayGameState(gsm, scene) {
	GameState.call(this, gsm, scene);
	this.degToRad = Math.PI / 180.0;

	this.TURN = 1;
	this.BOARD1 = 1;
	this.BOARD2 = 2;
	this.LASTCLICKEDPIECE = 0;
	this.WAITINGFORCLICK = false;

	this.SMALLPIECESP1 = 3;
	this.MEDIUMPIECESP1 = 3;
	this.BIGPIECESP1 = 3;

	this.SMALLPIECESP2 = 3;
	this.MEDIUMPIECESP2 = 3;
	this.BIGPIECESP2 = 3;

	this.boardPieces = [];
	this.BOARDPIECE1 = 1;
	this.BOARDPIECE2 = 2;
	this.BOARDPIECE3 = 3;
	this.BOARDPIECE4 = 4;
	this.BOARDPIECE5 = 5;
	this.BOARDPIECE6 = 6;
	this.BOARDPIECE7 = 7;
	this.BOARDPIECE8 = 8;
	this.BOARDPIECE9 = 9;
	this.generateBoard();

	this.piecesP1 = [];
	this.SMALLPIECEP11 = 10;
	this.SMALLPIECEP12 = 11;
	this.SMALLPIECEP13 = 12;
	this.MEDIUMPIECEP11 = 13;
	this.MEDIUMPIECEP12 = 14;
	this.MEDIUMPIECEP13 = 15;
	this.BIGPIECEP11 = 16;
	this.BIGPIECEP12 = 17;
	this.BIGPIECEP13 = 18;
	this.generatePiecesP1();

	this.piecesP2 = [];
	this.SMALLPIECEP21 = 19;
	this.SMALLPIECEP22 = 20;
	this.SMALLPIECEP23 = 21;
	this.MEDIUMPIECEP21 = 22;
	this.MEDIUMPIECEP22 = 23;
	this.MEDIUMPIECEP23 = 24;
	this.BIGPIECEP21 = 25;
	this.BIGPIECEP22 = 26;
	this.BIGPIECEP23 = 27;
	this.generatePiecesP2();

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
	}
};

PlayGameState.prototype.generateBoard1 = function() {
	this.boardPieces.push(new GamePiece(-1.55, 0.0, -0.9, this.BOARDPIECE1, 'boardPiece', new Cylinder(this.scene, 1.0, 1.0, 0.1, 6, 1)));
	this.boardPieces.push(new GamePiece(0.0, 0.0, -1.8, this.BOARDPIECE2, 'boardPiece', new Cylinder(this.scene, 1.0, 1.0, 0.1, 6, 1)));
	this.boardPieces.push(new GamePiece(1.55, 0.0, -0.9, this.BOARDPIECE3, 'boardPiece', new Cylinder(this.scene, 1.0, 1.0, 0.1, 6, 1)));
	this.boardPieces.push(new GamePiece(-1.55, 0.0, 0.9, this.BOARDPIECE4, 'boardPiece', new Cylinder(this.scene, 1.0, 1.0, 0.1, 6, 1)));
	this.boardPieces.push(new GamePiece(0.0, 0.0, 0.0, this.BOARDPIECE5, 'boardPiece', new Cylinder(this.scene, 1.0, 1.0, 0.1, 6, 1)));
	this.boardPieces.push(new GamePiece(1.55, 0.0, 0.9, this.BOARDPIECE6, 'boardPiece', new Cylinder(this.scene, 1.0, 1.0, 0.1, 6, 1)));
	this.boardPieces.push(new GamePiece(-1.55, 0.0, 2.7, this.BOARDPIECE7, 'boardPiece', new Cylinder(this.scene, 1.0, 1.0, 0.1, 6, 1)));
	this.boardPieces.push(new GamePiece(0.0, 0.0, 1.8, this.BOARDPIECE8, 'boardPiece', new Cylinder(this.scene, 1.0, 1.0, 0.1, 6, 1)));
	this.boardPieces.push(new GamePiece(1.55, 0.0, 2.7, this.BOARDPIECE9, 'boardPiece', new Cylinder(this.scene, 1.0, 1.0, 0.1, 6, 1)));
};

PlayGameState.prototype.generateBoard2 = function() {
	this.boardPieces.push(new GamePiece(-1.55, 0.0, -0.9, this.BOARDPIECE1, 'boardPiece', new Cylinder(this.scene, 1.0, 1.0, 0.1, 6, 1)));
	this.boardPieces.push(new GamePiece(0.0, 0.0, -1.8, this.BOARDPIECE2, 'boardPiece', new Cylinder(this.scene, 1.0, 1.0, 0.1, 6, 1)));
	this.boardPieces.push(new GamePiece(1.55, 0.0, -2.7, this.BOARDPIECE3, 'boardPiece', new Cylinder(this.scene, 1.0, 1.0, 0.1, 6, 1)));
	this.boardPieces.push(new GamePiece(-1.55, 0.0, 0.9, this.BOARDPIECE4, 'boardPiece', new Cylinder(this.scene, 1.0, 1.0, 0.1, 6, 1)));
	this.boardPieces.push(new GamePiece(0.0, 0.0, 0.0, this.BOARDPIECE5, 'boardPiece', new Cylinder(this.scene, 1.0, 1.0, 0.1, 6, 1)));
	this.boardPieces.push(new GamePiece(1.55, 0.0, -0.9, this.BOARDPIECE6, 'boardPiece', new Cylinder(this.scene, 1.0, 1.0, 0.1, 6, 1)));
	this.boardPieces.push(new GamePiece(-1.55, 0.0, 2.7, this.BOARDPIECE7, 'boardPiece', new Cylinder(this.scene, 1.0, 1.0, 0.1, 6, 1)));
	this.boardPieces.push(new GamePiece(0.0, 0.0, 1.8, this.BOARDPIECE8, 'boardPiece', new Cylinder(this.scene, 1.0, 1.0, 0.1, 6, 1)));
	this.boardPieces.push(new GamePiece(1.55, 0.0, 0.9, this.BOARDPIECE9, 'boardPiece', new Cylinder(this.scene, 1.0, 1.0, 0.1, 6, 1)));
};

PlayGameState.prototype.generatePiecesP1 = function() {
	this.piecesP1.push(new GamePiece(-3.5, 0.0, 3.0, this.SMALLPIECEP11, 'smallPiece', new Cylinder(this.scene, 0.2, 0.2, 0.1, 100, 1)));
	this.piecesP1.push(new GamePiece(-4.0, 0.0, 3.0, this.SMALLPIECEP12, 'smallPiece', new Cylinder(this.scene, 0.2, 0.2, 0.1, 100, 1)));
	this.piecesP1.push(new GamePiece(-4.5, 0.0, 3.0, this.SMALLPIECEP13, 'smallPiece', new Cylinder(this.scene, 0.2, 0.2, 0.1, 100, 1)));
	
	this.piecesP1.push(new GamePiece(-3.5, 0.0, 2.2, this.MEDIUMPIECEP11, 'mediumPiece', new Cylinder(this.scene, 0.4, 0.4, 0.1, 100, 1)));
	this.piecesP1.push(new GamePiece(-4.4, 0.0, 2.2, this.MEDIUMPIECEP12, 'mediumPiece', new Cylinder(this.scene, 0.4, 0.4, 0.1, 100, 1)));
	this.piecesP1.push(new GamePiece(-5.3, 0.0, 2.2, this.MEDIUMPIECEP13, 'mediumPiece', new Cylinder(this.scene, 0.4, 0.4, 0.1, 100, 1)));
	
	this.piecesP1.push(new GamePiece(-3.5, 0.0, 1.0, this.BIGPIECEP11, 'bigPiece', new Cylinder(this.scene, 0.6, 0.6, 0.1, 100, 1)));
	this.piecesP1.push(new GamePiece(-4.8, 0.0, 1.0, this.BIGPIECEP12, 'bigPiece', new Cylinder(this.scene, 0.6, 0.6, 0.1, 100, 1)));
	this.piecesP1.push(new GamePiece(-6.1, 0.0, 1.0, this.BIGPIECEP13, 'bigPiece', new Cylinder(this.scene, 0.6, 0.6, 0.1, 100, 1)));
};

PlayGameState.prototype.generatePiecesP2 = function() {
	this.piecesP2.push(new GamePiece(3.5, 0.0, -3.0, this.SMALLPIECEP21, 'smallPiece', new Cylinder(this.scene, 0.2, 0.2, 0.1, 100, 1)));
	this.piecesP2.push(new GamePiece(4.0, 0.0, -3.0, this.SMALLPIECEP22, 'smallPiece', new Cylinder(this.scene, 0.2, 0.2, 0.1, 100, 1)));
	this.piecesP2.push(new GamePiece(4.5, 0.0, -3.0, this.SMALLPIECEP23, 'smallPiece', new Cylinder(this.scene, 0.2, 0.2, 0.1, 100, 1)));
	
	this.piecesP2.push(new GamePiece(3.5, 0.0, -2.2, this.MEDIUMPIECEP21, 'mediumPiece', new Cylinder(this.scene, 0.4, 0.4, 0.1, 100, 1)));
	this.piecesP2.push(new GamePiece(4.4, 0.0, -2.2, this.MEDIUMPIECEP22, 'mediumPiece', new Cylinder(this.scene, 0.4, 0.4, 0.1, 100, 1)));
	this.piecesP2.push(new GamePiece(5.3, 0.0, -2.2, this.MEDIUMPIECEP23, 'mediumPiece', new Cylinder(this.scene, 0.4, 0.4, 0.1, 100, 1)));
	
	this.piecesP2.push(new GamePiece(3.5, 0.0, -1.0, this.BIGPIECEP21, 'bigPiece', new Cylinder(this.scene, 0.6, 0.6, 0.1, 100, 1)));
	this.piecesP2.push(new GamePiece(4.8, 0.0, -1.0, this.BIGPIECEP22, 'bigPiece', new Cylinder(this.scene, 0.6, 0.6, 0.1, 100, 1)));
	this.piecesP2.push(new GamePiece(6.1, 0.0, -1.0, this.BIGPIECEP23, 'bigPiece', new Cylinder(this.scene, 0.6, 0.6, 0.1, 100, 1)));
};

PlayGameState.prototype.update = function(deltaTime) {
	// animacoes
};

PlayGameState.prototype.display = function() {
	this.displayBoard();
	this.displayPiecesP1();
	this.displayPiecesP2();
};

PlayGameState.prototype.displayBoard = function() {
	this.boardPieceTexture.apply();

	for (var i = 0; i < this.boardPieces.length; i++) {
		this.scene.pushMatrix();
			this.scene.translate(this.boardPieces[i].x, this.boardPieces[i].y, this.boardPieces[i].z);
			this.scene.rotate(-90 * this.degToRad, 1, 0, 0);
			this.scene.registerForPick(this.boardPieces[i].id, this.boardPieces[i].primitive);
			this.boardPieces[i].primitive.display();
		this.scene.popMatrix();
	}
};

PlayGameState.prototype.displayPiecesP1 = function() {
	this.piecesP1Texture.apply();

	for (var i = 0; i < this.piecesP1.length; i++) {
		this.scene.pushMatrix();
			this.scene.translate(this.piecesP1[i].x, this.piecesP1[i].y, this.piecesP1[i].z);
			this.scene.rotate(-90 * this.degToRad, 1, 0, 0);
			this.scene.registerForPick(this.piecesP1[i].id, this.piecesP1[i].primitive);
			this.piecesP1[i].primitive.display();
		this.scene.popMatrix();
	}
};

PlayGameState.prototype.displayPiecesP2 = function() {
	this.piecesP2Texture.apply();

	for (var i = 0; i < this.piecesP2.length; i++) {
		this.scene.pushMatrix();
			this.scene.translate(this.piecesP2[i].x, this.piecesP2[i].y, this.piecesP2[i].z);
			this.scene.rotate(-90 * this.degToRad, 1, 0, 0);
			this.scene.registerForPick(this.piecesP2[i].id, this.piecesP2[i].primitive);
			this.piecesP2[i].primitive.display();
		this.scene.popMatrix();
	}
};

PlayGameState.prototype.handleInput = function(pickResults) {
	var ID = pickResults[0][1];
	var currClick = this.pieceClicked(ID);
	var lastClick = this.pieceClicked(this.LASTCLICKEDPIECE);

	if (this.WAITINGFORCLICK == false) {
		this.LASTCLICKEDPIECE = ID;
		this.WAITINGFORCLICK = true;
	} else {
		if (lastClick == 'pieceP1' && currClick == 'boardPiece') {
			console.log('Placing piece');
			this.WAITINGFORCLICK = false;
		} else if (lastClick == 'pieceP2' && currClick == 'boardPiece') {
			console.log('Placing piece');
			this.WAITINGFORCLICK = false;
		} else if (lastClick == 'pieceP1' && currClick == 'pieceP2') {
			console.log('Moving piece');
			this.WAITINGFORCLICK = false;
		} else if (lastClick == 'pieceP2' && currClick == 'pieceP1') {
			console.log('Moving piece');
			this.WAITINGFORCLICK = false;
		} else {
			console.log('Do nothing!');
			this.WAITINGFORCLICK = false;
		}
	}
};

PlayGameState.prototype.pieceClicked = function(ID) {
	if (ID >= 1 && ID <= 9) {
		return 'boardPiece';
	} else if (ID >= 10 && ID <= 18) {
		return 'pieceP1';
	} else if (ID >= 19 && ID <= 27) {
		return 'pieceP2';
	} else {
		return 'invalid';
	}
};