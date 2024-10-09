import p5 from 'p5';
import {Rect} from "../Scene/Rect";
import {Vector2} from "../Scene/Vector2";
import {Scene} from "../Scene/Scene";
import {Color} from "Components/Scene/Color";

export class SceneObject {
    public position : Vector2 = new Vector2(0,0);
    public scale : number = 1.0;

    constructor(private rects: Rect[], private size : Vector2) {

    }

    public getColliders() : Rect[] {
        return this.rects.map((x) => x);
    }

    public draw(p: p5, scene: Scene) : void {
        let scale : number = this.scale;
        this.rects.forEach(function (rect) {
            rect.draw(p);
        });
    }

    //I should use factory/builder pattern but this works
    public SetCenter(center: Vector2) : SceneObject {
        let newPos = center.subtract(this.size.divide(2));
        let difference = newPos.subtract(this.position);
        this.rects.forEach(function(x) {x.position = x.position.add(difference)})

        this.position = newPos;

        return this;
    }

    public SetColor(color: Color) : SceneObject {
        this.rects.forEach(function(x)
        {
            x.stroke = color;
            x.fill = color;
        })

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
    public static CreateSceneBounds(size : Vector2, width : number = 5) : SceneObject {
        return new SceneObject([
            new Rect(new Vector2(0, 0), new Vector2(size.x, width)),
            new Rect(new Vector2(0, size.y - width), new Vector2(size.x, width)),
            new Rect(new Vector2(0, 0), new Vector2(width, size.y)),
            new Rect(new Vector2(size.x - width, 0), new Vector2(width, size.y)),
        ], size);
    }


    applyScale(difference: Vector2) {
        this.rects.forEach(function (rect) {
            rect.applyScale(difference);
        });
    }
}

