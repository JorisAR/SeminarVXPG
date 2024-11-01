import {Vector2} from "Components/Util/Vector2";
import {RenderCall} from "Components/Scene/RenderCall";
import {SceneObject} from "Components/Scene/Objects/SceneObject";

export class Camera extends SceneObject {
    constructor(position: Vector2, public direction: Vector2, public fov: number) {
        super(position);
    }

    public static Create(position: Vector2, direction: Vector2, fov: number): Camera {
        return new Camera(position, direction, fov);
    }

    public draw(renderCall: RenderCall): void {
        const p = renderCall.p;
        const size = 0.1;
        const triangleSize = 0.05;
        const offset = -1.5 * size;
        p.push();
        p.translate(this.position.x * renderCall.scale.x, this.position.y * renderCall.scale.y);
        p.rotate(this.direction.angle());
        p.fill(0, 0, 0);
        p.rect((offset - size) / 2 * renderCall.scale.x, -size / 2 * renderCall.scale.y, size * renderCall.scale.x, size * renderCall.scale.y, 2);
        p.triangle(
            0, -triangleSize * renderCall.scale.y,
            -size / 2 * renderCall.scale.x, 0,
            0, triangleSize * renderCall.scale.y
        );
        p.pop();
    }

    public setDirection(angle: number) {
        this.direction = Vector2.fromAngle(angle);
    }

    public getFovRadians(): number {
        return this.fov * Math.PI / 180;
    }

    public getRandomRayDirection(): Vector2 {
        const angle = (Math.random() - 0.5) * this.getFovRadians(); // Random angle between -90 and 90 degrees
        return this.direction.rotate(angle).normalize();
    }

    public getRayDirection(t: number): Vector2 {
        const angle = (t - 0.5) * this.getFovRadians(); // Random angle between -90 and 90 degrees
        return this.direction.rotate(angle).normalize();
    }
}