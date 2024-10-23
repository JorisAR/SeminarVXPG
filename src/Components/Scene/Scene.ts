// src/Components/Scene/Scene.ts
import p5 from 'p5';
import {Rect} from "../Scene/Rect";
import {SceneObject} from "../Scene/SceneObject";
import {Vector2} from "../Scene/Vector2";
import {Camera, Light} from "Components/Scene/Gizmo";
import {Color} from "Components/Scene/Color";
import {RenderCall} from "Components/Scene/RenderCall";
import {VoxelGrid} from "Components/Scene/VoxelGrid";
import Settings from "Components/settings/Settings";

export class Scene {
    constructor(private size : Vector2, private objects : SceneObject[], public camera : Camera, public light : Light) {
        objects.push(SceneObject.CreateSceneBounds(size));
    }

    public draw(settings: RenderCall, color: Color | undefined) {
        this.objects.forEach(function (object) {
            object.draw(settings, color);
        });
    }

    public drawGizmos(settings: RenderCall) {
        this.light.draw(settings);
        this.camera.draw(settings);
    }

    public getGeometry(): Rect[] {
        return this.objects.flatMap(object => object.getColliders());
    }

    public getSize() : Vector2 {
        return this.size;
    }

    public sampleLight(point: Vector2, voxelGrid: VoxelGrid): number | null {
        const from = this.light.getPosition();
        const dir = point.subtract(from).normalize();
        const hit = voxelGrid.raycast(from, dir);
        if (hit && point.distanceTo(hit.point) < 0.01) {
            return this.light.brightnessAt(point);
        }
        return null;
    }

    public static getPredefinedScenes(): Scene[] {
        const dinnerTableScene = new Scene(
            new Vector2(6,3),
            [
                SceneObject.CreateTable(new Vector2(1,0.8)).SetCenter(new Vector2(1.5,2.6)).SetColor(new Color(150, 75, 15, 255)),
                SceneObject.CreateTable(new Vector2(.5,.5)).SetCenter(new Vector2(0.9,2.75)).SetColor(new Color(100, 40, 15, 255)),
                SceneObject.CreateTable(new Vector2(.5,.5)).SetCenter(new Vector2(2.1,2.75)).SetColor(new Color(100, 40, 15, 255)),
            ],
            Camera.Create(new Vector2(6 * 0.2, 3 * 0.1), new Vector2(1, 1).normalize(), 90),
            Light.Create(new Vector2(6 * 0.75, 3 * 0.25), 10));

        const occludedLightScene = new Scene(
            new Vector2(6,3),
            [
                SceneObject.CreateSquare(new Vector2(0.1,2)).SetCenter(new Vector2(4.5,1)).SetColor(new Color(150, 150, 150, 255)),
            ],
            Camera.Create(new Vector2(6 * 0.2, 3 * 0.7), new Vector2(1, -1).normalize(), 90),
            Light.Create(new Vector2(6 * 0.9, 3 * 0.25), 10));

        return [dinnerTableScene, occludedLightScene];
    }
}
