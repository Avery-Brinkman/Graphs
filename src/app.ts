import P5 from "p5";
import "./styles.scss";

import Graph from "./Graph";
import GraphNode from "./GraphNode";

// Creating the sketch itself
const sketch = (p5: P5) => {
  let graph: Graph;

  let prevNode: GraphNode;

  // The sketch setup method
  p5.setup = () => {
    graph = new Graph(p5);

    // Creating and positioning the canvas
    const canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight);
    canvas.parent("app");

    graph.createNode(200, 200, 1);
    graph.createNode(100, 100, 2);
    graph.createNode(300, 100, 3);
    graph.createEdge(0, 1);
  };

  // The sketch draw method
  p5.draw = () => {
    p5.background(123);

    graph.draw();
  };

  p5.mouseClicked = () => {
    // graph.clickHandler();

    if (p5.keyIsDown(p5.SHIFT)) {
      graph.createNode(p5.mouseX, p5.mouseY, 0);
    } else if (p5.keyIsDown(p5.CONTROL)) {
      if (prevNode) prevNode.pos.set(p5.mouseX, p5.mouseY);
    } else {
      let selectedNode: GraphNode;

      graph.nodes.forEach((node) => {
        selectedNode = node.clickHandler() ?? selectedNode;
      });

      if (selectedNode && prevNode && selectedNode != prevNode) {
        graph.createEdge(prevNode.uid, selectedNode.uid);
      }
      prevNode = selectedNode;
    }
  };

  p5.keyPressed = () => {
    if (prevNode) {
      if (p5.keyIsDown(p5.DELETE)) {
        graph.edges.delete(prevNode.uid);
        graph.nodes.delete(prevNode.uid);
      } else if (p5.keyIsDown(69)) {
        graph.edges.delete(prevNode.uid);
      } else if (p5.keyCode.valueOf() >= 48 && p5.keyCode.valueOf() <= 57) {
        prevNode.val = p5.keyCode.valueOf() - 48;
      }
    }
  };
};

new P5(sketch);
