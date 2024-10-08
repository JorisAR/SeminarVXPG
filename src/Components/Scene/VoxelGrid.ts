import p5 from "p5";
import {Ray} from "Components/Scene/Ray";
import {Vector2} from "Components/Scene/Vector2";
import {Voxel} from "Components/Scene/Voxel";
import {Rect} from "Components/Scene/Rect";
import {Color} from "Components/Scene/Color";


interface RaycastHit{
    point: Vector2;
    normal: Vector2;
}


export class VoxelGrid {

    private voxels : Voxel[] = [];
    private rays : Ray[] = [];
    public drawRays = true;

    constructor(private geometry: Rect[], private size: Vector2, private subdivisions: number) {
        const strokeColor = new Color(255, 105, 180, 255); // Pink color
        const fillColor = new Color(0, 0, 0, 0);

        const voxelWidth = Math.min(size.x, size.y);

        const voxelSize = voxelWidth / Math.pow(2, subdivisions - 1);
        for (let x = 0; x < size.x; x += voxelSize) {
            for (let y = 0; y < size.y; y += voxelSize) {
                // Check if the grid cell intersects with any scene geometry
                let rect = new Rect(new Vector2(x, y), new Vector2(voxelSize, voxelSize), fillColor, strokeColor);
                for (const other of geometry) {
                    if (rect.collides(other)) {
                        this.voxels.push(new Voxel(rect));
                        break;
                    }
                }
            }
        }
    }

    public addRay(from : Vector2, to: Vector2, color: Color) {
        this.rays.push(new Ray(from, to, color, this.rays.length))
    }

    addRays(a1: Vector2, b1: Vector2, a2: Vector2, b2: Vector2, a3: Vector2, b3: Vector2) {
        const index = this.rays.length + 2;
        this.rays.push(new Ray(a1, b1, new Color(255, 0, 0, 255), index))
        this.rays.push(new Ray(a2, b2, new Color(0, 255, 0, 255), index))
        this.rays.push(new Ray(a3, b3, new Color(0, 0, 255, 255), index))
    }


    public draw(p: p5, visibleRayCount : number) : void {
        if(this.drawRays) {
            const rayCount : number = this.rays.length - 1;
            this.rays.forEach(function (ray) {
                ray.draw(p, rayCount, visibleRayCount);
            });
        }


        this.voxels.forEach((x) => x.draw(p, Vector2.One));
    }

    public raycast(from: Vector2, dir: Vector2): RaycastHit | undefined {
        let closestHit: RaycastHit | undefined = undefined;
        let minDistance = Infinity;

        for (const rect of this.geometry) {
            const hit = VoxelGrid.raycastRect(from, dir, rect);
            if (hit) {
                const distance = from.subtract(hit.point).length();
                if (distance < minDistance && distance > 1) {
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

        return { point, normal };
    }

    public getVoxelAt(point: Vector2) : Voxel | undefined {
        for (const voxel of this.voxels) {
            if(voxel.rect.containsPoint(point))
                return voxel;
        }
        return  undefined;
    }

    resetRays() {
        this.rays = [];
        this.voxels.forEach(x => x.resetIrradiance());
    }
}