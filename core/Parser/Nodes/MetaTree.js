/**@import {Unsubscriber} from "../../Signals/Notifier" */
/**@import ConcreteNode from "../Nodes/ConcreteNode" */
/**
 * wrapper that holds tree and meta 
 * information related to the node.
 * handles the lifecycle of the instance of the VNode
 * after it is created
 * @template {ConcreteNode} T
 */
export default class MetaTree {

      /**
       * @type {T}
       */
      #root;

      /**
       * @type {T}
       */
      #node;

      /**
       * @ignore
       * debug property used to identify methods
       */
      #appendedWith = '';

      get node(){
            return this.#node;
      }

      get root(){
            return this.#root;
      }

      /**
       * 
       * @param {T} node
       */
      constructor( node ){
            this.#node = node;
      }

      /**
       * 
       * @param {T} root 
       */
      append( root ){
            root.appendChild(this.#node);
            this.#root = root;
            this.#appendedWith = 'append';
      }

      /**
       * 
       * @param {MetaTree<T>} node
       */
      appendChild( node ){
            node.#root = this.#node;
            this.#node.appendChild(node.#node);
            node.#appendedWith = 'appendChild';

      }

      /**
       * 
       * @param {MetaTree<T>} node 
       */
      appendAfter( node ){
            node.#root = this.#root;
            this.#node.after(node.#node);
            node.#appendedWith = 'appendAfter';
      }

      /**
       * @param {MetaTree<T>} node
       */
      replace( node ){
            node.#root = this.#root;
            this.#node.parentNode.replaceChild(node.#node,this.#node);
            node.#appendedWith = 'replace';
      }

      remove(){
            this.#node.parentNode.removeChild(this.#node);
      }

      /**
       * 
       * @param {T} root 
       */
      transferTo( root ){
            this.remove();
            this.append(root);
            this.#appendedWith = 'transfer';
      }

      /**
       * 
       * @param  {...string} args 
       */
      setCssKeys( ...args ){
            if (this.#node.classList && args.length > 0) {
                  args.forEach( key => this.#node.classList.add(key) );
            }
      }
}