/**@import ConcreteNode from "../Parser/Nodes/ConcreteNode" */

import List from "../Util/List";

/**
 * @template {ConcreteNode} T
 */
export default class Ref {
      /**
       * @type {List<(e: T) => void>}
       */
      #load = new List();

      /**
       * @type {List<() => void>}
       */
      #unload = new List();

      /**
       * @type {T}
       */
      #value;

      /**
       * @param {T} value 
       */
      set element( value ){
            if( value ){
                  this.#load.forEach( f => f( value ) );
            }else{
                  this.#unload.forEach( f => f() );
            }
            this.#value = value;
      }

      get element(){
            return this.#value;
      }

      /**
       * 
       * @param {(e: T) => void} hook 
       */
      onLoad(hook) {
            let node = this.#load.push(hook);
            return () => {
                  if (!node) {
                        return;
                  }
                  this.#load.remove(node);
                  node = null;
            }
      }

      /**
       * 
       * @param {() => void} hook 
       */
      onUnload(hook) {
            let node = this.#unload.push(hook);
            return () => {
                  if (!node) {
                        return;
                  }
                  this.#unload.remove(node);
                  node = null;
            }
      }
}