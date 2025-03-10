/**@import Component from "./core/template/component.js";*/

/**
 * @typedef {Object} Route
 * @property {boolean} keepMounted
 * @property {string[]} accessibleRoutes
 * @property {(params: Record<string,string>) => Component} page
 */

/**
 * @typedef {Object} RouterDescriptor
 * @property {HTMLElement} root
 * @property {boolean} debug
 * @property {string} default
 * @property {Record<string,Route>} routes
 */

/**
 * @typedef {Object} Route
 * @property {string} route
 * @property {Record<string,string>} params
 */

class Router {
      #root;
      /**
       * @type {Map<string,Route>}
       */
      #routes;
      /**
       * @type {Map<string,Component>}
       */
      #mountedRoutes;

      #currentRoute = '/';

      /**
       * @type {Set<( next: Route, previous: Route ) => void>}
       *
       */
      #onRouteEnter = new Set();

      /**
       * @param {string} current 
       * @param {Map<string,Route>} states 
       * @param {Set<string>} visited - reached states
       */
      static #analyze( current, states, visited, parent = '/' ){
            const state = states.get( current );

            if( !state ){
                  throw new Error(`[Router]: no match for route "${current}", reachable from parent route "${parent}"`)
            }

            const neighbors = state.accessibleRoutes;

            if( !neighbors.length )
                  return visited;

            for( let i = 0; i < neighbors.length; i++ ){

                  if( visited.has( neighbors[i] ) )
                        continue;

                  visited.add( neighbors[i] );
                  Router.#analyze( neighbors[i], states, visited, current );
            }
      }

      /**
       * @param {RouterDescriptor} descriptor
       */
      constructor( descriptor ){

            this.#root = descriptor.root;
            this.#routes = new Map();
            this.#mountedRoutes = new Map();

            if( !descriptor.routes[descriptor.default] ){
                  throw new Error('[Router]: default route must be added');
            }

            Object
                  .entries( descriptor.routes )
                  .forEach( ([k,v]) => {

                        if( k[0] != '/' )
                              throw new Error(`[Router]: routes names must start with '/'. "${k}"`);

                        this.#routes.set(k,v);
                  })

            if( descriptor.debug ){
                  const visited = new Set();
                  const unreachable = [];

                  Router.#analyze( descriptor.default, this.#routes, visited );

                  this.#routes.forEach( (v,k) => {
                        if( !visited.has(k) )
                              unreachable.push(k);
                  });

                  if( unreachable.length > 0 ){
                        throw new Error(`[Router]: some state are detected as unreachable, please, remove theme or correct their nextState list ${unreachable}` );
                  }
            }

            window.addEventListener('popstate', e => {
                  const { params, route } = this.#getRouteInfo();
                  this.#renderPage( route, params );
            }, true );

            this.push( descriptor.default, {} );
      }

      /**
       * 
       * @returns {Route}
       */
      #getRouteInfo(){
            const [route, paramsStr] = location.hash.replaceAll('#', '').split( '?', 2 );
            const params = {};

            if( paramsStr ){

                  for( let i = 0; i < paramsStr.length; i++ ){
                        const equalIdx = paramsStr.indexOf('=', i);
                        const k = paramsStr.slice( i, equalIdx );
                        let v = '';

                        if( equalIdx < i ){
                              throw new Error(`[Router] error while parsing parameters ${paramsStr}`)
                        }

                        // skip the equal and the last element 
                        for( i = equalIdx + 1; i < paramsStr.length; i++ ){

                              if( paramsStr[i] == ','){
                                    break;
                              }

                              v += paramsStr[i];
                        } 

                        params[k] = v;
                  } 
            }

            return {
                  params,
                  route,
            }
      }

      /**
       * @param {string} route 
       * @param {Record<string,string>} props
       */
      #renderPage( route, props ){
            if( route == this.#currentRoute )
                  return this;

            const current = this.#routes.get(this.#currentRoute);

            const next = this.#routes.get( route );
            let component;

            if( !next ){
                  throw new Error(`[Router]: route "${route}" doesn't exists`)
            }

            if( next.keepMounted && this.#mountedRoutes.has( route ) ){
                  component = this.#mountedRoutes.get( route );
            }else{
                  component = next.page( props );
                  this.#mountedRoutes.set( route, component );
            }

            const oldComponent = this.#mountedRoutes.get( this.#currentRoute );

            if( current && !current.keepMounted ){
                  this.#mountedRoutes.delete( this.#currentRoute );
            }

            if( oldComponent )
                  oldComponent.dispose();

            this.#root.append( ...component.render({ args: [], tree: [], refToArgs: [], idx: 0, }) )

            this.#currentRoute = route;

            return this;
      }

      /**
       * @param {string} route 
       * @param {Record<string,string>} param 
       */
      push( route, param ){
            let paramStr = '';
            if( param && Object.entries( param ).length > 0 ){
                  paramStr = '?' + Object.entries( param ).map( ([k,v]) => `${k}=${v}` ).reduce( (p,c) => `${p},${c}`, '')
            }

            const prev = this.#getRouteInfo();
            const next = {
                  route,
                  params: param,
            };

            this.#onRouteEnter.forEach( f => f( next, prev ) );

            location.hash = route + paramStr;

            return this;
      }

      /**
       * @param {( next: Route, previous: Route ) => void} listener 
       */
      onRouteEnter( listener ){
            this.#onRouteEnter.add( listener );
            return this;
      }

      /**
       * @param {( next: Route, previous: Route ) => void} listener 
       */
      removeOnRouteEnter( listener ){
            this.#onRouteEnter.delete( listener );
            return this;
      }
}

/**
 * @param {RouterDescriptor} descriptor
 */
export default function createRouter( descriptor ){
      const router = new Router(descriptor);

      return () => router;
};