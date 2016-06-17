using System;
using System.Collections.Generic;

namespace brain
{
    public class Node
    {

        // Tree depth
        public int depth;

        // 0 if not tested
        // 1 if p1 win
        // 2 if p2 win
        // 3 if draw
        public int result = 0;

        // Children nodes
        public List<Node> children = new List<Node>();
        // Parent node
        public Node parent;
        // Is this node the last child?
        public bool lastChild = false;

        // Generate child nodes
        public void generateChildren()
        {
            for (int i = 0; i < 9 - this.depth; i++)
            {
                this.children.Add(new Node { depth = this.depth + 1 });
                this.children[i].parent = this;

                // if last child
                if (i == 8 - this.depth)
                {
                    this.children[i].lastChild = true;
                }

                this.children[i].generateChildren();
            }
        }

        public int countLeaves(int i)
        {
            // if leaf, increment by 1
            if(this.children.Count == 0)
            {
                i++;
            } 
            // if not leaf, then continue counting for children.
            else
            {
                foreach (var child in this.children)
                {
                    i = child.countLeaves(i);
                }
            }
            return i;
        }

        public int findNextMove()
        {
            // index
            int i = 0;

            foreach (var child in this.children)
            {
                if (child.result == 0)
                {
                    return i;
                }
                i++;
            }
            // int is non nullable, so return something outside of range
            return -1;
        }

        // Assigns the result to the node
        // if this is the last child of parent, then assign result to parent node
        public void assignResult(int result)
        {
            this.result = result;
            if (this.lastChild)
            {
                // 1 if P1 forced win
                // 2 if else
                int r = 0;
                int player = this.parent.depth % 2 + 1;
                foreach (var child in this.parent.children)
                {
                    // if P1 turn, all children must have result = 1
                    if (player == 1)
                    {
                        if (child.result == 1)
                        {
                            r = 1;
                        }
                        else
                        {
                            r = 2;
                            break;
                        }
                    }
                    // if P2 turn, any child must have result = 1
                    else
                    {
                        r = 2;
                        if (child.result == 1)
                        {
                            r = 1;
                        }
                    }
                }

                // assign result to parent
                this.parent.assignResult(r);
            }
        }

        // abbreviated for file size
        public string serializeJSON()
        {
            string json = @"{""d"":" + this.depth + ","
                + @"""r"":" + this.result + ","
                + @"""c"":[";

            foreach (var child in this.children)
            {
                json += child.serializeJSON() + ",";
            };

            json += @"]}";

            return json;
        }

    };

    public class Game
    {

        int[] board = { 0, 0, 0, 0, 0, 0, 0, 0, 0 };
        bool inProgress = true;

        // initialize current node
        // This is used to keep track of where we are in the tree
        public Node currentNode;
        public Game(Node node)
        {
            currentNode = node;
        }

        // 1 Find next move
        // 2 Move there, where currentNode.depth is odd: 1, else: 2
        // 3 Check if move causes a win or draw
        // if win for p1
        // return true
        // if draw/loss for p1
        // return false
        // else
        // goto 1
        public int play()
        {
            while(inProgress)
            {
                // find the open space that corresponds to the next move
                int childNumber = this.currentNode.findNextMove();
                int move = this.findOpenSpace(childNumber);

                // No remaining moves
                if (move == -1)
                {
                    return -1;
                }

                // P1 if depth is even, P2 if odd
                int currentPlayer = this.currentNode.depth % 2 + 1;

                // Make move
                board[move] = currentPlayer;

                // Check for end
                int status = this.checkWin(move);

                this.currentNode = this.currentNode.children[childNumber];

                if (status != 0)
                {
                    // delete children that will never be played
                    this.currentNode.children.Clear();
                    inProgress = false;
                    return status;
                }

                
            }
            return -1;
        }

        // return (n+1)th empty space
        int findOpenSpace(int n)
        {
            int counter = 0;
            for (int i = 0; i < 9; i++)
            {
                if(board[i] == 0)
                {
                    if (counter == n)
                    {
                        return i;
                    }
                    counter++;
                }
            }
            return -1;
        }

        // Check for end condition
        // 1 if p1 win
        // 2 if p2 win
        // 3 if draw
        // 0 if else
        int checkWin(int i)
        {
            // Check column
            if (board[i % 3] == board[i % 3 + 3] &&
                board[i % 3] == board[i % 3 + 6])
            {
                return board[i % 3];
            }
            // Check row
            else if (board[3 * (i / 3)] == board[3 * (i / 3) + 1] &&
                board[3 * (i / 3)] == board[3 * (i / 3) + 2])
            {
                return board[3 * (i / 3)];
            }
            // Check diagonals
            else if ((
                (board[4] == board[0] &&
                board[4] == board[8]) ||
                (board[4] == board[2] &&
                board[4] == board[6])
                ) && board[i] == board[4])
            {
                return board[4];
            }
            // Check if last move
            else if (this.currentNode.depth >= 8)
            {
                return 3;
            }
            // continue
            else
            {
                return 0;
            }
        }

    };

    class brainMaker
    {
        static void Main()
        {
            // Root node
            var tree = new Node { depth = 0 };
            tree.generateChildren();
            //Console.WriteLine(tree.children[8].children[7].children[6].children[5].children[4].children[3].children[2].children[1].children[0]);
            //Console.WriteLine(tree.countLeaves(0));

            int i = 0;
            int[] endTurn = { 0, 0, 0, 0, 0, 0, 0, 0, 0 };

            while (true)
            {
                var game = new Game(tree);
                int result = game.play();
                game.currentNode.assignResult(result);
                if (result == -1)
                {
                    break;
                }
                i++;
                endTurn[game.currentNode.depth -1]++;
            }
            
            System.IO.File.WriteAllText(@"C:\Users\brett.beekley\Documents\GitHub\MoraleBooster\json.txt", tree.serializeJSON());

            Console.Write("Simulated games: " + i);
            Console.Read();
        }
    }
}
