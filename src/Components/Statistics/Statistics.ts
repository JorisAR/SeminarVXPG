import { EventEmitter } from 'events';

class Statistics extends EventEmitter {

    private _injectionRayCount : number = 0;

    get injectionRayCount(): number {
        return this._injectionRayCount;
    }

    set injectionRayCount(value: number) {
        this._injectionRayCount = value;
        this.emit('change', this);
    }

    public Reset(): void {
        this.injectionRayCount = 0;
    }
}
export default new Statistics();