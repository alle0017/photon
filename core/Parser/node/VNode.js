import List from "../../Util/List.js";
import Reactive from "../../Signals/Reactive.js";
import { Renderer } from "./Renderer.js";
import Register from "./Register.js";
import { getDifference, isNodeArray } from "./Diff.js";
/**@import ConcreteNode from "./ConcreteNode" */
/**@import {Unsubscriber} from "../../Signals/Notifier" */

/**
 * @template {ConcreteNode} T
 * @typedef {string | VNode<T>[] | Reactive<string> | Reactive<VNode<T>[]>} Tag 
 */
/**
 * @template {ConcreteNode} T
 * @typedef {{
 *    tag: unknown,
 *    props: Map<string,unknown>,
 *    subscriptions: List<Unsubscriber>,
 *    children: VNode<T>[],
 *    render(): T[],
 * }} VNode
 */


/**
 * @template {ConcreteNode} T
 * @param {string} tag 
 * @param {Map<string,unknown>} props 
 * @param {VNode<T>[]} children 
 * @returns {VNode<T>}
 */
function createElement(tag, props, children) {
      return {
            tag,
            props,
            subscriptions: new List(),
            children,
            render() {
                  const root = /**@type {T}*/(Renderer.createElement(tag));

                  for (const child of this.children) {
                        child.render().forEach(node => root.appendChild(node));
                  }

                  return [root];
            }
      };
}

/**
 * convert any type into string
 * @param {unknown} obj 
 */
function toString(obj) {
      return Object
                  .getPrototypeOf(
                        obj || (typeof obj !== 'undefined' && typeof obj !== 'object') ? 
                        obj : 
                        ''
                  ).toString();
}

/**
 * @template {ConcreteNode} T
 * @param {Reactive<unknown>} state 
 * @returns {VNode<T>[]}
 */
function createTreeFromReactive(state) {
      const tree = [];

      if (Array.isArray(state.value) && isNodeArray(state.value)) {
            
            if (tree.length <= 0) {
                  tree.push(createText(''));
            } else {
                  tree.push(...state.value);
            }
      } else {
            const text = toString(state.value);
            tree.push(createText(text));
      }

      return /**@type {VNode<T>[]}*/(tree);
}

/**
 * @template {ConcreteNode} T
 * @param {T} sibling 
 * @param {VNode<T>} node 
 */
function append(sibling, node) {
      const html = node.render();

      for (let i = 0; i < html.length; i++) {
            sibling.after(html[i]);
      }

      return html;
}

/**
 * @param {VNode<ConcreteNode>} node 
 */
function clearSubscriptions(node) {
      let stack = [...node.children];

      node.subscriptions.forEach(sub => sub());

      for (let i = 0; i < stack.length; i++) {
            stack[i].subscriptions.forEach(sub => sub());
            stack = stack.concat(stack[i].children);
      }
}
/**
 * @template {ConcreteNode} T
 * @param {Reactive<unknown>} state 
 */
function createReactive(state) {
      /**@type {T[][]} */
      let html = [];

      const unsubscribe = state.subscribe(() => {
            const tree = /**@type {VNode<T>[]}*/(createTreeFromReactive(state));
            const diff = getDifference(node.children, tree);
            
            for (const dt of diff) {
                  const branch = html[dt.idx];
                  const nodes = append(branch[0], dt.node);
                  
                  for (let i = 0; i < branch.length; i++) {
                        branch[i].parentNode.removeChild(branch[i]);
                  }

                  html[dt.idx] = nodes;
                  clearSubscriptions(node.children[dt.idx]);
                  node.children[dt.idx] = dt.node;
            }

            if (tree.length > html.length) {
                  for (let i = html.length; i < tree.length; i++) {
                        const last = html.at(-1)[0];
                        html.push(append(last, tree[i]));
                        node.children.push(tree[i]);
                  }
            } else if (tree.length < html.length) {
                  for (let i = html.length; i >= tree.length; i--) {
                        html.pop().forEach(node => node.parentNode.removeChild(node));
                        clearSubscriptions(node.children.pop());
                  }
            }
      });

      /**@type {VNode<T>} */
      const node =  {
            tag: state,
            props: new Map(),
            subscriptions: new List(),
            children: createTreeFromReactive(state),
            render() {
                  for (const child of this.children) {
                        const tree = /**@type {T[]}*/(child.render());

                        html.push(tree);
                  }
                  return html.flat();
            }
      };

      node.subscriptions.push(unsubscribe);

      return node;
}

/**
 * @template {ConcreteNode} T
 * @param {string} text
 * @returns {VNode<T>}
 */
function createText(text) {
      return {
            tag: text,
            props: new Map(),
            subscriptions: new List(),
            children: [],
            render() {
                  return [/**@type {T}*/(Renderer.createText(text))];
            }
      };
}

export const Builder = {
      /**
       * @template {ConcreteNode} T
       * @param {string} tag 
       * @param {Map<string,unknown>} props 
       * @param {VNode<T>[]} children 
       * @returns {VNode<T>[]}
       */
      createElement(tag, props, children) {
            if (!Register.exists(tag)) {
                  return [createElement(tag, props, children)];
            } 

            props.set('children', children);
            return /**@type {VNode<T>[]}*/(Register.get(tag, props));
      },
      /**
       * @template {ConcreteNode} T
       * @param {string} text
       * @returns {VNode<T>[]}
       */
      createText(text) {
            return [createText(text)];
      },
      /**
       * @template {ConcreteNode} T
       * @param {unknown} arg
       * @returns {VNode<T>[]}
       */
      createArgElement(arg) {
            if (arg instanceof Reactive) {
                  return [createReactive(arg)];
            } 

            return [createText(toString(arg))];
      }
}