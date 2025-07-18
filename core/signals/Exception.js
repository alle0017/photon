import List from "../Util/List.js";
/**@import {Node} from "./Notifier.js" */

export default class Exception {
      /**
       * @type {List<(e: Error) => void>}
       */
      static #subs = new List();

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
            let node = this.#subs.push(sub);

            return () => {
                  if (!node) {
                        return;
                  }
                  this.#subs.remove(node);
                  node = null;
            };
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