
// VNode.js
// Core virtual DOM node implementation for the Photon framework.
// Provides utilities for creating, updating, and managing virtual nodes (VNodes),
// including reactivity, event handling, and attribute management.

import List from "../Util/List.js";
import Reactive from "../signals/Reactive.js";
import { Renderer } from "./Renderer.js";
import Register from "./Register.js";
import { getDifference, isNodeArray } from "./Diff.js";
import Ref from "../signals/Reference.js";
import Exception from "../signals/Exception.js";
/** @import ConcreteNode from "./ConcreteNode" */
/** @import {Unsubscriber} from "../signals/Notifier" */


/**
 * @template {ConcreteNode} T
 * @typedef {string | VNode<T>[] | Reactive<string> | Reactive<VNode<T>[]>} Tag
 *
 * Tag type accepted by VNode creation functions. Can be a string (HTML tag),
 * an array of VNodes, or a Reactive value wrapping a string or VNode array.
 */

/**
 * @template {ConcreteNode} T
 * @typedef {Object} VNode
 * @property {unknown} tag - The tag or value representing this node (string, Reactive, etc).
 * @property {Map<string,unknown>} props - Map of properties/attributes for this node.
 * @property {List<Unsubscriber>} subscriptions - List of cleanup functions for reactivity/event listeners.
 * @property {VNode<T>[]} children - Array of child VNodes.
 * @property {function(): T[]} render - Renders the VNode and returns an array of concrete nodes.
 */

/**
 * Adds an event listener to a concrete DOM node, with error handling via Exception.
 * Used for props starting with 'on' or '@'.
 *
 * @param {ConcreteNode} root - The DOM node to attach the listener to.
 * @param {string} key - The event name (e.g., 'click').
 * @param {Function} value - The event handler function.
 */
function addListener(root, key, value) {
      root.addEventListener(
            key,
            /**
             * @param {Event} ev - The event object.
             */
            ev => {
                  try {
                        value(ev);
                  } catch (e) {
                        Exception.throw(e);
                        Exception.notify();
                  }
            }
      );
}
/**
 * Sets an attribute or property on a concrete DOM node.
 * Handles event listeners, reactive values, and references.
 *
 * @param {ConcreteNode} root - The DOM node to set the attribute on.
 * @param {string} key - The attribute/property name.
 * @param {unknown} value - The value to set (can be function, Ref, Reactive, or primitive).
 * @returns {Unsubscriber|null} - Unsubscribe function for reactivity, or null.
 */
function setAttribute(root, key, value) {
      if ((key.startsWith("on") || key.startsWith("@")) && typeof value === "function") {
            addListener(root, key.replace(/@|on/,'').toLowerCase(), value);
      } else if (value instanceof Ref) {
            value.element = root;
      } else if (value instanceof Reactive) {
            root.setAttribute(key, value.value);
            return value.subscribe(v => {
                  setAttribute(root, key, v);
            });
      } else {
            root.setAttribute(key, /**@type {string}*/(value));
      }
      return null;
}

/**
 * Creates a VNode representing an element with the given tag, props, and children.
 * The returned VNode can be rendered to produce a concrete DOM node.
 *
 * @template {ConcreteNode} T
 * @param {string} tag - The tag name (e.g., 'div').
 * @param {Map<string,unknown>} props - Map of properties/attributes.
 * @param {VNode<T>[]} children - Array of child VNodes.
 * @returns {VNode<T>} The constructed VNode.
 */
function createElement(tag, props, children) {
      return {
            tag,
            props,
            subscriptions: new List(),
            children,
            render() {
                  const root = /**@type {T}*/(Renderer.createElement(tag));
                  for (const [k, v] of props) {
                        const sub = setAttribute(root, k, v);
                        if (sub) {
                              this.subscriptions.push(sub);
                        }
                  }
                  for (const child of this.children) {
                        child.render().forEach(node => root.appendChild(node));
                  }
                  return [root];
            }
      };
}

