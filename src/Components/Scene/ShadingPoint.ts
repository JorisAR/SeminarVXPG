import {Color} from "../Scene/Color";
import {Vector2} from "../Scene/Vector2";
import {RenderCall} from "Components/Scene/RenderCall";
import {VoxelCluster} from "Components/Scene/VoxelCluster";

export class ShadingPoint {
    private radius : number = 0.05;
    private irradiance : number = 0;

    constructor(public position: Vector2,
                public color: Color = new Color(150))
    {
    }

    public draw(settings: RenderCall, color : Color | undefined) : void {
        const alpha = 1.0;
        const p = settings.p;

        if(color === undefined) color = this.color;
/*
        if(visibleRayCount > 0) {
            if(rayCount - this.index > visibleRayCount * 3) return;
            alpha = this.index == rayCount ? 1.0 : 0.15;
        }*/
        p.push();
        p.stroke(color.r, color.g, color.b, this.color.a * alpha);
        p.fill(color.r, color.g, color.b, this.color.a * alpha);
        p.ellipse(this.position.x * settings.scale.x, this.position.y * settings.scale.y,
            this.radius * settings.scale.x, this.radius * settings.scale.y);
        p.pop();
    }

    public sampleVoxel(voxelCluster: VoxelCluster) {
        const voxel = voxelCluster.powerSampleVoxel();
        const factor = voxel.rect.getCenter().inverseSquareLawFactor(this.position)
        this.irradiance = voxel.getIrradiance() * factor;
        this.color = Color.ColorFromIrradiance(this.irradiance);
    }
}