import p5 from "p5";
import {Path, Ray} from "Components/Scene/Ray";
import {Vector2} from "Components/Scene/Vector2";
import {Voxel} from "Components/Scene/Voxel";
import {Rect} from "Components/Scene/Rect";
import {Color} from "Components/Scene/Color";
import {ShadingPoint} from "Components/Scene/ShadingPoint";
import {Scene} from "Components/Scene/Scene";
import settings from "Components/settings/Settings";
import {RenderCall} from "Components/Scene/RenderCall";
import {ShadingPointCluster} from "Components/Scene/ShadingPointCluster";
import {VoxelCluster} from "Components/Scene/VoxelCluster";
import Settings from "Components/settings/Settings";


interface RaycastHit{
    point: Vector2;
    normal: Vector2;
}


export class VoxelGrid {
   // private voxels : Voxel[] = [];
    public voxelClusters : VoxelCluster[] = [];
    private paths : Path[] = [];
    private cameraFrustum : Ray[] = [];
    private shadingPointClusters : ShadingPointCluster[] = [];
    public drawRays = true;
    private geometry: Rect[];
    private clusterSize: number = 0;

    constructor(public scene: Scene, private size: Vector2, private subdivisions: number) {
        this.geometry = scene.getGeometry();
        const strokeColor = new Color(255, 105, 180, 255); // Pink color
        const fillColor = new Color(0, 0, 0, 0);
        const voxelSize = Math.min(size.x, size.y) / Math.pow(2, subdivisions - 1);
        const clusterEdgeCount = 4; //need n = k^2 amount of clusters
        const clusterSize = size.divide(clusterEdgeCount);

        for (let x = 0; x < size.x; x += clusterSize.x) {
            for (let y = 0; y < size.y; y += clusterSize.y) {
                let cluster = new VoxelCluster(
                    new Rect(new Vector2(x, y), new Vector2(clusterSize.x, clusterSize.y)),
                    Color.CreateRandomSaturated(150),
                    this.voxelClusters.length);

                this.voxelClusters.push(cluster);
            }
        }

        for (let x = 0; x < size.x; x += voxelSize) {
            for (let y = 0; y < size.y; y += voxelSize) {
                // Check if the grid cell intersects with any scene geometry
                let rect = new Rect(new Vector2(x, y), new Vector2(voxelSize, voxelSize), fillColor, strokeColor);
                for (const other of this.geometry) {
                    if (rect.collides(other)) {
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
        this.GenerateShadingPoints(this.scene, 1000);
        this.computeGI();

        this.injectGeometry()
    }

    private GenerateShadingPoints(scene : Scene, count: number) {
        count = Math.max(2, count);
        const clusterCount = 10;
        for(let i = 0; i < clusterCount; i++) {
            this.shadingPointClusters.push(new ShadingPointCluster(Color.CreateRandomSaturated(255)))
        }

        this.clusterSize = count / clusterCount;

        for(let i = 0; i < count; i++) {
            const clusterIndex = Math.floor(i / this.clusterSize);

            let from = scene.camera.getPosition();
            let dir = scene.camera.getRayDirection(i / (count - 1));
            let hit = this.raycast(from, dir);

            if(hit) {
                const color = new Color(0, 0, 0, 255);
                this.shadingPointClusters[clusterIndex].addShadingPoint(new ShadingPoint(hit.point, hit.normal, color));
                if(i === 0 || i === count - 1) {
                    this.cameraFrustum.push(new Ray(from, hit.point, new Color(255, 255, 255, 255)))
                }
            }
        }
    }

    public computeGI() {
        const voxelGrid : VoxelGrid = this;
        this.shadingPointClusters.forEach(function (cluster) {
            cluster.computeThroughput(voxelGrid);
            cluster.throughputSampleVoxelCluster(voxelGrid);
            cluster.pathTrace(voxelGrid);
        });
    }

    public addDirectPath(a1: Vector2, b1: Vector2, a2: Vector2, b2: Vector2) {
        let rays = []
        rays.push(new Ray(a1, b1, new Color(255, 0, 0, 255)));
        rays.push(new Ray(a2, b2, new Color(0, 0, 255, 255)));
        this.paths.push(new Path(rays, this.paths.length));
        this.computeGI();
    }

    public addMissedPath(a1: Vector2, b1: Vector2, a2: Vector2, b2: Vector2) {
        let rays = []
        rays.push(new Ray(a1, b1, new Color(255, 0, 0, 255)));
        rays.push(new Ray(a2, b2, new Color(5, 15, 5, 255)));
        this.paths.push(new Path(rays, this.paths.length));

        this.computeGI();
    }

    public addFullPath(a1: Vector2, b1: Vector2, a2: Vector2, b2: Vector2, a3: Vector2, b3: Vector2) {
        let rays = []
        rays.push(new Ray(a1, b1, new Color(255, 0, 0, 255)));
        rays.push(new Ray(a2, b2, new Color(0, 255, 0, 255)));
        rays.push(new Ray(a3, b3, new Color(0, 0, 255, 255)));
        this.paths.push(new Path(rays, this.paths.length));

        this.computeGI();
    }


    public draw(renderCall: RenderCall) : void {
        if(this.drawRays) {
            const rayCount : number = this.paths.length - 1;
            this.paths.forEach(function (ray) {
                ray.draw(renderCall, rayCount, settings.visibleRayCount);
            });
        }

        if(settings.drawVoxels) {
            this.voxelClusters.forEach(function (cluster) {
                cluster.draw(renderCall, settings.showVoxelClusters);
            });
            //this.voxels.forEach((x) => x.draw(p, Vector2.One));
        }

        this.cameraFrustum.forEach(function (ray) {
            ray.draw(renderCall, 2, -1, 0);
        });

        if(settings.drawShadingPoints) {
            let i = 0;
            for (const cluster of this.shadingPointClusters) {
                if(renderCall.selectedShadingCluster && renderCall.selectedShadingCluster !== cluster) continue;
                cluster.draw(renderCall, settings.showShadingPointClusters, i);
                i += this.clusterSize;
                //cluster.rect?.draw(renderCall, cluster.color);
            }
            this.shadingPointClusters.forEach(function (cluster) {

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

        return { point, normal };
    }

    private getCollidingGeometry(collider: Rect, geometry: Rect[]) : Rect[] {
        const result : Rect[] = [];
        geometry.forEach(g => {
            g.collides(collider)
            result.push(g);
        });
        return result;
    }

    public injectGeometry() : void {
        if(!settings.tightBounds) return;
        this.voxelClusters.forEach((cluster, clusterIndex) => {
            const clusterGeometry = this.getCollidingGeometry(cluster.rect, this.geometry);
            cluster.voxels.forEach((voxel, index) => {
                const g = this.getCollidingGeometry(voxel.rect, clusterGeometry)
                voxel.rect = voxel.rect.unionIntersections(g, 0.01);
                this.voxelClusters[clusterIndex].voxels[index] = voxel; // Ensure the voxel in the array is updated
            });
        });
    }

    public getShadingPointClusterAt(point: Vector2) : ShadingPointCluster | undefined {

        for (const cluster of this.shadingPointClusters) {
            if(cluster.rect?.containsPoint(point)) {
                return cluster;
            }
        }
        return undefined;
    }

    public getVoxelAt(point: Vector2) : Voxel | undefined {
        for (const cluster of this.voxelClusters) {
            const voxel = cluster.tryGetVoxelAt(point);
            if(voxel !== undefined) return voxel;
        }
        return  undefined;
    }

    resetRays() {
        this.paths = [];
        this.voxelClusters.forEach(x => x.resetIrradiance());
        this.computeGI();
    }
}