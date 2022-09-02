import P5 from "p5";

export default class GraphNode {
  p5: P5;
  pos: P5.Vector;
  size: number;
  val: number;
  uid: number;
  selected: boolean;
  neighbors: GraphNode[];

  constructor(p5: P5, position: P5.Vector, value: number, uid: number) {
    this.p5 = p5;
    this.pos = position;
    this.val = value;
    this.uid = uid;
    this.size = 50;
    this.selected = false;
    this.neighbors = [];
  }

  draw() {
    const p5 = this.p5; // just for convenience

    p5.push();

    p5.translate(this.pos);

    p5.stroke(0);

    p5.strokeWeight(3);
    p5.fill(this.selected ? "cyan" : "white");
    p5.ellipse(0, 0, this.size);

    p5.textAlign("center", "center");
    p5.textSize(this.size / 2);
    p5.strokeWeight(1);
    p5.fill(0);
    p5.text(this.val, 0, 0);

    p5.pop();
  }

  clickHandler(): GraphNode {
    const p5 = this.p5;

    if (p5.dist(p5.mouseX, p5.mouseY, this.pos.x, this.pos.y) < this.size / 2) {
      return this;
    }
  }
}
