import {Vector2} from "Components/Util/Vector2";
import {RenderCall} from "Components/Scene/RenderCall";
import {SceneObject} from "Components/Scene/Objects/SceneObject";

export class Light extends SceneObject {
    constructor(position: Vector2, public brightness: number) {
        super(position);
    }

    public static Create(position: Vector2, brightness: number): Light {
        return new Light(position, brightness);
    }

    public draw(renderCall: RenderCall): void {
        const p = renderCall.p;
        const radius = 0.1;
        const lineLength = 0.05;
        const wave = Math.sin(2 * p.frameCount / p.getTargetFrameRate()) * 0.01 - 0.075;
        p.push();
        p.fill(255, 255, 0);
        p.stroke(255, 255, 0);
        p.ellipse(this.position.x * renderCall.scale.x, this.position.y * renderCall.scale.y, radius * renderCall.scale.x, radius * renderCall.scale.y);
        for (let angle = 0; angle < 360; angle += 45) {
            const x = Math.cos(p.radians(angle)) * (radius + wave) * renderCall.scale.x;
            const y = Math.sin(p.radians(angle)) * (radius + wave) * renderCall.scale.y;
            const x2 = Math.cos(p.radians(angle)) * (radius + lineLength + wave) * renderCall.scale.x;
            const y2 = Math.sin(p.radians(angle)) * (radius + lineLength + wave) * renderCall.scale.y;
            p.strokeWeight(5);
            p.line(this.position.x * renderCall.scale.x + x, this.position.y * renderCall.scale.y + y, this.position.x * renderCall.scale.x + x2, this.position.y * renderCall.scale.y + y2);
        }
        p.pop();
    }

    public brightnessAt(x2: Vector2): number {
        const factor = this.getPosition().inverseSquareLawFactor(x2);
        return this.brightness * factor;
    }
}