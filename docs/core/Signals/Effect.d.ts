/**@import {Unsubscriber} from "./Notifier" */
/**
 * @template T
 */
export default class Effect<T> extends Reactive<any> {
    /**
     *
     * @param {(() => T )| ((oldValue: T) => T)} callback
     * @param  {...Reactive<unknown>} signals
     */
    constructor(callback: (() => T) | ((oldValue: T) => T), ...signals: Reactive<unknown>[]);
    set value(arg: T);
    get value(): T;
    #private;
}
import Reactive from "./Reactive.js";
//# sourceMappingURL=Effect.d.ts.map