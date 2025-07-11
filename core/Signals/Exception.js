/**@import {Node} from "./Notifier" */
export default class Exception {
      /**
       * @type {Set<(e: Error) => void>}
       */
      static #subs = new Set();

      /**
       * @type {Node<Error>} 
       */
      static #queue;
      /**
       * @type {Node<Error>} 
       */
      static #tail;

      static notify() {
            while (this.#queue) {
                  this.#subs.forEach(sub => sub(this.#queue.value));
                  this.#queue = this.#queue.next;
            }
      }

      /**
       * handler used to catch any exception 
       * that happens during app
       * execution
       * @param {(e: Error) => void} sub 
       */
      static catch(sub) {
            this.#subs.add(sub);

            return () => this.#subs.delete(sub);
      }

      /**
       * add an error to the queue. must 
       * be used in combination with {@link Exception.notify}
       * to notify all subscribers that an error happened
       * @param {Error} error 
       */
      static throw(error) {

            if (this.#tail) {
                  this.#tail.next = {
                        value: error,
                        next: null,
                  };
                  this.#tail = this.#tail.next;
            } else {
                  this.#queue = {
                        value: error,
                        next: null,
                  };
                  this.#tail = this.#queue;
            }
      }
}