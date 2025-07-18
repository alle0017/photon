/**
 * @template T
 * @implements {Notifier<T>}
 */
export default class Signal<T> extends Reactive<any> implements Notifier<T> {
    /**
     * @param {T} value default value of the signal
     */
    constructor(value: T);
    set value(arg: T);
    get value(): T;
    /**
     * force setting of
     * specified value. Use carefully, it triggers
     * refresh each time is called.
     * @ignore
     * @param {T} value
     */
    set(value: T): void;
    /**
     * used to map a signal into a value
     * @template V
     * @param {T extends Array<infer K> ? (v: K, index: number) => V : (v: T) => V } callback
     */
    map<V>(callback: T extends (infer K)[] ? (v: K, index: number) => V : (v: T) => V): Effect<any>;
    #private;
}
import Reactive from "./Reactive.js";
import Effect from "./Effect.js";
//# sourceMappingURL=Signal.d.ts.map