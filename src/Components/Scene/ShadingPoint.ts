import p5 from "p5";
import {Color} from "../Scene/Color";
import {Vector2} from "../Scene/Vector2";

export class ShadingPointCluster {
    private shadingPoints : ShadingPoint[] = []

    constructor(public color : Color) {
    }

    public addShadingPoint(shadingPoint : ShadingPoint) {
        this.shadingPoints.push(shadingPoint);
    }

    draw(p: p5, useClusterColor: boolean) {
        const color : Color = this.color;
        this.shadingPoints.forEach(function (shadingPoint) {
            shadingPoint.draw(p, useClusterColor ? color : undefined);
        });
    }
}

export class ShadingPoint {
    private radius : number = 25;

    constructor(public position: Vector2,
                public color: Color = new Color(150))
    {
    }

    public draw(p: p5, color : Color | undefined) : void {
        let alpha = 1.0;

        if(color === undefined) color = this.color;
/*
        if(visibleRayCount > 0) {
            if(rayCount - this.index > visibleRayCount * 3) return;
            alpha = this.index == rayCount ? 1.0 : 0.15;
        }*/
        p.push();
        p.stroke(color.r, color.g, color.b, this.color.a * alpha);
        p.fill(color.r, color.g, color.b, this.color.a * alpha);
        p.ellipse(this.position.x, this.position.y, this.radius);
        p.pop();
    }
}