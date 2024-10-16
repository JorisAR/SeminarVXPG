import p5 from "p5";
import {Vector2} from "../Scene/Vector2";
import {Scene} from "Components/Scene/Scene";

export type DrawOperation = (p: p5, position: Vector2) => void;

export class Gizmo {
    constructor(private position: Vector2,
                private drawOperation : DrawOperation)
    {
    }

    public draw(p: p5) : void {
        this.drawOperation(p, this.position);
    }

    public getPosition() : Vector2 {
        return this.position;
    }

    applyScale(difference: Vector2) {
        this.position = this.position.multiplyV(difference);
    }
}

export class Camera extends Gizmo {
    constructor(position: Vector2, public direction: Vector2, public fov: number,
                drawOperation : DrawOperation) {
        super(position, drawOperation);
    }

    public static Create(position: Vector2, direction: Vector2, fov: number) : Camera {
        return new Camera(position, direction, fov, (p: p5, position: Vector2) =>
            {
                p.push();
                p.fill(0, 0, 0);
                p.ellipse(position.x, position.y, 25, 25);
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
        return new Light(position, brightness, (p: p5, position: Vector2) =>
            {
                p.push();
                p.fill(255, 255, 0);
                p.stroke(255, 255, 0);
                p.ellipse(position.x, position.y, 25, 25);
                p.pop();
            }
        );
    }

    public brightnessAt(x2: Vector2) : number {
        const factor = this.getPosition().inverseSquareLawFactor(x2);
        //const dist = 1.0 - Math.min(this.getPosition().distanceTo(x2) / this.falloff, 1.0);

        return this.brightness * factor;
    }
}