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
 *    shadow: VNode<T>[],
 *    instance: T | undefined,
 *    rendered: boolean,
 *    children: VNode<T>[],
 *    render(): void,
 * }} VNode
 */

/**
 * @template {ConcreteNode} T
 * @param {string} text 
 * @returns {VNode<T>}
 */
function createText(text) {
      return {
            tag: text,
            props: new Map(),
            shadow: [],
            subscriptions: new List(),
            rendered: true,
            instance: undefined,
            children: [],
            render() {
                  this.rendered = true;
                  this.instance = /**@type {T}*/(Renderer.createText(text));

                  return this.instance;
            }
      };
}

/**
 * replaces the old node with the new one.
 * it expects both nodes to be rendered.
 * @param {VNode<ConcreteNode>} newNode 
 * @param {VNode<ConcreteNode>} oldNode 
 */
function replace(newNode, oldNode) {
      const instance = oldNode.instance ? oldNode.instance: oldNode.shadow.at(0).instance;

      if (newNode.instance) {
            instance.parentNode.replaceChild(oldNode.instance, newNode.instance);

            if (oldNode.shadow.length <= 0) {
                  return;
            }

            for (let i = 0; i < oldNode.shadow.length; i++) {
                  const node = oldNode.shadow[i].instance;

                  if (!node.parentNode) {
                        continue;
                  }

                  node.parentNode.removeChild(node);
            }

            return;
      }

      if (newNode.shadow.length <= 0) {
            // handle case in which new element is void
            newNode.shadow.push(createText(''));
      }

      for (const node of newNode.shadow) {
            instance.after(node.instance);
      }

      const parent = instance.parentNode;

      for (const node of oldNode.shadow) {
            parent.removeChild(node.instance);
      }
}

/**
 * @template {ConcreteNode} T
 * @param {Reactive<unknown>} tag 
 * @param {Map<string,unknown>} props 
 * @param {VNode<T>[]} children 
 * @returns {VNode<T>}
 */
function createReactive(tag, props, children) {
      const unsubscribe = tag.subscribe(() => {

            const tree = [];

            if (Array.isArray(tag.value) && isNodeArray(tag.value)) {
                  tree.push(...tag.value);
            } else {
                  tree.push(createText(/**@type {string} */(tag.value)));
            }

            const diff = getDifference(node.shadow, tree);

            for (const delta of diff) {
                  delta.node.render();
                  node
                        .shadow[delta.idx]
                        .instance
                        .parentNode
                        .replaceChild(node.shadow[delta.idx].instance, delta.node.instance);
            }
      });

      /**
       * @type {VNode<T>}
       */
      const node = {
            tag,
            props,
            shadow: [],
            subscriptions: new List(),
            rendered: true,
            instance: undefined,
            children,
            render() {
                  for (let i = 0; i < this.shadow.length; i++) {
                        this.shadow[i].render();
                  }
            }
      };

      node.subscriptions.push(unsubscribe);

      return node;
}

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
            shadow: [],
            subscriptions: new List(),
            rendered: false,
            instance: undefined,
            children,
            render() {
                  this.rendered = true;
                  this.instance = /**@type {T}*/(Renderer.createElement(tag));

                  for (let i = 0; i < this.children.length; i++) {
                        this.children[i].render();
                  }
            }
      };
}

/**
 * @template {ConcreteNode} T
 * @param {string} tag 
 * @param {Map<string,unknown>} props 
 * @param {VNode<T>[]} children 
 * @returns {VNode<T>}
 */
function createCustomElement(tag, props, children) {

      props.set('children', children);

      return {
            tag,
            props,
            shadow: /**@type {VNode<T>[]}*/(Register.get(tag, props)),
            subscriptions: new List(),
            rendered: true,
            instance: undefined,
            children,
            render() {
                  for (let i = 0; i < this.shadow.length; i++) {
                        this.shadow[i].render();
                  }
            }
      };
}

export const Builder = {
      /**
       * @template {ConcreteNode} T
       * @param {string} tag 
       * @param {Map<string,unknown>} props 
       * @param {VNode<T>[]} children 
       * @returns {VNode<T>}
       */
      createElement(tag, props, children) {
            if (Register.exists(tag)) {
                  return createCustomElement(tag, props, children);
            }

            return createElement(tag, props, children);
      },
      /**
       * @template {ConcreteNode} T
       * @param {string | Reactive<unknown>} tag 
       * @param {Map<string,unknown>} props 
       * @param {VNode<T>[]} children 
       * @returns {VNode<T>}
       */
      createText(tag, props, children) {
            if (tag instanceof Reactive) {
                  return createReactive(tag, props, children);
            }

            return createText(tag);
      }
}