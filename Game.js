var state = "p1 turn"
var turn = 1;
var board = new Array(3);
for (var i = 0; i < 3; i++) { board[i] = new Array(3)};

ai = true;


// Always-lose AI turn
/*
P1 =  player 1 move
P2 =  AI move

Turn 2 (first AI turn): corner not bordering P1
Turn 4: Open side bordering P2
Turn 6: Cell that results in three winnable spots (and also doesn't get 3 in a row)
Turn 8: Any open cell
Turn 10: ???


*/
function losingAIturn() {
	
	// find open corner
	if (turn == 2) {
		if (!board[0][0] && !board[1][0] && !board[0][1]) {
			pcTurn(0, 2);
		} else if (!board[2][0] && !board[1][0] && !board[2][1]) {
			pcTurn(2, 2);
		} else if (!board[2][2] && !board[1][2] && !board[2][1]) {
			pcTurn(8, 2);
		} else if (!board[0][2] && !board[0][1] && !board[1][2]) {
			pcTurn(2, 2); // won't happen lol
		};
	} 
	// find open side next to corner
	else if (turn == 4) {
		if (board[0][0] == 2) {
			if (!board[1][0]) {
				pcTurn(1, 2);
			} else {
				pcTurn(3, 2);
			}
		} else if (board[2][0] == 2) {
			if (!board[1][0]) {
				pcTurn(1, 2);
			} else {
				pcTurn(5, 2);
			}
		} else if (board[2][2] == 2) {
			if (!board[1][2]) { 
				pcTurn(7, 2);
			} else {
				pcTurn(5, 2);
			}
		} else if (board[0][2] == 2) {
			if (!board[1][2]) {
				pcTurn(7, 2);
			} else {
				pcTurn(3, 2);
			};
		};
	}
	// Turn 6
	/* 
	One algorithm:
	1. P2 in next empty cell
	2. P2, P1 and P1 in remaining empty cells
	3. Repeat 2 for each combination of moves in thos three cells
	3a. If there are two P1 winning states and no P2 winning states in the three,
	then P2 chooses cell from 1
	3b. Else return to 1 with next next empty cell
	*/
	else if (turn == 6){
	
		// initialize test vars	
		var openCol = new Array(4);
		var openRow = new Array(4);

		// Find open cells
		// First, make a copy of the board
		var tb1 = new Array(3);
		for (var k=0; k<3; k++) {
			tb1[k] = board[k].slice();
		}
		
		// Then record and fill the cells
		for (i=0; i<4; i++) {

			openCol[i] = findOpenCol(tb1);
			openRow[i] = findOpenRow(tb1);
			tb1[openCol[i]][openRow[i]] = 3; // doesn't matter what this is
			
		}
		
		// run algorithm
		for (j=0; j<4; j++) {
			
			// Initialize Win/loss counts for P2
			var P2wins = 0;
			var P2losses = 0;

			// Create new test board
			var tb2 = new Array(3);
			for (var k=0; k<3; k++) {
				tb2[k] = board[k].slice();
			}

			// Set P2 move location
			tb2[openCol[j%4]][openRow[j%4]] = 2;
			
			
			// Find open cells from the new board
			var testCol = new Array(3);
			var testRow = new Array(3);
			
			// Create new test board from tb2
			var tb3 = new Array(3);
			for (var k=0; k<3; k++) {
				tb3[k] = tb2[k].slice();
			}
			
			// Then record and fill the cells
			for (i=0; i<3; i++) {

				testCol[i] = findOpenCol(tb3);
				testRow[i] = findOpenRow(tb3);
				tb3[testCol[i]][testRow[i]] = 3; // doesn't matter what this is
			}

			for (i=0; i<3; i++) {

				// Create new test board from tb2
				// This board will be a completed board that contains a possible finish
				var tb4 = new Array(3);
				for (var k=0; k<3; k++) {
					tb4[k] = tb2[k].slice();
				}

				// Set P2 move location
				tb4[testCol[i%3]][testRow[i%3]] = 2;
				// Set P1 move locations
				tb4[testCol[(i+1)%3]][testRow[(i+1)%3]] = 1;
				tb4[testCol[(i+2)%3]][testRow[(i+2)%3]] = 1;
				
				// Test moves for wins/losses
				for (var k=0; k<3; k++) {
					var win = checkWin(tb4, testCol[k], testRow[k]);
					
					if (win == 2) {
						P2wins += 1;
						break;
					} else if (win == 1) {
						P2losses += 1;
						break;
					}
				}
			}
						
			// Check t6 move loss and two wins here?
			if (checkWin(tb2, openCol[j%4], openRow[j%4]) != 2 & P2losses >= 2){
				console.log(openCol[j%4] + ' ' + openRow[j%4]);
				
				// Move there
				// Ugh still using 0-8 system
				pcTurn(openCol[j%4] + 3*openRow[j%4], 2);
				break;	
			}
		}
	} 
	
	// Turn 8
	// Easy peasy. Look for the spot that doesn't result in a loss
	else if (turn == 8){
		
		// Create test board
		var tb1 = new Array(3);
		for (var k=0; k<3; k++) {
			tb1[k] = board[k].slice();
		}
		
		// Try the first open spot
		var openCol = findOpenCol(tb1);
		var openRow = findOpenRow(tb1);
		
		console.log(openCol + ' ' + openRow);
		
		tb1[openCol][openRow] = 2;
		
		if (checkWin(tb1, openCol, openRow) != 2) {
			// Go there
			pcTurn(openCol + 3*openRow, 2);
		} else {
			// find the next open spot
			openCol = findOpenCol(tb1);
			openRow = findOpenRow(tb1);
			
			// Go there
			pcTurn(openCol + 3*openRow, 2);
		}
	}
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
		console.log("Move: " + col + "," + row);
		
		// Update displayed board to match board array
		for (var i = 0; i < 3; i++) {
			for (var j = 0; j < 3; j++) {
				// Get cell number from array
				var cellNum = i + 3*j;
				
				// Print to cell
				$("#" + cellNum).text(board[i][j]);
			}
		}
								
		// moved to resolveTurn() 
		/*var nextplayer = 1 + player%2;
		state = "p" + nextplayer + " turn";
		turn++;*/
		
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
		
		//start AI turn
		if (ai == true && nextplayer == 2) {
			console.log("Turn: " + turn);
			losingAIturn();
		};
	};
};

function endGame(winningPlayer) {
	state = "end";
	
	if (winningPlayer != 0) {
		console.log("Player " + winningPlayer + " wins!");
	} else {
		console.log("Draw!");
	};	
};


// Code to run
$( document ).ready(function() {
	
	// click on cell event
	$( ".cell" ).click(function(){
		console.log("State: " + state);
		// if Player 1's turn
		switch(state) {
			case "p1 turn":
				pcTurn($(this).attr('id'),1);
				break;
			case "p2 turn":
				if (ai == false) {
					pcTurn($(this).attr('id'),2);
				};
				break;
		};
	});
		
});