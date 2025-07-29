import Signal from "./Signal.js";

export default class Scheduler {
      /**
       * @type {Promise<void> | undefined}
       */
      #tick;
      /**
       * @type {() => void}
       */
      #resolver;
      /**
       * @type {Map<Signal<unknown>,unknown>}
       */
      #schedule = new Map();
      constructor() {
            this.#createTicker();
      }
      #createTicker() {
            if (this.#tick == undefined) {
                  return;
            }
            this.#tick = new Promise(resolve => {
                  this.#resolver = resolve;
            });
      }
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

            this.#createTicker();

            requestAnimationFrame(() => {
                  for (const [k,v] of this.#schedule) {
                        k.set(v);
                  }
                  this.#schedule.clear();
                  this.#resolver();
                  this.tick = undefined;
            });
      }

      tick() {
            return this.#tick;
      }
}