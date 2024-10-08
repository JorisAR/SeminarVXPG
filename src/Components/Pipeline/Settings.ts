// src/Settings.ts
import { EventEmitter } from 'events';
import { Scene } from 'Components/Scene/Scene';

class Settings extends EventEmitter {
    voxelSize: number;
    simulationSpeed: number;
    visibleRayCount: number;
    selectedTab:number;
    simulationActive: boolean;
    scenes: Scene[];
    currentScene: Scene;

    constructor() {
        super();
        this.voxelSize = 5;
        this.visibleRayCount = 15;
        this.simulationSpeed = 20;
        this.selectedTab=0;
        this.simulationActive = false;
        this.scenes = Scene.getPredefinedScenes();
        this.currentScene = this.scenes[0];
    }

    setVoxelSize(size: number) {
        this.voxelSize = size;
        this.emit('voxelSizeChange', size);
    }

    setSimulationSpeed(speed: number) {
        this.simulationSpeed = speed;
        this.emit('simulationSpeedChange', speed);
    }

    setVisibleRayCount(count: number) {
        this.visibleRayCount = count;
        this.emit('visibleRayCountChange', count);
    }
    //Tabs
    setSelectedTab(number: number) {
        this.selectedTab = number;
        this.emit('selectedTabChange', number);
    }
    isSceneStage() {
        return this.selectedTab === 0;
    }

    isLightInjectionStage() {
        return this.selectedTab === 1;
    }

    isClusterStage() {
        return this.selectedTab === 2;
    }

    isVoxelSelectionStage() {
        return this.selectedTab === 3;
    }

    resetLightInjection() {
        this.emit('resetLightInjection');
    }

    shootLightInjectionRay() {
        this.emit('shootLightInjectionRay');
    }

    toggleSimulation() {
        this.simulationActive = !this.simulationActive;
        this.emit('toggleSimulation', this.simulationActive);
    }

    setScene(scene: Scene) {
        this.currentScene = scene;
        this.emit('sceneChange', scene);
    }

    getScenes(): Scene[] {
        return this.scenes;
    }


}
export default new Settings();