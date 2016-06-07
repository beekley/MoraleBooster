using System;
using System.Collections.Generic;

namespace brain
{
	public class Node {
				
		// Tree depth
		public int depth;
		
		// true if...
		public bool result;
		
		// Children nodes
		public List<Node> children = new List<Node>();
		
		// Generate child nodes
		public void generateChildren() {
			for ( int i = 0; i < 8 - this.depth; i++ ) {
				this.children.Add(new Node{ depth = this.depth + 1 });
				this.children[i].generateChildren();
			}
		}
		
		public string serializeJSON() {
			string json = @"{""depth"":"+this.depth+","
				+@"""result"":"+this.result+","
				+@"""children"":[";
			
			foreach(var child in this.children) {
				json += child.serializeJSON() + ",";
			};
			
			json += @"]}";
			
			return json;
		}
					
	};

    class brainMaker 
    {
        static void Main() 
        {
			// Root node
			var tree = new Node { depth = 0 };
			tree.generateChildren();
			Console.WriteLine(tree.children[7].children[6].children[5].children[4].children[3].children[2].children[1].children[0]);
			
			System.IO.File.WriteAllText(@"C:\Users\brett.beekley\Documents\GitHub\MoraleBooster\json.txt", tree.serializeJSON());
			
			Console.Write("Done.");
			Console.Read();
		}
    }
}
