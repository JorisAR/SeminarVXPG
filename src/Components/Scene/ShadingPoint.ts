import p5 from "p5";
import {Color} from "../Scene/Color";
import {Vector2} from "../Scene/Vector2";
import {VoxelGrid} from "Components/Scene/VoxelGrid";
import {VoxelCluster} from "Components/Scene/Voxel";

export class ShadingPointCluster {
    private shadingPoints : ShadingPoint[] = []
    private throughput : number[] = [];

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

    public computeThroughput(voxelGrid : VoxelGrid) {
        this.throughput = []
        voxelGrid.voxelClusters.forEach((cluster) => {
            //cluster.voxels
            let throughput : number  = 0;
            let n : number = 0;
            cluster.voxels.forEach((voxel) => {
                //see if it has LOS
                let shadingPoint = this.shadingPoints[Math.floor(Math.random() * this.shadingPoints.length)];
                let from = shadingPoint.position;
                let dir = voxel.rect.getCenter().subtract(from).normalize();
                let hit = voxelGrid.raycast(from, dir);


                //if(hit !== undefined) console.log(voxel.rect.getCenter().distanceTo(hit.point));
                if(hit !== undefined && voxel.rect.containsPoint(hit.point)) {
                    const factor = voxel.rect.getCenter().inverseSquareLawFactor(from)
                    throughput += voxel.getIrradiance() * factor;
                }
                n++;
            })
            if(n === 0) n = 1;
            this.throughput.push(throughput / n);
        });
    }

    public throughputSampleVoxelCluster(voxelGrid : VoxelGrid) {
        this.shadingPoints.forEach((shadingPoint) => {
            let i;

            let weights = [this.throughput[0]];

            for (i = 1; i < this.throughput.length; i++)
                weights[i] = this.throughput[i] + weights[i - 1];

            const random = Math.random() * weights[weights.length - 1];

            for (i = 0; i < weights.length; i++)
                if (weights[i] > random)
                    break;

            let cluster = voxelGrid.voxelClusters[i];
            if(cluster !== undefined) {
                shadingPoint.sampleVoxel(cluster);
            }
        });
    }
}

export class ShadingPoint {
    private radius : number = 5;
    private irradiance : number = 0;

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

    public sampleVoxel(voxelCluster: VoxelCluster) {
        const voxel = voxelCluster.powerSampleVoxel();
        const factor = voxel.rect.getCenter().inverseSquareLawFactor(this.position)
        this.irradiance = voxel.getIrradiance() * factor * 10;
        this.color = new Color(255 * this.irradiance);
    }
}