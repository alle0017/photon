/**@import VNode from "./Nodes/VNode";*/
/**@import ConcreteNode from "./Nodes/ConcreteNode"; */

import Exception from "../Signals/Exception.js";
import Out from "../Util/Logger.js";

/**
 * class that implements a register for custom elements. Custom elements
 * are functions that returns strictly `VNode` lists.
 * 
 * ## implementation note
 * 
 * Each time this function is called, the 
 * underlying component-function is called, so is to avoid fetching data from 
 * outside in the function body
 * @template {ConcreteNode} T
 */
export default class Register {
      /**
       * @type {Map<string, ( props: Record<string,unknown> ) => VNode<T>[]>}
       */
      #register = new Map();
      /**
       * @type {Map<string,Record<string,unknown>>}
       */
      #propRegister = new Map();

      /**
       * register new custom element
       * @param {string} tag 
       * @param {( props: Record<string,unknown> ) => VNode<T>[]} renderer 
       */
      register( tag, renderer ){
            if( this.#register.has(tag) ){
                  Out.error("[register] tag found while expecting it not exists.");
                  throw new Error(`Tag ${tag} already registered`);
            }

            this.#register.set(tag, renderer);
      }

      /**
       * checks if exists a custom element with name `tag`
       * @param {string} tag 
       * @returns true if the tag is registered
       */
      has( tag ){
            return this.#register.has(tag);
      }

      /**
       * return instance of a tag. Each time this function is called, the 
       * underlying component-function is called, so is to avoid fetching data from 
       * outside in the function body
       * @param {string} tag 
       * @param {Map<string,unknown>} propsMap
       * @param {VNode<T>[]} children 
       */
      create( tag, propsMap, children ){

            if( !this.#register.has(tag) ){
                  Out.error("[register] tag not found while expecting it exists");
                  throw new Error(`Tag ${tag} not registered`);
            }
            
            Out.log("[register] creating tag with name ", tag );
            
            const props = this.#propRegister.has(tag) ? this.#propRegister.get(tag) : {};

            for( let [key, value] of propsMap ){
                  
                  if( key.startsWith('@') ){
                        key = 'on' + key.slice(1,2).toUpperCase() + key.slice(2);     
                  }

                  props[key] = value;
                  props['children'] = children;
            }

            this.#propRegister.set(tag, props);
            try {
                  return this.#register.get(tag)(props);
            } catch (e) {
                  Exception.throw(e);
                  return [];
            }
      }

}