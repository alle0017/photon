/**@import Notifier,{Unsubscriber} from "./Notifier" */

import Effect from "./Effect.js";
import Reactive from "./Reactive.js";

/**
 * @template T
 * @implements {Notifier<T>}
 */
export default class Signal extends Reactive {
      /**
       * @type {T}
       */
      #value = undefined;

      get value(){
            return this.#value;
      }

      set value(value) {
            if( this.#value == value )
                  return;

            Reactive.scheduler.schedule(this, value);      
      }
      
      /**
       * @param {T} value default value of the signal
       */
      constructor(value) {
            super();
            this.#value = value;
      }

      /**
       * force setting of
       * specified value. Use carefully, it triggers 
       * refresh each time is called.
       * @ignore
       * @param {T} value 
       */
      set(value) {
            this.#value = value;
            this.call(value);  
      }

      /**
       * used to map a signal into a value
       * @template V
       * @param {T extends Array<infer K> ? (v: K, index: number) => V : (v: T) => V } callback 
       */
      map(callback) {
            if (Array.isArray(this.#value)) {
                  return new Effect(
                        oldValue => {
                              if (!Array.isArray(this.#value)) {
                                    return oldValue;
                              }
                              return this.#value.flatMap((v,i) => callback(v,i));
                        },
                        this
                  );
            }

            return new Effect(() => callback(this.#value, -1), this);
      }
}