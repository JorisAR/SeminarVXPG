// src/Components/Scene/ScenePanel.tsx
import React, { useRef, useEffect, useState } from 'react';
import p5 from 'p5';
import { Scene } from 'Components/Scene/Scene';
import { Rect } from 'Components/Scene/Rect';
import { Vector2 } from 'Components/Scene/Vector2';
import { VoxelGrid } from 'Components/Scene/VoxelGrid';
import settings from 'Components/Pipeline/Settings';

interface ScenePanelProps {
    settings: typeof settings;
}

const ScenePanel: React.FC<ScenePanelProps> = ({ settings }) => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const [subdivisions, setSubdivisions] = useState(settings.voxelSize);
    const [scene, setScene] = useState(settings.currentScene);

    let prevSubdivisions = -1;
    let sceneGeometry: Rect[] = [];

    scene.scale = new Vector2(2.0);
    const scaledSize = scene.getSize();
    let voxelGrid = new VoxelGrid(sceneGeometry, scaledSize, subdivisions);


    useEffect(() => {
        const sketch = (p: p5) => {
            let frameCounter = 0;
            p.setup = () => {
                p.createCanvas(scaledSize.x, scaledSize.y).parent(canvasRef.current!);
                sceneGeometry = scene.getGeometry(scene.scale);
            };

            p.draw = () => {
                p.background(50);
                scene.draw(p);
                if (prevSubdivisions !== subdivisions) {
                    prevSubdivisions = subdivisions;
                    voxelGrid = new VoxelGrid(sceneGeometry, scaledSize, subdivisions);
                    voxelGrid.GenerateShadingPoints(scene, 1000);
                }
                voxelGrid.drawRays = settings.isLightInjectionStage();
                voxelGrid.draw(p, settings);
                scene.drawGizmos(p);

                if (settings.simulationActive && settings.isLightInjectionStage()) {
                    const raysPerSecond = settings.simulationSpeed;
                    const frameRate = p.frameRate();
                    const framesPerRay = frameRate / raysPerSecond;

                    // Increment the frame counter
                    frameCounter++;

                    // Draw a ray if the frame counter exceeds the frames per ray interval
                    if (frameCounter >= framesPerRay) {
                        lightInjectionStep();
                        frameCounter = 0; // Reset the frame counter
                    }
                }
            };

            p.mousePressed = () => {
                //lightInjectionStep();
            };
        };

        const p5Instance = new p5(sketch);

        return () => {
            p5Instance.remove();
        };
    }, [scene, settings, subdivisions]);

    useEffect(() => {
        const handleVoxelSizeChange = (size: number) => {
            setSubdivisions(size);
        };

        const handleResetLightInjection = () => {
            voxelGrid.resetRays();
            // Implement reset logic here
        };

        const handleShootLightInjectionRay = () => {
            lightInjectionStep();
            console.log("injecting!")
        };

        const handleSceneChange = (scene: Scene) => {
            setScene(scene);
        };

        settings.on('voxelSizeChange', handleVoxelSizeChange);
        settings.on('resetLightInjection', handleResetLightInjection);
        settings.on('shootLightInjectionRay', handleShootLightInjectionRay);
        settings.on('sceneChange', handleSceneChange);

        return () => {
            settings.off('voxelSizeChange', handleVoxelSizeChange);
            settings.off('resetLightInjection', handleResetLightInjection);
            settings.off('shootLightInjectionRay', handleShootLightInjectionRay);
            settings.off('sceneChange', handleSceneChange);
        };
    }, [settings, scene, subdivisions]);

    function lightInjectionStep(): void {
        let from = scene.camera.getPosition(scene);
        let dir = scene.camera.getRandomRayDirection();
        let hit = voxelGrid.raycast(from, dir);
        if (hit) {
            const camera = from;
            const x1 = hit.point;
            from = hit.point;
            dir = dir.reflect(hit.normal);
            dir = hit.normal.randomReflection();
            hit = voxelGrid.raycast(from, dir);
            if (hit) {
                const x2 = hit.point;
                let light = scene.light;
                from = light.getPosition(scene);
                dir = x2.subtract(from).normalize();
                hit = voxelGrid.raycast(from, dir);
                if (hit && x2.distanceTo(hit.point) < 5) {
                    voxelGrid.addRays(camera, x1, x1, x2, from, x2);

                    let voxel = voxelGrid.getVoxelAt(x2);
                    if (voxel) {
                        voxel.inject(light.brightnessAt(scene, x2));
                    }
                }
            }
        }
    }

    return (
        <div>
            <div ref={canvasRef}></div>
        </div>
    );
};

export default ScenePanel;
