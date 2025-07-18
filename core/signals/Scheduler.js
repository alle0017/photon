import Signal from "./Signal.js";

export default class Scheduler {
      /**
       * @type {Map<Signal<unknown>,unknown>}
       */
      #schedule = new Map();

      /**
       * @template T
       * @param {Signal<T>} signal 
       * @param {T} value 
       */
      schedule(signal,value) {
            this.#schedule.set(signal,value);

            if (this.#schedule.size > 1) {
                  return;
            }

            requestAnimationFrame(() => {
                  for (const [k,v] of this.#schedule) {
                        k.set(v);
                  }
                  this.#schedule.clear();
            });
      }
}