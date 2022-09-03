import P5 from "p5";
import Edge from "../Edge";
import VertexRenderer from "./VertexRenderer";

export default class EdgeRenderer extends Edge {
  p5: P5;
  startVert: VertexRenderer;
  endVert: VertexRenderer;
  selected: boolean;

  constructor(p5: P5, startVert: VertexRenderer, endVert: VertexRenderer) {
    super(startVert, endVert);
    this.p5 = p5;
    this.startVert = startVert;
    this.endVert = endVert;
    this.selected = false;
  }

  draw() {
    const p5: P5 = this.p5;
    const from: P5.Vector = this.startVert.pos;
    const to: P5.Vector = this.endVert.pos;

    p5.stroke(0);
    p5.strokeWeight(this.selected ? 6 : 3);
    p5.line(from.x, from.y, to.x, to.y);

    p5.push();

    let angle: number = p5.atan2(from.y - to.y, from.x - to.x);

    p5.translate(to.x, to.y);
    p5.rotate(angle - p5.HALF_PI);
    p5.line(
      0,
      this.endVert.size / 2,
      -this.endVert.size * 0.2,
      this.endVert.size * 1.1
    );
    p5.line(
      0,
      this.endVert.size / 2,
      this.endVert.size * 0.2,
      this.endVert.size * 1.1
    );
    p5.pop();
  }

  clickHandler() {
    const p5: P5 = this.p5;
    const from: P5.Vector = this.startVert.pos;
    const to: P5.Vector = this.endVert.pos;

    // Get slope of edge line
    let slope: number = (to.y - from.y) / (to.x - from.y);
    // Find what y should be if mouse was directly on the line
    let expectedY: number = slope * (p5.mouseX - from.x) + from.y;
    // Treat as clicked if mouse is within some distance
    if (Math.abs(expectedY - p5.mouseY) <= 5) {
      return this;
    }
  }
}
