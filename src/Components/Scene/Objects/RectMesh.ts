import {Rect} from "Components/Util/Rect";
import {Vector2} from "Components/Util/Vector2";
import {Color} from "Components/Util/Color";
import {RenderCall} from "Components/Scene/RenderCall";
import {SceneObject} from "Components/Scene/Objects/SceneObject";

export class RectMesh extends SceneObject {

    constructor(private rects: Rect[]) {
        super(Vector2.Zero);
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

    //--------------------- I should use factory/builder pattern but this works ---------------------------

    public SetColor(color: Color) : RectMesh {
        this.rects.forEach(function(x)
        {
            x.stroke = color;
            x.fill = color;
        });
        return this;
    }

    public SetStatic(value: boolean) : RectMesh {
        this.static = value;
        return this;
    }

    public SetCenter(center: Vector2) : RectMesh {
        let newPos = center.subtract(this.bounds.size.divide(2));
        let difference = newPos.subtract(this.position);
        this.rects.forEach(function(x) {x.position = x.position.add(difference)})
        this.bounds.position = this.bounds.position.add(difference);

        this.position = newPos;

        return this;
    }

// Static Constructors
    public static CreateTable(size : Vector2) : RectMesh {
        let legWidth = 0.2 * size.x;
        let rects = [
            new Rect(new Vector2(0, 0), new Vector2(size.x, size.y * 0.25)),
            new Rect(new Vector2(0, size.y * 0.25), new Vector2(legWidth, size.y * 0.75)),
            new Rect(new Vector2(size.x - legWidth, size.y * 0.25), new Vector2(legWidth, size.y * 0.75)),
        ];
        return new RectMesh(rects);
    }
    public static CreateSquare(size : Vector2) : RectMesh {
        let rects = [
            new Rect(new Vector2(0, 0), new Vector2(size.x, size.y)),
        ];
        return new RectMesh(rects);
    }
    public static CreateSceneBounds(size : Vector2, width : number = 0.05) : RectMesh {
        return new RectMesh([
            new Rect(new Vector2(0, 0), new Vector2(size.x, width)),
            new Rect(new Vector2(0, size.y - width), new Vector2(size.x, width)),
            new Rect(new Vector2(0, 0), new Vector2(width, size.y)),
            new Rect(new Vector2(size.x - width, 0), new Vector2(width, size.y)),
        ]).SetStatic(true);
    }
}

