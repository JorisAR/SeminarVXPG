import p5 from "p5";
import {Color} from "Components/Util/Color";
import {Vector2} from "Components/Util/Vector2";
import {RenderCall} from "Components/Scene/RenderCall";

export class Rect {
    static Empty = new Rect(Vector2.Zero, Vector2.Zero);

    constructor(public position: Vector2,
                public  size: Vector2,
                public  fill: Color = new Color(150, 150, 150, 255),
                public  stroke: Color = new Color(150, 150, 150, 255))
    {
    }

    public draw(settings: RenderCall, color : Color | undefined = undefined) : void {
        const p = settings.p;
        p.push();

        let stroke = this.stroke;
        if(color !== undefined) stroke = color;

        if(stroke.a > 0.5)
            p.stroke(stroke.r, stroke.g, stroke.b, stroke.a);
        else
            p.noStroke();

        let fill = this.fill;
        if(color !== undefined) fill = color;

        if(fill.a > 0.5)
            p.fill(fill.r, fill.g, fill.b, fill.a);
        else
            p.noFill();

        const pos = this.position.add(settings.offset).multiplyV(settings.scale);
        const size = this.size.add(settings.offset).multiplyV(settings.scale);
        p.rect(pos.x, pos.y, size.x, size.y);

        p.pop();
    }

    public collides(other: Rect): boolean {
        return (
            this.position.x + this.size.x >= other.position.x &&    // r1 right edge past r2 left
            this.position.x <= other.position.x + other.size.x &&    // r1 left edge past r2 right
            this.position.y + this.size.y >= other.position.y &&    // r1 top edge past r2 bottom
            this.position.y <= other.position.y + other.size.y      // r1 bottom edge past r2 top
        );
    }

    public merge(point: Vector2) : Rect {
        const min = point.min(this.position);
        const max = point.max(this.getEnd());
        return new Rect(min, max.subtract(min), this.fill, this.stroke);
    }

    public union(other: Rect): Rect {
        const minX = Math.min(this.position.x, other.position.x);
        const minY = Math.min(this.position.y, other.position.y);
        const maxX = Math.max(this.position.x + this.size.x, other.position.x + other.size.x);
        const maxY = Math.max(this.position.y + this.size.y, other.position.y + other.size.y);
        return new Rect(new Vector2(minX, minY), new Vector2(maxX - minX, maxY - minY), this.fill, this.stroke);
    }

    public intersection(other: Rect): Rect | undefined {
        const minX = Math.max(this.position.x, other.position.x);
        const minY = Math.max(this.position.y, other.position.y);
        const maxX = Math.min(this.position.x + this.size.x, other.position.x + other.size.x);
        const maxY = Math.min(this.position.y + this.size.y, other.position.y + other.size.y);

        if (minX < maxX && minY < maxY) {
            return new Rect(new Vector2(minX, minY), new Vector2(maxX - minX, maxY - minY), this.fill, this.stroke);
        } else {
            // Return an "empty" rectangle if they do not intersect
            return undefined;
        }
    }

    public unionIntersections(rects: Rect[], buffer: number): Rect {
        let result : Rect | undefined = undefined;
        for (const rect of rects) {
            if (this.collides(rect)) {
                const intersection = this.intersection(rect.grow(buffer));
                if(intersection) {
                    if(result === undefined)
                        result = intersection;
                    else
                        result = result.union(intersection);
                }
            }
        }
        if(result === undefined) return this;
        return result;
    }


    public containsPoint(point: Vector2) : boolean {
        return (
            point.x >= this.position.x &&
            point.x < this.position.x + this.size.x &&
            point.y >= this.position.y &&
            point.y < this.position.y + this.size.y
        );
    }

    public applyScale(scale: Vector2): void {
        this.position = this.position.multiplyV(scale);
        this.size = this.size.multiplyV(scale);
    }

    public getCenter() : Vector2 {
        return this.position.add(this.size.multiply(0.5));
    }

    public getEnd() : Vector2 {
        return this.position.add(this.size);
    }

    public grow(amount : number): Rect {
        return new Rect(
            this.position.subtract(Vector2.One.multiply(amount)),
            this.size.add(Vector2.One.multiply(2.0 * amount)),
            this.fill,
            this.stroke,
            );
    }

    public getRandomPointWithin(): Vector2 {
        return this.position.add(this.size.multiplyV(new Vector2(Math.random(), Math.random())));
    }


    static UnionRects(rects: Rect[]) : Rect {
        if(rects.length <= 0) return Rect.Empty;
        return rects.reduce((sum, x) => sum.union(x), rects[0]);
    }
}