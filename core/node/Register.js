/**@import ConcreteNode from "./ConcreteNode" */
/**@import {VNode} from "./VNode" */

import Exception from "../signals/Exception.js";

export default class Register {
      /**
       * @type {Map<string,(props: {}) => VNode<ConcreteNode>[]>}
       */
      static #map = new Map();
      /**
       * register new component. 
       * @param {(props: {}) => VNode<ConcreteNode>[]} creator 
       * @param {string} key 
       */
      static register(creator, key = creator.name) {
            Register.#map.set(key, creator);
      }
      /**
       * check if exists any component with 
       * the specified name
       * @param {string} key 
       */
      static exists(key) {
            return Register.#map.has(key);
      }
      /**
       * return the component with the specified name
       * @param {string} key 
       * @param {Map<string,unknown>} props 
       */
      static get(key, props) {
            const component = Register.#map.get(key);
            const attribs = {};

            for (let [k,v] of props) {
                  if (k.startsWith('@')) {
                        k = k.replace(k.at(1), k.at(1).toUpperCase()).replace('@', 'on')
                  }
                  attribs[k] = v;
            }

            try {
                  return component(attribs);
            } catch (e) {
                  Exception.throw(e);
                  return [];
            }
      }
}