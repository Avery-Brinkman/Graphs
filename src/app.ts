import P5 from "p5";
import "./styles.scss";

import GraphRenderer from "./rendering/GraphRenderer";
import VertexRenderer from "./rendering/VertexRenderer";

// Creating the sketch itself
const sketch = (p5: P5) => {
  let graph: GraphRenderer;
  let prevVert: VertexRenderer;

  // The sketch setup method
  p5.setup = () => {
    graph = new GraphRenderer(p5);

    // Creating and positioning the canvas
    const canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight);
    canvas.parent("app");

    graph.makeVertex(200, 200, 1);
    graph.makeVertex(100, 100, 2);
    graph.makeVertex(300, 100, 3);
    graph.makeEdge(0, 1);
  };

  // The sketch draw method
  p5.draw = () => {
    p5.background(123);

    graph.draw();
  };

  p5.mouseClicked = () => {
    // graph.clickHandler();

    if (p5.keyIsDown(p5.SHIFT)) {
      graph.makeVertex(p5.mouseX, p5.mouseY, 0);
    } else if (p5.keyIsDown(p5.CONTROL)) {
      if (prevVert) prevVert.pos.set(p5.mouseX, p5.mouseY);
    } else {
      let selectedVert: VertexRenderer;

      graph.r_vertices.forEach((vert) => {
        selectedVert = vert.clickHandler() ?? selectedVert;
      });

      if (prevVert && selectedVert && selectedVert != prevVert) {
        graph.makeEdge(prevVert.uid, selectedVert.uid);
      }
      prevVert = selectedVert;
    }
  };

  p5.keyPressed = () => {
    if (prevVert) {
      if (p5.keyIsDown(p5.DELETE)) {
        graph.removeVertex(prevVert.uid);
      } else if (p5.keyIsDown(69)) {
        graph.removeEdgeFrom(prevVert.uid);
        graph.removeEdgeTo(prevVert.uid);
      } else if (p5.keyCode.valueOf() >= 48 && p5.keyCode.valueOf() <= 57) {
        prevVert.val = p5.keyCode.valueOf() - 48;
      }
    }
  };
};

new P5(sketch);
