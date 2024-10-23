// src/Components/settings/PipelineTabs.tsx
import React from 'react';
import 'Components/settings/Settings.css';
import settings, {Tab} from 'Components/settings/Settings';
import useSettings from 'Hooks/UseSettings';
import Statistics from "Components/Statistics/Statistics";
import UseStatistics from "Hooks/UseStatistics";
import Settings from "Components/settings/Settings";

const SettingsComponent: React.FC = () => {
    useSettings();
    UseStatistics();

    const renderContent = () => {
        switch (settings.selectedTab) {
            case Tab.Scene:
                return (
                    <div>
                        {/*<strong>Note:</strong> Changing these settings resets the scene. <br/><br/>*/}
                        <div>
                            {settings.getScenes().map((scene, index) => (
                                <button key={index} onClick={() => settings.setScene(scene)}>
                                    Select Scene {index + 1}
                                </button>
                            ))}
                        </div>

                        <br/>
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
                            Show Supervoxels:
                            <input
                                type="checkbox"
                                checked={settings.showVoxelClusters}
                                onChange={(e) => settings.setShowVoxelClusters(e.target.checked)}
                            />
                        </label>
                        <br/>
                        <br/>
                        <label>
                            Show Shading Points
                            <input
                                type="checkbox"
                                checked={settings.drawShadingPoints}
                                onChange={(e) => settings.setDrawShadingPoints(e.target.checked)}
                            />
                        </label><br />
                        <label>
                            Show Superpixels:
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
                        <button onClick={() => settings.toggleSimulation()}>{settings.simulationActive ? "Shoot Ray Automatically: On" : "Shoot Ray Automatically: Off"}</button><br/>
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
                            /><br/><br/>
                        </label>
                        }
                        Alternatively, rays can be shot from the camera's position to anywhere in the scene by clicking in the scene.
                        <br/>
                        <button onClick={() => settings.resetLightInjection()}>Reset Lightinjection</button>
                    </div>
                );
            case Tab.Throughput:
                return (
                    <div>
                        <strong>Note:</strong> Shading points display the irradiance directly sampled from the selected voxel.
                        <br/>
                        <br/>
                        <strong>Hover</strong> over any shading point cluster to see the throughput between each voxel cluster.
                        <br/>
                        <br/>
                        <strong>Click</strong> on a shading point to sample a voxel.
                    </div>
                );
            case Tab.VoxelSampling:
                return <div>
                    <button onClick={() => settings.recomputeGI()}>Recompute Path-Tracing</button>
                    <button onClick={() => settings.toggleForcePT()}>{settings.voxelSamplingForcePT ? "Force Path-Tracing: On" : "Force Path-Tracing: Off"}</button><br/>
                    <button onClick={() => settings.togglePrettyRenderer()}>{settings.voxelSamplingPrettyRenderer ? "RenderMode: pretty" : "RenderMode: visualisation"}</button>
                    <button onClick={() => settings.toggleShowArrows()}>{settings.voxelSamplingShowArrows ? "Show Arrows: On" : "Show Arrows: Off"}</button><br/>
                    {settings.voxelSamplingShowArrows &&
                        <label>
                            {"Arrow Frequency: " + settings.voxelSamplingSPFrequency.toString()}<br/>
                            <input
                                type="range"
                                min="1"
                                max="30"
                                value={settings.voxelSamplingSPFrequency}
                                onChange={(e) => settings.setVisibleArrowCount(Number(e.target.value))}
                            /><br/><br/>
                        </label>
                    }
                    {(Statistics.injectionRayCount === 0 || Settings.voxelSamplingForcePT) &&
                        <div>
                            <strong>Note:</strong> Shading points are shaded using normal path-tracing with explicit light sampling, as no light has been injected.
                            <br/>
                        </div>
                    }
                </div>;
            case Tab.Overview:
                return <div>
                    <strong>Use</strong> the tabs to navigate the different steps involved.
                    <br/>
                    <strong>Read</strong> the paragraphs top-right for an explanation per step.

                </div>;
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
                        <button onClick={() => settings.ToggleGeometryInjection()}>{settings.tightBounds ? "Set Loose Geometry Bounds" : "Set Tight Geometry Bounds"}</button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="content" style={{ width: '100%', height: '100%' }}>
            <div className="tabs">
                <button onClick={() => settings.setSelectedTab(Tab.Overview)} className={settings.selectedTab === Tab.Overview ? "selected" : ""}>Overview</button>
                <button onClick={() => settings.setSelectedTab(Tab.Scene)} className={settings.selectedTab === Tab.Scene ? "selected" : ""}>Scene</button>
                <button onClick={() => settings.setSelectedTab(Tab.GeometryInjection)} className={settings.selectedTab === Tab.GeometryInjection ? "selected" : ""}>Geometry Injection</button>
                <button onClick={() => settings.setSelectedTab(Tab.LightInjection)} className={settings.selectedTab === Tab.LightInjection ? "selected" : ""}>Light Injection</button>
                <button onClick={() => settings.setSelectedTab(Tab.Clustering)} className={settings.selectedTab === Tab.Clustering ? "selected" : ""}>Clustering</button>
                <button onClick={() => settings.setSelectedTab(Tab.Throughput)} className={settings.selectedTab === Tab.Throughput ? "selected" : ""}>Throughput & Voxel Selection</button>
                <button onClick={() => settings.setSelectedTab(Tab.VoxelSampling)} className={settings.selectedTab === Tab.VoxelSampling ? "selected" : ""}>Intra-Voxel Sampling</button>
                <div className="highlight-bar"></div>
            </div>
            <div className="box">
                {renderContent()}
            </div>
        </div>
    );
};

export default SettingsComponent;
