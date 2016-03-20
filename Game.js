var state = "p1 turn"
var turn = 1;
var board = new Array(3);
for (var i = 0; i < 3; i++) { board[i] = new Array(3)};

// player's turn
function pcTurn(cell, player) {
	
	if($(this).text() == "") {
		$("#" + cell).text(player);
		
		var col = cell%3;
		var row = Math.floor(cell/3);
		board[col][row] = player;
		console.log(turn);
					
		var nextplayer = 1 + player%2;
		state = "p" + nextplayer + " turn";
		turn++;
		
		checkWin(col, row);
	};
};

function checkWin(col, row) {
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
		gameEnd(0);
	}
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
				pcTurn($(this).attr('id'),2);
				break;
		};
	});
		
});