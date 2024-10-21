import {Rect} from "Components/Scene/Rect";
import p5 from "p5";
import {Vector2} from "Components/Scene/Vector2";
import {Color} from "Components/Scene/Color";
import {RenderCall} from "Components/Scene/RenderCall";


export class VoxelCluster {
    public voxels : Voxel[] = []

    constructor(public rect : Rect, public color : Color) {
    }

    public addVoxel(voxel : Voxel) {
        this.voxels.push(voxel);
    }

    public draw(renderCall: RenderCall, useClusterColor: boolean) {
        const color : Color = this.color;
        this.voxels.forEach(function (voxel) {
            voxel.draw(renderCall, useClusterColor ? color : undefined);// useClusterColor ? color : undefined);
        });
    }


    public tryGetVoxelAt(point: Vector2) : Voxel | undefined {
        for (const voxel of this.voxels) {
            if(voxel.rect.containsPoint(point))
                return voxel;
        }
        return  undefined;
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
}

export class Voxel {
    //should have a rect
    //should have a brightness
    private irradiance : number = 0;
    private injectionCount = 0;

    constructor(public rect : Rect) {
        this.resetIrradiance();
    }

    public draw(renderCall : RenderCall, color: Color | undefined) : void {
        this.rect.draw(renderCall, color);
    }

    public inject(brightness: number) {
        this.irradiance += brightness;
        this.injectionCount++;

        let c = this.irradiance / this.injectionCount;
        this.rect.fill = new Color(255 * c, 255 * c, 255 * c, 250);
    }

    public getIrradiance() : number {
        if(this.injectionCount <= 0) return 0;
        return this.irradiance / this.injectionCount;
    }

    public resetIrradiance() {
        this.irradiance = 0;
        this.injectionCount = 0;
        this.rect.fill = new Color(0, 0, 0, 50);
    }
}