import {Color} from "Components/Scene/Color";
import {RenderCall} from "Components/Scene/RenderCall";
import {VoxelGrid} from "Components/Scene/VoxelGrid";
import {ShadingPoint} from "Components/Scene/ShadingPoint";
import {Rect} from "Components/Scene/Rect";
import {Vector2} from "Components/Scene/Vector2";

export class ShadingPointCluster {
    private shadingPoints: ShadingPoint[] = []
    private throughput: number[] = [];
    private normalizedThroughput: number[] = []; //throughput, but scaled such that the largest value = 1;
    public rect: Rect | undefined = undefined;

    constructor(public color: Color) {
    }

    public addShadingPoint(shadingPoint: ShadingPoint) {
        this.shadingPoints.push(shadingPoint);
        const offset = new Vector2(0.05, 0.05);

        if(!this.rect) this.rect = new Rect(shadingPoint.position.subtract(offset), offset.multiply(2));
        else {
            this.rect = this.rect.merge(shadingPoint.position);
        }
    }

    draw(settings: RenderCall, useClusterColor: boolean) {
        const color: Color = this.color;
        this.shadingPoints.forEach(function (shadingPoint) {
            shadingPoint.draw(settings, useClusterColor ? color : undefined);
        });
    }

    public computeThroughput(voxelGrid: VoxelGrid) {
        this.throughput = []
        let max = 0;
        voxelGrid.voxelClusters.forEach((cluster) => {
            //cluster.voxels
            let throughput: number = 0;
            let n: number = 0;
            cluster.voxels.forEach((voxel) => {
                //see if it has Line of sight
                const shadingPoint = this.shadingPoints[Math.floor(Math.random() * this.shadingPoints.length)];
                const from = voxel.rect.getCenter();
                const to = shadingPoint.position;
                const dir = to.subtract(from).normalize();
                const hit = voxelGrid.raycast(from, dir);

                if (hit !== undefined && hit.point.distanceTo(to) < 0.01) {
                    const factor = to.inverseSquareLawFactor(from)
                    throughput += voxel.getIrradiance() * factor;
                }
                n++;
            })
            if (n === 0) n = 1;
            throughput /= n
            this.throughput.push(throughput);
            max = Math.max(throughput, max);
        });

        this.normalizedThroughput = this.throughput;
        if(max > 0) {
            for(let i = 0; i < this.normalizedThroughput.length; i++) {
                this.normalizedThroughput[i] = this.normalizedThroughput[i] / max;
            }
        }
    }

    public throughputSampleVoxelCluster(voxelGrid: VoxelGrid) {
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
            if (cluster !== undefined) {
                shadingPoint.sampleVoxel(cluster);
            }
        });
    }

    public getNormalizedThroughput(i : number) : number {
        if(i < 0 || i >= this.normalizedThroughput.length) return 0;
        return this.normalizedThroughput[i];
    }
}