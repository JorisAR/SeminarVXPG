// src/Components/Pipeline/PipelineTabs.tsx
import React from 'react';
import './PipelineTabs.css';
import settings from 'Components/Pipeline/Settings';
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

const PipelineTabs: React.FC = () => {
    useSettings();

    const renderContent = () => {
        switch (settings.selectedTab) {
            case 0:
                return (
                    <div>
                        <SceneSelector /><br/>
                        <label>
                            {"Scene Scale: " + (settings.sceneScale).toString()}<br/>
                            <input
                                type="range"
                                min="0.5"
                                max="3"
                                step="0.25"
                                value={settings.sceneScale}
                                onChange={(e) => settings.setSceneScale(Number(e.target.value))}
                            />
                        </label><br/>
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
                        <div className="Legend">
                            <strong>Note:</strong> Changing these settings resets the scene.

                            <h2>Brief Paper Overview:</h2>
                            To achieve more accurate path-guiding with only two samples per pixel, the paper proposes to use a global spatial distribution.
                            The rendering process is split up in two:
                            <ul>
                                <li>Divide the scene into voxels, and inject light into these using a path tracing step.</li>
                                <li>Select bright voxels efficiently, and use them to guide a path to bright parts in the scene.</li>
                            </ul>
                        </div>
                    </div>
                );
            case 1:
                return (
                    <div>
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
                        <div className="Legend">
                            <h2>Definitions</h2>
                            <strong>Voxels</strong> is the set of disjoint axis aligned bounding boxes around the geometry. Ideally, they form a tight bound around the scene geometry with positive irradiance.<br/><br/>
                            <strong>Shading points</strong> is the set of points on the geometry directly seen by the camera.<br/><br/>


                            <h2>Clusters</h2>
                            To more efficiently select voxels, we cluster both shading points and clusters.
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div>
                        <label>
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
                        <div className="Legend">
                            <ul>
                                <li><span className="color-box" style={{ backgroundColor: 'red' }}></span>Ray from camera to shading point</li>
                                <li><span className="color-box" style={{ backgroundColor: 'green' }}></span>BSDF Ray from shading point to a secondary point x2</li>
                                <li><span className="color-box" style={{ backgroundColor: 'blue' }}></span>Light occlusion rays from x2</li>
                            </ul>
                        </div>
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
        <div className="PipelineTabs">
            <div className="tabs">
                <button onClick={() => settings.setSelectedTab(0)}>Scene</button>
                <button onClick={() => settings.setSelectedTab(1)}>Clustering</button>
                <button onClick={() => settings.setSelectedTab(2)}>Light Injection</button>
                <button onClick={() => settings.setSelectedTab(3)}>Throughput</button>
                <button onClick={() => settings.setSelectedTab(4)}>Voxel Selection</button>
            </div>
            <div className="content">
                {renderContent()}
            </div>
        </div>
    );
};

export default PipelineTabs;
