/**@import Renderer from "../View/Renderer.js" */
/**@import ConcreteNode from "../Nodes/ConcreteNode.js" */
/**@import Register from "../Register";*/
/**@import {Unsubscriber} from "../../Signals/Notifier" */
/**@import Differ from "../Diff/Differ" */

import Reactive from "../../Signals/Reactive.js";
import MetaTree from "./MetaTree.js";
import Ref from "../../Signals/Reference.js";
import { isCssKey } from "../../css/CssParser.js";
import Exception from "../../Signals/Exception.js";

/**
 * @template {ConcreteNode} T
 * @typedef {string} TagName
 */
/**
 * @template {ConcreteNode} T
 * @typedef {string|Reactive<string>|VNode[]|Reactive<VNode[]>} Tag
 */

 /** 
 * @template {ConcreteNode} T
 * class that represent a virtual node.
 * A virtual node can be a standard tag, (like `div`,`span` etc...) 
 * or a user defined tag. all handling of children happens here, so that 
 * each tag is self-encapsulated. This means that each time a `Reactive` 
 * property changes is the component that uses it that updates itself.
 * 
 * ## notes
 * 
 * before usage the `VNode.configure` method must be called to 
 * initialize the way the VNode will work. Configuration of VNode 
 * permits different diff strategies, different renderer and different
 * register for custom component. In this way it can be easily ported
 * in every environment.
 */
export default class VNode {

      /**
       * @type {Renderer<ConcreteNode>}
       */
      static #renderer;

      static get renderer(){
            return this.#renderer;
      }

      static set renderer( rend ){
            this.#renderer = rend;
      }

      /**
       * @type {TagName<T>} 
       */
      #tag;
      /**
       * @type {Map<string,unknown>}
       */
      #props;
      /**
       * @type {VNode<T>[]}
       */
      #children;

      /**
       * @type {MetaTree<T>}
       */
      #instance

      /**
       * @type {Unsubscriber[]}
       */
      #subs = [];

      /**
       * @type {Set<()=>void>}
       */
      #leave = new Set();

      hasBeenRenderer = false;

      /**
       * @type {Set<string>}
       */
      #cssKeys = new Set();

      get tag(){
            return this.#tag;
      }

      get children(){
            return this.#children;
      }

      /**
       * 
       * @param {TagName<T>} tag 
       * @param {Map<string,unknown>} props 
       * @param {VNode[]} children 
       */
      constructor(tag, props, children) {
            this.#tag = tag;
            this.#props = props;
            this.#children = children.flat();
      }

      /**
       * @param {ConcreteNode} root 
       * @param {string} key 
       * @param {Function} value 
       */
      #addListener(root, key, value) {
            root.addEventListener(
                  key, 
                  /**
                   * @param {Event} ev 
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
       * set the attribute of the node. if the 
       * value is a function, it will be added as an event listener.
       * if the value is a signal, it will be subscribed to the signal.
       * if the value is a string, it will be set as an attribute.
       * @param {ConcreteNode} root 
       * @param {string} key 
       * @param {unknown} value 
       * 
       * @returns {null|Unsubscriber}
       */
      #setAttribute(root, key, value) {
            if ((key.startsWith("on") || key.startsWith("@")) && typeof value === "function") {
                  this.#addListener(root, key.replace(/@|on/,'').toLowerCase(), value);
            } else if ( value instanceof Ref ) {
                  value.element = root;
            }else if ( value instanceof Reactive ) {

                  root.setAttribute(key, value.value);

                  return value.subscribe( v => {
                        this.#setAttribute(root, key, v);
                  });
            } else if( isCssKey( value ) ) {
                  this.#cssKeys.add(value.__css__Key);
            } else {
                  root.setAttribute(key, /**@type {string}*/(value));
            }

            return null;
      }
      

