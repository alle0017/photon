import Reactive from "./Reactive.js";
/**@import {Unsubscriber} from "./Notifier" */

/**
 * @template T
 */
export default class Effect extends Reactive {
      /**
       * @type {T}
       */
      #value;
      /**
       * @type {Set<Unsubscriber>}
       */
      #subs = new Set();

      get value() {
            return this.#value;
      }

      set value(value) { 
            return;
      }


      /**
       * 
       * @param {(() => T )| ((oldValue: T) => T)} callback 
       * @param  {...Reactive<unknown>} signals 
       */
      constructor(callback, ...signals) {
            super();

            this.#value = callback(undefined);

            for (const signal of signals) {
                  this.#subs.add(
                        signal.subscribe( _ => {
                              const value = callback(this.#value);

                              if (value == this.#value) {
                                    return;
                              }

                              this.#value = value;
                              this.call( value );
                        })
                  );
            }
      }
}