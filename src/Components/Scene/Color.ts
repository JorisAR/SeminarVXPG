export class Color {
    public r: number;
    public g: number;
    public b: number;
    public a: number;

    constructor(r: number, g: number, b: number, a: number);
    constructor(gray: number);
    constructor(rOrGray: number, g?: number, b?: number, a: number = 255.0) {
        if (g === undefined || b === undefined) {
            this.r = rOrGray;
            this.g = rOrGray;
            this.b = rOrGray;
            this.a = 255.0;
        } else {
            this.r = rOrGray;
            this.g = g;
            this.b = b;
            this.a = a;
        }
    }

    static CreateRandomSaturated(alpha = 255 ) : Color {
        return new Color(Math.random() * 255, Math.random() * 255, Math.random()* 255, alpha);
    }

    static ColorFromNormalizedIrradiance(irradiance: number) {
        return new Color(irradiance * 255, irradiance * 255, irradiance * 255, 255);
    }

    static ColorFromIrradiance(irradiance: number) {
        const gamma = 2.2; // Common value for gamma correction
        const normalizedIrradiance = Math.pow(irradiance, 1 / gamma); // Apply gamma correction
        const clampedIrradiance = Math.min(Math.max(normalizedIrradiance, 0), 1); // Clamp the value between 0 and 1
        const colorValue = clampedIrradiance * 255;
        return new Color(colorValue, colorValue, colorValue, 255);
    }

}