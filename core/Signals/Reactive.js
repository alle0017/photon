import List from "../Util/List.js";
import Out from "../Util/Logger.js";
import Exception from "./Exception.js";
import Scheduler from "./Scheduler.js";
/**@import Notifier,{Unsubscriber} from "./Notifier" */

/**
 * @template T
 * @abstract
 * @implements {Notifier<T>}
 */
export default class Reactive {
      static #scheduler = new Scheduler();

      static get scheduler() {
            return this.#scheduler;
      }
      /**
       * @type {List<(arg: T) => void>}
       * @readonly
       */
      #subscribers = new List();
      /**
       * @abstract
       * @type {T}
       */
      get value(){
            throw new Error("reactive elements must implement the value property");
      }
      
      /**
       * subscribe to the signal
       * @param {(arg: T) => void} callback 
       * @returns {Unsubscriber}
       */
      subscribe( callback ){
            if (typeof callback !== 'function') {
                  throw new TypeError("callback must be a function");
            }

            let node = this.#subscribers.push(callback);

            return () => {
                  if (!node) {
                        return;
                  }
                  Out.log("[subscription] subscription deleted");
                  this.#subscribers.remove(node);
                  node = null;
            };
      }

      /**
       * subscribe to the signal. if true is returned, 
       * the subscription is deleted
       * @param {(arg: T) => boolean} callback 
       * @returns {Unsubscriber}
       */
      autoDropSubscribe( callback ){
            if( typeof callback !== 'function' ){
                  throw new TypeError("callback must be a function");
            }

            let node = this.#subscribers.push(value => {
                  if (node && callback(value)) {
                        Out.log("[subscription] auto drop subscription detected");
                        this.#subscribers.remove(node);
                        node = null;
                  }
            });

            return () => {
                  if (!node) {
                        return;
                  }
                  Out.log("[subscription] subscription deleted");
                  this.#subscribers.remove(node);
                  node = null;
            };
      }

      /**
       * @protected
       * @param {T} value
       */
      call(value) {
            for (const callback of this.#subscribers) {
                  callback(value);
            }

            Exception.notify();
      }
}
