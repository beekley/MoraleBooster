class Node {
	
	// 0-8 on the board
	public int space { get; set }
	
	// Tree depth
	public int depth { get; set }
	
	// true if...
	public bool result { get; set; }
	
	// Children nodes
	public Node[] child { get; set; }
	
	// Generate child nodes
	public void generateChildren() {
		for ( int i = 0; i < 7; i++ ) {
			this.child
		}
	}
	
};

// Root node
var tree = new Node { depth = 0 };
tree.generateChildren();