import p5 from "p5";
import {Ray} from "Components/Scene/Ray";
import {Vector2} from "Components/Scene/Vector2";
import {Voxel, VoxelCluster} from "Components/Scene/Voxel";
import {Rect} from "Components/Scene/Rect";
import {Color} from "Components/Scene/Color";
import {ShadingPoint, ShadingPointCluster} from "Components/Scene/ShadingPoint";
import {Scene} from "Components/Scene/Scene";
import settings from "Components/Pipeline/Settings";


interface RaycastHit{
    point: Vector2;
    normal: Vector2;
}


export class VoxelGrid {
   // private voxels : Voxel[] = [];
    public voxelClusters : VoxelCluster[] = [];
    private rays : Ray[] = [];
    private cameraFrustum : Ray[] = [];
    private shadingPointClusters : ShadingPointCluster[] = [];
    public drawRays = true;

    constructor(private geometry: Rect[], private size: Vector2, private subdivisions: number) {
        const strokeColor = new Color(255, 105, 180, 255); // Pink color
        const fillColor = new Color(0, 0, 0, 0);
        const voxelSize = Math.min(size.x, size.y) / Math.pow(2, subdivisions - 1);
        const clusterEdgeCount = 4; //need ^2 amount of clusters
        const clusterSize = size.divide(clusterEdgeCount);

        for (let x = 0; x < size.x; x += clusterSize.x) {
            for (let y = 0; y < size.y; y += clusterSize.y) {
                let cluster = new VoxelCluster(new Rect(new Vector2(x, y), new Vector2(clusterSize.x, clusterSize.y)), Color.CreateRandomSaturated(150));
                this.voxelClusters.push(cluster);
            }
        }

        for (let x = 0; x < size.x; x += voxelSize) {
            for (let y = 0; y < size.y; y += voxelSize) {
                // Check if the grid cell intersects with any scene geometry
                let rect = new Rect(new Vector2(x, y), new Vector2(voxelSize - 1, voxelSize - 1), fillColor, strokeColor);
                for (const other of geometry) {
                    if (rect.collides(other)) {
                        //this.voxels.push(new Voxel(rect));
                        for(const cluster of this.voxelClusters) {
                            if (cluster.rect.containsPoint(new Vector2(x , y))) {
                                cluster.addVoxel(new Voxel(rect));
                                break;
                            }
                        }
                        break;
                    }
                }
            }
        }
    }

    public GenerateShadingPoints(scene : Scene, count: number) {
        count = Math.max(2, count);
        const clusterCount = 10;
        for(let i = 0; i < clusterCount; i++) {
            this.shadingPointClusters.push(new ShadingPointCluster(Color.CreateRandomSaturated(255)))
        }

        const clusterSize = count / clusterCount;

        for(let i = 0; i < count; i++) {
            const clusterIndex = Math.floor(i / clusterSize);

            let from = scene.camera.getPosition();
            let dir = scene.camera.getRayDirection(i / (count - 1));
            let hit = this.raycast(from, dir);

            if(hit) {
                const color = new Color(0, 0, 0, 255);
                this.shadingPointClusters[clusterIndex].addShadingPoint(new ShadingPoint(hit.point, color));
                if(i === 0 || i === count - 1) {
                    this.cameraFrustum.push(new Ray(from, hit.point, new Color(255, 255, 255, 255), 0))
                }
            }
        }
    }

    public computeThroughput() {
        const voxelGrid : VoxelGrid = this;
        this.shadingPointClusters.forEach(function (cluster) {
            cluster.computeThroughput(voxelGrid);
            cluster.throughputSampleVoxelCluster(voxelGrid);
        });
    }

    public addRays(a1: Vector2, b1: Vector2, a2: Vector2, b2: Vector2, a3: Vector2, b3: Vector2) {
        const index = this.rays.length + 2;
        this.rays.push(new Ray(a1, b1, new Color(255, 0, 0, 255), index))
        this.rays.push(new Ray(a2, b2, new Color(0, 255, 0, 255), index))
        this.rays.push(new Ray(a3, b3, new Color(0, 0, 255, 255), index))

        this.computeThroughput();
    }


    public draw(p: p5, Settings : any) : void {
        if(this.drawRays) {
            const rayCount : number = this.rays.length - 1;
            this.rays.forEach(function (ray) {
                ray.draw(p, rayCount, settings.visibleRayCount);
            });
        }

        if(settings.drawVoxels) {
            this.voxelClusters.forEach(function (cluster) {
                cluster.draw(p, settings.showVoxelClusters);
            });
            //this.voxels.forEach((x) => x.draw(p, Vector2.One));
        }

        if(settings.drawShadingPoints) {
            this.cameraFrustum.forEach(function (ray) {
                ray.draw(p, 2, -1);
            });

            this.shadingPointClusters.forEach(function (cluster) {
                cluster.draw(p, settings.showShadingPointClusters);
            });
        }
    }

    public raycast(from: Vector2, dir: Vector2): RaycastHit | undefined {
        let closestHit: RaycastHit | undefined = undefined;
        let minDistance = Infinity;

        for (const rect of this.geometry) {
            const hit = VoxelGrid.raycastRect(from, dir, rect);
            if (hit) {
                const distance = from.subtract(hit.point).length();
                if (distance < minDistance && distance > 0.1) {
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
        for (const cluster of this.voxelClusters) {
            const voxel = cluster.tryGetVoxelAt(point);
            if(voxel !== undefined) return voxel;
        }
        return  undefined;
    }

    resetRays() {
        this.rays = [];
        this.voxelClusters.forEach(x => x.resetIrradiance());
    }
}