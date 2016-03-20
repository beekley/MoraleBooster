var state = "p1 turn"
var turn = 1;
var board = new Array(3);
for (var i = 0; i < 3; i++) { board[i] = new Array(3)};

ai = false;

// player's turn
function pcTurn(cell, player) {
	
	if($(this).text() == "") {
		$("#" + cell).text(player);
		
		var col = cell%3;
		var row = Math.floor(cell/3);
		board[col][row] = player;
		console.log(turn);
					
		// moved to checkWin() 
		/*var nextplayer = 1 + player%2;
		state = "p" + nextplayer + " turn";
		turn++;*/
		
		checkWin(col, row, player);
	};
};

// Always-lose AI turn
function losingAIturn() {
	
};

function checkWin(col, row, player) {
	// check in row
	if (board[0][row] == board[col][row] &&
		board[1][row] == board[col][row] &&
		board[2][row] == board[col][row]) {
		endGame(board[col][row]);
	}
	
	// check in column
	else if (board[col][0] == board[col][row] &&
		board[col][1] == board[col][row] &&
		board[col][2] == board[col][row]) {
		endGame(board[col][row]);
	}
	
	// check diagonal
	else if (board[0][2] == board[col][row] &&
		board[1][1] == board[col][row] &&
		board[2][0] == board[col][row]) {
		endGame(board[col][row]);
	}
	
	// check anti diagonal
	else if (board[0][0] == board[col][row] &&
		board[1][1] == board[col][row] &&
		board[2][2] == board[col][row]) {
		endGame(board[col][row]);
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
		console.log(state);
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