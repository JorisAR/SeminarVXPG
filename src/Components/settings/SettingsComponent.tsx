// src/Components/settings/PipelineTabs.tsx
import React from 'react';
import './PipelineTabs.css';
import settings from 'Components/settings/Settings';
import useSettings from 'Hooks/UseSettings';

const SceneSelector: React.FC = () => {
    const scenes = settings.getScenes();

    return (
        <div>
            {scenes.map((scene, index) => (
                <button key={index} onClick={() => settings.setScene(scene)}>
                    Scene {index + 1}
                </button>
            ))}
        </div>
    );
};

const SettingsComponent: React.FC = () => {
    useSettings();

    const renderContent = () => {
        switch (settings.selectedTab) {
            case 0:
                return (
                    <div>
                        <h2>Scene</h2>
                        <SceneSelector /><br/>
                        <label>
                            {"Voxel Subdivisions: " + (settings.voxelSize - 1).toString()}<br/>
                            <input
                                type="range"
                                min="3"
                                max="8"
                                value={settings.voxelSize}
                                onChange={(e) => settings.setVoxelSize(Number(e.target.value))}
                            />
                        </label><br/>
                        <label>
                            {"Camera Field Of View: " + (settings.cameraFov).toString()}<br/>
                            <input
                                type="range"
                                min="25"
                                max="150"
                                step = "5"
                                value={settings.cameraFov}
                                onChange={(e) => settings.setCameraFoV(Number(e.target.value))}
                            />
                        </label>
                        <br/>
                        <strong>Note:</strong> Changing these settings resets the scene.
                    </div>
                );
            case 1:
                return (
                    <div>
                        <h2>Clustering</h2>
                        <h2>Voxels</h2>
                        <label>
                            Show Voxels:
                            <input
                                type="checkbox"
                                checked={settings.drawVoxels}
                                onChange={(e) => settings.setDrawVoxels(e.target.checked)}
                            />
                        </label><br/>
                        <label>
                            Show Voxel Clusters:
                            <input
                                type="checkbox"
                                checked={settings.showVoxelClusters}
                                onChange={(e) => settings.setShowVoxelClusters(e.target.checked)}
                            />
                        </label><br/>


                        <h2>Shading Points</h2>
                        <label>
                            Show Shading Points
                            <input
                                type="checkbox"
                                checked={settings.drawShadingPoints}
                                onChange={(e) => settings.setDrawShadingPoints(e.target.checked)}
                            />
                        </label><br />
                        <label>
                            Show Shading Point Clusters:
                            <input
                                type="checkbox"
                                checked={settings.showShadingPointClusters}
                                onChange={(e) => settings.setShowShadingPointClusters(e.target.checked)}
                            />
                        </label>
                    </div>
                );
            case 2:
                return (
                    <div>
                        <h2>Light Injection</h2>
                        <label>
                            {/*{`Raycount: ${settings.}}}<br/>*/}
                            {settings.visibleRayCount <= 0 ? "Show All Rays" :
                                "Amount of Visible Rays: " + settings.visibleRayCount.toString()}<br/>
                            <input
                                type="range"
                                min="0"
                                max="30"
                                value={settings.visibleRayCount}
                                onChange={(e) => settings.setVisibleRayCount(Number(e.target.value))}
                            />
                        </label><br/>
                        <button onClick={() => settings.shootLightInjectionRay(1)}>Shoot 1 Ray</button>
                        <button onClick={() => settings.shootLightInjectionRay(10)}>Shoot 10 Rays</button>
                        <button onClick={() => settings.shootLightInjectionRay(100)}>Shoot 100 Rays</button>
                        <button onClick={() => settings.toggleSimulation()}>{settings.simulationActive ? "Simulation: On" : "Simulation: Off"}</button><br/>
                        <br/>
                        {settings.simulationActive &&
                        <label>
                            {"Rays Per Second: " + settings.simulationSpeed.toString()}<br/>
                            <input
                                type="range"
                                min="1"
                                max="30"
                                value={settings.simulationSpeed}
                                onChange={(e) => settings.setSimulationSpeed(Number(e.target.value))}
                            />
                        </label>
                        }<br/>
                        <button onClick={() => settings.resetLightInjection()}>Reset Lightinjection</button>
                    </div>
                );
            case 3:
                return <div>Controls for Stage 4</div>;
            case 4:
                return <div>Controls for Stage 5</div>;
            default:
                return null;
        }
    };

    return (
        <div className="content">
            {renderContent()}
        </div>
    );
};

export default SettingsComponent;
