import {Vector2} from "Components/Util/Vector2";
import {RenderCall} from "Components/Scene/RenderCall";
import {Rect} from "Components/Util/Rect";
import {Color} from "Components/Util/Color";

export abstract class SceneObject {
    bounds: Rect;
    public static : boolean = false; //if true, cannot be moved

    protected constructor(protected position: Vector2) {
        const r = new Vector2(0.15, 0.15);
        this.bounds = new Rect(position.subtract(r), r.multiply(2));
    }

    public abstract draw(renderCall: RenderCall, color : Color | undefined): void;

    public getPosition(): Vector2 {
        return this.position;
    }

    public getCenter(): Vector2 {
        return this.bounds.getCenter();
    }

    public SetCenter(center: Vector2) : SceneObject {
        let difference = center.subtract(this.position);
        this.bounds.position = this.bounds.position.add(difference);
        this.position = center;
        return this;
    }
}


