/**@import ConcreteNode from "../Parser/Nodes/ConcreteNode" */

/**
 * @template {ConcreteNode} T
 */
export default class Ref {
      /**
       * @type {Set<(e: T) => void>}
       */
      #load = new Set();

      /**
       * @type {Set<() => void>}
       */
      #unload = new Set();

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
      onLoad( hook ){
            this.#load.add(hook);
      }

      /**
       * 
       * @param {() => void} hook 
       */
      onUnload( hook ){
            this.#unload.add(hook);
      }
}