/**
 * Converts any value to a string representation for text nodes.
 *
 * @param {unknown} obj - The value to convert.
 * @returns {string} String representation of the value.
 */
function toString(obj) {
      if (obj || (typeof obj !== 'undefined' && typeof obj !== 'object')) {
            if (typeof obj != 'object') {
                  return String(obj);
            } else {
                  return Object.getPrototypeOf(obj).toString();
            }
      }
      return '';
}

/**
 * Creates a VNode tree from a Reactive value.
 * If the value is an array of nodes, returns those; otherwise, creates a text node.
 *
 * @template {ConcreteNode} T
 * @param {Reactive<unknown>} state - The reactive value to convert.
 * @returns {VNode<T>[]} Array of VNodes representing the state.
 */
function createTreeFromReactive(state) {
      const tree = [];
      if (Array.isArray(state.value) && isNodeArray(state.value)) {
            if (state.value.length <= 0) {
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
 * Appends the rendered output of a VNode after a sibling node in the DOM.
 *
 * @template {ConcreteNode} T
 * @param {T} sibling - The DOM node after which to insert.
 * @param {VNode<T>} node - The VNode to render and insert.
 * @returns {T[]} Array of inserted DOM nodes.
 */
function append(sibling, node) {
      const html = node.render();
      for (let i = 0; i < html.length; i++) {
            sibling.after(html[i]);
      }
      return html;
}

/**
 * Clears all subscriptions (event listeners, reactive subscriptions) for a VNode and its descendants.
 *
 * @param {VNode<ConcreteNode>} node - The root VNode to clear.
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
 * Creates a reactive VNode that updates its children and DOM when the reactive state changes.
 * Handles diffing and DOM updates for efficient reactivity.
 *
 * @template {ConcreteNode} T
 * @param {Reactive<unknown>} state - The reactive value to bind to the VNode.
 * @returns {VNode<T>} The reactive VNode.
 */
function createReactive(state) {
      /** @type {T[][]} */
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
      /** @type {VNode<T>} */
      const node = {
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
 * Creates a VNode representing a text node.
 *
 * @template {ConcreteNode} T
 * @param {string} text - The text content.
 * @returns {VNode<T>} The text VNode.
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

/**
 * Builder object for creating VNodes in a uniform way.
 * Provides methods for element, text, and argument-based VNode creation.
 *
 * @namespace Builder
 */
export const Builder = {
      /**
       * Creates a VNode array for a given tag, props, and children.
       * If the tag is registered, delegates to Register; otherwise, creates a standard element.
       *
       * @template {ConcreteNode} T
       * @param {string} tag - The tag name.
       * @param {Map<string,unknown>} props - Properties/attributes.
       * @param {VNode<T>[]} children - Child VNodes.
       * @returns {VNode<T>[]} Array of VNodes.
       */
      createElement(tag, props, children) {
            if (!Register.exists(tag)) {
                  return [createElement(tag, props, children)];
            }
            props.set('children', children);
            return /**@type {VNode<T>[]}*/(Register.get(tag, props));
      },
      /**
       * Creates a VNode array containing a single text node.
       *
       * @template {ConcreteNode} T
       * @param {string} text - The text content.
       * @returns {VNode<T>[]} Array with one text VNode.
       */
      createText(text) {
            return [createText(text)];
      },
      /**
       * Creates a VNode array from an argument, handling reactivity and arrays.
       *
       * @template {ConcreteNode} T
       * @param {unknown} arg - The argument to convert.
       * @returns {VNode<T>[]} Array of VNodes.
       */
      createArgElement(arg) {
            if (arg instanceof Reactive) {
                  return [createReactive(arg)];
            } else if (Array.isArray(arg) && isNodeArray(arg.flat())) {
                  return /**@type {VNode<T>[]}*/(arg.flat());
            }
            return [createText(toString(arg))];
      }
};