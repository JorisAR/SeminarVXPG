// src/Components/Scene/Scene.ts
import p5 from 'p5';
import {Rect} from "../Scene/Rect";
import {SceneObject} from "../Scene/SceneObject";
import {Vector2} from "../Scene/Vector2";
import {Camera, Light} from "Components/Scene/Gizmo";
import {Color} from "Components/Scene/Color";

export class Scene {
    public scale : Vector2 = Vector2.One;
    public camera : Camera;
    public light : Light;

    constructor(private size : Vector2, private objects : SceneObject[]) {
        objects.push(SceneObject.CreateSceneBounds(size));

        this.camera  = Camera.Create(new Vector2(size.x * 0.2, size.y * 0.2), new Vector2(1, 1).normalize(), Math.PI * 0.5);
        this.light  = Light.Create(new Vector2(size.x * 0.5, size.y * 0.25), 255, 800);
    }

    public draw(p: p5) {
        const scene : Scene = this;
        this.objects.forEach(function (object) {
            object.draw(p, scene);
        });
    }

    public drawGizmos(p: p5) {
        const scene : Scene = this;
        this.light.draw(p, scene);
        this.camera.draw(p, scene);
    }

    public getGeometry(scale: Vector2): Rect[] {
        return this.objects.flatMap(object => object.getColliders(scale));
    }

    public getSize() : Vector2 {
        return this.size.multiplyV(this.scale);
    }

    public static getPredefinedScenes(): Scene[] {
        const dinnerTableScene = new Scene(
            new Vector2(400,400),
            [
                SceneObject.CreateTable(new Vector2(105,100)).SetCenter(new Vector2(200,350)).SetColor(new Color(150, 75, 15, 255)),
                SceneObject.CreateTable(new Vector2(49,50)).SetCenter(new Vector2(100,375)).SetColor(new Color(100, 40, 15, 255)),
                SceneObject.CreateTable(new Vector2(49,50)).SetCenter(new Vector2(300,375)).SetColor(new Color(100, 40, 15, 255)),
        ]);

        return [dinnerTableScene];
    }
}
