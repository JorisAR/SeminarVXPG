import {Rect} from "Components/Util/Rect";
import {Color} from "Components/Util/Color";
import {RenderCall} from "Components/Scene/RenderCall";
import {Vector2} from "Components/Util/Vector2";
import {Voxel} from "Components/Scene/Voxel";

export class VoxelCluster {
    public voxels: Voxel[] = []
    ;

    constructor(public rect: Rect, public color: Color, private index: number) {
    }

    public addVoxel(voxel: Voxel) {
        this.voxels.push(voxel);
    }

    public draw(renderCall: RenderCall, useClusterColor: boolean) {
        let color: Color = this.color;
        if(renderCall.selectedShadingCluster) {
            useClusterColor = true;
            color = Color.ColorFromNormalizedIrradiance(renderCall.selectedShadingCluster.getNormalizedThroughput(this.index), 200);
        }
        this.voxels.forEach(function (voxel) {
            voxel.draw(renderCall, useClusterColor ? color : undefined);// useClusterColor ? color : undefined);
        });
    }


    public tryGetVoxelAt(point: Vector2): Voxel | undefined {
        for (const voxel of this.voxels) {
            if (voxel.rect.containsPoint(point))
                return voxel;
        }
        return undefined;
    }

    resetIrradiance() {
        this.voxels.forEach(x => x.resetIrradiance());
    }

    public powerSampleVoxel() {
        let i;
        let weights = [this.voxels[0].getIrradiance()];
        for (i = 1; i < this.voxels.length; i++)
            weights[i] = this.voxels[i].getIrradiance() + weights[i - 1];

        const random = Math.random() * weights[weights.length - 1];

        for (i = 0; i < weights.length; i++)
            if (weights[i] > random)
                break;

        return this.voxels[i];
    }

    // powerSampleIrradiance(position: Vector2) {
    //     let i;
    //     let weights = [this.voxels[0].getIrradianceFrom(position)];
    //     for (i = 1; i < this.voxels.length; i++)
    //         weights[i] = this.voxels[i].getIrradianceFrom(position) + weights[i - 1];
    //
    //     const random = Math.random() * weights[weights.length - 1];
    //
    //     for (i = 0; i < weights.length; i++)
    //         if (weights[i] > random)
    //             break;
    //
    //     return this.voxels[i].getIrradianceFrom(position);
    // }
}