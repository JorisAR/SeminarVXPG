import p5 from "p5";
import {Color} from "../Scene/Color";
import {Vector2} from "../Scene/Vector2";

export class Rect {
    constructor(public position: Vector2,
                public  size: Vector2,
                public  fill: Color = new Color(150, 150, 150, 255),
                public  stroke: Color = new Color(150, 150, 150, 255))
    {
    }

    public draw(p: p5, color : Color | undefined = undefined) : void {
        p.push();

        let stroke = this.stroke;
        if(color !== undefined) stroke = color;

        if(stroke.a > 0.5)
            p.stroke(stroke.r, stroke.g, stroke.b, stroke.a);
        else
            p.noStroke();

        let fill = this.fill;
        if(color !== undefined) fill = color;

        if(fill.a > 0.5)
            p.fill(fill.r, fill.g, fill.b, fill.a);
        else
            p.noFill();

        p.rect(
            (this.position.x),// * scale.x,
            (this.position.y),// * scale.y,
            this.size.x,// * scale.x,
            this.size.y);// * scale.y);

        p.pop();
    }

    public collides(other: Rect): boolean {
        return (
            this.position.x + this.size.x >= other.position.x &&    // r1 right edge past r2 left
            this.position.x <= other.position.x + other.size.x &&    // r1 left edge past r2 right
            this.position.y + this.size.y >= other.position.y &&    // r1 top edge past r2 bottom
            this.position.y <= other.position.y + other.size.y      // r1 bottom edge past r2 top
        );
    }

    public containsPoint(point: Vector2) : boolean {
        return (
            point.x >= this.position.x &&
            point.x < this.position.x + this.size.x &&
            point.y >= this.position.y &&
            point.y < this.position.y + this.size.y
        );
    }

    applyScale(difference: Vector2) {
        this.position = this.position.multiplyV(difference);
        this.size = this.size.multiplyV(difference);
    }
}