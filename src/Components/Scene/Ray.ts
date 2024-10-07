import p5 from "p5";
import {Color} from "../Scene/Color";
import {Vector2} from "../Scene/Vector2";

export class Ray {
    constructor(public from: Vector2,
                public to: Vector2,
                public color: Color = new Color(150))
    {
    }

    public draw(p: p5) : void {
        p.push();
        p.stroke(this.color.r, this.color.g, this.color.b, this.color.a);

        p.line(this.from.x, this.from.y, this.to.x, this.to.y);
        p.pop();
    }
}