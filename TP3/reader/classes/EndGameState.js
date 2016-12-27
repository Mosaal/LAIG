function EndGameState(gsm, scene) {
	GameState.call(this, gsm, scene);
	this.degToRad = Math.PI / 180.0;

	this.digits = [];
	this.pointsP1Left = 0;
	this.pointsP2Left = 0;
	this.pointsP1Right = 0;
	this.pointsP2Right = 0;
	this.minLeftIndex = 0;
	this.minRightIndex = 0;
	this.secLeftIndex = 0;
	this.secRightIndex = 0;

	this.generateDigits();
	this.generateTimer();
	this.generatePoints();

	this.infoPlane = new Plane(this.scene, 2, 0.5, 50, 50);
	this.gameOverBoard = new Plane(this.scene, 5, 3, 50, 50);
	this.smallBoard = new Plane(this.scene, 0.1, 0.3, 50, 50);

	this.gameOverTexture = new CGFappearance(this.scene);
	this.gameOverTexture.loadTexture("images/gameOver.png");

	this.winnerTexture = new CGFappearance(this.scene);
	if (this.gsm.gameInfo.pointsP1 > this.gsm.gameInfo.pointsP2)
		this.winnerTexture.loadTexture("images/winnerP1.png");
	else if (this.gsm.gameInfo.pointsP2 > this.gsm.gameInfo.pointsP1)
		this.winnerTexture.loadTexture("images/winnerP2.png");

	this.totalTimeTexture = new CGFappearance(this.scene);
	this.totalTimeTexture.loadTexture("images/totalTime.png");

	this.pointsP1Texture = new CGFappearance(this.scene);
	this.pointsP1Texture.loadTexture("images/pointsP1.png");

	this.pointsP2Texture = new CGFappearance(this.scene);
	this.pointsP2Texture.loadTexture("images/pointsP2.png");

	this.colonTexture = new CGFappearance(this.scene);
	this.colonTexture.loadTexture("images/colon.png");
}

EndGameState.prototype = Object.create(GameState.prototype);
EndGameState.prototype.constructor = EndGameState;

EndGameState.prototype.generateDigits = function() {
	for (var i = 0; i < 10; i++) {
		var temp = new CGFappearance(this.scene);
		temp.loadTexture("images/" + i + ".png");
		this.digits.push(temp);
	}
};

EndGameState.prototype.generateTimer = function() {
	var outMin = [], outSec = [];
	var min = Math.floor(this.gsm.gameInfo.elapsedTime / 60);
	var sec = Math.floor(this.gsm.gameInfo.elapsedTime % 60);
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

EndGameState.prototype.generatePoints = function() {
	var outPointsP1 = [], outPointsP2 = [];
	var pointsP1Str = this.gsm.gameInfo.pointsP1.toString();
	var pointsP2Str = this.gsm.gameInfo.pointsP2.toString();

	for (var i = 0; i < pointsP1Str.length; i++)
		outPointsP1.push(pointsP1Str[i]);

	for (var i = 0; i < pointsP2Str.length; i++)
		outPointsP2.push(pointsP2Str[i]);

	if (outPointsP1.length > 1) {
		this.pointsP1Left = parseInt(outPointsP1[0]);
		this.pointsP1Right = parseInt(outPointsP1[1]);
	} else {
		this.pointsP1Left = 0;
		this.pointsP1Right = parseInt(outPointsP1[0]);
	}

	if (outPointsP2.length > 1) {
		this.pointsP2Left = parseInt(outPointsP2[0]);
		this.pointsP2Right = parseInt(outPointsP2[1]);
	} else {
		this.pointsP2Left = 0;
		this.pointsP2Right = parseInt(outPointsP2[0]);
	}
};

EndGameState.prototype.update = function(deltaTime) {};

EndGameState.prototype.display = function() {};

EndGameState.prototype.displayHUD = function() {
	this.scene.pushMatrix();
		this.scene.translate(0.0, 0.0, -4.0);
		this.scene.rotate(-180 * this.degToRad, 0, 0, 1);
		this.gameOverTexture.apply();
		this.gameOverBoard.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(0.0, 0.52, -4.0);
		this.scene.rotate(-180 * this.degToRad, 0, 0, 1);
		this.winnerTexture.apply();
		this.infoPlane.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(-0.35, 0.0, -4.0);
		this.scene.rotate(-180 * this.degToRad, 0, 0, 1);
		this.totalTimeTexture.apply();
		this.infoPlane.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(0.4, 0.0, -4.0);
		this.scene.rotate(-180 * this.degToRad, 0, 0, 1);
		this.digits[this.minLeftIndex].apply();
		this.smallBoard.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(0.5, 0.0, -4.0);
		this.scene.rotate(-180 * this.degToRad, 0, 0, 1);
		this.digits[this.minRightIndex].apply();
		this.smallBoard.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(0.6, 0.0, -4.0);
		this.scene.rotate(-180 * this.degToRad, 0, 0, 1);
		this.colonTexture.apply();
		this.smallBoard.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(0.7, 0.0, -4.0);
		this.scene.rotate(-180 * this.degToRad, 0, 0, 1);
		this.digits[this.secLeftIndex].apply();
		this.smallBoard.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(0.8, 0.0, -4.0);
		this.scene.rotate(-180 * this.degToRad, 0, 0, 1);
		this.digits[this.secRightIndex].apply();
		this.smallBoard.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(-0.2, -0.52, -4.0);
		this.scene.rotate(-180 * this.degToRad, 0, 0, 1);
		this.pointsP1Texture.apply();
		this.infoPlane.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(0.35, -0.52, -4.0);
		this.scene.rotate(-180 * this.degToRad, 0, 0, 1);
		this.digits[this.pointsP1Left].apply();
		this.smallBoard.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(0.45, -0.52, -4.0);
		this.scene.rotate(-180 * this.degToRad, 0, 0, 1);
		this.digits[this.pointsP1Right].apply();
		this.smallBoard.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(-0.2, -1.04, -4.0);
		this.scene.rotate(-180 * this.degToRad, 0, 0, 1);
		this.pointsP2Texture.apply();
		this.infoPlane.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(0.4, -1.04, -4.0);
		this.scene.rotate(-180 * this.degToRad, 0, 0, 1);
		this.digits[this.pointsP2Left].apply();
		this.smallBoard.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(0.5, -1.04, -4.0);
		this.scene.rotate(-180 * this.degToRad, 0, 0, 1);
		this.digits[this.pointsP2Right].apply();
		this.smallBoard.display();
	this.scene.popMatrix();
};

EndGameState.prototype.handleInput = function(pickResults) {
	if (pickResults[0][1] >= 300) {
		console.error("The selection of this Object is ignored!");
		return;
	}
};