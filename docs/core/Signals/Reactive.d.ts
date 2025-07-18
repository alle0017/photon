/**@import Notifier,{Unsubscriber} from "./Notifier" */
/**
 * @template T
 * @abstract
 * @implements {Notifier<T>}
 */
export default class Reactive<T> implements Notifier<T> {
    static "__#4@#scheduler": Scheduler;
    static get scheduler(): Scheduler;
    /**
     * @abstract
     * @type {T}
     */
    get value(): T;
    /**
     * subscribe to the signal
     * @param {(arg: T) => void} callback
     * @returns {Unsubscriber}
     */
    subscribe(callback: (arg: T) => void): Unsubscriber;
    /**
     * subscribe to the signal. if true is returned,
     * the subscription is deleted
     * @param {(arg: T) => boolean} callback
     * @returns {Unsubscriber}
     */
    autoDropSubscribe(callback: (arg: T) => boolean): Unsubscriber;
    /**
     * @protected
     * @param {T} value
     */
    protected call(value: T): void;
    #private;
}
import Scheduler from "./Scheduler.js";
//# sourceMappingURL=Reactive.d.ts.map