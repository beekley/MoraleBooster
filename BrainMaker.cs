using System;
using System.Collections.Generic;
using System.Web.Script.Serialization;

namespace HelloWorld
{
	public class Node {
				
		// Tree depth
		public int depth;
		
		// true if...
		public bool result;
		
		// Children nodes
		public List<Node> child = new List<Node>();
		
		// Generate child nodes
		public void generateChildren() {
			for ( int i = 0; i < 8 - this.depth; i++ ) {
				this.child.Add(new Node{ depth = this.depth + 1 });
				this.child[i].generateChildren();
			}
		}
		
	};

    class Hello 
    {
        static void Main() 
        {
			// Root node
			var tree = new Node { depth = 0 };
			tree.generateChildren();
			Console.WriteLine(tree.child[7].child[6].child[5].child[4].child[3].child[2].child[1].child[0]);
			Console.Write("Done.");
			Console.Read();
			

			var serializer = new JavaScriptSerializer();
			string json = serializer.Serialize(tree);

			//string json = JsonConvert.SerializeObject(Node);

			System.IO.File.WriteAllText(@"C:\Users\brett.beekley\Documents\GitHub\MoraleBooster\json.txt", json);
        }
    }
}
