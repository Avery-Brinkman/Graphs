import P5 from "p5";
import "./styles.scss";

import Graph from "./Graph";
import Edge from "./Edge";

// Creating the sketch itself
const sketch = (p5: P5) => {
  let graph: Graph;

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
    graph.clickHandler();
  };

  p5.keyPressed = () => {
    if (graph.selectNode) return true;
  };
};

new P5(sketch);
