import Edge from "./Edge";
import Vertex from "./Vertex";

/**
 * Generates a unique Id for vertices.
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

  /**
   * Maps vertex's uid to the actual vertex.
   */
  vertices: Map<number, Vertex>;
  /**
   * List of edges, stored as min heap.
   */
  edges: Edge[];

  constructor() {
    this.vertices = new Map<number, Vertex>();
    this.edges = [];
  }

  /**
   * Constructs a Vertex and adds it to the graph.
   *
   * @param {number} value The value of the new vertex.
   */
  createVertex(value: number) {
    let uid: number = this.getUid.next().value;
    let newVert: Vertex = new Vertex(value, uid);
    this.vertices.set(uid, newVert);
  }

  /**
   * Takes an already constructed vertex and adds it to the graph.
   *
   * @param {Vertex} vertex The vertex to add to the graph.
   */
  insertVertex(vertex: Vertex) {
    this.vertices.set(vertex.uid, vertex);
  }

  /**
   * Deletes a vertex and the edges that came from it from the graph.
   *
   * @param {number} vertex The uid of the vertex to be deleted.
   */
  deleteVertex(vertex: number) {
    // Delete vertex
    this.vertices.delete(vertex);
    // Update edges
    this.deleteEdgeFrom(vertex);
    this.deleteEdgeTo(vertex);
  }

  /**
   * Creates an edge and adds it to the graph.
   *
   * @param {number} from The uid for the vertex the edge starts at.
   * @param {number} to The uid for the vertex the edge points to.
   */
  createEdge(from: number, to: number) {
    // Make the new edge
    let edge: Edge = new Edge(this.vertices.get(from), this.vertices.get(to));

    // Add edge to vertices
    this.vertices.get(from).outEdges.set(to, edge);
    this.vertices.get(to).inEdges.set(from, edge);

    // Add edge to graph
    this.edges.push(edge);
    // Update the min heap
    this.sortEdgesInsert();
  }

  /**
   * Takes an already constructed edge and adds it to the graph.
   *
   * @param {Edge} edge The edge to add to the graph.
   */
  insertEdge(edge: Edge) {
    // Add edge to vertices
    this.vertices.get(edge.from.uid).outEdges.set(edge.to.uid, edge);
    this.vertices.get(edge.to.uid).inEdges.set(edge.from.uid, edge);

    // Add edge to graph
    this.edges.push(edge);
    // Update the min heap
    this.sortEdgesInsert();
  }

  /**
   *
   */
  deleteEdgeFrom(from: number, to: number = null) {
    let index: number = 0;
    let edge: Edge;
    // Go through the edges
    while (index < this.edges.length) {
      edge = this.edges[index];
      // Check if the edge should be deleted. If 'to' is not specified, all of 'froms' outgoing edges are deleted
      if (edge.from.uid == from && (to == null || edge.to.uid == to)) {
        // Remove edge from vertices
        edge.from.outEdges.delete(edge.to.uid);
        edge.to.inEdges.delete(edge.from.uid);

        // Remove edge from graph
        this.edges.splice(index, 1);
      } else {
        // Removing shifts everything down by one, so only update if nothing was removed
        index++;
      }
    }

    // Update the min heap
    this.sortEdgesDelete();
  }

  /**
   *
   */
  deleteEdgeTo(to: number) {
    let index: number = 0;
    let edge: Edge;
    // Go through the edges
    while (index < this.edges.length) {
      edge = this.edges[index];
      // Check if the edge should be deleted.
      if (edge.to.uid == to) {
        // Remove edge from vertices
        edge.from.outEdges.delete(edge.to.uid);
        edge.to.inEdges.delete(edge.from.uid);

        // Remove edge from graph
        this.edges.splice(index, 1);
      } else {
        // Removing shifts everything down by one, so only update if nothing was removed
        index++;
      }
    }

    // Update the min heap
    this.sortEdgesDelete();
  }

  /**
   * Sorts the min heap from the bottom up. Used after an insertion.
   *
   * @param {number} inserted The inserted edge to be sorted. Defaults to the last edge.
   */
  sortEdgesInsert(inserted: number = this.edges.length - 1) {
    let parent: number = Math.floor((inserted - 1) / 2);

    // Make sure parent exists
    if (this.edges[parent]) {
      if (this.edges[inserted].weight < this.edges[parent].weight) {
        // Swap edges
        let temp: Edge = this.edges[parent];
        this.edges[parent] = this.edges[inserted];
        this.edges[inserted] = temp;

        // Recursively sort the min heap
        this.sortEdgesInsert(parent);
      }
    }
  }

  /**
   * Sorts the min heap of edges from the top down. Used after deletion.
   *
   * @param {number} parent The parent vertex for the subtree that should be sorted. Defaults to the root.
   */
  sortEdgesDelete(parent: number = 0) {
    // Get left and right
    let smallest: number = parent;
    let left: number = 2 * parent + 1;
    let right: number = 2 * parent + 2;

    // If left child is smaller than root
    if (
      left < this.edges.length &&
      this.edges[left].weight < this.edges[smallest].weight
    )
      smallest = left;

    // If right child is smaller than left and root
    if (
      right < this.edges.length &&
      this.edges[right].weight < this.edges[smallest].weight
    )
      smallest = right;

    // If smallest is not root
    if (smallest != parent) {
      // Swap edges
      let temp: Edge = this.edges[parent];
      this.edges[parent] = this.edges[smallest];
      this.edges[smallest] = temp;

      // Recursively sort the affected sub-tree
      this.sortEdgesDelete(smallest);
    }
  }
}
