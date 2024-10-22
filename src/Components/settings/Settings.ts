import { EventEmitter } from 'events';
import { Scene } from 'Components/Scene/Scene';

export enum Tab {
    Scene,
    GeometryInjection,
    LightInjection,
    Clustering ,
    Throughput,
    VoxelSelection ,
}

class Settings extends EventEmitter {

    selectedTab: Tab = Tab.Scene;

    //Scene
    scenes: Scene[]  = Scene.getPredefinedScenes();
    currentScene: Scene  = this.scenes[0];
    voxelSize: number  = 5;
    sceneScale: number = 2.0;
    cameraFov : number = 90;

    //Light Injection
    simulationSpeed: number  = 20;
    visibleRayCount: number  = 15;
    simulationActive: boolean  = false;

    //Clustering
    private _drawShadingPoints : boolean = true;
    private _showShadingPointClusters : boolean = true;
    private _drawVoxels : boolean = true;
    private _showVoxelClusters : boolean = true;

    constructor() {
        super();
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

    setCameraFoV(fov: number) {
        this.cameraFov = fov;
        this.emit('fovChange', fov);
        this.emit('change', this);
    }

    setScene(scene: Scene) {
        this.currentScene = scene;
        this.emit('sceneChange', scene);
        this.emit('change', this);
    }

    getScenes(): Scene[] {
        return this.scenes;
    }

    setSceneScale(scale: number) {
        this.sceneScale = scale;
        this.emit('scaleChange', scale);
        this.emit('change', this);
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
        if(this.selectedTab !== Tab.Clustering) return true;
        return this._drawVoxels;
    }
    get showShadingPointClusters(): boolean {
        if(this.selectedTab !== Tab.Clustering) return false;
        return this._showShadingPointClusters;
    }

    get drawShadingPoints(): boolean {
        if(this.selectedTab !== Tab.Clustering) return true;
        return this._drawShadingPoints;
    }

    setShowVoxelClusters(checked: boolean) {
        this._showVoxelClusters = checked;
        this.emit('change', this);
    }

    setShowShadingPointClusters(checked: boolean) {
        this._showShadingPointClusters = checked;
        this.emit('change', this);
    }

    setDrawShadingPoints(checked: boolean) {
        this._drawShadingPoints = checked;
        this.emit('change', this);
    }

    setDrawVoxels(checked: boolean) {
        this._drawVoxels = checked;
        this.emit('change', this);
    }
}
export default new Settings();