// src/App.tsx
import React, { useState } from 'react';
import './App.css';
import { Scene } from './Components/Scene/Scene';
import SceneComponent from 'Components/Scene/SceneComponent';
import SettingsComponent from 'Components/settings/SettingsComponent';
import LegendComponent from 'Components/Legend/LegendComponent';
import settings from 'Components/settings/Settings';
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import StatisticsComponent from "Components/Statistics/StatisticsComponent";

const App: React.FC = () => {
    const scenes = Scene.getPredefinedScenes();

    return (
        // <div className="App">
        //     <div className="PipelineTabs">
        //         <h1>Real-Time Path Guiding using Bounding Voxel Sampling</h1>
        //         <Pipeline />
        //         <PipelineTabs />
        //
        //     </div>
        //     <ScenePanel settings={settings} />
        // </div>

    <div className="App" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{
            backgroundColor: '#010609',
            color: '#fff',
            padding: '10px',
            textAlign: 'center',
            fontWeight: 'bold'
        }}>
            Real-Time Path Guiding using Bounding Voxel Sampling
        </div>
        <div style={{ display: 'flex', height: 'calc(100vh - 41px)' }}>
            <PanelGroup direction="horizontal">
                <Panel defaultSize={69} minSize={10}>
                    <PanelGroup direction="vertical">
                        <Panel defaultSize={70} minSize={10}>
                            <SceneComponent settings={settings}></SceneComponent>
                        </Panel>
                        <PanelResizeHandle />
                        <Panel minSize={10}>
                            <div className="horizontal-column"></div>
                            <SettingsComponent></SettingsComponent>

                        </Panel>
                    </PanelGroup>
                </Panel>
                <PanelResizeHandle />

                <Panel minSize={10}>
                    <div className="container">
                        <div className="vertical-column"></div>
                        <div className="main-content">
                            <PanelGroup direction="vertical">
                                <Panel defaultSize={60} minSize={10}>
                                    <LegendComponent />
                                </Panel>
                                <PanelResizeHandle />
                                <Panel minSize={10}>
                                    <div className="horizontal-column"></div>
                                    <StatisticsComponent />
                                </Panel>
                            </PanelGroup>
                        </div>
                    </div>

                </Panel>
            </PanelGroup>
        </div>
    </div>
    );
};

export default App;
