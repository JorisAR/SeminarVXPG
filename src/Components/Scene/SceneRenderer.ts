import p5 from 'p5';
import {Scene} from 'Components/Scene/Scene';
import {Vector2} from 'Components/Scene/Vector2';
import {VoxelGrid} from 'Components/Scene/VoxelGrid';
import settings, {Tab} from 'Components/settings/Settings';
import {RenderCall} from 'Components/Scene/RenderCall';
import {Light} from 'Components/Scene/Gizmo';
import statistics from "Components/Statistics/Statistics";
import {ShadingPointCluster} from "Components/Scene/ShadingPointCluster";
import Statistics from "Components/Statistics/Statistics";
import {ShadingPoint} from "Components/Scene/ShadingPoint";
import Settings from "Components/settings/Settings";
import {Color} from "Components/Scene/Color";

export class SceneRenderer {
    public p5Instance: p5;
    private canvasRef: HTMLDivElement;
    private scene: Scene;
    public voxelGrid: VoxelGrid;
    private scale: Vector2 = new Vector2(100, 100);
    private prevSubdivisions: number = -1;
    private frameCounter: number = 0;
    private selectedShadingPoint : ShadingPoint | undefined = undefined;

    constructor(canvasRef: HTMLDivElement, scene: Scene) {
        this.canvasRef = canvasRef;
        this.scene = scene;
        this.scene.camera.fov = settings.cameraFov;
        this.voxelGrid = new VoxelGrid(scene, this.scene.getSize(), settings.voxelSize);

        this.p5Instance = new p5((p: p5) => {

            p.setup = () => {
                p.createCanvas(this.scene.getSize().x * this.scale.x, this.scene.getSize().y * this.scale.y).parent(this.canvasRef);
            };

            p.draw = () => {
                Settings.voxelSamplingPrettyRenderer ? p.background(5) : p.background(50);
                const selectedShadingCluster = this.getShadingPointCluster();
                if(selectedShadingCluster === undefined)
                    this.selectedShadingPoint = undefined;

                const renderCall: RenderCall = {
                    p: p,
                    offset: Vector2.Zero,
                    scale: this.scale,
                    selectedShadingCluster: selectedShadingCluster,
                    selectedShadingPoint: this.selectedShadingPoint
                };

                let color : Color | undefined = undefined;
                if(Settings.voxelSamplingPrettyRenderer)
                    color = new Color(20, 20, 40, 255);

                this.scene.draw(renderCall, color);
                this.voxelGrid.drawRays = settings.selectedTab === Tab.LightInjection;
                this.voxelGrid.draw(renderCall);
                this.scene.drawGizmos(renderCall);

                if (settings.simulationActive && settings.selectedTab === Tab.LightInjection) {
                    const raysPerSecond = settings.simulationSpeed;
                    const frameRate = p.frameRate();
                    const framesPerRay = frameRate / raysPerSecond;
                    this.frameCounter++;

                    if (this.frameCounter >= framesPerRay) {
                        this.lightInjectionStep();
                        this.frameCounter = 0;
                    }
                }
            };

            p.mouseClicked = () => {
                if(settings.selectedTab === Tab.LightInjection) {
                    const clickPos = new Vector2(p.mouseX, p.mouseY);
                    if(!this.isInWindow(clickPos)) return;
                    const dir = clickPos.subtract(this.scene.camera.getPosition().multiplyV(this.scale)).normalize();
                    this.lightInjectionStep(dir);
                }

                if(settings.selectedTab === Tab.Throughput) {
                    this.selectedShadingPoint = this.getClosestShadingPoint();
                }
            }
        });
    }

    private getClosestShadingPoint() : ShadingPoint | undefined {
        const mousePos = new Vector2(this.p5Instance.mouseX, this.p5Instance.mouseY);
        this.voxelGrid.computeGI();
        return this.getShadingPointCluster()?.getClosestShadingPoint(this.windowPointToScene(mousePos));
    }

    private getShadingPointCluster() : ShadingPointCluster | undefined {
        if(settings.selectedTab !== Tab.Throughput) {
            return undefined;
        }

        const mousePos = new Vector2(this.p5Instance.mouseX, this.p5Instance.mouseY);
        if(this.isInWindow(mousePos))
            return this.voxelGrid.getShadingPointClusterAt(this.windowPointToScene(mousePos));
    }

    private isInWindow(position : Vector2) : boolean {
        return position.x >= 0 && position.y >= 0 && position.x < this.p5Instance.width && position.y < this.p5Instance.height;
    }

    private windowPointToScene(position : Vector2) : Vector2 {
        return position.divideV(this.scale);
    }

    public UpdateFoV() : void {
        this.scene.camera.fov = settings.cameraFov;
        this.UpdateVoxelGridSize();
    }

    public InjectGeometry() : void {
        this.voxelGrid.injectGeometry();
    }

    public UpdateVoxelGridSize() : void {
        this.prevSubdivisions = settings.voxelSize;
        this.voxelGrid = new VoxelGrid(this.scene, this.scene.getSize(), settings.voxelSize);
    }

    public lightInjectionStep(dir? : Vector2): void {
        let from = this.scene.camera.getPosition();
        if(!dir) dir = this.scene.camera.getRandomRayDirection();
        let hit = this.voxelGrid.raycast(from, dir);

        statistics.injectionRayCount += 1;

        if (hit) {
            const camera = from;
            const x1 = hit.point;
            let light = this.scene.light;
            let lightSample = this.scene.sampleLight(x1, this.voxelGrid);

            if (lightSample) {
                this.voxelGrid.addDirectPath(camera, x1, x1, light.getPosition());
                let voxel = this.voxelGrid.getVoxelAt(x1);
                if (voxel) {
                    voxel.inject(lightSample);
                }
                return;
            }

            from = hit.point;
            dir = dir.reflect(hit.normal);
            dir = hit.normal.randomReflection();
            hit = this.voxelGrid.raycast(from, dir);

            if (hit) {
                const x2 = hit.point;
                lightSample = this.scene.sampleLight(x2, this.voxelGrid);
                if (lightSample) {
                    this.voxelGrid.addFullPath(camera, x1, x1, x2, light.getPosition(), x2);
                    let voxel = this.voxelGrid.getVoxelAt(x2);
                    if (voxel) {
                        voxel.inject(lightSample);
                    }
                } else {
                    this.voxelGrid.addMissedPath(camera, x1, x1, x2);
                }
            }
        }
    }

    public resizeCanvas(width: number, height: number) {
        const scale = new Vector2(width, height).divideV(this.scene.getSize())
        const size = this.scene.getSize().multiply(Math.min(scale.x, scale.y));

        this.p5Instance.resizeCanvas(size.x, size.y);
        this.scale = size.divideV(this.scene.getSize());
    }
}
