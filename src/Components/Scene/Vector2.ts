import {RenderCall} from "Components/Scene/RenderCall";
import {Color} from "Components/Scene/Color";

export class Vector2 {
    x: number;
    y: number;

    constructor(x: number, y: number);
    constructor(value: number);
    constructor(xOrValue: number, y?: number) {
        if (y === undefined) {
            this.x = xOrValue;
            this.y = xOrValue;
        } else {
            this.x = xOrValue;
            this.y = y;
        }
    }

    static Zero = new Vector2(0, 0);
    static One = new Vector2(1, 1);
    static UnitX = new Vector2(1, 0);
    static UnitY = new Vector2(0, 1);

    // Add another vector to this vector
    public add(v: Vector2): Vector2 {
        return new Vector2(this.x + v.x, this.y + v.y);
    }

    // Subtract another vector from this vector
    public subtract(v: Vector2): Vector2 {
        return new Vector2(this.x - v.x, this.y - v.y);
    }

    // Multiply this vector by a scalar
    public multiply(scalar: number): Vector2 {
        return new Vector2(this.x * scalar, this.y * scalar);
    }

    public multiplyV(scale: Vector2) {
        return new Vector2(this.x * scale.x, this.y * scale.y);
    }

    // Multiply this vector by a scalar
    public divide(scalar: number): Vector2 {
        return new Vector2(this.x / scalar, this.y / scalar);
    }
    public divideV(scale: Vector2) {
        return new Vector2(this.x / scale.x, this.y / scale.y);
    }

    public reflect(normal: Vector2) {
        return this.subtract(normal.multiply(2 * this.dot(normal)));
    }

    // Calculate the dot product of this vector and another vector
    public dot(v: Vector2): number {
        return this.x * v.x + this.y * v.y;
    }

    public distanceTo(v: Vector2): number {
        return this.subtract(v).length();
    }

    // Calculate the cross product of this vector and another vector
    // Note: In 2D, the cross product is a scalar
    public cross(v: Vector2): number {
        return this.x * v.y - this.y * v.x;
    }

    // Calculate the magnitude (length) of this vector
    public length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    // Normalize this vector (make it unit length)
    public normalize(): Vector2 {
        const mag = this.length();
        return new Vector2(this.x / mag, this.y / mag);
    }

    // Rotate this vector by a given angle (in radians)
    public rotate(angle: number): Vector2 {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return new Vector2(
            this.x * cos - this.y * sin,
            this.x * sin + this.y * cos
        );
    }

    // Randomly reflect this vector around a normal vector within ±90 degrees
    public randomReflection() {
        const angle = (Math.random() - 0.5) * Math.PI; // Random angle between -90 and 90 degrees
        return this.rotate(angle).normalize();
    }

    //elementwise min
    public min(v: Vector2): Vector2 {
        return new Vector2(Math.min(this.x, v.x), Math.min(this.y, v.y));
    }

    //elementwise max
    public max(v: Vector2): Vector2 {
        return new Vector2(Math.max(this.x, v.x), Math.max(this.y, v.y));
    }

    public toString() : string {
        return `{${this.x}, ${this.y}}`
    }


    public inverseSquareLawFactor(v: Vector2) : number {
        const r = this.distanceTo(v) / 2 + 0.000001;
        return 1 / (4 * Math.PI * r * r);
    }

    public angle() : number {
        return Math.atan2(this.y, this.x);
    }

    public drawArrow(settings: RenderCall, from: Vector2, color: Color = new Color(0, 255, 0, 150)) {
        const p = settings.p;
        const length = 100; // Arrow length
        const angle = this.angle();
        let dir = this.normalize();
        const arrowTip = from.add(dir.multiply(length));
        const arrowTipBase = from.add(dir.multiply(length * 0.8));
        const leftWing = arrowTipBase.add(new Vector2(-dir.y, dir.x).normalize().multiply(5));
        const rightWing = arrowTipBase.add(new Vector2(dir.y, -dir.x).normalize().multiply(5));

        p.push();
        p.noFill();

        p.strokeWeight(3);
        p.beginShape();

        p.vertex(from.x, from.y);
        p.vertex(arrowTipBase.x, arrowTipBase.y);
        p.vertex(leftWing.x, leftWing.y);
        p.vertex(arrowTip.x, arrowTip.y);
        p.vertex(rightWing.x, rightWing.y);
        p.vertex(arrowTipBase.x, arrowTipBase.y);


        p.stroke(color.r, color.g, color.b, color.a);
        p.endShape();

        // Now apply the alpha value


        p.pop();


    }



}
