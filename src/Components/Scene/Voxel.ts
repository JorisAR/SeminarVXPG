import {Rect} from "Components/Scene/Rect";
import {Color} from "Components/Scene/Color";
import {RenderCall} from "Components/Scene/RenderCall";
import {Vector2} from "Components/Scene/Vector2";


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
        this.rect.fill = Color.ColorFromIrradiance(c);
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