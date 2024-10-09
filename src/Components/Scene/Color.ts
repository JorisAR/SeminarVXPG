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
            this.a = 1.0;
        } else {
            this.r = rOrGray;
            this.g = g;
            this.b = b;
            this.a = a;
        }
    }

    static CreateRandomSaturated() : Color {
        return new Color(Math.random() * 255, Math.random() * 255, Math.random()* 255, 255);
    }
}