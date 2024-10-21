// src/App.tsx
import React, { useState } from 'react';
import './App.css';
import { Scene } from './Components/Scene/Scene';
import SceneComponent from 'Components/Scene/SceneComponent';
import SettingsComponent from 'Components/settings/SettingsComponent';
import PipelineComponent from 'Components/Legend/PipelineComponent';
import settings from 'Components/settings/Settings';
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";

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
            backgroundColor: '#333',
            color: '#fff',
            padding: '10px',
            textAlign: 'center',
            fontWeight: 'bold'
        }}>
            Real-Time Path Guiding using Bounding Voxel Sampling
        </div>
        <div style={{ display: 'flex', height: 'calc(100vh - 40px)' }}>
            <PanelGroup direction="horizontal">
                <Panel defaultSize={65} minSize={10}>
                    <PanelGroup direction="vertical">
                        <Panel defaultSize={50} minSize={10}>
                            <SceneComponent settings={settings}></SceneComponent>
                        </Panel>
                        <PanelResizeHandle />
                        <Panel minSize={10}>
                            <div style={{ height: '5px', width: '100%', backgroundColor: '#333' }}></div>
                            <PipelineComponent></PipelineComponent>
                        </Panel>
                    </PanelGroup>
                </Panel>
                <PanelResizeHandle />
                <Panel minSize={10}>
                    <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
                        <div style={{ width: '5px', height: '100%', backgroundColor: '#333' }}></div>
                        <div style={{ flex: 1, padding: '10px', overflowY: 'auto', height: '100%' }}>
                            <SettingsComponent></SettingsComponent>
                        </div>
                    </div>
                </Panel>
            </PanelGroup>
        </div>
    </div>
    );
};

export default App;
