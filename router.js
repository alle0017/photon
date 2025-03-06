import { Component } from "./core";

class Router {
      /**
       * @type {Router}
       */
      static defaultRouter;
      /**
       * @param {HTMLElement} root 
       * @param {Record<string,(params: {}) => Component>} map
       */
      static default( root, map ){

            if( !this.defaultRouter ){
                  this.defaultRouter = new Router( root ).map( map );
            }

            return this.defaultRouter;
      }
      /**
       * @type {Map<string,(params: {}) => Component>}
       */
      #routes =  new Map();
      /**
       * @type {HTMLElement}
       */
      #root;
      /**
       * @type {Component}
       */
      #component;

      /**
       * @param {HTMLElement} root 
       */
      constructor( root ){
            this.#root = root;
      }

      /**
       * @param {Record<string,(params: {}) => Component>} routes 
       */
      map( routes ){
            Object.entries( routes ).forEach( ([k,f]) => {
                  this.#routes.set(k,f);
            });
            return this;
      }

      /**
       * @param {string} route 
       * @param {{}} props 
       */
      goto( route, props ){
            if( !this.#routes.has(route) )
                  throw new Error('route not available');

            if( this.#component )
                  this.#component.dispose();

            this.#component = this.#routes.get(route)(props);

            //@ts-ignore
            this.#root.append( ...this.#component.render({ tree: [], args: [], refToArgs: [], idx: 0 }) );

            return this;
      }
}
/**
 * @param {HTMLElement} root 
 * @param {Record<string,(params: {}) => Component>} map
 */
export const createRouter = ( root, map ) => Router.default( root, map );
export const useRouter = () => Router.defaultRouter;