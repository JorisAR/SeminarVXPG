export class Color {
    public r: number;
    public g: number;
    public b: number;
    public a: number;

    static White = new Color(255, 255, 255, 255);
    static Black = new Color(0, 0, 0, 255);

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

    static CreateRandomSaturated(alpha = 255) : Color {
        return new Color(Math.random() * 255, Math.random() * 255, Math.random()* 255, alpha);
    }

    static ColorFromNormalizedIrradiance(irradiance: number, alpha = 255) {
        return new Color(irradiance * 255, irradiance * 255, irradiance * 255, alpha);
    }

    static ColorFromIrradiance(irradiance: number, alpha = 255) {
        const gamma = 2.2; // Common value for gamma correction
        const normalizedIrradiance = Math.pow(irradiance, 1 / gamma); // Apply gamma correction
        const clampedIrradiance = Math.min(Math.max(normalizedIrradiance, 0), 1); // Clamp the value between 0 and 1
        const colorValue = clampedIrradiance * 255;
        return new Color(colorValue, colorValue, colorValue, alpha);
    }

    public getIntensity(): number {
        return (0.299 * this.r + 0.587 * this.g + 0.114 * this.b) / 255;
    }

}