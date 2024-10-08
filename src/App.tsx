// src/App.tsx
import React, { useState } from 'react';
import './App.css';
import { Scene } from './Components/Scene/Scene';
import ScenePanel from './Components/Scene/ScenePanel';
import PipelineTabs from './Components/Pipeline/PipelineTabs';
import Legend from './Components/Legend/Legend';
import settings from 'Components/Pipeline/Settings';

const App: React.FC = () => {
    const scenes = Scene.getPredefinedScenes();

    return (
        <div className="App">
            <div className="PipelineTabs">
                <h1>Real-Time Path Guiding using Bounding Voxel Sampling</h1>
                <PipelineTabs />
                <Legend />
            </div>
            <ScenePanel settings={settings} />
        </div>
    );
};

export default App;
