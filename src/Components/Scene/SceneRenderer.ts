import p5 from 'p5';
import {Scene} from 'Components/Scene/Scene';
import {Vector2} from 'Components/Util/Vector2';
import {VoxelGrid} from 'Components/Scene/VoxelGrid';
import settings from 'Components/Settings/Settings';
import Settings, {Tab} from 'Components/Settings/Settings';
import {RenderCall} from 'Components/Scene/RenderCall';
import {ShadingPointCluster} from "Components/Scene/ShadingPointCluster";
import {ShadingPoint} from "Components/Scene/ShadingPoint";
import {Color} from "Components/Util/Color";
import {SceneObject} from "Components/Scene/SceneObject";

export class SceneRenderer {
    public p5Instance: p5;
    private canvasRef: HTMLDivElement;
    public voxelGrid: VoxelGrid;
    private scale: Vector2 = new Vector2(100, 100);
    private prevSubdivisions: number = -1;
    private frameCounter: number = 0;
    private selectedShadingPoint : ShadingPoint | undefined = undefined;
    private selectedSceneObject : SceneObject | undefined = undefined;
    private selectedSceneObjectCenterDifference : Vector2 = Vector2.Zero;

    constructor(canvasRef: HTMLDivElement, scene: Scene) {
        this.canvasRef = canvasRef;
        settings.scene.camera.fov = settings.cameraFov;
        this.voxelGrid = new VoxelGrid(settings.scene.getSize(), settings.voxelSize);

        this.p5Instance = new p5((p: p5) => {
            p.setup = () => {
                p.createCanvas(settings.scene.getSize().x * this.scale.x, settings.scene.getSize().y * this.scale.y).parent(this.canvasRef);
            };

            p.draw = () => {
                // ---------------------------- input ----------------------------
                const clickPos = new Vector2(p.mouseX, p.mouseY);
                this.moveObject(clickPos);

                const selectedShadingCluster = this.getShadingPointCluster(clickPos);
                if(selectedShadingCluster === undefined)
                    this.selectedShadingPoint = undefined;

                // ---------------------------- rendering ----------------------------

                Settings.voxelSamplingPrettyRenderer ? p.background(5) : p.background(50);


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

                settings.scene.draw(renderCall, color);
                this.voxelGrid.drawRays = settings.selectedTab === Tab.LightInjection;
                this.voxelGrid.draw(renderCall);

                settings.scene.drawGizmos(renderCall);

                if (settings.simulationActive && settings.selectedTab === Tab.LightInjection) {
                    const raysPerSecond = settings.simulationSpeed;
                    const frameRate = p.frameRate();
                    const framesPerRay = frameRate / raysPerSecond;
                    this.frameCounter++;

                    if (this.frameCounter >= framesPerRay) {
                        this.voxelGrid.lightInjectionStep();
                        this.frameCounter = 0;
                    }
                }
            };

            p.mousePressed = (e) => {
                const clickPos = new Vector2(p.mouseX, p.mouseY);
                if(!this.isInWindow(clickPos)) return;

                if(settings.selectedTab === Tab.LightInjection) {
                    const dir = clickPos.subtract(settings.scene.camera.getPosition().multiplyV(this.scale)).normalize();
                    this.voxelGrid.lightInjectionStep(dir);
                }

                if(settings.selectedTab === Tab.Throughput) {
                    this.selectedShadingPoint = this.getClosestShadingPoint(clickPos);
                }

                if(settings.selectedTab === Tab.Scene) {
                    this.selectedSceneObject = this.getSceneObjectAtMouse(clickPos);
                    this.selectedSceneObjectCenterDifference =
                        this.windowPointToScene(clickPos).subtract(
                            this.selectedSceneObject?.getCenter() || this.selectedSceneObjectCenterDifference);

                    if(p.mouseButton === p.RIGHT && this.selectedSceneObject)
                    {
                        settings.scene.removeObject(this.selectedSceneObject);
                        this.selectedSceneObject = undefined;
                    }

                }
            }

            p.mouseReleased = () => {
                if(settings.selectedTab === Tab.Scene) {
                    this.UpdateVoxelGridSize();
                    this.selectedSceneObject = undefined;
                }
            }
        });
    }

    private getSceneObjectAtMouse(position : Vector2) : SceneObject | undefined {
        const object = settings.scene.getSceneObjectAt(this.windowPointToScene(position));
        if(object?.static) return undefined;
        return object;
    }

    private getClosestShadingPoint(position : Vector2) : ShadingPoint | undefined {
        this.voxelGrid.computeGI();
        return this.getShadingPointCluster(position)?.getClosestShadingPoint(this.windowPointToScene(position));
    }

    private getShadingPointCluster(position : Vector2) : ShadingPointCluster | undefined {
        if(!this.isInWindow(position)) return undefined;
        if(settings.selectedTab !== Tab.Throughput) {
            return undefined;
        }

        return this.voxelGrid.getShadingPointClusterAt(this.windowPointToScene(position));
    }

    private isInWindow(position : Vector2) : boolean {
        return position.x >= 0 && position.y >= 0 && position.x < this.p5Instance.width && position.y < this.p5Instance.height;
    }

    private windowPointToScene(position : Vector2) : Vector2 {
        return position.divideV(this.scale);
    }

    public UpdateFoV() : void {
        settings.scene.camera.fov = settings.cameraFov;
        this.UpdateVoxelGridSize();
    }

    public InjectGeometry() : void {
        this.voxelGrid.injectGeometry();
    }

    public UpdateVoxelGridSize() : void {
        this.prevSubdivisions = settings.voxelSize;
        this.voxelGrid = new VoxelGrid(settings.scene.getSize(), settings.voxelSize);
    }

    public resizeCanvas(width: number, height: number): void {
        const scale = new Vector2(width, height).divideV(settings.scene.getSize())
        const size = settings.scene.getSize().multiply(Math.min(scale.x, scale.y));

        this.p5Instance.resizeCanvas(size.x, size.y);
        this.scale = size.divideV(settings.scene.getSize());
    }

    private moveObject(position: Vector2): void {
        if(!this.isInWindow(position) || this.selectedSceneObject === undefined) return;

        this.selectedSceneObject.SetCenter(this.windowPointToScene(position).subtract(this.selectedSceneObjectCenterDifference));
    }
}
