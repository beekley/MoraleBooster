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

        // Generate child nodes
        public void generateChildren()
        {
            for (int i = 0; i < 9 - this.depth; i++)
            {
                this.children.Add(new Node { depth = this.depth + 1 });
                this.children[i].generateChildren();
            }
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
        Node currentNode;
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
        public bool play()
        {
            while(inProgress)
            {
                // find the open space that corresponds to the next move
                int move = this.findOpenSpace(this.currentNode.findNextMove());

                // P1 if depth is even, P2 if odd
                int currentPlayer = this.currentNode.depth % 2 + 1;

                // Make move
                board[move] = currentPlayer;

                // Check for end
                int status = this.checkWin(move);

                switch (status)
                {
                    case 1:
                        return false;
                    case 2:
                        return true;
                    case 3:
                        return false;
                }
            }
            return false;
        }

        // return (n+1)th empty space
        int findOpenSpace(int n)
        {
            int counter = 0;
            for (int i = 0; i < 9; i++)
            {
                if(board[i] == 0)
                {
                    counter++;
                    
                    if (counter == n)
                    {
                        return i;
                    }
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
            else if ((board[0] == board[4] &&
                board[0] == board[8]) ||
                (board[2] == board[4] &&
                board[2] == board[6]))
            {
                return board[4];
            }
            // Check if last move
            else if (this.currentNode.depth >= 7)
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
            Console.WriteLine(tree.children[8].children[7].children[6].children[5].children[4].children[3].children[2].children[1].children[0]);

            var game = new Game(tree);
            Console.WriteLine(game.play());

            //System.IO.File.WriteAllText(@"C:\Users\brett.beekley\Documents\GitHub\MoraleBooster\json.txt", tree.serializeJSON());

            Console.Write("Done.");
            Console.Read();
        }
    }
}
