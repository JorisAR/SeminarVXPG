import { EventEmitter } from 'events';

class Statistics extends EventEmitter {

    private _injectionRayCount : number = 0;
    private _voxelCount : number = 0;
    private _shadingPointCount : number = 0;
    private _pathTracingHitCount : number = 0;

    private _superPixelCount: number = 0;
    private _superVoxelCount: number = 0;

    get injectionRayCount(): number {
        return this._injectionRayCount;
    }

    set injectionRayCount(value: number) {
        this._injectionRayCount = value;
        this.emit('change', this);
    }

    get voxelCount(): number {
        return this._voxelCount;
    }

    set voxelCount(value: number) {
        this._voxelCount = value;
        this.emit('change', this);
    }
    get shadingPointCount(): number {
        return this._shadingPointCount;
    }

    get superPixelCount(): number {
        return this._superPixelCount;
    }

    set superPixelCount(value: number) {
        this._superPixelCount = value;
        this.emit('change', this);
    }
    get superVoxelCount(): number {
        return this._superVoxelCount;
    }

    set superVoxelCount(value: number) {
        this._superVoxelCount = value;
        this.emit('change', this);
    }

    set shadingPointCount(value: number) {
        this._shadingPointCount = value;
        this.emit('change', this);
    }
    get pathTracingHitPercentage(): number {
        return Math.round(100 * this._pathTracingHitCount / (0.0000001 + this.shadingPointCount));
    }

    get pathTracingHitCount(): number {
        return this._pathTracingHitCount;
    }

    set pathTracingHitCount(value: number) {
        this._pathTracingHitCount = value;
        this.emit('change', this);
    }

    public Reset(): void {
        this.injectionRayCount = 0;
        this.voxelCount = 0;
        this.shadingPointCount = 0;
        this.pathTracingHitCount = 0;

    }
}
export default new Statistics();