import p5 from "p5";
import {Vector2} from "Components/Util/Vector2";
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
        return new Camera(position, direction, fov, (renderCall: RenderCall) => {
            const p = renderCall.p;
            const size = 0.1;
            const triangleSize = 0.05;
            const offset = -1.5 * size;
            p.push();
            p.translate(position.x * renderCall.scale.x, position.y * renderCall.scale.y);
            p.rotate(direction.angle());
            p.fill(0, 0, 0);
            p.rect((offset - size) / 2 * renderCall.scale.x, -size / 2 * renderCall.scale.y, size * renderCall.scale.x, size * renderCall.scale.y, 2);
            p.triangle(
                0, -triangleSize * renderCall.scale.y,
                -size  / 2 * renderCall.scale.x, 0,
                0, triangleSize * renderCall.scale.y);
            p.pop();
        });
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
        return new Light(position, brightness, (renderCall: RenderCall) => {
            const p = renderCall.p;
            const radius = 0.1;
            const lineLength = 0.05;
            const wave = Math.sin( 2 * p.frameCount / p.getTargetFrameRate()) * 0.01 - 0.075;

            p.push();
            p.fill(255, 255, 0);
            p.stroke(255, 255, 0);
            p.ellipse(position.x * renderCall.scale.x, position.y * renderCall.scale.y, radius * renderCall.scale.x, radius * renderCall.scale.y);

            for (let angle = 0; angle < 360; angle += 45) {
                const x = Math.cos(p.radians(angle)) * (radius + wave) * renderCall.scale.x;
                const y = Math.sin(p.radians(angle)) * (radius + wave) * renderCall.scale.y;
                const x2 = Math.cos(p.radians(angle)) * (radius + lineLength + wave) * renderCall.scale.x;
                const y2 = Math.sin(p.radians(angle)) * (radius + lineLength + wave) * renderCall.scale.y;
                p.strokeWeight(5);
                p.line(position.x * renderCall.scale.x + x, position.y * renderCall.scale.y + y, position.x * renderCall.scale.x + x2, position.y * renderCall.scale.y + y2);
            }

            p.pop();
        });
    }


    public brightnessAt(x2: Vector2) : number {
        const factor = this.getPosition().inverseSquareLawFactor(x2);
        return this.brightness * factor;
    }
}