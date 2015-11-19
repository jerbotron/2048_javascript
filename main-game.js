// Project: 2048 Game
// Author: Jeremy Wang

$(document).ready(function() {
	var gameBoard = new Board();
	var gameStart = false;

	$('button').click(function() {
		gameBoard.beginGame();
		gameBoard.printBoard();
		gameStart = true;
	});

	$(document).keydown(function(event) {
		if (gameStart) {
	    	switch(event.which) {
	    		case 37: 							// left
	    		console.log("left pressed");
	    		gameBoard.move(0);
	    		break;

	    		case 38: 							// up
	    		console.log("up pressed");
	    		gameBoard.move(1);
	    		break;

	    		case 39: 							// right
	    		console.log("right pressed");
	    		gameBoard.move(2);
	    		break;

	    		case 40: 							// down
	    		console.log("down pressed");
	    		gameBoard.move(3);
	    		break;

	    		default: return;
	    	}
	    	gameBoard.printBoard();
	    }
	});
});

var colorHash = {
	0: '#CDC1B4',
	2: '#EEE4DA',
	4: '#EDE0C8',
	8: '#F2B179',
	16: '#F59563',
	32: '#F67C5F',
	64: '#F65E3B',
	128: '#EDCF72',
	256: '#EDCC61',
	512: '#EDC850',
	1024: '#EDC53F',
	2048: '#EDC255'
};

var getRandomNumber = function(n) {
	return Math.floor(Math.random() * n);
};

//----- Board Class -----//
function Board() {
	this.boardMatrix = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	this.prev_boardMatrix = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	this.numOfMoves = 0;
};

Board.prototype.printBoard = function() {
	console.log(this.boardMatrix.slice(0,4));
	console.log(this.boardMatrix.slice(4,8));
	console.log(this.boardMatrix.slice(8,12));
	console.log(this.boardMatrix.slice(12,16));
	// for (var y = 0; y < 4; ++y) {
	// 	console.log(this.boardMatrix.slice(0*y,4*(y+1)));
	// }
}

Board.prototype.clearBoard = function() {
	var children = document.getElementsByClassName('inner')[0].children;
	for (var i = 0; i < children.length; ++i) {
		children[i].firstChild.innerHTML = '';
		children[i].firstChild.style.backgroundColor = colorHash[0];
	};
};

Board.prototype.updateBoard = function() {
	console.log("updating board");
	this.clearBoard();
	for (var i = 0; i < this.boardMatrix.length; ++i) {
		if (this.boardMatrix[i] != 0) {
			this.updateTile(i);
		}
	}
};

Board.prototype.updateTile = function(tile_number) {
	var children = document.getElementsByClassName('inner')[0].children;
	var tile = children[tile_number].firstChild;
	// if (tile.innerHTML == '') { var n = (getRandomNumber(2)+1) * 2;}
	// else { var n = tile.innerHTML * 2; }
	var n = this.boardMatrix[tile_number];
	tile.style.backgroundColor = colorHash[n];
	if (n > 4) {
		console.log("white");
		tile.style.color = 'white';
	}
	if (n > 1000) {
		tile.style.fontSize = '38px';
	}
	else if (n > 100) {
		tile.style.fontSize = '42px';
	}
	tile.innerHTML = n;
};

Board.prototype.beginGame = function() {
	this.clearBoard();
	this.boardMatrix = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var t1 = getRandomNumber(16);
	var t2 = getRandomNumber(16);
	while (t2 == t1) { t2 = getRandomNumber(16); }
	this.boardMatrix[t1] = (getRandomNumber(2)+1) * 2;
	this.boardMatrix[t2] = (getRandomNumber(2)+1) * 2;
	this.updateTile(t1);
	this.updateTile(t2);
};

Board.prototype.move = function(direction) {
	var temp = this.boardMatrix;
	switch(direction) {
		case 0:
			console.log("moving left");
			for (var y = 0; y < 4; ++y) {
				for (var x = 0; x < 3; ++x) {
					var count = 0;
					while (this.boardMatrix[x + 4 * y] == 0) {
						for (var z = x; z < 3; ++z) {
							this.boardMatrix[z + 4 * y] = this.boardMatrix[(z + 1) + 4 * y];
							this.boardMatrix[(z + 1) + 4 * y] = 0;
						}
						if (count == 4 - x) { break; }
						++count;
					}

					var j = x + 1;

					while (this.boardMatrix[j + 4 * y] == 0 && j < 3) { ++j; }

					if (this.boardMatrix[x + 4 * y] == this.boardMatrix[j + 4 * y]) {
						this.boardMatrix[x + 4 * y] += this.boardMatrix[j + 4 * y]
						this.boardMatrix[j + 4 * y] = 0;
					}
				}
			} break;

		case 1:
			console.log("moving up");
			for (var x = 0; x < 4; ++x) {
				for (var y = 0; y < 3; ++y) {
					var count = 0;
					while (this.boardMatrix[x + 4 * y] == 0) {
						for (var z = y; z < 3; ++z) {
							this.boardMatrix[x + 4 * z] = this.boardMatrix[x + 4 * (z + 1)];
							this.boardMatrix[x + 4 * (z + 1)] = 0;
						}
						if (count == 4 - y) { break; }
						++count;
					}

					var j = y + 1;

					while (this.boardMatrix[x + 4 * j] == 0 && j < 3) { ++j; }

					if (this.boardMatrix[x + 4 * y] == this.boardMatrix[x + 4 * j]) {
						this.boardMatrix[x + 4 * y] += this.boardMatrix[x + 4 * j]
						this.boardMatrix[x + 4 * j] = 0;
					}
				}
			} break;

		case 2:
			console.log("moving right");
			for (var y = 0; y < 4; ++y) {
				for (var x = 3; x > 0; --x) {
					var count = 0;
					while (this.boardMatrix[x + 4 * y] == 0) {
						for (var z = x; z > 0; --z) {
							this.boardMatrix[z + 4 * y] = this.boardMatrix[(z - 1) + 4 * y];
							this.boardMatrix[(z - 1) + 4 * y] = 0;
						}
						if (count == x - 1) { break; }
						++count;
					}

					var j = x - 1;

					while (this.boardMatrix[j + 4 * y] == 0 && j > 0) { --j; }

					if (this.boardMatrix[x + 4 * y] == this.boardMatrix[j + 4 * y]) {
						this.boardMatrix[x + 4 * y] += this.boardMatrix[j + 4 * y]
						this.boardMatrix[j + 4 * y] = 0;
					}
				}
			} break;

		case 3:
			console.log("moving down");
			for (var x = 0; x < 4; ++x) {
				for (var y = 3; y > 0; --y) {
					var count = 0;
					while (this.boardMatrix[x + 4 * y] == 0) {
						for (var z = y; z > 0; --z) {
							this.boardMatrix[x + 4 * z] = this.boardMatrix[x + 4 * (z - 1)];
							this.boardMatrix[x + 4 * (z - 1)] = 0;
						}
						if (count == y - 1) { break; }
						++count;
					}

					var j = y - 1;

					while (this.boardMatrix[x + 4 * j] == 0 && j > 0) { --j; }

					if (this.boardMatrix[x + 4 * y] == this.boardMatrix[x + 4 * j]) {
						this.boardMatrix[x + 4 * y] += this.boardMatrix[x + 4 * j]
						this.boardMatrix[x + 4 * j] = 0;
					}
				}
			} break;
	}

	this.updateBoard();

}
//----- Board Class end -----//