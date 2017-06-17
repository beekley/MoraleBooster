// Input
  // An array of nine moves
  //  [0, 1, 2
  //   3, 4, 5
  //   6, 7, 8]
// Ouput
  // "1" if player 1 wins
  // "2" if player 2 wins
  // "d" if draw
function checkWin(game) {
  for (let i = 0; i < game.length; i += 1) {
    // Check column
    if (game[i % 3] === game[i % 3 + 3] && 
        game[i % 3] === game[i % 3 + 6] && 
        game[i] !== null) {
      //console.log("Column, winning move:", i);
      return game[i];
    }
    
    // Check row
    else if (game[3 * Math.floor(i / 3)] === game[3 * Math.floor(i / 3) + 1] && 
             game[3 * Math.floor(i / 3)] === game[3 * Math.floor(i / 3) + 2] && 
        game[i] !== null) {
      //console.log("Row, winning move:", i);
      return game[i];
    }
    
    // Check diagonals
    else if ((
      (game[4] == game[0] && game[4] == game[8]) ||
      (game[4] == game[2] && game[4] == game[6])) &&
       game[i] == game[4] && 
       game[i] !== null)
    {
      //console.log("Diagonal, winning move:", i);
      return game[i];
    }
  }
  
  // If nobody won
  return null;
}

// Test cases
/*
const game1 = [1,2,1,2,1,2,2,2,1];
const game2 = [1,2,2,2,1,1,1,1,2];
const game3 = [1,2,1,1,2,1,1,1,2];
const game4 = [1,1,2,2,2,1,1,1,1];
console.log(checkWin(game1)); // 1, diagonal
console.log(checkWin(game2)); // d
console.log(checkWin(game3)); // 1, column
console.log(checkWin(game4)); // 1, row
*/


class Node {
  constructor(depth, parent, board, i) {
    this.gameSize = 9;
    this.depth = depth;
    this.parent = parent;
    this.children = [];
    this.board = board;
    if (depth != 0) this.board[i] = 2 - this.depth % 2;
    
    // Stores the lossyness
    this.value = null;
    this.winner = null;
    
    this.generateChildren();
  }
  
  // Check if this node is "lossy"
  // "lossy" means that there are decisions that player 2 can make that force player 1 to win, given the current game state
  isLossy() {
    // if this is a leaf
    if (this.winner == 2) return true;
    if (this.winner == 1) return false;
    if (this.depth === this.gameSize &&
        this.winner === null) return true;
    
    // Check children
    // If this is p1's turn, all children must be lossy
    if ((2 - this.depth % 2) == 1) {
      return this.children.reduce((lossy, child) => {
        // if any child is not lossy, then this node is not lossy
        if (!child.isLossy()) return false;
        else return lossy;
      }, true)
    }
    // If this is p2's turn, any child may be lossy
    else {
      return this.children.reduce((lossy, child) => {
        // if any child is not lossy, then this node is not lossy
        if (child.isLossy()) return true;
        else return lossy;
      }, false)
    }
    
    console.log("shouldn't see this");
  }
  
  // Generate children for each empty board space, if this is not a leaf
  generateChildren() {
    //console.log(this.depth);
    // Check if game has ended
    this.winner = checkWin(this.board);
    
    // If this is a leaf or the game has ended
    if (this.depth === this.gameSize ||
        this.winner !== null) {
      leafCount += 1;
      
      if (this.winner == 1) p1WinCount += 1;
      if (this.winner == 2) p2WinCount += 1;
      if (this.winner == null) drawCount += 1;
    }
    
    else {
      // Create children for each empty board space
      for (let i = 0; i < this.gameSize; i += 1) {
        if (!this.board[i]) {
          const boardCopy = JSON.parse(JSON.stringify(this.board));

          this.children[i] = new Node(this.depth + 1, this, boardCopy, i);
        }
      }
    }
  }
}

let leafCount = 0;
let p1WinCount = 0;
let p2WinCount = 0;
let drawCount = 0;
const startTime = new Date();

const emptyBoard = [null, null, null, null, null, null, null, null, null];
const tree = new Node(0, null, emptyBoard, 0);
//console.log(tree.children[0].board);

const endTime = new Date();

console.log();
console.log("--Diagnostics--")
console.log("Leaf count (should be 255168):", leafCount);
console.log("p1 win count (should be 131184):", p1WinCount);
console.log("p2 win count (should be 77904):", p2WinCount);
console.log("Draw count (should be 46080):", drawCount);
console.log();
console.log("--Results--")
console.log("Duration (ms):", (endTime - startTime));
console.log("Lossy", tree.isLossy());
console.log();
