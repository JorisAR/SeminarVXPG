// src/Components/settings/PipelineTabs.tsx
import React from 'react';
import 'Components/settings/Settings.css';
import settings, {Tab} from 'Components/settings/Settings';
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
            case Tab.Scene:
                return (
                    <div>
                        <strong>Note:</strong> Changing these settings resets the scene. <br/><br/>
                        <SceneSelector/><br/>
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
                    </div>
                );
            case Tab.Clustering:
                return (
                    <div>
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
            case Tab.LightInjection:
                return (
                    <div>
                        <label>
                            {/*{`Raycount: ${settings.}}}<br/>*/}
                            {settings.visibleRayCount <= 0 ? "Show All Rays" :
                                "Amount of Visible Rays: " + settings.visibleRayCount.toString()}<br/>
                            <input
                                type="range"
                                min="0"
                                max="500"
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
            case Tab.Throughput:
                return (
                    <div>
                        Hover over any shading point cluster to see the throughput between each voxel cluster.
                    </div>
                );
            case Tab.VoxelSelection:
                return <div>Controls for Stage 5</div>;
            case Tab.GeometryInjection:
                return (
                    <div>
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
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="content" style={{ width: '100%', height: '100%' }}>
            <div className="tabs">
                <button onClick={() => settings.setSelectedTab(Tab.Scene)} className={settings.selectedTab === Tab.Scene ? "selected" : ""}>Scene</button>
                <button onClick={() => settings.setSelectedTab(Tab.GeometryInjection)} className={settings.selectedTab === Tab.GeometryInjection ? "selected" : ""}>Geometry Injection</button>
                <button onClick={() => settings.setSelectedTab(Tab.LightInjection)} className={settings.selectedTab === Tab.LightInjection ? "selected" : ""}>Light Injection</button>
                <button onClick={() => settings.setSelectedTab(Tab.Clustering)} className={settings.selectedTab === Tab.Clustering ? "selected" : ""}>Clustering</button>
                <button onClick={() => settings.setSelectedTab(Tab.Throughput)} className={settings.selectedTab === Tab.Throughput ? "selected" : ""}>Throughput</button>
                <button onClick={() => settings.setSelectedTab(Tab.VoxelSelection)} className={settings.selectedTab === Tab.VoxelSelection ? "selected" : ""}>Voxel Selection</button>
                <div className="highlight-bar"></div>
            </div>
            <div className="box">
                {renderContent()}
            </div>
        </div>
    );
};

export default SettingsComponent;
