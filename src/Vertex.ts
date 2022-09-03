import Edge from "./Edge";

export default class Vertex {
  val: number;
  uid: number;
  /**
   * E = (A, B)
   *
   * A.outEdges(B) = E
   */
  outEdges: Map<number, Edge>;
  /**
   * E = (A, B)
   *
   * B.inEdges(A) = E
   */
  inEdges: Map<number, Edge>;

  constructor(value: number, uid: number) {
    this.val = value;
    this.uid = uid;
    this.outEdges = new Map<number, Edge>();
    this.inEdges = new Map<number, Edge>();
  }
}
