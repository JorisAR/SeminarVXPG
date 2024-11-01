import React, { useRef, useEffect, useState } from 'react';
import { Scene } from 'Components/Scene/Scene';
import settings from 'Components/Settings/Settings';
import { SceneRenderer } from './SceneRenderer';
import Statistics from "Components/Statistics/Statistics";

interface ScenePanelProps {
    settings: typeof settings;
}

const SceneComponent: React.FC<ScenePanelProps> = ({ settings }) => {
    const canvasRef = useRef<HTMLDivElement | null>(null);
    const rendererRef = useRef<SceneRenderer | null>(null);
    const [scene, setScene] = useState(settings.scene);

    useEffect(() => {
        if (canvasRef.current) {
            rendererRef.current = new SceneRenderer(canvasRef.current, scene);
            const { clientWidth, clientHeight } = canvasRef.current;
            rendererRef.current?.resizeCanvas(clientWidth, clientHeight);

            // Add event listener to prevent right-click menu
            const handleContextMenu = (event: MouseEvent) => {
                event.preventDefault();
            };
            canvasRef.current.addEventListener('contextmenu', handleContextMenu);

            return () => {
                // Clean up p5 instance and event listener on unmount
                rendererRef.current?.p5Instance.remove();
                canvasRef.current?.removeEventListener('contextmenu', handleContextMenu);
            };
        }
    }, []);

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
        return () => {
            rendererRef.current?.UpdateVoxelGridSize();
        };
    }, [scene]);

    useEffect(() => {
        const handleVoxelSizeChange = (size: number) => {
            rendererRef.current?.UpdateVoxelGridSize();
        };
        const handleResetLightInjection = () => {
            rendererRef.current?.voxelGrid.resetRays();
            Statistics.injectionRayCount = 0;
            // Implement reset logic here
        };
        const handleShootLightInjectionRay = (count: number) => {
            const grid = rendererRef.current?.voxelGrid;
            if(!grid) return;
            for (let i = 0; i < count; i++) {
                grid.lightInjectionStep(undefined, false);
            }
            grid.computeGI();
        };
        const handleSceneChange = (scene: Scene) => {
            setScene(scene);
        };
        const handleForceGridChange = (fov: number) => {
            rendererRef.current?.UpdateGrid();
        };
        const handleInjectGeometry = (fov: number) => {
            rendererRef.current?.InjectGeometry();
        };
        const handleRecomputeGI = (fov: number) => {
            rendererRef.current?.voxelGrid.computeGI();
        };
        settings.on('voxelSizeChange', handleVoxelSizeChange);
        settings.on('resetLightInjection', handleResetLightInjection);
        settings.on('shootLightInjectionRay', handleShootLightInjectionRay);
        settings.on('sceneChange', handleSceneChange);
        settings.on('injectGeometry', handleInjectGeometry);
        settings.on('forceGridChange', handleForceGridChange);
        settings.on('recomputeGI', handleRecomputeGI);
        return () => {
            settings.off('voxelSizeChange', handleVoxelSizeChange);
            settings.off('resetLightInjection', handleResetLightInjection);
            settings.off('shootLightInjectionRay', handleShootLightInjectionRay);
            settings.off('sceneChange', handleSceneChange);
            settings.off('injectGeometry', handleInjectGeometry);
            settings.off('forceGridChange', handleForceGridChange);
            settings.off('recomputeGI', handleRecomputeGI);
        };
    }, [settings, scene]);

    return (
        <div ref={canvasRef} style={{ width: '100%', height: '100%', backgroundColor: "black" }} >
        </div>
    );
};

export default SceneComponent;
