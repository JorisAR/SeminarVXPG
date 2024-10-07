// src/App.tsx
import React, { useState } from 'react';
import './App.css';
import SceneSelector from './Components/Scene/SceneSelector';
import { Scene } from './Components/Scene/Scene';
import VoxelGridPanel from './Components/Voxel/VoxelGridPanel';

const App: React.FC = () => {
    const [selectedScene, setSelectedScene] = useState<Scene | null>(null);

    const scenes = Scene.getPredefinedScenes();

    return (
        <div className="App">
            <h1>Voxel Test</h1>
            <SceneSelector scenes={scenes} onSelect={setSelectedScene} />
            {selectedScene && <VoxelGridPanel scene={selectedScene} />}
        </div>
    );
};

export default App;
