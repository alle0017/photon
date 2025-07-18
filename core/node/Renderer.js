/**@import ConcreteNode from "./ConcreteNode" */

const createText = (() => {
      /**@type {Map<string,Text>} */
      const cache = new Map();
      /**
       * @param {string} text 
       * @returns {ConcreteNode}
       */
      return text => {
            if (cache.has(text)) {
                  // @ts-expect-error
                  return cache.get(text).cloneNode();
            }

            const node = document.createTextNode(text);
            cache.set(text,node);
            // @ts-expect-error
            return node;
      }           
})()
/**
 * clear all settled attributes
 * @param {Element} elem 
 * @returns {Element}
 */
const clean = elem => {
      const attrs = [...elem.attributes];
      
      for (let i = 0; i < attrs.length; i++) {
            elem.removeAttribute(attrs[i].name);
      }

      return elem;
}


const createElement = (() => {
      /**@type {Map<string,Element>} */
      const cache = new Map();
      /**
       * @param {string} elem
       * @returns {ConcreteNode}
       */
      return elem => {
            if (cache.has(elem)) {
                  // @ts-expect-error
                  return clean(cache.get(elem).cloneNode());
            }

            const node = document.createElement(elem);
            cache.set(elem,node);
            return node;
      }           
})()

export const Renderer = {
      createElement,
      createText
}