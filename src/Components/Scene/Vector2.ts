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
    add(v: Vector2): Vector2 {
        return new Vector2(this.x + v.x, this.y + v.y);
    }

    // Subtract another vector from this vector
    subtract(v: Vector2): Vector2 {
        return new Vector2(this.x - v.x, this.y - v.y);
    }

    // Multiply this vector by a scalar
    multiply(scalar: number): Vector2 {
        return new Vector2(this.x * scalar, this.y * scalar);
    }

    multiplyV(scale: Vector2) {
        return new Vector2(this.x * scale.x, this.y * scale.y);
    }

    // Multiply this vector by a scalar
    divide(scalar: number): Vector2 {
        return new Vector2(this.x / scalar, this.y / scalar);
    }

    reflect(normal: Vector2) {
        return this.subtract(normal.multiply(2 * this.dot(normal)));
    }


    // Calculate the dot product of this vector and another vector
    dot(v: Vector2): number {
        return this.x * v.x + this.y * v.y;
    }

    distanceTo(v: Vector2): number {
        return this.subtract(v).length();
    }

    // Calculate the cross product of this vector and another vector
    // Note: In 2D, the cross product is a scalar
    cross(v: Vector2): number {
        return this.x * v.y - this.y * v.x;
    }

    // Calculate the magnitude (length) of this vector
    length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    // Normalize this vector (make it unit length)
    normalize(): Vector2 {
        const mag = this.length();
        return new Vector2(this.x / mag, this.y / mag);
    }

    // Rotate this vector by a given angle (in radians)
    rotate(angle: number): Vector2 {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return new Vector2(
            this.x * cos - this.y * sin,
            this.x * sin + this.y * cos
        );
    }

    // Randomly reflect this vector around a normal vector within ±90 degrees
    randomReflection() {
        const angle = (Math.random() - 0.5) * Math.PI; // Random angle between -90 and 90 degrees
        return this.rotate(angle).normalize();
    }
}
