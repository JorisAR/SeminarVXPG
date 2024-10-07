export const collideRectRect = (
    x: number, y: number, w: number, h: number,
    x2: number, y2: number, w2: number, h2: number
): boolean => {
    return (
        x + w >= x2 &&    // r1 right edge past r2 left
        x <= x2 + w2 &&    // r1 left edge past r2 right
        y + h >= y2 &&    // r1 top edge past r2 bottom
        y <= y2 + h2      // r1 bottom edge past r2 top
    );
};
