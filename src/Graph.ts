import P5 from "p5";
import Edge from "./Edge";
import GraphNode from "./GraphNode";

function* generateUid(currentGuid: number = 0): Generator<number> {
  while (true) {
    yield currentGuid++;
  }
}

export default class Graph {
  getUid = generateUid();

  p5: P5;
  nodes: Map<number, GraphNode>;
  edges: Map<number, Edge[]>;
  selectNode: GraphNode;
  prevSelNode: GraphNode;
  selectEdge: Edge;

  constructor(p5: P5) {
    this.p5 = p5;
    this.nodes = new Map<number, GraphNode>();
    this.edges = new Map<number, Edge[]>();
  }

  draw() {
    this.edges.forEach((edgeList) => {
      edgeList.forEach((edge) => {
        edge.draw();
      });
    });
    this.nodes.forEach((node) => {
      node.draw();
    });
  }

  clickHandler() {
    let selectedNode: GraphNode;
    // Try and select a node
    this.nodes.forEach((node) => {
      selectedNode = node.clickHandler() ?? selectedNode;
    });
    // Found a node
    if (selectedNode) {
      // A node is already selected
      if (this.selectNode) {
        // Create edge between selected and prev selected
        this.createEdge(this.selectNode.uid, selectedNode.uid);
        this.selectNode.selected = false;
      }
      // Update selected
      selectedNode.selected = true;
      this.selectNode = selectedNode;

      if (this.selectEdge) this.selectEdge.selected = false;
      this.selectEdge = null;
      return;
    }
    // No node found
    else {
      if (this.selectNode) this.selectNode.selected = false;
      this.selectNode = null;
    }

    let selectedEdge: Edge;
    // Try and select an edge
    this.edges.forEach((edgeList) => {
      edgeList.forEach((edge) => {
        selectedEdge = edge.clickHandler() ?? selectedEdge;
      });
    });
    // Found an edge
    if (selectedEdge) {
      selectedEdge.selected = true;
      if (this.selectEdge) this.selectEdge.selected = false;
      this.selectEdge = selectedEdge;
      return;
    }
    // No edge found
    else {
      if (this.selectEdge) this.selectEdge.selected = false;
      this.selectEdge = null;
    }

    //Nothing found, create new node
    this.createNode(this.p5.mouseX, this.p5.mouseY, 0);
  }

  createNode(x: number, y: number, value: number) {
    let uid = this.getUid.next().value;
    this.nodes.set(
      uid,
      new GraphNode(this.p5, new P5.Vector(x, y), value, uid)
    );
  }

  createEdge(from: number, to: number) {
    // Make sure there is a list to push to
    if (!this.edges.get(from)) this.edges.set(from, []);

    // Add to edges
    this.edges
      .get(from)
      .push(new Edge(this.p5, this.nodes.get(from), this.nodes.get(to)));

    // Add neighbor to node
    this.nodes.get(from).neighbors.push(this.nodes.get(to));
  }
}
