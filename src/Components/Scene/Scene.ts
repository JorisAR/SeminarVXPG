// src/Components/Scene/Scene.ts
import p5 from 'p5';
import {Rect} from "Components/Util/Rect";
import {RectMesh} from "Components/Scene/Objects/RectMesh";
import {Vector2} from "Components/Util/Vector2";
import {SceneObject} from "Components/Scene/Objects/SceneObject";
import {Color} from "Components/Util/Color";
import {RenderCall} from "Components/Scene/RenderCall";
import {Camera} from "Components/Scene/Objects/Camera";
import {Light} from "Components/Scene/Objects/Light";

interface RaycastHit {
    point: Vector2;
    normal: Vector2;
}

export class Scene {
    constructor(private size: Vector2, private objects: RectMesh[], public camera: Camera, public light: Light) {
        objects.push(RectMesh.CreateSceneBounds(size));
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

    public getSize(): Vector2 {
        return this.size;
    }

    public removeObject(object: SceneObject): void {
        this.objects = this.objects.filter(x => x !== object);
    }

    public addObject(object: RectMesh): void {
        this.objects.push(object);
    }

    public sampleLight(point: Vector2): number | null {
        const from = this.light.getPosition();
        const dir = point.subtract(from).normalize();
        const hit = this.raycast(from, dir);
        if (hit && point.distanceTo(hit.point) < 0.01) {
            return this.light.brightnessAt(point);
        }
        return null;
    }

    public static getPredefinedScenes(): Scene[] {
        const scene1 = new Scene(
            new Vector2(6, 3),
            [
                RectMesh.CreateTable(new Vector2(1, 0.8)).SetCenter(new Vector2(3, 2.6)).SetColor(new Color(150, 75, 15, 255)),
                RectMesh.CreateTable(new Vector2(.5, .5)).SetCenter(new Vector2(2, 2.75)).SetColor(new Color(100, 40, 15, 255)),
                RectMesh.CreateTable(new Vector2(.5, .5)).SetCenter(new Vector2(4, 2.75)).SetColor(new Color(100, 40, 15, 255)),
            ],
            Camera.Create(new Vector2(6 * 0.2, 3 * 0.1), new Vector2(1, 1).normalize(), 90),
            Light.Create(new Vector2(4.6, 2.7), 25));

        const scene2 = new Scene(
            new Vector2(6, 3),
            [
                RectMesh.CreateSquare(new Vector2(0.1, 1.2)).SetCenter(new Vector2(4.5, .6)).SetColor(new Color(150, 150, 150, 255)),
            ],
            Camera.Create(new Vector2(6 * 0.2, 3 * 0.7), new Vector2(1, -1).normalize(), 90),
            Light.Create(new Vector2(6 * 0.875, 3 * 0.15), 25));

        const scene3 = new Scene(
            new Vector2(6, 3),
            [
                RectMesh.CreateSquare(new Vector2(0.1, 2)).SetCenter(new Vector2(4, 1)).SetColor(new Color(150, 150, 150, 255)),
                RectMesh.CreateSquare(new Vector2(0.1, 1.3)).SetCenter(new Vector2(2, 2.35)).SetColor(new Color(150, 150, 150, 255)),
            ],
            Camera.Create(new Vector2(6 * 0.1, 3 * 0.5), new Vector2(1, 0).normalize(), 90),
            Light.Create(new Vector2(6 * 0.9, 3 * 0.25), 25));

        return [scene1, scene2, scene3];
    }

    public getSceneObjectAt(position: Vector2): SceneObject | undefined {

        if (!this.camera.static && this.camera.bounds.containsPoint(position)) {
            return this.camera;
        }

        if (!this.light.static && this.light.bounds.containsPoint(position)) {
            return this.light;
        }

        for (let i = this.objects.length - 1; i >= 0; i--) {
            const object = this.objects[i];
            if (!object.static && object.bounds.containsPoint(position)) {
                return object;
            }
        }
        return undefined;
    }

    public raycast(from: Vector2, dir: Vector2): RaycastHit | undefined {
        let closestHit: RaycastHit | undefined = undefined;
        let minDistance = Infinity;

        for (const rect of this.getGeometry()) {
            const hit = Scene.raycastRect(from, dir, rect);
            if (hit) {
                const distance = from.subtract(hit.point).length();
                //if normal dot dir >= 0 and dist low, then we discard the hit, as from is likely on the edge of the hit object.
                if (distance < minDistance && !(hit.normal.dot(dir) >= 0 && distance < 0.001)) {
                    minDistance = distance;
                    closestHit = hit;
                }
            }
        }
        return closestHit;
    }

    private static raycastRect(from: Vector2, dir: Vector2, rect: Rect): RaycastHit | undefined {
        const eps = 0.00001
        const invDir = new Vector2(1 / (eps + dir.x), 1 / (eps + dir.y));

        const t1 = (rect.position.x - from.x) * invDir.x;
        const t2 = (rect.position.x + rect.size.x - from.x) * invDir.x;
        const t3 = (rect.position.y - from.y) * invDir.y;
        const t4 = (rect.position.y + rect.size.y - from.y) * invDir.y;

        const tmin = Math.max(Math.min(t1, t2), Math.min(t3, t4));
        const tmax = Math.min(Math.max(t1, t2), Math.max(t3, t4));

        if (tmax < 0 || tmin > tmax) {
            return undefined;
        }
        const t = tmin < 0 ? tmax : tmin;
        const point = from.add(dir.multiply(t));
        const normal = new Vector2(
            t === t1 ? -1 : t === t2 ? 1 : 0,
            t === t3 ? -1 : t === t4 ? 1 : 0
        );

        return {point, normal};
    }
}
