import { $signal, Signal, } from "./core/index.js";
import Effect from "./core/Signals/Effect.js";
/**
 * @template {{}} T
 * @typedef {<K>(accessor: (t: T) => K) => Effect<K>} Accessor
 */
/**
 * @template {{}} T
 * @typedef {<K extends unknown[], X extends (T | Promise<T>)>(t: T, ...params: K) => X} Actuator
 */

/**
 * @template {{}} T
 * @typedef {(<K extends unknown[]>(mutator: (t: T, ...params: K) => T | Promise<T>) => (...params: K) => void)} Mutator
 */
/**
 * @template {{}} T
 * @typedef {<K extends string[]>(...path: K) => State<ValueOf<T,K>>} Deriver
 */
/**
 * @template {{}} K
 * @template {string[]} T
 * @typedef {T extends [infer X, ...infer Z]? 
 *     (X extends keyof K ? 
 *           (Z extends [string, ...string[]]? 
 *                 (K[X] extends infer O? ValueOf<O,Z>: never): 
 *                 K[X]
 *           )
 *           : never
 *     ): 
 *     (T extends keyof K ? K[T]: never)
 * } ValueOf
 */
/**
 * @template {{}} T
 * @typedef {{ 
 *    accessor: Accessor<T>,
 *    mutator: Mutator<T>,
 *    derive: Deriver<T>
 * }} State
 */

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

      if (a instanceof Array && b instanceof Array) {
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
 * @template {{}} T
 * @template {string[]} V
 * @param {T} state 
 * @param {V} path
 * @returns {ValueOf<T, V>}
 */
const extract = (state, path) => {
      let obj = state;

      for (const key of path) {
            obj = obj[key];

            if (!obj) {
                  return null;
            }
      }

      //@ts-ignore
      return obj;
}
/**
 * @template {{}} T
 * @template {string[]} V
 * @param {T} state 
 * @param {V} path
 * @returns {ValueOf<T, V>}
 */
const extractAndPatch = (state, path) => {
      let obj = state;

      for (const key of path) {
            if (!obj[key] && path.at(-1) !== key) {
                  obj[key] = {};
            }
            
            obj = obj[key];
      }

      //@ts-ignore
      return obj;
}
/**
 * 
 * @param {{}} old 
 * @param {{}} newVal 
 */
const patch = (old,newVal) => {

      for (const k of Object.keys(old)) {
            if (!newVal?.[k]) {
                  old[k] = null;
            }
      }

      if (!newVal) {
            return;
      }

      for (const k of Object.keys(newVal)) {
            old[k] = newVal[k];
      }
}
/**
 * @template {{}} T
 * @template {string[]} V
 * @param {T} state 
 * @param {V} path
 * @param {Signal<T>} [dep=null]
 * @returns {State<ValueOf<T, V>>}
 */
const toState = (state, path, dep = null) => {
      const signal = $signal(state);
      let clone = structuredClone(extract(signal.value, path));
      /**@param {ValueOf<T,V>} value */
      const apply = value => {
            if (equal(extract(signal.value, path), value)) {
                  return;
            }

            patch(extractAndPatch(signal.value, path), value);
            clone = structuredClone(extract(signal.value, path));
            signal.set(signal.value);
      }

      if (dep) {
            dep.subscribe(() => {
                  signal.set(dep.value);
                  clone = structuredClone(extract(signal.value, path));
            });
      }

      return {
            /**
             * @template K
             * @param {(t: ValueOf<T,V>) => K} accessor
             * @returns {Effect<K>}
             */
            //@ts-ignore
            accessor: accessor => signal.map(() => accessor(extract(signal.value, path))),
            /**
             * @template {unknown[]} K
             * @param {(t: ValueOf<T,V>, ...params: K) => ValueOf<T,V>} mutator 
             * @returns {(...params: K) => void} - function that applies the mutation
             */
            mutator: mutator => {
                  return (...params) => { 
                        const value = mutator(clone, ...params);

                        if (typeof value !== 'object') {
                              throw new TypeError(`mutation cannot convert state in something that is not an object.\n Underlying error is: \n Waiting for typeof Object but found ${typeof value}`);
                        }

                        if (value && value instanceof Promise) {

                              value.then(result => {
                                    apply(result);
                              });

                              return;
                        }

                        apply(value);
                  };
            },
            //@ts-ignore
            derive: (...subpath) => {
                  return toState(signal.value, [...path, ...subpath], signal);
            }
      }
}

/**
 * create a reactive global state. The state itself
 * can be accessed through `accessor` method, that returns an effect
 * that will be updated each time a `mutator` mutates the state.
 * mutators are special functions that can change the state.
 * derived states are special states that will not rerender the parent
 * if updated, while they will if the parent is updated
 * 
 * ---
 * 
 * #### note
 * this package aim to implement single source of true:
 * to do so, the suggestion is to avoid passing objects and keeping
 * their reference outside of the state. In this way, data 
 * corruption can be avoided.
 * @template {{}} T
 * @param {T} state 
 * @returns {State<T>}
 */
//@ts-ignore
export const createState = state => toState(state, []);