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
	// 1. find empty cell
	// 2. test if any two P1 moves will result in loss
	// 3. if false, repeat
	else if (turn == 6){
		
		for (var i = findOpenCell(0); i < 9; i++)  {
			
			// 1. Find empty cell
			var openCell = findOpenCell(i);
			var col = openCell%3;
			var row = Math.floor(openCell/3);
			console.log(col + " " + row);
			
			// 2. Test if any two P1 moves in remaining cells result in loss
			// Test for loss if going here
			var testBoard = board;
			testBoard[col][row] = 2;
			if (checkWin(testBoard, col, row) != 2) {
				// Check first option
				var tb1 = testBoard;
				
				// Does AI move produce win?
				var testCol1 = findOpenCol(tb1);
				var testRow1 = findOpenRow(tb1);
				tb1[testCol1][testRow1] = 2;
				// Looking for a 0 here, aka did the AI win with this move?
				var result1 = checkWin(tb1, testCol1, testRow1);
				
				
				
			}
			
			
			break;
		};
		
	};

};

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
	};
	return -1;
};

// player's turn
// Actually, now the mechanism for every turn
function pcTurn(cell, player) {
	
	if($("#" + cell).text() == "") {
		$("#" + cell).text(player);
		
		var col = cell%3;
		var row = Math.floor(cell/3);
		board[col][row] = player;
					
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