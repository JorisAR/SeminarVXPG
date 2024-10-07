// src/App.tsx
import React, { useState } from 'react';
import './App.css';
import VoxelGrid from './Components/Voxel/VoxelGrid';
import SceneSelector from './Components/Scene/SceneSelector';
import { Scene } from './Components/Scene/Scene';

const App: React.FC = () => {
    const [selectedScene, setSelectedScene] = useState<Scene | null>(null);

    const scenes = Scene.getPredefinedScenes();

    return (
        <div className="App">
            <h1>Voxel Test</h1>
            <SceneSelector scenes={scenes} onSelect={setSelectedScene} />
            {selectedScene && <VoxelGrid scene={selectedScene} />}
        </div>
    );
};

export default App;
