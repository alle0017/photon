/**@import ConcreteNode from "./ConcreteNode" */
/**@import {VNode} from "./VNode" */

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
            this.#map.set(key, creator);
      }
      /**
       * check if exists any component with 
       * the specified name
       * @param {string} key 
       */
      static exists(key) {
            return this.#map.has(key);
      }
      /**
       * return the component with the specified name
       * @param {string} key 
       * @param {Map<string,unknown>} props 
       */
      static get(key, props) {
            const component = this.#map.get(key);
            const attribs = {};

            for (const [k,v] of props) {
                  attribs[k] = v;
            }

            return component(props);
      }
}