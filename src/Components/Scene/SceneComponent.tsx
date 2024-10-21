import React, { useRef, useEffect, useState } from 'react';
import { Scene } from 'Components/Scene/Scene';
import { Vector2 } from 'Components/Scene/Vector2';
import settings from 'Components/settings/Settings';
import { SceneRenderer } from './SceneRenderer';

interface ScenePanelProps {
    settings: typeof settings;
}

const SceneComponent: React.FC<ScenePanelProps> = ({ settings }) => {
    const canvasRef = useRef<HTMLDivElement | null>(null);
    const rendererRef = useRef<SceneRenderer | null>(null);
    const [scene, setScene] = useState(settings.currentScene);

    useEffect(() => {
        if (canvasRef.current) {
            rendererRef.current = new SceneRenderer(canvasRef.current, scene);
            const { clientWidth, clientHeight } = canvasRef.current;
            rendererRef.current?.resizeCanvas(clientWidth, clientHeight);
        }
        return () => {
            // Clean up p5 instance on unmount
            rendererRef.current?.p5Instance.remove();
        };
    }, [scene]);

    useEffect(() => {
        if (canvasRef.current && rendererRef.current) {
            const handleResize = () => {
                if (canvasRef.current) {
                    const { clientWidth, clientHeight } = canvasRef.current;
                    rendererRef.current?.resizeCanvas(clientWidth, clientHeight);
                }
            };

            const resizeObserver = new ResizeObserver(() => {
                window.requestAnimationFrame(handleResize);
            });

            if (canvasRef.current) {
                resizeObserver.observe(canvasRef.current);
            }

            return () => {
                if (canvasRef.current) {
                    resizeObserver.unobserve(canvasRef.current);
                }
            };
        }
    }, []);

    useEffect(() => {
        const handleVoxelSizeChange = (size: number) => {
            rendererRef.current?.UpdateVoxelGridSize();
        };

        const handleResetLightInjection = () => {
            rendererRef.current?.voxelGrid.resetRays();
            // Implement reset logic here
        };

        const handleShootLightInjectionRay = (count : number) => {
            for (let i = 0; i < count; i++) {
                rendererRef.current?.lightInjectionStep();
            }
        };

        const handleSceneChange = (scene: Scene) => {
            setScene(scene);
        };

        const handleFoVChange = (fov : number) => {
            rendererRef.current?.UpdateFoV();
        };

        settings.on('voxelSizeChange', handleVoxelSizeChange);
        settings.on('resetLightInjection', handleResetLightInjection);
        settings.on('shootLightInjectionRay', handleShootLightInjectionRay);
        settings.on('sceneChange', handleSceneChange);
        settings.on('fovChange', handleFoVChange);

        return () => {
            settings.off('voxelSizeChange', handleVoxelSizeChange);
            settings.off('resetLightInjection', handleResetLightInjection);
            settings.off('shootLightInjectionRay', handleShootLightInjectionRay);
            settings.off('sceneChange', handleSceneChange);
            settings.off('fovChange', handleFoVChange);
        };
    }, [settings, scene]);

    return <div ref={canvasRef} style={{ width: '100%', height: '100%' }}></div>;
};

export default SceneComponent;
