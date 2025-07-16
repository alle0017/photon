import List from "../../Util/List.js";
/**@import ConcreteNode from "./ConcreteNode" */
/**@import {VNode} from "./VNode" */

/**
 * @template {ConcreteNode} T
 * @param {unknown} value 
 * @returns {value is VNode<T>}
 */
export const isNode = value => {
  if (typeof value !== 'object' || value === null) return false;

  const v = /**@type {Partial<VNode<T>>}*/(value);

  return typeof v.tag === 'string' &&
    v.props instanceof Map &&
    v.subscriptions &&
    Array.isArray(v.children) &&
    typeof v.render === 'function';
}

/**
 * 
 * @param {unknown[]} arr
 * @returns {arr is VNode<ConcreteNode>[]}
 */
export const isNodeArray = arr => arr.length <= 0 || arr.every(node => isNode(node));
/**
 * 
 * @param {unknown} a 
 * @param {unknown} b 
 */
const equal = (a,b) => {
      if (a === b) {
            return true;
      }

      if (a === null || b === null || typeof a !== "object" || typeof b !== "object") {
            return false;
      }

      if (Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) {
            return false;
      }

      if (Array.isArray(a) && Array.isArray(b)) {
            if (a.length != b.length) {
                  return false;
            }

            for (let i = 0; i < a.length; i++) {
                  if (!equal(a[i],b[i])) {
                        return false;
                  }
            }
      }

      if (ArrayBuffer.isView(a) && ArrayBuffer.isView(b)) {
            const A = new Float64Array(a.buffer);
            const B = new Float64Array(b.buffer);

            if (A.length !== B.length) {
                  return false;
            }

            for (let i = 0; i < A.length; i++) {
                  if (A.at(i) !== B.at(i)) {
                        return false;
                  }
            }
      }

      if (a instanceof Map && b instanceof Map) {
            if (a.size !== b.size) {
                  return false;
            }

            for (const key of a.keys()) {
                  if (!b.has(key) || !equal(b.get(key), a.get(key))) {
                        return false;
                  }
            }
      }
      if (a instanceof Set && b instanceof Set) {
            if (a.size !== b.size) {
                  return false;
            }

            for (const key of a.keys()) {
                  if (!b.has(key)) {
                        return false;
                  }
            }
      }

      for (const key of Object.keys(a)) {
            if (!equal(a[key], b[key])) {
                  return false;
            }
      }

      return true;
}
/**
 * 
 * @param {VNode<ConcreteNode>} a 
 * @param {VNode<ConcreteNode>} b 
 */
const isEqual = (a,b) => {
      if (a === b) {
            return true;
      }

      if (!b)
            return false;
      if (typeof b !== 'object')
            return false;
      if (!isNode(b))
            return false;
      if (b.tag !== a.tag)
            return false;
      if (a.props.size !== b.props.size)
            return false;
      if (a.children.length !== b.children.length)
            return false;

      for (const key of a.props.keys()){
            if (key === 'children') {
                  continue;
            }

            if (!b.props.has(key)) {
                  return false;
            } 

            if (!equal(b.props.get(key), a.props.get(key)) && a.props.get(key) !== b.props.get(key)) {
                  return false;
            }
      }

      for (let i = 0; i < a.children.length; i++) {
            if (!isEqual(b.children[i],a.children[i])) {
                  return false;
            }
      }

      return true;
}

/**
 * Compare two trees index by index
 * @template {ConcreteNode} T
 * @param {VNode<T>[]} oldTree 
 * @param {VNode<T>[]} newTree 
 * @returns {List<{ idx: number, node: VNode<T>}>} map that has as key the index in old tree that contains the difference,
 * and as value the new node that should be inserted in the old tree at the same index
 */
export function getDifference(oldTree, newTree) {
      /**
       * @type {List<{
       *    idx: number,
       *    node: VNode<T>
       * }>} 
       */
      const diff = new List();
      const min = Math.min(oldTree.length, newTree.length);

      for( let i = 0; i < min; i++ ){

            const oldNode = oldTree[i];
            const newNode = newTree[i];

            if( !isEqual(oldNode,newNode) ){
                  diff.push({
                        idx: i,
                        node: newNode,
                  });
            }
      }   

      return diff;
}