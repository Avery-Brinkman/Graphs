import Vertex from "./Vertex";

export default class Edge {
  from: Vertex;
  to: Vertex;
  weight: number;

  constructor(from: Vertex, to: Vertex, weight: number = Math.random() * 10) {
    this.from = from;
    this.to = to;
    this.weight = weight;
  }
}
