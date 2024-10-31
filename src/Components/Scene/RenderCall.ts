import {Vector2} from "Components/Util/Vector2";
import p5 from "p5";
import {ShadingPointCluster} from "Components/Scene/ShadingPointCluster";
import {ShadingPoint} from "Components/Scene/ShadingPoint";

export interface RenderCall
{
    p: p5;
    scale : Vector2; //scale factor, to convert from scene scale to pixels
    offset : Vector2; // offset in meters
    selectedShadingCluster : ShadingPointCluster | undefined; //
    selectedShadingPoint : ShadingPoint | undefined;
}