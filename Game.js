var state = "p1 turn"
var turn = 1;
var board = new Array(3);
for (var i = 0; i < 3; i++) { board[i] = new Array(3)};

var playerChars = [];
playerChars[1] = 'X';
playerChars[2] = 'O';

ai = true;
randoP1 = true;

verbose = true;

// Log moves
var logCol = new Array(9);
var logRow = new Array(9);


// Always-lose AI turn
/*

A new approach.

The P2 AI is going to log every past game and make its decisions based on that information.
To do:
1. Storage of past games
2. Log of complete search space of 255,168 games (maybe not necessary?)
3. AI decisionmaking engine based on previous games

*/
function losingAIturn() {
	
	
}

// Run random tests until a non-win is found
function randoP1Turn() {
	// Create test board
	var tb1 = new Array(3);
	for (var k=0; k<3; k++) {
		tb1[k] = board[k].slice();
	}
	
	var openCol = new Array(9);
	var openRow = new Array(9);
	var openCount = 0;
	
	for (var i=0; i<9; i++) {
		
		openCol[i] =  findOpenCol(tb1);
		openRow[i] =  findOpenRow(tb1);
		
		try {
			tb1[openCol[i]][openRow[i]] = true;
		}
		catch (err) {
			break;
		}
		
		openCount++;

	}
	
	// Randomly choose number
	var rand = Math.floor(openCount*Math.random());
	
	pcTurn(openCol[rand] + 3*openRow[rand],1);
}

// Find open cell of arbirary board using coordinates
function findOpenRow(brd) {
	for (var col = 0; col < 3; col++){
		for (var row = 0; row < 3; row++){
			if (!brd[col][row]) {
				return row;
			}
		}
	}
}
function findOpenCol(brd) {
	for (var col = 0; col < 3; col++){
		for (var row = 0; row < 3; row++){
			if (!brd[col][row]) {
				return col;
			}
		}
	}
}

// Find open cell on rendered board
// I really should skip the 0-8 id thing and use coords exclusively
function findOpenCell(startingCell) {
	for (var i = startingCell; i < 9; i++) {
		if($("#" + i).text() == "") {
			return i;
		}
	}
	return -1;
}

// player's turn
// Actually, now the mechanism for every turn
function pcTurn(cell, player) {
	
	if($("#" + cell).text() == "") {
		var col = cell%3;
		var row = Math.floor(cell/3);
		board[col][row] = player;
		
		if (verbose) {
		console.log("Move: " + col + "," + row);
		}
		
		// Update displayed board to match board array
		for (var i = 0; i < 3; i++) {
			for (var j = 0; j < 3; j++) {
				// Get cell number from array
				var cellNum = i + 3*j;
				
				// Print to cell
				$("#" + cellNum).text(playerChars[board[i][j]]);
			}
		}
								
		logCol[turn-1] = col;
		logRow[turn-1] = row;
		
		resolveTurn(col, row, player);
	} else {
		console.log("Cell taken");
		return false;
	}
		
};

// Checks for winning board based on given move
// Returns winner, else 0
function checkWin(brd, col, row) {
	
	// check in row
	if (brd[0][row] == brd[col][row] &&
		brd[1][row] == brd[col][row] &&
		brd[2][row] == brd[col][row]) {
		return brd[col][row];
	}
	
	// check in column
	else if (brd[col][0] == brd[col][row] &&
		brd[col][1] == brd[col][row] &&
		brd[col][2] == brd[col][row]) {
		return brd[col][row];
	}
	
	// check diagonal
	else if (brd[0][2] == brd[col][row] &&
		brd[1][1] == brd[col][row] &&
		brd[2][0] == brd[col][row]) {
		return brd[col][row];
	}
	
	// check anti diagonal
	else if (brd[0][0] == brd[col][row] &&
		brd[1][1] == brd[col][row] &&
		brd[2][2] == brd[col][row]) {
		return brd[col][row];
	} 
	// no winner
	else {
		return 0;
	}
}

function resolveTurn(col, row, player) {
	// check for win
	var winner = checkWin(board, col, row);
	if (winner != 0) {
		endGame(winner);
	} 
	// check draw
	else if (turn >= 9) {
		endGame(0);
	} 
	
	// Continue Playing
	else {
		var nextplayer = 1 + player%2;
		state = "p" + nextplayer + " turn";
		turn++;
		
		if (verbose) {
			console.log("Turn: " + turn);
		}
		
		//start AI turn
		if (ai == true && nextplayer == 2) {
			losingAIturn();
		};
		
		//start AI turn
		if (randoP1 == true && nextplayer == 1) {
			randoP1Turn();
		};
	};
};

function endGame(winningPlayer) {
	state = "end";
	
	if (winningPlayer != 0) {
		console.log("Player " + winningPlayer + " wins!");
		
	} else {
		console.log("Draw!");
	}
	
	if (randoP1 && winningPlayer != 1) {
		console.log("Here are the moves that lead to this:");
		console.log(logCol);
		console.log(logRow);
	} else if (randoP1 && winningPlayer == 1) {
		resetBoard();
		randoP1Turn();
	}
	
};

// Wipe the board
function resetBoard(brd) {
	brd = brd || board;
	
	for (var col = 0; col < 3; col++){
		for (var row = 0; row < 3; row++){
			brd[col][row] = null;
		}
	}
	
	for (var i=0; i<9; i++) {
		$("#" + i).text('');
	}
	
	turn = 1;
	var state = "p1 turn"
}



// Code to run
$( document ).ready(function() {
	
	if (randoP1) {
		randoP1Turn();
	}
	
	// click on cell event
	$( ".cell" ).click(function(){
		if (verbose) {
			console.log("State: " + state);
		}
		
		// if Player 1's turn
		switch(state) {
			case "p1 turn":
				if (randoP1 == false) {
					pcTurn($(this).attr('id'),1);
				}
				break;
			case "p2 turn":
				if (ai == false) {
					pcTurn($(this).attr('id'),2);
				};
				break;
		};
	});
		
});