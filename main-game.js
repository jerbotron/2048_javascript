// Project: 2048 Game
// Author: Jeremy Wang

$(document).ready(function() {
	var gameBoard = new Board();
	var gameStart = true;
	gameBoard.beginGame();

	$('button').click(function() {
		// for (var i = 0; i<2; ++ i) {
		// 	if (i == 0) {
		// 		$('.moving:eq(0)').animate({left: '110px'});
		// 	}
		// 	else {
		// 		$('.moving:eq(1)').animate({left: '220px'});
		// 	}
		// }
		// $('.moving').removeClass('moving');
		// gameBoard.animateMove(0);
		gameBoard.animateMove(0);
		// gameBoard.beginGame();
		// gameStart = true;
	});

	$(document).keydown(function(event) {
		if (gameStart) {
	    	switch(event.which) {
	    		case 37: 							// left
	    			gameBoard.move(0);
	    			break;
	    		case 38: 							// up
		    		gameBoard.move(1);
		    		break;
	    		case 39: 							// right
		    		gameBoard.move(2);
		    		break;
	    		case 40: 							// down
		    		gameBoard.move(3);
		    		break;
	    		default: break;;
	    	}
	    	document.getElementsByClassName('moves-counter')[0].innerHTML = gameBoard.numberOfMoves;
	    	// gameBoard.printMatrix(gameBoard.boardMatrix);
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

var isNotEmpty = function(arr) {
	var l = arr.length;
	for (var i = 0; i < l; ++i) {
		if (arr[i] != 0) { return i; }
	}
	return false;
};

var BOARD_LENGTH = 16;
var TILE_WIDTH = 110;

//----- Board Class -----//
function Board() {
	this.boardMatrix = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	this.numberOfMoves = 0;
	this.animations = {
		2: 1,
		6: 2
	};
};

Board.prototype.beginGame = function() {
	this.clearBoard();
	this.boardMatrix = [0,0,2,0,
						0,0,2,0,
						0,0,0,0,
						0,0,0,0];
	this.numberOfMoves = 0;
	document.getElementsByClassName('moves-counter')[0].innerHTML = 0;
	// var t1 = getRandomNumber(BOARD_LENGTH);
	// var t2 = getRandomNumber(BOARD_LENGTH);
	// while (t2 == t1) { t2 = getRandomNumber(BOARD_LENGTH); }
	// this.boardMatrix[t1] = (getRandomNumber(2)+1) * 2;
	// this.boardMatrix[t2] = (getRandomNumber(2)+1) * 2;
	this.updateBoard();
};

Board.prototype.clearBoard = function() {
	var children = document.getElementsByClassName('board')[0].children;
	for (var i = 0; i < children.length; ++i) {
		children[i].firstChild.innerHTML = '';
		children[i].firstChild.style.backgroundColor = colorHash[0];
	};
};

Board.prototype.updateBoard = function() {
	this.clearBoard();
	for (var i = 0; i < BOARD_LENGTH; ++i) {
		if (this.boardMatrix[i] != 0) {
			this.updateTile(i);
		}
	}
};

Board.prototype.updateTile = function(tileNumber) {
	var children = document.getElementsByClassName('board')[0].children;
	var tile = children[tileNumber].firstChild;
	var n = this.boardMatrix[tileNumber];
	if (n != 0) {
		tile.className += " moving";
	}
	tile.style.backgroundColor = colorHash[n];
	if (n > 4) { tile.style.color = 'white'; }
	else { tile.style.color = '#776E65'; }
	if (n > 1000) { tile.style.fontSize = '38px'; }
	else if (n > 100) {	tile.style.fontSize = '42px'; }
	tile.innerHTML = n;
};

Board.prototype.getNewTile = function() {
	var empty_tile_positions = [];
	for (var i = 0; i < BOARD_LENGTH; ++i) {
		if (this.boardMatrix[i] == 0) { empty_tile_positions.push(i); }
	}
	
	if (empty_tile_positions.length == 0) { return; }

	var new_pos = empty_tile_positions[getRandomNumber(empty_tile_positions.length)];
	var new_val = (getRandomNumber(2)+1) * 2;

	this.boardMatrix[new_pos] = new_val;
}

Board.prototype.animateMove = function(dir) {
	var obj = this.animations;
	$('.moving').each(function(index) {
		var dist = (obj[Object.keys(obj)[index]] * TILE_WIDTH).toString() + 'px';
		switch(dir) {
			case 0: var param = {'right': dist}; break;
			case 1: var param = {'bottom': dist}; break;
			case 2: var param = {'left': dist}; break;
			case 3: var param = {'top': dist}; break;
		}
		$(this).animate(param);
	});
	var self = this;
	var wait = function() {
		var n = $('.moving').queue('fx');
		if (n == 0) { 
			clearTimeout(t);
			console.log("done animations");
			self.animations = {};
			$('.moving').removeClass('moving');
			self.boardMatrix = [0,2,0,0,
								2,0,0,0,
								0,0,0,0,
								0,0,0,0];
			self.updateBoard();
		}
		else {
			var t = setTimeout(wait, 100);
		}
	}
	wait();
}

Board.prototype.move = function(direction) {
	var prevMatrix = this.boardMatrix.slice();
	for (var y = 0; y < 4; ++y) {
		switch(direction) {
			case 0:
				var row = this.getRow(y);
				break;
			case 1:
				var row = this.getColumn(y);
				break;
			case 2:
				var row = this.getRow(y).reverse();
				break;
			case 3:
				var row = this.getColumn(y).reverse();
				break;
		}
		for (var x = 0; x < 3; ++x) {
			if (row[x] == 0) {
				if (z = isNotEmpty(row.slice(x, 4))) {
					var t = [0,0,0,0];
					t = t.slice(0, 4 - x);
					t.splice.apply(t, [0, 4 - x - z].concat(row.slice(x + z, 4)));
					row.splice.apply(row, [x, 4 - x].concat(t));
				}
				else { break; }
			}
			var j = x + 1;
			while (row[j] == 0 && j < 3) { ++j; }
			if (row[x] == row[j]) {
				row[x] += row[j]
				row[j] = 0;
			}
		}
		switch(direction) {
			case 0:
				this.insertRow(y, row);
				break;
			case 1:
				this.insertColumn(y, row);
				break;
			case 2:
				this.insertRow(y, row.reverse());
				break;
			case 3:
				this.insertColumn(y, row.reverse());
				break;
		}
	}
	if (!this.compareMatrix(prevMatrix)) { 
		this.getNewTile();
		this.updateBoard();
		++this.numberOfMoves;
	}
}

Board.prototype.compareMatrix = function(m) {
	if (m.length != BOARD_LENGTH) { return false; }
	for (var i = 0; i < BOARD_LENGTH; ++i) {
		if (this.boardMatrix[i] != m[i]) { return false; }
	}
	return true;
}

Board.prototype.isFull = function() {
	for (var i = 0; i < BOARD_LENGTH; ++i) {
		if (this.boardMatrix[i] == 0) { return false; }
	}
	return true;
}

Board.prototype.getColumn = function(c) {
	var arr = [];
	for (var i = 0; i < BOARD_LENGTH; i+=4) {
		arr.push(this.boardMatrix[i + c]);
	}
	return arr;
}

Board.prototype.insertColumn = function(c, newColumn) {
	for (var i = 0; i < 4; ++i) {
		this.boardMatrix[c + 4 * i] = newColumn[i];
	}
}

Board.prototype.getRow = function(r) {
	return this.boardMatrix.slice(4 * r, 4 + 4 * r)
}

Board.prototype.insertRow = function(r, newRow) {
	this.boardMatrix.splice.apply(this.boardMatrix, [4 * r, 4].concat(newRow));
}

Board.prototype.printMatrix = function(m) {
	console.log('---');
	console.log(m.slice(0,4));
	console.log(m.slice(4,8));
	console.log(m.slice(8,12));
	console.log(m.slice(12,16));
}
//----- Board Class end -----//