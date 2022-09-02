import P5 from "p5";
import GraphNode from "./GraphNode";

export default class Edge {
  p5: P5;
  from: GraphNode;
  to: GraphNode;
  weight: number;
  newWeight: string;
  selected: boolean;
  hovering: boolean;

  constructor(p5: P5, from: GraphNode, to: GraphNode, weight: number = 1) {
    this.p5 = p5;
    this.from = from;
    this.to = to;
    this.weight = weight;
    this.newWeight = "";
    this.selected = false;
    this.hovering = false;
  }

  draw() {
    const p5 = this.p5;

    p5.stroke(0);
    if (this.selected) {
      p5.strokeWeight(6);
    } else {
      p5.strokeWeight(this.hovering ? 4 : 3);
    }
    p5.line(this.from.pos.x, this.from.pos.y, this.to.pos.x, this.to.pos.y);

    p5.push();

    var angle = p5.atan2(
      this.from.pos.y - this.to.pos.y,
      this.from.pos.x - this.to.pos.x
    ); //gets the angle of the line

    p5.translate(this.to.pos.x, this.to.pos.y); //translates to the destination vertex
    p5.rotate(angle - p5.HALF_PI); //rotates the arrow point
    p5.line(0, this.to.size / 2, -this.to.size * 0.2, this.to.size * 1.1);
    p5.line(0, this.to.size / 2, this.to.size * 0.2, this.to.size * 1.1);
    p5.pop();
  }

  clickHandler(): Edge {
    const p5 = this.p5;

    let slope: number =
      (this.to.pos.y - this.from.pos.y) / (this.to.pos.x - this.from.pos.y);
    let expectedY: number =
      slope * (p5.mouseX - this.from.pos.x) + this.from.pos.y;
    if (Math.abs(expectedY - p5.mouseY) <= 5) {
      return this;
    }
  }
}
