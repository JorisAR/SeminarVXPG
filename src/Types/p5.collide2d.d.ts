import * as p5 from 'p5';

declare module 'p5' {
    interface p5InstanceExtensions {
        collideRectRect: (
            x: number, y: number, w: number, h: number,
            x2: number, y2: number, w2: number, h2: number
        ) => boolean;
    }
}
