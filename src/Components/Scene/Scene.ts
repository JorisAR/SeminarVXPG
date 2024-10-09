// src/Components/Scene/Scene.ts
import p5 from 'p5';
import {Rect} from "../Scene/Rect";
import {SceneObject} from "../Scene/SceneObject";
import {Vector2} from "../Scene/Vector2";
import {Camera, Light} from "Components/Scene/Gizmo";
import {Color} from "Components/Scene/Color";

export class Scene {
    private scale : Vector2 = Vector2.One;

    constructor(private size : Vector2, private objects : SceneObject[], public camera : Camera, public light : Light) {
        objects.push(SceneObject.CreateSceneBounds(size));
    }

    public draw(p: p5) {
        const scene : Scene = this;
        this.objects.forEach(function (object) {
            object.draw(p, scene);
        });
    }

    public drawGizmos(p: p5) {
        this.light.draw(p);
        this.camera.draw(p);
    }

    public getGeometry(): Rect[] {
        return this.objects.flatMap(object => object.getColliders());
    }

    public getSize() : Vector2 {
        return this.size;


    }

    public getScale() : Vector2 {
        return this.scale;
    }

    public setScale(scale : Vector2) {
        const difference = scale.divideV(this.scale);

        this.size = this.size.multiplyV(difference);
        this.camera.applyScale(difference);
        this.light.applyScale(difference);

        this.objects.forEach(function (object) {
            object.applyScale(difference);
        });

        this.scale = scale;
    }


    public static getPredefinedScenes(): Scene[] {

        const dinnerTableScene = new Scene(
            new Vector2(800,400),
            [
                SceneObject.CreateTable(new Vector2(105,100)).SetCenter(new Vector2(200,350)).SetColor(new Color(150, 75, 15, 255)),
                SceneObject.CreateTable(new Vector2(49,50)).SetCenter(new Vector2(100,375)).SetColor(new Color(100, 40, 15, 255)),
                SceneObject.CreateTable(new Vector2(49,50)).SetCenter(new Vector2(300,375)).SetColor(new Color(100, 40, 15, 255)),
            ],
            Camera.Create(new Vector2(800 * 0.2, 400 * 0.1), new Vector2(1, 1).normalize(), Math.PI * 0.5),
            Light.Create(new Vector2(800 * 0.75, 400 * 0.25), 255, 1600));

        const dinnerTableScene2 = new Scene(
            new Vector2(400,400),
            [
                SceneObject.CreateTable(new Vector2(49,50)).SetCenter(new Vector2(100,375)).SetColor(new Color(100, 40, 15, 255)),
            ],
            Camera.Create(new Vector2(400 * 0.2, 400 * 0.1), new Vector2(1, 1).normalize(), Math.PI * 0.5),
            Light.Create(new Vector2(400 * 0.5, 400 * 0.25), 255, 800));

        return [dinnerTableScene, dinnerTableScene2];
    }
}
