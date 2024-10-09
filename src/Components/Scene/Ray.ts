import p5 from "p5";
import {Color} from "../Scene/Color";
import {Vector2} from "../Scene/Vector2";


export class Ray {
    constructor(public from: Vector2,
                public to: Vector2,
                public color: Color = new Color(150),
                public index: number)
    {
    }

    public draw(p: p5, rayCount : number, visibleRayCount: number) : void {

        let alpha = 0.5;
        if(visibleRayCount > 0) {
            if(rayCount - this.index >= visibleRayCount * 3) return;
            alpha = this.index == rayCount ? 1.0 : 0.15;
        }
        p.push();

        p.stroke(this.color.r, this.color.g, this.color.b, this.color.a * alpha);

        p.line(this.from.x, this.from.y, this.to.x, this.to.y);
        p.pop();
    }
}