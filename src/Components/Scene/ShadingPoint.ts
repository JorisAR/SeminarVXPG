import {Color} from "../Scene/Color";
import {Vector2} from "../Scene/Vector2";
import {RenderCall} from "Components/Scene/RenderCall";
import {VoxelCluster} from "Components/Scene/VoxelCluster";
import {Voxel} from "Components/Scene/Voxel";
import {VoxelGrid} from "Components/Scene/VoxelGrid";
import Settings, {Tab} from "Components/settings/Settings";

export class ShadingPoint {
    private radius : number = 0.05;
    private naiveIrradiance : number = 0;
    private irradiance : number = 0;
    public sampledVoxel : Voxel | undefined;
    private pathTracedColor: Color = new Color(0);
    private pathTraceDir: Vector2 = Vector2.Zero;

    constructor(public position: Vector2,
                public normal : Vector2,
                public color: Color = new Color(150))
    {
    }

    public draw(settings: RenderCall, color : Color | undefined, index: number) : void {
        let alpha = 1.0;
        if(settings.selectedShadingPoint !== undefined && settings.selectedShadingPoint !== this)
            alpha = 0.05;
        const p = settings.p;

        if(color === undefined)
            color = Settings.selectedTab === Tab.VoxelSampling ? this.pathTracedColor : this.color;


        if(Settings.selectedTab === Tab.VoxelSampling && Settings.voxelSamplingShowArrows && index % Settings.voxelSamplingSPFrequency === 0)
            this.pathTraceDir.drawArrow(settings, this.position.multiplyV(settings.scale));

        p.push();
        p.stroke(color.r, color.g, color.b, this.color.a * alpha);
        p.fill(color.r, color.g, color.b, this.color.a * alpha);
        p.ellipse(this.position.x * settings.scale.x, this.position.y * settings.scale.y,
            this.radius * settings.scale.x, this.radius * settings.scale.y);
        p.pop();

    }

    public sampleVoxel(voxelCluster: VoxelCluster) {
        this.sampledVoxel = voxelCluster.powerSampleVoxel();
        const factor = this.sampledVoxel.rect.getCenter().inverseSquareLawFactor(this.position)
        this.naiveIrradiance = this.sampledVoxel.getIrradiance() * factor;
        this.color = Color.ColorFromIrradiance(this.naiveIrradiance);
    }

    //get light at.
    public pathTrace(voxelGrid: VoxelGrid): number {
        let lightSample = voxelGrid.scene.sampleLight(this.position, voxelGrid);

        if (lightSample) {
            this.pathTraceDir = voxelGrid.scene.light.getPosition().subtract(this.position).normalize()
            return lightSample;
        }

        this.pathTraceDir = this.sampledVoxel?.rect.getCenter().subtract(this.position).normalize() ?? this.normal.randomReflection();
        if(Settings.voxelSamplingForcePT) this.pathTraceDir = this.normal.randomReflection();

        const hit = voxelGrid.raycast(this.position, this.pathTraceDir);

        if (hit) {
            lightSample = voxelGrid.scene.sampleLight(hit.point, voxelGrid);
            if (lightSample) {
                return lightSample;
            }
        }
        return 0;
    }

    public setIrradiance(irradiance : number){
        this.naiveIrradiance = irradiance;
        this.pathTracedColor = Color.ColorFromIrradiance(this.naiveIrradiance);
    }
}