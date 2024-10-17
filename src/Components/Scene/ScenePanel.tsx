// src/Components/Scene/ScenePanel.tsx
import React, { useRef, useEffect, useState } from 'react';
import p5 from 'p5';
import { Scene } from 'Components/Scene/Scene';
import { Rect } from 'Components/Scene/Rect';
import { Vector2 } from 'Components/Scene/Vector2';
import { VoxelGrid } from 'Components/Scene/VoxelGrid';
import settings from 'Components/Pipeline/Settings';
import {Light} from "Components/Scene/Gizmo";
import {RenderCall} from "Components/Scene/RenderCall";

interface ScenePanelProps {
    settings: typeof settings;
}

const ScenePanel: React.FC<ScenePanelProps> = ({ settings }) => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const [subdivisions, setSubdivisions] = useState(settings.voxelSize);
    const [scene, setScene] = useState(settings.currentScene);
    const [fov, setFoV] = useState(settings.cameraFov);
    //const [scale, setScale] = useState(settings.sceneScale);

    let prevSubdivisions = -1;
    scene.camera.fov = fov;
    const sceneSize = scene.getSize();
    const scale = new Vector2(250, 250);
    let sceneGeometry: Rect[] = scene.getGeometry();
    let voxelGrid = new VoxelGrid(sceneGeometry, scene.getSize(), subdivisions);


    useEffect(() => {
        const sketch = (p: p5) => {
            let frameCounter = 0;
            p.setup = () => {
                p.createCanvas(sceneSize.x * scale.x, sceneSize.y * scale.y).parent(canvasRef.current!);
            };

            p.draw = () => {
                p.background(50);

                const renderCall : RenderCall = {p : p, offset : Vector2.Zero, scale : scale }

                scene.draw(renderCall);
                if (prevSubdivisions !== subdivisions) {
                    prevSubdivisions = subdivisions;
                    voxelGrid = new VoxelGrid(sceneGeometry, sceneSize, subdivisions);
                    voxelGrid.GenerateShadingPoints(scene, 1000);
                }
                voxelGrid.drawRays = settings.isLightInjectionStage();
                voxelGrid.draw(renderCall);
                scene.drawGizmos(renderCall);

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
    }, [scene, settings, subdivisions, fov, scale]);

    useEffect(() => {
        const handleVoxelSizeChange = (size: number) => {
            setSubdivisions(size);
        };

        const handleResetLightInjection = () => {
            voxelGrid.resetRays();
            // Implement reset logic here
        };

        const handleShootLightInjectionRay = (count : number) => {
            for (let i = 0; i < count; i++) {
                lightInjectionStep();
            }
        };

        const handleSceneChange = (scene: Scene) => {
            setScene(scene);
        };

        const handleFoVChange = (fov : number) => {
            setFoV(fov);
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
    }, [settings, scene, subdivisions, fov, scale]);

    function lightInjectionStep(): void {
        let from = scene.camera.getPosition();
        let dir = scene.camera.getRandomRayDirection();
        let hit = voxelGrid.raycast(from, dir);
        if (hit) {
            const camera = from;
            const x1 = hit.point;
            let light = scene.light;
            //try to see if we can get direct light:
            let lightSample = sampleLight(x1, light);
            if (lightSample) {
                voxelGrid.addPath(camera, x1, x1, light.getPosition());
                let voxel = voxelGrid.getVoxelAt(x1);
                if (voxel) {
                    voxel.inject(lightSample);
                }
                return;
            }

            from = hit.point;
            dir = dir.reflect(hit.normal);
            dir = hit.normal.randomReflection();
            hit = voxelGrid.raycast(from, dir);
            if (hit) {
                const x2 = hit.point;
                lightSample = sampleLight(x2, light);

                if (lightSample) {
                    voxelGrid.addPath(camera, x1, x1, x2, light.getPosition(), x2);
                    let voxel = voxelGrid.getVoxelAt(x2);
                    if (voxel) {
                        voxel.inject(lightSample);
                    }
                } else {
                    voxelGrid.addPath(camera, x1, x1, x2);
                }
            }
        }
    }

    function sampleLight(point: Vector2, light : Light): number | null {
        const from = light.getPosition();
        const dir = point.subtract(from).normalize();
        const hit = voxelGrid.raycast(from, dir);
        if (hit && point.distanceTo(hit.point) < 0.01) {
            return light.brightnessAt(point);
        }
        return null;
    }

    return (
        <div>
            <div ref={canvasRef}></div>
        </div>
    );
};

export default ScenePanel;
