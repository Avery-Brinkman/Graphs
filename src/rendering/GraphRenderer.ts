import P5 from "p5";
import Graph from "../Graph";
import EdgeRenderer from "./EdgeRenderer";
import VertexRenderer from "./VertexRenderer";

export default class GraphRenderer extends Graph {
  p5: P5;
  r_vertices: Map<number, VertexRenderer>;
  r_edges: EdgeRenderer[];
  selectedVertex: VertexRenderer;
  selectedEdge: EdgeRenderer;

  constructor(p5: P5) {
    super();
    this.p5 = p5;
    this.r_vertices = new Map<number, VertexRenderer>();
    this.r_edges = [];
    this.selectedVertex = null;
    this.selectedEdge = null;
  }

  draw() {
    for (let edge of this.r_edges) {
      edge.draw();
    }
    this.r_vertices.forEach((vertex) => {
      vertex.draw();
    });
  }

  // clickHandler() {
  //   let selectedNode: GraphNode;
  //   // Try and select a node
  //   this.nodes.forEach((node) => {
  //     selectedNode = node.clickHandler() ?? selectedNode;
  //   });
  //   // Found a node
  //   if (selectedNode) {
  //     // A node is already selected
  //     if (this.selectNode) {
  //       // Create edge between selected and prev selected
  //       this.createEdge(this.selectNode.uid, selectedNode.uid);
  //       this.selectNode.selected = false;
  //     }
  //     // Update selected
  //     selectedNode.selected = true;
  //     this.selectNode = selectedNode;

  //     if (this.selectEdge) this.selectEdge.selected = false;
  //     this.selectEdge = null;
  //     return;
  //   }
  //   // No node found
  //   else {
  //     if (this.selectNode) this.selectNode.selected = false;
  //     this.selectNode = null;
  //   }

  //   let selectedEdge: Edge;
  //   // Try and select an edge
  //   this.edges.forEach((edgeList) => {
  //     edgeList.forEach((edge) => {
  //       selectedEdge = edge.clickHandler() ?? selectedEdge;
  //     });
  //   });
  //   // Found an edge
  //   if (selectedEdge) {
  //     selectedEdge.selected = true;
  //     if (this.selectEdge) this.selectEdge.selected = false;
  //     this.selectEdge = selectedEdge;
  //     return;
  //   }
  //   // No edge found
  //   else {
  //     if (this.selectEdge) this.selectEdge.selected = false;
  //     this.selectEdge = null;
  //   }

  //   //Nothing found, create new node
  //   this.createNode(this.p5.mouseX, this.p5.mouseY, 0);
  // }

  /**
   * Creates a vertex and renderer and adds it to the graph and graph renderer.
   *
   * @param {number} x The x position to place the vertex at.
   * @param {number} y The y position to place the vertex at.
   * @param {number} value The value of the new vertex.
   */
  makeVertex(x: number, y: number, value: number) {
    // Generate uid
    let uid: number = this.getUid.next().value;
    // Create the renderer
    let vert: VertexRenderer = new VertexRenderer(
      this.p5,
      value,
      uid,
      new P5.Vector(x, y)
    );
    // Add it to graph renderer
    this.r_vertices.set(uid, vert);
    // Add it to graph
    this.insertVertex(vert);
  }

  /**
   * Removes a vertex and renderer from graph and graph renderer.
   *
   * @param {number} vertex The uid of the vertex to be removed.
   */
  removeVertex(vertex: number) {
    // Remove from renderer
    this.r_vertices.delete(vertex);
    // Remove from graph
    this.deleteVertex(vertex);
    // Remove edges that start from vertex
    this.removeEdgeFrom(vertex);
    this.removeEdgeTo(vertex);
  }

  /**
   * Creates an edge and renderer and adds it to the graph and graph renderer.
   *
   * @param {number} from The uid for the node the edge starts at.
   * @param {number} to The uid for the node the edge points to.
   */
  makeEdge(from: number, to: number) {
    // Create the edge and renderer
    let edge: EdgeRenderer = new EdgeRenderer(
      this.p5,
      this.r_vertices.get(from),
      this.r_vertices.get(to)
    );
    // Add edge renderer to graph renderer
    this.r_edges.push(edge);

    // Add edge to graph
    this.insertEdge(edge);
  }

  /**
   * Removes all edges and renderers from graph and graph renderer that start from a given vertex.
   * Specifying to will delete only the edge that points to that vertex.
   *
   * @param {number} from The uid of the vertex that the edge(s) start at
   * @param {number} to The uid of the vertex that the edge points to. Optional.
   */
  removeEdgeFrom(from: number, to: number = null) {
    let index: number = 0;
    let edge: EdgeRenderer;
    // Go through the r_edges
    while (index < this.r_edges.length) {
      edge = this.r_edges[index];
      // Check if the r_edge should be removed. If 'to' is not specified, all of 'from' outgoing edges are removed.
      if (edge.from.uid == from && (to == null || edge.to.uid == to)) {
        // Remove r_edge from GraphRenderer
        this.r_edges.splice(index, 1);
      } else {
        // Removing shifts everything down by one, so only update if nothing was removed
        index++;
      }
    }

    // Delete from graph
    this.deleteEdgeFrom(from, to);
  }

  /**
   * Removes all edges and renderers from graph and graph renderer that point to a given vertex.
   *
   * @param {number} to The uid of the vertex that the edges point to.
   */
  removeEdgeTo(to: number) {
    let index: number = 0;
    let edge: EdgeRenderer;
    // Go through the r_edges
    while (index < this.r_edges.length) {
      edge = this.r_edges[index];
      // Check if the r_edge should be removed. If 'to' is not specified, all of 'from' outgoing edges are removed.
      if (edge.to.uid == to) {
        // Remove r_edge from GraphRenderer
        this.r_edges.splice(index, 1);
      } else {
        // Removing shifts everything down by one, so only update if nothing was removed
        index++;
      }
    }

    // Delete from graph
    this.deleteEdgeTo(to);
  }
}
