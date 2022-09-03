import P5 from "p5";
import Edge from "./Edge";
import GraphNode from "./GraphNode";

/**
 * Generates a unique Id for nodes.
 *
 * @param {number} currentGuid The starting number to return. Default 0.
 *
 * @return {Generator<number>} The current guid, incremented by one. get value with next().value
 */
function* generateUid(currentGuid: number = 0): Generator<number> {
  while (true) {
    yield currentGuid++;
  }
}

export default class Graph {
  getUid = generateUid();

  p5: P5;
  /**
   * Maps node's uid to the actual node.
   */
  nodes: Map<number, GraphNode>;
  /**
   * Maps node's uid to a list of edges that originate at that node.
   */
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

  /**
   * Creates a node and adds it to the graph.
   *
   * @param {number} x The x position to place the node at.
   * @param {number} y The y position to place the node at.
   * @param {number} value The value of the new node.
   */
  createNode(x: number, y: number, value: number) {
    let uid = this.getUid.next().value;
    this.nodes.set(
      uid,
      new GraphNode(this.p5, new P5.Vector(x, y), value, uid)
    );
  }

  /**
   * Creates an edge and adds it to the graph.
   *
   * @param {number} from The uid for the node the edge starts at.
   * @param {number} to The uid for the node the edge points to.
   */
  createEdge(from: number, to: number) {
    // Make sure there is a list to push to
    if (!this.edges.get(from)) this.edges.set(from, []);

    // Add to edges
    this.edges
      .get(from)
      .push(new Edge(this.p5, this.nodes.get(from), this.nodes.get(to)));
    // Update the heap
    this.sortEdgesInsert(from);

    // Add neighbor to node
    this.nodes.get(from).neighbors.push(this.nodes.get(to));
  }

  /**
   * Sorts the heap from the bottom up. Used after an insertion.
   *
   * @param {number} node The node to be sorted. Defaults to the last edge.
   */
  sortEdgesInsert(
    node: number,
    inserted: number = this.edges.get(node).length - 1
  ) {
    let parent: number = (inserted - 1) / 2;

    if (this.edges.get(node)[parent]) {
      if (
        this.edges.get(node)[inserted].weight <
        this.edges.get(node)[parent].weight
      ) {
        let temp = this.edges.get(node)[parent];
        this.edges.get(node)[parent] = this.edges.get(node)[inserted];
        this.edges.get(node)[inserted] = temp;

        // Recursively heapify the parent node
        this.sortEdgesInsert(node, parent);
      }
    }
  }

  /**
   * Sorts the heap of edges for a given node from the top down. Used after deletion.
   *
   * @param {number} node The node whose edges should be sorted
   * @param {number} parent The parent node for the subtree that should be sorted. Defaults to the root.
   */
  sortEdgesDelete(node: number, parent: number = 0) {
    let smallest: number = parent;
    let left: number = 2 * parent + 1;
    let right: number = 2 * parent + 2;

    // If left child is smaller than root
    if (
      left < this.edges.get(node).length &&
      this.edges.get(node)[left].weight < this.edges.get(node)[smallest].weight
    )
      smallest = left;

    // If right child is smaller than smallest so far
    if (
      right < this.edges.get(node).length &&
      this.edges.get(node)[right].weight < this.edges.get(node)[smallest].weight
    )
      smallest = right;

    // If smallest is not root
    if (smallest != parent) {
      let temp: Edge = this.edges.get(node)[parent];
      this.edges.get(node)[parent] = this.edges.get(node)[smallest];
      this.edges.get(node)[smallest] = temp;

      // Recursively sort the affected sub-tree
      this.sortEdgesDelete(node, smallest);
    }
  }
}
