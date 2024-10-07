import React, { useRef, useEffect, useState } from 'react';
import p5 from 'p5';
import { Scene } from '../Scene/Scene';
import { Rect } from '../Scene/Rect';
import { Ray } from '../Scene/Ray';
import { Vector2 } from '../Scene/Vector2';
import { Color } from '../Scene/Color';
import {VoxelGrid} from "../Voxel/VoxelGrid";

interface VoxelGridProps {
    scene: Scene;
}

const VoxelGridPanel: React.FC<VoxelGridProps> = ({ scene }) => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const [subdivisions, setSubdivisions] = useState(1);

    useEffect(() => {
        const sketch = (p: p5) => {
            let prevSubdivisions = 0;
            let sceneGeometry: Rect[] = [];
            scene.scale = new Vector2(2.0);
            const scaledSize = scene.getSize();
            let voxelGrid = new VoxelGrid(sceneGeometry, scaledSize, subdivisions);

            function lightInjectionStep(): void {
                let from = scene.camera.getPosition(scene);
                let dir = scene.camera.getRandomRayDirection();
                let hit = voxelGrid.raycast(from, dir);

                if (hit) {
                    voxelGrid.rays.push(new Ray(from, hit.point, new Color(255, 0, 0, 50)));
                    const x1 = hit.point;
                    from = hit.point;
                    dir = dir.reflect(hit.normal);
                    dir = hit.normal.randomReflection();
                    hit = voxelGrid.raycast(from, dir);
                    if(hit) {
                        const x2 = hit.point;
                        voxelGrid.rays.push(new Ray(from, hit.point, new Color(0, 255, 0, 50)));

                        //calculate if light hits this
                        let light = scene.light;
                        from = light.getPosition(scene);
                        dir = x2.subtract(from).normalize();
                        hit = voxelGrid.raycast(from, dir);
                        if(hit && x2.distanceTo(hit.point) < 5) { //
                            voxelGrid.rays.push(new Ray(from, x2, new Color(0, 0, 255, 50)));

                            let voxel = voxelGrid.getVoxelAt(x2);
                            if(voxel){
                                voxel.inject(light.brightnessAt(scene, x2));
                            }
                        }
                    }
                }
            }

            p.setup = () => {
                p.createCanvas(scaledSize.x, scaledSize.y).parent(canvasRef.current!);
                sceneGeometry = scene.getGeometry(scene.scale);

            };

            p.draw = () => {
                p.background(50);
                scene.draw(p);
                if(prevSubdivisions !== subdivisions) {
                    prevSubdivisions = subdivisions;
                    voxelGrid = new VoxelGrid(sceneGeometry, scaledSize, subdivisions);
                }
                voxelGrid.draw(p);
                scene.drawGizmos(p);

                lightInjectionStep();
            };

            p.mousePressed = () => {
/*                let from = new Vector2(20, 20);
                let dir = new Vector2(p.mouseX, p.mouseY).subtract(from).normalize();*/
                lightInjectionStep();

            };
        };

        const p5Instance = new p5(sketch);

        return () => {
            p5Instance.remove();
        };
    }, [scene, subdivisions]);

    return (
        <div>
            <div ref={canvasRef}></div>
            <input
                type="range"
                min="1"
                max="7"
                value={subdivisions}
                onChange={(e) => setSubdivisions(Number(e.target.value))}
            />
        </div>
    );
};

export default VoxelGridPanel;
