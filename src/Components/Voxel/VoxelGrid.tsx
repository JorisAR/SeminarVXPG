import React, { useRef, useEffect, useState } from 'react';
import p5 from 'p5';
import { Scene } from '../Scene/Scene';
import {collideRectRect} from "../../Utils/collision"

interface VoxelGridProps {
    scene: Scene;
}

const VoxelGrid: React.FC<VoxelGridProps> = ({ scene }) => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const [subdivisions, setSubdivisions] = useState(1);

    const width = 800;
    const height = 800;

    useEffect(() => {
        const sketch = (p: p5) => {
            let sceneGeometry: { x: number, y: number, w: number, h: number }[] = [];

            p.setup = () => {
                p.createCanvas(width, height).parent(canvasRef.current!);
                sceneGeometry = scene.getGeometry(width, height);
            };

            p.draw = () => {
                // Clear the background
                p.background(255);

                // Execute the draw operation in the scene
                scene.Draw(p, width, height);

                // Draw the grid on top of the scene
                p.push(); // Save the current drawing style settings
                p.stroke(255, 105, 180); // Pink color
                p.noFill();
                const size = width / Math.pow(2, subdivisions - 1);
                for (let x = 0; x < width; x += size) {
                    for (let y = 0; y < height; y += size) {
                        // Check if the grid cell intersects with any scene geometry
                        for (const geom of sceneGeometry) {
                            if (collideRectRect(x, y, size, size, geom.x, geom.y, geom.w, geom.h)) {
                                p.rect(x, y, size, size);
                                break;
                            }
                        }
                    }
                }
                p.pop(); // Restore the previous drawing style settings
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

export default VoxelGrid;
