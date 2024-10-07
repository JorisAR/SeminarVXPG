import React from 'react';
import { Scene } from '../Scene/Scene';

interface SceneSelectorProps {
    scenes: Scene[];
    onSelect: (scene: Scene) => void;
}

const SceneSelector: React.FC<SceneSelectorProps> = ({ scenes, onSelect }) => {
    return (
        <div>
            {scenes.map((scene, index) => (
                <button key={index} onClick={() => onSelect(scene)}>
                    Scene {index + 1}
                </button>
            ))}
        </div>
    );
};

export default SceneSelector;
