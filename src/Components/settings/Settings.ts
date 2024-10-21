// src/Settings.ts
import { EventEmitter } from 'events';
import { Scene } from 'Components/Scene/Scene';
import {Vector2} from "Components/Scene/Vector2";

class Settings extends EventEmitter {
    selectedTab:number =0;

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
    drawShadingPoints : boolean = true;
    showShadingPointClusters : boolean = false;
    drawVoxels : boolean = true;
    showVoxelClusters : boolean = false;

    constructor() {
        super();
    }

    //======================================== Tabs ========================================
    setSelectedTab(number: number) {
        this.selectedTab = number;
        this.emit('selectedTabChange', number);
        this.emit('change', this);
    }
    isSceneStage() {
        return this.selectedTab === 0;
    }

    isClusterStage() {
        return this.selectedTab === 1;
    }

    isLightInjectionStage() {
        return this.selectedTab === 2;
    }

    isThroughputStage() {
        return this.selectedTab === 3;
    }

    isVoxelSelectionStage() {
        return this.selectedTab === 4;
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
    setShowVoxelClusters(checked: boolean) {
        this.showVoxelClusters = checked;
        this.emit('change', this);
    }

    setShowShadingPointClusters(checked: boolean) {
        this.showShadingPointClusters = checked;
        this.emit('change', this);
    }

    setDrawShadingPoints(checked: boolean) {
        this.drawShadingPoints = checked;
        this.emit('change', this);
    }

    setDrawVoxels(checked: boolean) {
        this.drawVoxels = checked;
        this.emit('change', this);
    }
}
export default new Settings();