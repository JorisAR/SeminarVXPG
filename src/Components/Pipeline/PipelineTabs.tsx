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
    const { voxelSize, simulationSpeed, simulationActive, visibleRayCount, selectedTab } = useSettings();

    const renderContent = () => {
        switch (selectedTab) {
            case 0:
                return (
                    <div>
                        <SceneSelector />
                        <label>
                            {"Voxel Subdivisions: " + (settings.voxelSize - 1).toString()}
                            <input
                                type="range"
                                min="3"
                                max="8"
                                value={voxelSize}
                                onChange={(e) => settings.setVoxelSize(Number(e.target.value))}
                            />
                        </label>
                    </div>
                );
            case 1:
                return (
                    <div>
                        <button onClick={() => settings.shootLightInjectionRay()}>Shoot Ray</button><br />
                        <button onClick={() => settings.toggleSimulation()}>{simulationActive ? "Simulation: On" : "Simulation: Off"}</button><br />
                        <label>
                            {"Rays Per Second: " + settings.simulationSpeed.toString()}
                            <input
                                type="range"
                                min="1"
                                max="30"
                                value={simulationSpeed}
                                onChange={(e) => settings.setSimulationSpeed(Number(e.target.value))}
                            />
                        </label><br />
                        <label>
                            {settings.visibleRayCount <= 0 ? "Show All Rays" :
                                "Amount of Visible Rays: " + settings.visibleRayCount.toString()}
                            <input
                                type="range"
                                min="0"
                                max="30"
                                value={visibleRayCount}
                                onChange={(e) => settings.setVisibleRayCount(Number(e.target.value))}
                            />
                        </label><br />
                        <button onClick={() => settings.resetLightInjection()}>Reset</button>
                    </div>
                );
            case 2:
                return <div>Controls for Stage 3</div>;
            case 3:
                return <div>Controls for Stage 4</div>;
            default:
                return null;
        }
    };

    return (
        <div className="PipelineTabs">
            <div className="tabs">
                <button onClick={() => settings.setSelectedTab(0)}>Scene</button>
                <button onClick={() => settings.setSelectedTab(1)}>Light Injection</button>
                <button onClick={() => settings.setSelectedTab(2)}>Clustering</button>
                <button onClick={() => settings.setSelectedTab(3)}>Voxel Selection</button>
            </div>
            <div className="content">
                {renderContent()}
            </div>
        </div>
    );
};

export default PipelineTabs;