      /**
       * check if two elements are equal
       * @param {unknown} el 
       */
      equals( el ){
            /**
             * @param {unknown} a 
             * @param {unknown} b 
             * @returns 
             */
            const objectEquals = (a,b) => (
                  typeof a === 'object' && 
                  typeof b === 'object' &&
                  JSON.stringify(a) === JSON.stringify(b)
            );

            if( !el )
                  return false;
            if( typeof el !== 'object' )
                  return false;
            if( !(el instanceof VNode) )
                  return false;
            if( el.#tag !== this.#tag )
                  return false;
            if( el.#props.size !== this.#props.size )
                  return false;
            if (el.#children.length !== this.#children.length)
                  return false;

            for( const key of this.#props.keys() ){
                  if( !el.#props.has(key) ) {
                        return false;
                  } 

                  if ( !objectEquals(el.#props.get(key), this.#props.get(key)) && this.#props.get(key) !== el.#props.get(key) ) {
                        return false;
                  }
            }

            for (let i = 0; i < this.#children.length; i++) {
                  if (!this.#children[i].equals(el.#children[i])) {
                        return false;
                  }
            }

            return true;
      }
      
      /**
       * render elements using the render strategy.
       * in here are handled also subscriptions to reactive properties
       * resulting tree is not appended to the root.
       * @returns {T}
       */
      render() {
            let tag = this.#tag;
            this.hasBeenRenderer = true;

            this.#instance = new MetaTree(/**@type {T}*/(VNode.#renderer.createElement(tag)));

            for ( const [key,value] of this.#props ) {
                  const sub = this.#setAttribute(this.#instance.node,key,value);

                  if ( sub ) {
                        this.#subs.push(sub);
                  }
            }

            this.#instance.setCssKeys( ...this.#cssKeys );

            for ( const child of this.#children ) {
                  this.#cssKeys.forEach(key => child.#cssKeys.add(key));
                  child.render();
                  this.#instance.appendChild(child.#instance);
            }


            return this.#instance.node;
      }

      /**
       * 
       * @param {VNode<T>} node 
       */
      appendAfter(node){
            node.render();
            this.#instance.appendAfter(node.#instance);
      }

      /**
       * @param {VNode<T>} node 
       */
      replace( node ){

            for( const sub of this.#subs ){
                  sub();
            }

            node.render();
            this.#instance.replace(node.#instance);
            this.#leave.forEach( leave => leave() );
      }

      remove(){
            //unsubscribe from all reactive values
            for( const sub of this.#subs ){
                  sub();
            }

            this.#instance.remove();
            this.#leave.forEach( leave => leave() );

            for( const c of this.#children ){
                  c.remove();
            }
      }

      /**
       * clones only the current node.
       * @throws {TypeError} if the tagName is not specified and 
       * the one of this is an object
       * @param {Map<string,unknown>} props 
       * @param {VNode[]} children 
       */
      shallowClone( props, children, tag = this.#tag ){

            if( tag == this.#tag && typeof tag !== 'string' ){
                  throw new TypeError('cannot create a shallow clone using same reactive tag name');
            }

            return new VNode( this.#tag, props, children );
      }

      /**
       * clone this node, by using same tag name and properties.
       * properties are the same as this, but stored in a new `Map`.
       * children are cloned to. 
       * > if you want to clone only the current node, consider using the `shallowClone` method.
       * @returns {VNode<T>} clone of the current node
       */
      clone(){
            const props = new Map();
            const children = [];

            for( const [key,value] of this.#props ){
                  props.set(key,value);
            }

            for (const child of this.#children) {
                  children.push(child.clone());
            }

            return new VNode( this.#tag, props, children );
      }

      /**
       * clones deep the current node. 
       * Deep clone means that the properties 
       * are completely replaced with the new one.
       * @param {Map<string,unknown>} props 
       */
      cloneDeep( props ){
            const children = [];

            for (const child of this.#children) {
                  children.push(child.cloneDeep( child.#props ));
            }

            return new VNode( this.#tag, props, children );
      }

      /**
       * @param {() => void} callback 
       */
      onLeave( callback ){
            this.#leave.add(callback);
      }
}