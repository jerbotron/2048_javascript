// Project: 2048 Game
// Author: Jeremy Wang

$(document).ready(function() {
	var gameBoard = new Board();
	var gameStart = true;
	gameBoard.beginGame();

	$('button').click(function() {
		gameBoard.beginGame();
		gameStart = true;
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

var BOARD_LENGTH = 16;
var TILE_WIDTH = 110;
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

//----- Board Class -----//
function Board() {
	this.boardMatrix = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	this.animateDists = [];
	this.numberOfMoves = 0;
};

Board.prototype.beginGame = function() {
	this.clearBoard();
	this.boardMatrix = [0,0,0,0,
						0,0,0,0,
						0,0,0,0,
						0,0,0,0];
	this.numberOfMoves = 0;
	document.getElementsByClassName('moves-counter')[0].innerHTML = 0;
	var t1 = getRandomNumber(BOARD_LENGTH);
	var t2 = getRandomNumber(BOARD_LENGTH);
	while (t2 == t1) { t2 = getRandomNumber(BOARD_LENGTH); }
	this.boardMatrix[t1] = (getRandomNumber(2)+1) * 2;
	this.boardMatrix[t2] = (getRandomNumber(2)+1) * 2;
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
	$('.moving').removeClass('moving');
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

Board.prototype.move = function(direction) {
	var prevMatrix = this.boardMatrix.slice();
	for (var y = 0; y < 4; ++y) {
		var d = [0,0,0,0];
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
		// console.log("row = " + row.toString());
		for (var x = 0; x < 3; ++x) {
			var z = 0;
			if (row[x] == 0) {
				if (z = isNotEmpty(row.slice(x, 4))) {
					var t = [0,0,0,0];
					t = t.slice(0, 4 - x);
					var non_zero_section = row.slice(x + z, 4);
					// console.log("nzs = " + non_zero_section.toString());
					t.splice.apply(t, [0, 4 - x - z].concat(row.slice(x + z, 4)));
					for (var n = 0; n < non_zero_section.length; ++n) {
						if (non_zero_section[n]) {
							// console.log('x = ' + x);
							// console.log('z = ' + z);
							// console.log('n = ' + n);
							d[n + x + z] += z;
						}
					}
					// console.log("d = " + d.toString());
					row.splice.apply(row, [x, 4 - x].concat(t));
				}
				else { break; }
			}
			var j = x + 1;
			while (row[j] == 0 && j < 3) { ++j; }
			if (row[x] == row[j]) {
				row[x] += row[j]
				row[j] = 0;
				// console.log('j = ' + j);
				// console.log('x = ' + x);
				// console.log('z = ' + z);
				d[j] += j - x;
			}

		}
		switch(direction) {
			case 0:
				this.insertRow(this.boardMatrix, y, row);
				this.insertRow(this.animateDists, y, d);
				break;
			case 1:
				this.insertColumn(this.boardMatrix, y, row);
				this.insertColumn(this.animateDists, y, d);
				break;
			case 2:
				this.insertRow(this.boardMatrix, y, row.reverse());
				this.insertRow(this.animateDists, y, d.reverse());
				break;
			case 3:
				this.insertColumn(this.boardMatrix, y, row.reverse());
				this.insertColumn(this.animateDists, y, d.reverse());
				break;
		}
		// this.animateDists.concat(d);
		// this.animateDists = this.animateDists.concat(d);
		// console.log("final d = " + d.toString());
		// console.log(this.animateDists);
	}
	this.printMatrix(this.animateDists);
	// this.animateDists = [];
	if (!this.compareMatrix(prevMatrix)) { 
		this.animateMove(direction);
		++this.numberOfMoves;
		this.getNewTile();
		// this.updateBoard();
	}
}

Board.prototype.animateMove = function(direction) {
	var self = this;
	$('.inner-tile').each(function(index) {
		// if (self.animateDists[index]){
		this.className += ' moving';
		// }
	})
	var obj = this.animateDists;
	$('.moving').each(function(index) {
		var dist = (obj[index] * TILE_WIDTH).toString() + 'px';
		switch(direction) {
			case 0: var param = {'right': dist}; break;
			case 1: var param = {'bottom': dist}; break;
			case 2: var param = {'left': dist}; break;
			case 3: var param = {'top': dist}; break;
		}
		$(this).animate(param, 'slow');
	});
	var wait = function() {
		var n = $('.moving').queue('fx');
		if (n == 0) { 
			clearTimeout(t);
			console.log("done animations");
			// self.animateDists = [];
			self.resetTilePositions(direction);
			self.updateBoard();		
		}
		else {
			var t = setTimeout(wait, 100);
		}
	}
	wait();
}

Board.prototype.getMoveDistances = function(arr) {
	console.log(arr.toString());
	var d = [0,0,0,0];
	var matched = 0;
	for (var i = 0; i < 3; ++i) {
		var f = arr[i];
		if (f) {
			for (var j = i+1; j < 4; ++j) {
				var c = arr[j];
				if (c == f && !matched) { 
					d[j] += 1;
					matched = 1;
					arr[j] = 0;
					arr[i] *= 2;
				}
				else if (arr[j-1] == 0 && c) {
					d[j] += 1;
				}
			}
			if (matched) {
				++i;
			}
		}
		else {
			for (var j = i+1; j < 4; ++j) {
				if (arr[j]) {
					d[j] += 1;
				}
			}
		}
	}
	console.log(d.toString());
	return arr;
}

Board.prototype.resetTilePositions = function(direction) {
	$('.moving').each(function() {
		switch(direction) {
			case 0: 
				$(this).css('right', "");
				break;
			case 1:
				$(this).css('bottom', "");
				break;
			case 2: 
				$(this).css('left', "");
				break;
			case 3:
				$(this).css('top', "");
				break;
		}
	});
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

Board.prototype.insertColumn = function(m, c, newColumn) {
	for (var i = 0; i < 4; ++i) {
		m[c + 4 * i] = newColumn[i];
	}
}

Board.prototype.getRow = function(r) {
	return this.boardMatrix.slice(4 * r, 4 + 4 * r)
}

Board.prototype.insertRow = function(m, r, newRow) {
	m.splice.apply(m, [4 * r, 4].concat(newRow));
}

Board.prototype.printMatrix = function(m) {
	console.log('---');
	console.log(m.slice(0,4));
	console.log(m.slice(4,8));
	console.log(m.slice(8,12));
	console.log(m.slice(12,16));
}
//----- Board Class end -----//