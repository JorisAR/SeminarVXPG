import p5 from "p5";
import {Color} from "../Scene/Color";
import {Vector2} from "../Scene/Vector2";
import {RenderCall} from "Components/Scene/RenderCall";


export class Path {
    constructor(public rays: Ray[], public index: number) {
    }

    public draw(settings: RenderCall, rayCount : number, visibleRayCount: number) : void {
        this.rays.forEach((ray : Ray) => ray.draw(settings, rayCount, visibleRayCount, this.index))
    }
}

export class Ray {
    constructor(public from: Vector2,
                public to: Vector2,
                public color: Color = new Color(150))
    {
    }

    public draw(settings: RenderCall, rayCount : number, visibleRayCount: number, index : number) : void {
        const p = settings.p;
        let alpha = 0.5;
        if(visibleRayCount > 0) {
            if(rayCount - index >= visibleRayCount) return;
            alpha = index === rayCount ? 1.0 : 0.15;
        }
        p.push();

        p.stroke(this.color.r, this.color.g, this.color.b, this.color.a * alpha);

        p.line(this.from.x * settings.scale.x, this.from.y  * settings.scale.y,
            this.to.x  * settings.scale.x, this.to.y  * settings.scale.y);
        p.pop();
    }
}