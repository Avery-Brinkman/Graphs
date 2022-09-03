import Edge from "../Edge";
import Graph from "../Graph";

/**
 * Returns a list of edges according to Dijkstra's algorithm.
 *
 * @param {Graph} graph The graph to perform the algorithm on.
 * @param {number} startNode The starting node uid.
 * @param {number} endNode The ending node uid.
 *
 * @return {Edge[]} A list of edges in order. If this is for all nodes, this is in depth first order.
 */
export default function dijkstra(
  graph: Graph,
  startNode: number,
  endNode?: number
): Edge[] {
  return;
}

/**
 * Returns a list of edges according to Dijkstra's algorithm.
 *
 * @param {Graph} graph The graph to perform the algorithm on.
 * @param {number} startNode The starting node uid.
 *
 * @return {Edge[]} A list of edges in order.
 */
function dijkstra_start(graph: Graph, startNode: number): Edge[] {
  return;
}

/**
 * Returns a list of edges according to Dijkstra's algorithm.
 *
 * @param {Graph} graph The graph to perform the algorithm on.
 * @param {number} startNode The starting node uid.
 * @param {number} endNode The ending node uid.
 *
 * @return {Edge[]} A list of edges in order in depth first order.
 */
function dijkstra_all(
  graph: Graph,
  startNode: number,
  endNode: number
): Edge[] {
  return;
}
