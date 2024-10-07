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

    public draw(p: p5, scale: Vector2 = Vector2.One) : void {
        p.push();
        if(this.stroke.a > 0.5)
            p.stroke(this.stroke.r, this.stroke.g, this.stroke.b, this.stroke.a);
        else
            p.noStroke();

        if(this.fill.a > 0.5)
            p.fill(this.fill.r, this.fill.g, this.fill.b, this.fill.a);
        else
            p.noFill();

        p.rect(
            (this.position.x) * scale.x,
            (this.position.y) * scale.y,
            this.size.x * scale.x,
            this.size.y * scale.y);

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

    public scaled(scale: number) : Rect {
        return new Rect(this.position.multiply(scale), this.size.multiply(scale), this.fill, this.stroke);
    }

    public scaledV(scale: Vector2) : Rect {
        return new Rect(this.position.multiplyV(scale), this.size.multiplyV(scale), this.fill, this.stroke);
    }


}