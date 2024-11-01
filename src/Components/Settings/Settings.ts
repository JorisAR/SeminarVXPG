import { EventEmitter } from 'events';
import { Scene } from 'Components/Scene/Scene';

export enum Tab {
    Overview,
    Scene,
    GeometryInjection,
    LightInjection,
    Clustering ,
    Throughput,
    VoxelSampling ,
}

class Settings extends EventEmitter {
    public selectedTab: Tab = Tab.Overview;

    //Scene
    public scenes: Scene[]  = Scene.getPredefinedScenes();
    public scene: Scene  = this.scenes[0];

    //public cameraFov : number = 90;

    //Geometry Injection
    public tightBounds: boolean = false;
    public voxelSize: number  = 5;

    //Light Injection
    simulationSpeed: number  = 20;
    visibleRayCount: number  = 1000;
    simulationActive: boolean  = false;

    //Clustering
    private _drawShadingPoints : boolean = true;
    private _showShadingPointClusters : boolean = true;
    private _drawVoxels : boolean = true;
    private _showVoxelClusters : boolean = true;

    //intra-voxel sampling
    public voxelSamplingShowArrows = true;
    public voxelSamplingSPFrequency = 10; //one in n samplingpoints are rendered
    public voxelSamplingForcePT = false;
    private _voxelSamplingPrettyRenderer = false;
    private _voxelSamplingBinaryColor = false;


    constructor() {
        super();
    }

    public forceGridChange() {
        this.emit('forceGridChange', this);
    }

    public forceChange() {
        this.emit('change', this);
    }

    //======================================== Tabs ========================================
    setSelectedTab(tab: Tab) {
        this.selectedTab = tab;
        this.emit('selectedTabChange', tab);
        this.emit('change', this);
    }

    //======================================== Scene ========================================

    setVoxelSize(size: number) {
        this.voxelSize = size;
        this.emit('voxelSizeChange', size);
        this.emit('change', this);
    }


    ToggleGeometryInjection() {
        this.tightBounds = !this.tightBounds;
        if(!this.tightBounds)
            this.emit('voxelSizeChange', this.voxelSize);
        this.emit('change', this);
        this.emit('injectGeometry', this);
    }

    // setCameraFoV(fov: number) {
    //     this.cameraFov = fov;
    //     this.emit('fovChange', fov);
    //     this.emit('change', this);
    // }

    setScene(scene: Scene) {
        this.scene = scene;
        this.emit('sceneChange', scene);
        this.emit('change', this);
    }

    getScenes(): Scene[] {
        return this.scenes;
    }

    //======================================== light injection ========================================

    setSimulationSpeed(speed: number) {
        this.simulationSpeed = speed;
        this.emit('simulationSpeedChange', speed);
        this.emit('change', this);
    }

    setVisibleRayCount(count: number) {
        this.visibleRayCount = count;
        this.emit('visibleRayCountChange', count);
        this.emit('change', this);
    }

    resetLightInjection() {
        this.emit('resetLightInjection');
    }

    shootLightInjectionRay(count : number = 1) {
        this.emit('shootLightInjectionRay', count);
    }

    toggleSimulation() {
        this.simulationActive = !this.simulationActive;
        this.emit('toggleSimulation', this.simulationActive);
        this.emit('change', this);
    }

    //======================================== clusters ========================================

    get showVoxelClusters(): boolean {
        if(this.selectedTab !== Tab.Clustering) return false;
        return this._showVoxelClusters;
    }
    get drawVoxels(): boolean {
        if(this.selectedTab === Tab.Scene) return false;
        if(this.selectedTab !== Tab.Clustering && this.selectedTab !== Tab.VoxelSampling) return true;
        return this._drawVoxels;
    }
    get showShadingPointClusters(): boolean {
        if(this.selectedTab !== Tab.Clustering) return false;
        return this._showShadingPointClusters;
    }

    get drawShadingPoints(): boolean {
        if(this.selectedTab !== Tab.Clustering)
            return this.selectedTab === Tab.Throughput || this.selectedTab === Tab.VoxelSampling || this.selectedTab === Tab.Scene;
        return this._drawShadingPoints;
    }

    set showVoxelClusters(checked: boolean) {
        this._showVoxelClusters = checked;
        this.emit('change', this);
    }

    set showShadingPointClusters(checked: boolean) {
        this._showShadingPointClusters = checked;
        this.emit('change', this);
    }

    set drawShadingPoints(checked: boolean) {
        this._drawShadingPoints = checked;
        this.emit('change', this);
    }

    set drawVoxels(checked: boolean) {
        this._drawVoxels = checked;
        this.emit('change', this);
    }

    public toggleDrawVoxels() {
        this.drawVoxels = !this.drawVoxels;
        this.emit('change', this);
    }



    //======================================== voxel sampling ========================================

    public toggleForcePT() {
        this.voxelSamplingForcePT = !this.voxelSamplingForcePT;
        this.emit('change', this);
        this.recomputeGI()
    }

    toggleShowArrows() {
        this.voxelSamplingShowArrows = !this.voxelSamplingShowArrows;
        this.emit('change', this);
    }

    toggleBinaryColors() {
        this.voxelSamplingBinaryColor = !this.voxelSamplingBinaryColor;
    }

    setVisibleArrowCount(count: number) {
        this.voxelSamplingSPFrequency = count;
        this.emit('change', this);
    }

    recomputeGI() {
        this.emit('recomputeGI');
    }

    togglePrettyRenderer() {
        this._voxelSamplingPrettyRenderer = !this._voxelSamplingPrettyRenderer;
        this.emit('change', this);
    }

    get voxelSamplingPrettyRenderer(): boolean {
        if(this.selectedTab !== Tab.VoxelSampling) return false;
        return this._voxelSamplingPrettyRenderer;
    }

    get voxelSamplingBinaryColor(): boolean {
        if(this.selectedTab !== Tab.VoxelSampling) return false;
        return this._voxelSamplingBinaryColor;
    }

    set voxelSamplingBinaryColor(value: boolean) {
        this._voxelSamplingBinaryColor = value;
        this.emit('change', this);
    }
}
export default new Settings();