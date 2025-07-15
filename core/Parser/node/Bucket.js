/**
 * @template T
 * @typedef {{
 *    life: number,
 *    value: T,
 * }} Token
 */
/**
 * @template T
 */
export default class Bucket {
      static #LIFESPAN = 10;
      static #TIMEOUT = 60;

      /**@type {Map<string,Token<T>>} */
      #cache = new Map();
      #schedule = () => requestIdleCallback ? requestIdleCallback(this.#tick): setTimeout(this.#tick, 0);
      #tick = () => {
            for (const [key,value] of this.#cache) {
                  value.life--;

                  if (value.life < 0) {
                        this.#cache.delete(key);
                  }
            }

            if (this.#cache.size > 0) {
                  setTimeout(this.#schedule, Bucket.#TIMEOUT);
            }
      }


      /**
       * @param {string} key 
       */
      get(key) {
            return this.#cache.get(key)?.value;
      }
      /**
       * @param {string} key 
       */
      has(key) {
            return this.#cache.has(key);
      }
      /**
       * @param {string} key 
       * @param {T} value 
       */
      set(key,value) {
            this.#cache.set(key, {
                  life: Bucket.#LIFESPAN,
                  value,
            });

            if (this.#cache.size === 1) {
                  requestIdleCallback(this.#tick);
            }
      }
}