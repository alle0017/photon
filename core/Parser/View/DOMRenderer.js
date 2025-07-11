/**@import Renderer from "./Renderer" */

import Out from "../../Util/Logger.js";


/**
 * @implements {Renderer<Element>}
 * renderer that is used for dom elements.
 * it prefers cloning instead of creating, to prevent memory leak.
 * the only leak is if a cached element is removed from the dom: in that case, it is
 * hold as model for the other elements, but is not reused. 
 */
export default class DOMRenderer {
      /**
       * @type {Map<string,Element>}
       */
      #cache = new Map();

      /**
       * @param {Element} node 
       */
      #cloneNode(node) {

            const clone = node.cloneNode();

            if (clone instanceof Element) {
                  const attrs = [...clone.attributes];
                  
                  for (let i = 0; i < attrs.length; i++) {
                        clone.removeAttribute(attrs[i].name);
                  }
            }

            return clone;
      }

      /**
       * create a element of name tag. If the tag is of type `HTMLUnknownElement`,
       * than it is converted to text. if the element was already created, than it is cloned 
       * instead, to increase performance.
       * @param {string} tag 
       */
      createElement(tag) {

            if (this.#cache.has(tag)) {
                  Out.log( "element found in cache for tag ", tag );
                  return /**@type {Element}*/(this.#cloneNode( this.#cache.get(tag) ));
            }

            if( !tag || typeof tag !== 'string' || tag.search(/[ |#|\[|\]|.]/) >= 0 ){
                  Out.log( 'detected invalid tag name', tag );
                  const text = /**@type {Element}*/(/**@type {Node}*/(document.createTextNode(tag)));
      
                  this.#cache.set(tag, text);
                  return text;
            }

            try{
                  const element = document.createElement(tag);

                  if (element instanceof HTMLUnknownElement) {

                        const text = /**@type {Element}*/(/**@type {Node}*/(document.createTextNode(tag)));
      
                        this.#cache.set(tag, text);
                        return text;
                  }
      
                  this.#cache.set(tag, element);
                  return element;   
            }catch(e){
                  const text = /**@type {Element}*/(/**@type {Node}*/(document.createTextNode(tag)));
      
                  Out.error(e);
                  Out.internalError('caused by tag ',tag.toString());
                  this.#cache.set(tag, text);
                  return text;
            }
            
      }

      /**
       * creates a void element that can be used as root
       * for other elements. As all other elements, the root
       * is created once, than is cloned each time
       * @returns {Element}
       */
      createRoot(){
            if( this.#cache.has("") )
                  return /**@type {Element}*/(this.#cache.get("").cloneNode());

            const root = /**@type {Element}*/(/**@type {Node}*/(document.createTextNode("")));

            this.#cache.set("",root);

            return root;
      }
}