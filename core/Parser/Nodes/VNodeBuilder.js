/**@import Renderer from "../View/Renderer.js" */
/**@import ConcreteNode from "../Nodes/ConcreteNode.js" */
/**@import Register from "../Register";*/
/**@import {Unsubscriber} from "../../Signals/Notifier" */
/**@import Differ from "../Diff/Differ" */

import Reactive from "../../Signals/Reactive.js";
import VNode from "./VNode.js";

/**
 * @template {ConcreteNode} T
 * @typedef {string|Reactive<string>} TagName
 */

/**
 * @template {ConcreteNode} T
 * @typedef {string|Reactive<string>|VNode[]|Reactive<VNode[]>} Tag
 */

/**
 * factory class delegated of VNode creation
 * and higher-subscription management.
 * higher-subscription are reactive values that 
 * are not attribute (delegated to the specific VNode),
 * but text, tag name or other VNode trees. 
 * those subscriptions are dropped when the father is dropped.
 * @template {ConcreteNode} T
 */
export default class VNodeBuilder {
      /**
       * @type {Map<string,unknown>}
       */
      static #voidMap;

      /**
       * @type {Register<T>}
       */
      #register;

      /**
       * @type {Differ}
       */
      #differ;

      /**
       * configure the strategy that will be used by the 
       * VNode to render, register custom components and 
       * Diffing between two trees
       * @param {Renderer<ConcreteNode>} renderer 
       * @param {Register} register 
       * @param {Differ} differ
       */
      constructor( renderer, register, differ){
            this.#register = register;
            this.#differ = differ;
            VNode.renderer = renderer;
      }

      /**
       * 
       * @param {VNode<T>[]} tree 
       * @param {VNode<T>[]} oldTree 
       */
      #diffTrees( tree, oldTree ){

            const diff = /**@type {Map<number,VNode<T>>}*/(this.#differ.getDifference( oldTree, tree ));
            const build = [];


            for ( let i = 0; i < oldTree.length; i++ ) {
                  if ( diff.has(i) ) {
                        build.push(diff.get(i));
                        oldTree[i].replace(diff.get(i));
                  }else{
                        build.push(oldTree[i]);
                  }
            }

            if ( oldTree.length < tree.length ) {
                  let root = build.at(-1);

                  for ( let i = build.length; i < tree.length; i++ ) {
                        root.appendAfter(tree[i]);
                        root = tree[i];
                        build.push(tree[i]);
                  }
            } else if ( tree.length < build.length ) {
                  for ( let i = tree.length; i < build.length; i++ ) {
                        build[i].remove();
                  }

                  build.splice( tree.length, build.length - tree.length );
            }

            return [...build];
      }

      /**
       * @param {string} tagName 
       * @param {Map<string,unknown>} props 
       * @param {VNode<T>[]} children 
       * @param {Unsubscriber[]} scope 
       */
      #createElement(tagName, props, children, scope = []){
            if ( this.#register.has( tagName ) ) {
                  return {
                        subs: scope,
                        tree: this.#register.create( tagName, props, children )
                  };
            }

            const node = /**@type {VNode<T>}*/(new VNode(tagName,props,children));

            node.onLeave(() => {
                  scope.forEach(sub => sub());
            });

            return { 
                  subs: [], 
                  tree: [node] 
            }
      }

      /**
       * @param {Reactive<VNode[]>} tag 
       * @returns 
       */
      #handleReactiveVNodeList(tag){

            if( tag.value.length < 1 ){
                  // keep the tree always partially 
                  // full, to prevent lost of root
                  tag.value.push(new VNode('', new Map(), []));
            }

            const build = tag.value;
            let oldTree = [...tag.value];

            const sub = tag.subscribe( tree => {

                  if (tree.length < 1) {
                        tree.push(new VNode('', new Map(), []));
                  }

                  oldTree = this.#diffTrees(tree,oldTree);
            });

            return {sub,build};
      }

      /**
       * function delegated of creation and management of
       * reactive tag names, so tag that can change at runtime
       * @param {Reactive<string>} tag 
       * @param {VNode<T>[]} children 
       * @param {Map<string,unknown>} props 
       * @returns 
       */
      #handleReactiveTagName(tag,children,props){

            const value = this.#createElement(tag.value,props,children).tree;
            const build = value;
            let oldTree = [...value];

            if( build.length < 1 ){
                  // keep the tree always partially 
                  // full, to prevent lost of root
                  build.push(new VNode('', new Map(), []));
            }

            const sub = tag.subscribe( tagName => {
                  const tree = this.#createElement(tagName,props,children).tree;

                  if (tree.length < 1) {
                        tree.push(new VNode('', new Map(), []));
                  }

                  oldTree = this.#diffTrees(tree,oldTree);
            });

            return {sub,build};
      }

      /**
       * shortcut used to create simple text node.
       * reactive values are not allowed.
       * @param {string} text 
       * @returns 
       */
      createTextNode( text ){
            if ( !VNodeBuilder.#voidMap ) {
                  VNodeBuilder.#voidMap = new Map();
            }

            return /**@type {VNode<T>}*/(new VNode(text,VNodeBuilder.#voidMap,[]))
      }

      /**
       * create a tree of nodes and return all the scope that needs to
       * be managed by the father of the node.
       * @param {Tag<T>} tag 
       * @param {Map<string,unknown>} props 
       * @param {VNode[]} children 
       * @param {Unsubscriber[]} scope 
       * @returns {{subs: Unsubscriber[], tree: VNode<T>[]}}
       */
      create(tag, props, children,scope){
            if( tag instanceof Reactive ){

                  if ( tag.value instanceof Array ) {
                        const {sub,build} = this.#handleReactiveVNodeList(/**@type {Reactive<VNode[]>}*/(tag));

                        scope.push(sub);
                        return {
                              subs: scope,
                              tree: build,
                        }
                  } else {
                        const {sub,build} = this.#handleReactiveTagName(/**@type {Reactive<String>}*/(tag),children,props);

                        scope.push(sub);
                        return {
                              subs: scope,
                              tree: build,
                        }
                  }
            }

            if( tag instanceof Array ) {
                  return {
                        subs: scope,
                        tree: tag,
                  };
            } else {
                  return this.#createElement(tag,props,children,scope);
            } 

      }

      /**
       * register new custom tag
       * @param {(args: {}) => VNode<T>[]} renderer 
       * @param {string} tag 
       */
      register( renderer, tag = renderer.name ){
            this.#register.register( tag,renderer );
      }
}