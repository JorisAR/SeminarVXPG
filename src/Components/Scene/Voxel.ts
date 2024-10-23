import {Rect} from "Components/Scene/Rect";
import {Color} from "Components/Scene/Color";
import {RenderCall} from "Components/Scene/RenderCall";
import {Vector2} from "Components/Scene/Vector2";
import Settings from "Components/settings/Settings";


export class Voxel {
    //should have a rect
    //should have a brightness
    private irradiance : number = 0;
    private injectionCount = 0;

    constructor(public rect : Rect) {
        this.resetIrradiance();
    }

    public draw(renderCall : RenderCall, color: Color | undefined) : void {

        if(renderCall.selectedShadingPoint !== undefined)
        {
            if(renderCall.selectedShadingPoint.sampledVoxel !== this)
                color = Color.ColorFromNormalizedIrradiance(0, 200);
        } if(Settings.voxelSamplingPrettyRenderer) {
            color = Color.ColorFromNormalizedIrradiance(this.getIrradiance(), 100);
        }
        this.rect.draw(renderCall, color);
    }

    public inject(brightness: number) {
        this.irradiance += brightness;
        this.injectionCount++;

        this.rect.fill = Color.ColorFromIrradiance(this.getIrradiance());
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