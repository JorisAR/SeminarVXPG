import {Path, Ray} from "Components/Util/Ray";
import {Vector2} from "Components/Util/Vector2";
import {Voxel} from "Components/Scene/Voxel";
import {Rect} from "Components/Util/Rect";
import {Color} from "Components/Util/Color";
import {ShadingPoint} from "Components/Scene/ShadingPoint";
import {Scene} from "Components/Scene/Scene";
import settings from "Components/Settings/Settings";
import {RenderCall} from "Components/Scene/RenderCall";
import {ShadingPointCluster} from "Components/Scene/ShadingPointCluster";
import {VoxelCluster} from "Components/Scene/VoxelCluster";
import Statistics from "Components/Statistics/Statistics";
import statistics from "Components/Statistics/Statistics";

export class VoxelGrid {
   // private voxels : Voxel[] = [];
    public voxelClusters : VoxelCluster[] = [];
    private paths : Path[] = [];
    private cameraFrustum : Ray[] = [];
    private shadingPointClusters : ShadingPointCluster[] = [];
    public drawRays = true;
    //private geometry: Rect[];
    private clusterSize: number = 0;

    constructor(private size: Vector2, private subdivisions: number) {
        Statistics.Reset();

        const strokeColor = new Color(255, 105, 180, 255); // Pink color
        const fillColor = new Color(0, 0, 0, 0);
        const voxelSize = Math.min(size.x, size.y) / Math.pow(2, subdivisions - 1);
        const clusterEdgeCount = 4; //need n = k^2 amount of clusters
        const clusterSizes = size.divide(clusterEdgeCount);
        const clusterSize = Math.min(clusterSizes.x, clusterSizes.y);

        for (let x = 0; x < size.x; x += clusterSize) {
            for (let y = 0; y < size.y; y += clusterSize) {
                let cluster = new VoxelCluster(
                    new Rect(new Vector2(x, y), new Vector2(clusterSize, clusterSize)),
                    Color.CreateRandomSaturated(150),
                    this.voxelClusters.length);

                this.voxelClusters.push(cluster);
            }
        }

        const geometry = settings.scene.getGeometry();

        for (let x = 0; x < size.x; x += voxelSize) {
            for (let y = 0; y < size.y; y += voxelSize) {
                // Check if the grid cell intersects with any scene geometry
                let rect = new Rect(new Vector2(x, y), new Vector2(voxelSize, voxelSize), fillColor, strokeColor);
                for (const other of geometry) {
                    if (rect.collides(other)) {
                        for(const cluster of this.voxelClusters) {
                            if (cluster.rect.containsPoint(new Vector2(x , y))) {
                                cluster.addVoxel(new Voxel(rect));
                                Statistics.voxelCount += 1;
                                break;
                            }
                        }
                        break;
                    }
                }
            }
        }

        Statistics.superVoxelCount = this.voxelClusters.filter(x => x.voxels.length > 0).reduce((sum, x) => sum + 1, 0);
        this.GenerateShadingPoints(1000);
        this.computeGI();
        this.injectGeometry()
    }

    private GenerateShadingPoints(count: number) {
        count = Math.max(2, count);
        const clusterCount = 10;
        Statistics.superPixelCount = clusterCount;
        for(let i = 0; i < clusterCount; i++) {
            this.shadingPointClusters.push(new ShadingPointCluster(Color.CreateRandomSaturated(255)))
        }

        this.clusterSize = count / clusterCount;

        for(let i = 0; i < count; i++) {
            const clusterIndex = Math.floor(i / this.clusterSize);

            let from = settings.scene.camera.getPosition();
            let dir = settings.scene.camera.getRayDirection(i / (count - 1));
            let hit = settings.scene.raycast(from, dir);

            if(hit) {
                const color = new Color(0, 0, 0, 255);
                this.shadingPointClusters[clusterIndex].addShadingPoint(new ShadingPoint(hit.point, hit.normal, color));
                Statistics.shadingPointCount += 1;
                if(i === 0 || i === count - 1) {
                    this.cameraFrustum.push(new Ray(from, hit.point, new Color(255, 255, 255, 255)))
                }
            }
        }
    }

    public computeGI() {
        const voxelGrid : VoxelGrid = this;
        Statistics.pathTracingHitCount = 0;
        this.shadingPointClusters.forEach(function (cluster) {
            cluster.computeThroughput(voxelGrid);
            cluster.throughputSampleVoxelCluster(voxelGrid);
            cluster.pathTrace();
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

        const geometry = settings.scene.getGeometry();

        this.voxelClusters.forEach((cluster, clusterIndex) => {
            const clusterGeometry = this.getCollidingGeometry(cluster.rect, geometry);
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

    public lightInjectionStep(dir? : Vector2): void {
        let from = settings.scene.camera.getPosition();
        if(!dir) dir = settings.scene.camera.getRandomRayDirection();
        let hit = settings.scene.raycast(from, dir);

        statistics.injectionRayCount += 1;

        if (hit) {
            const camera = from;
            const x1 = hit.point;
            let light = settings.scene.light;
            let lightSample = settings.scene.sampleLight(x1);

            if (lightSample) {
                this.addDirectPath(camera, x1, x1, light.getPosition());
                let voxel = this.getVoxelAt(x1);
                if (voxel) {
                    voxel.inject(lightSample);
                }
                return;
            }

            from = hit.point;
            dir = dir.reflect(hit.normal);
            dir = hit.normal.randomReflection();
            hit = settings.scene.raycast(from, dir);

            if (hit) {
                const x2 = hit.point;
                lightSample = settings.scene.sampleLight(x2);
                if (lightSample) {
                    this.addFullPath(camera, x1, x1, x2, light.getPosition(), x2);
                    let voxel = this.getVoxelAt(x2);
                    if (voxel) {
                        voxel.inject(lightSample);
                    }
                } else {
                    this.addMissedPath(camera, x1, x1, x2);
                }
            }
        }
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