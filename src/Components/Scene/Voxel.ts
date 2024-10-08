import {Rect} from "Components/Scene/Rect";
import p5 from "p5";
import {Vector2} from "Components/Scene/Vector2";
import {Color} from "Components/Scene/Color";

export class Voxel {
    //should have a rect
    //should have a brightness
    private irradiance : number = 0;
    private injectionCount = 0;

    constructor(public rect : Rect) {
        this.resetIrradiance();
    }

    public draw(p: p5, scale: Vector2 = Vector2.One) : void {
        this.rect.draw(p, scale);
    }

    public inject(brightness: number) {
        this.irradiance += brightness;
        this.injectionCount++;

        let c = this.irradiance / this.injectionCount;

        this.rect.fill = new Color(c, c, c, 250);
    }

    public resetIrradiance() {
        this.irradiance = 0;
        this.injectionCount = 0;
        this.rect.fill = new Color(0, 0, 0, 50);
    }
}