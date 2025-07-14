import List from "../Util/List.js";
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
       * @type {List<Unsubscriber>}
       */
      #subs = new List();

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
                  this.#subs.push(
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