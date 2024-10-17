import p5 from "p5";
import {Vector2} from "../Scene/Vector2";
import {Scene} from "Components/Scene/Scene";
import {RenderCall} from "Components/Scene/RenderCall";

export type DrawOperation = (renderCall: RenderCall) => void;

export class Gizmo {
    constructor(private position: Vector2,
                private drawOperation : DrawOperation)
    {
    }

    public draw(renderCall: RenderCall) : void {
        this.drawOperation(renderCall);
    }

    public getPosition() : Vector2 {
        return this.position;
    }
}

export class Camera extends Gizmo {
    constructor(position: Vector2, public direction: Vector2, public fov: number,
                drawOperation : DrawOperation) {
        super(position, drawOperation);
    }

    public static Create(position: Vector2, direction: Vector2, fov: number) : Camera {
        return new Camera(position, direction, fov, (renderCall: RenderCall) =>
            {
                const radius = 0.1;
                const p = renderCall.p;
                p.push();
                p.fill(0, 0, 0);
                p.ellipse(position.x * renderCall.scale.x, position.y * renderCall.scale.y,
                    radius * renderCall.scale.x, radius * renderCall.scale.y);
                p.pop();
            }
        );
    }

    public getFovRadians() : number {
        return this.fov * Math.PI / 180;
    }

    public getRandomRayDirection() : Vector2 {
        const angle = (Math.random() - 0.5) * this.getFovRadians(); // Random angle between -90 and 90 degrees
        return this.direction.rotate(angle).normalize();
    }

    public getRayDirection(t: number) : Vector2 {
        const angle = (t - 0.5) * this.getFovRadians(); // Random angle between -90 and 90 degrees
        return this.direction.rotate(angle).normalize();
    }
}

export class Light extends Gizmo {
    constructor(position: Vector2, public brightness: number,
                drawOperation : DrawOperation) {
        super(position, drawOperation);
    }

    public static Create(position: Vector2, brightness: number) : Light {
        return new Light(position, brightness, (renderCall: RenderCall) =>
            {
                const radius = 0.1;
                const p = renderCall.p;
                p.push();
                p.fill(255, 255, 0);
                p.stroke(255, 255, 0);
                p.ellipse(position.x * renderCall.scale.x, position.y * renderCall.scale.y,
                    radius * renderCall.scale.x, radius * renderCall.scale.y);
                p.pop();
            }
        );
    }

    public brightnessAt(x2: Vector2) : number {
        const factor = this.getPosition().inverseSquareLawFactor(x2);
        return this.brightness * factor;
    }
}