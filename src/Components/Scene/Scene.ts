// src/Components/Scene/Scene.ts
import p5 from 'p5';

export class Scene {
    constructor(private drawOperation: (p: p5, width: number, height: number) => void) {}

    public Draw(p: p5, width: number, height: number) {
        this.drawOperation(p, width, height);
    }

    public getGeometry(width: number, height: number): { x: number, y: number, w: number, h: number }[] {
        const DEFAULT_SCENE_WIDTH = 400;
        const DEFAULT_SCENE_HEIGHT = 400;
        const w = width / DEFAULT_SCENE_WIDTH;
        const h = height / DEFAULT_SCENE_HEIGHT;

        return [
            { x: 150 * w, y: 150 * h, w: 100 * w, h: 100 * h }, // Big cube in the middle
            { x: 50 * w, y: 150 * h, w: 50 * w, h: 50 * h },    // Smaller cube on the left
            { x: 300 * w, y: 150 * h, w: 50 * w, h: 50 * h }    // Smaller cube on the right
        ];
    }

    public static getPredefinedScenes(): Scene[] {
        const dinnerTableScene = new Scene((p: p5, width: number, height: number) => {
            const w = width / 400;
            const h = height / 400;
            p.push();
            p.stroke(0);
            p.fill(150);
            // Big cube in the middle
            p.rect(150 * w, 150 * h, 100 * w, 100 * h);
            // Smaller cubes on the left and right
            p.rect(50 * w, 150 * h, 50 * w, 50 * h);
            p.rect(300 * w, 150 * h, 50 * w, 50 * h);
            p.pop();
        });

        return [dinnerTableScene];
    }
}
