import {Rect} from "Components/Util/Rect";
import {Vector2} from "Components/Util/Vector2";
import {Color} from "Components/Util/Color";
import {RenderCall} from "Components/Scene/RenderCall";

export class SceneObject {
    public position : Vector2 = new Vector2(0,0);
    public static : boolean = false; //if true, cannot be moved
    public bounds: Rect;
    constructor(private rects: Rect[], private size : Vector2) {
        this.bounds = Rect.UnionRects(rects);
    }

    public getColliders() : Rect[] {
        return this.rects.map((x) => x);
    }

    public draw(settings: RenderCall, color : Color | undefined) : void {
        this.rects.forEach(function (rect) {
            rect.draw(settings, color);
        });
    }

    public getCenter(): Vector2 {
        return this.bounds.getCenter();
    }

    //--------------------- I should use factory/builder pattern but this works ---------------------------
    public SetCenter(center: Vector2) : SceneObject {
        let newPos = center.subtract(this.size.divide(2));
        let difference = newPos.subtract(this.position);
        this.rects.forEach(function(x) {x.position = x.position.add(difference)})
        this.bounds.position = this.bounds.position.add(difference);

        this.position = newPos;

        return this;
    }

    public SetColor(color: Color) : SceneObject {
        this.rects.forEach(function(x)
        {
            x.stroke = color;
            x.fill = color;
        });
        return this;
    }

    public SetStatic(value: boolean) : SceneObject {
        this.static = value;
        return this;
    }

// Static Constructors
    public static CreateTable(size : Vector2) : SceneObject {
        let legWidth = 0.2 * size.x;
        let rects = [
            new Rect(new Vector2(0, 0), new Vector2(size.x, size.y * 0.25)),
            new Rect(new Vector2(0, size.y * 0.25), new Vector2(legWidth, size.y * 0.75)),
            new Rect(new Vector2(size.x - legWidth, size.y * 0.25), new Vector2(legWidth, size.y * 0.75)),
        ];
        return new SceneObject(rects, size);
    }
    public static CreateSquare(size : Vector2) : SceneObject {
        let rects = [
            new Rect(new Vector2(0, 0), new Vector2(size.x, size.y)),
        ];
        return new SceneObject(rects, size);
    }
    public static CreateSceneBounds(size : Vector2, width : number = 0.05) : SceneObject {
        return new SceneObject([
            new Rect(new Vector2(0, 0), new Vector2(size.x, width)),
            new Rect(new Vector2(0, size.y - width), new Vector2(size.x, width)),
            new Rect(new Vector2(0, 0), new Vector2(width, size.y)),
            new Rect(new Vector2(size.x - width, 0), new Vector2(width, size.y)),
        ], size).SetStatic(true);
    }
}

