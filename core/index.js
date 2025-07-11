import Parser from "./Parser/Parser.js"
import Signal from "./Signals/Signal.js";
import DOMRenderer from "./Parser/View/DOMRenderer.js";
import Register from "./Parser/Register.js";
import VNode from "./Parser/Nodes/VNode.js";
import LinearDiffer from "./Parser/Diff/LinearDiffer.js";
import Effect from "./Signals/Effect.js";
import Ref from "./Signals/Reference.js";
import css from "./css/CssParser.js";
import VNodeBuilder from "./Parser/Nodes/VNodeBuilder.js";
import Out from "./Util/Logger.js";
import Exception from "./Signals/Exception.js";

export {css,Signal,VNode, Ref};

/**
 * 
 * @param {TemplateStringsArray} strings 
 * @param  {...unknown} args 
 * @returns {VNode<HTMLElement>[]}
 */
export const html = ( strings, ...args ) => {
      const tree = new Parser(GApp.builder).parse( strings, ...args );
      Exception.notify();
      return tree;
}
 
export const $error = Exception;

/**
 * @template T
 * @param {T} value 
 * @returns {Signal<T>}
 */
export const $signal = value => new Signal(value);
/**
 * @template T
 * @param {(() => T )| ((oldValue: T) => T)} callback 
 * @param  {...Signal<unknown>} signals 
 */
export const $effect = (callback,...signals) => new Effect(callback,...signals);
/**
 * connect the callback to the specified signal, producing a non-computed side effect.
 * the returned value is the unsubscribe function, that can be used to detach the listener
 * from the subscription list. 
 * * @example 
 * ```js
 * const signal = $signal(0);
 * const unsubscribe = $watcher(() => console.log(signal.value), signal)
 * 
 * signal.value += 2; // log: 2
 * signal.value += 2; // log: 4
 * unsubscribe();
 * signal.value += 2; // log: nothing
 * ```
 * @param {()=>void} callback 
 * @param {Signal<unknown>} signal 
 */
export const $watcher = ( callback, signal ) => signal.subscribe(callback);

/**
 * @template {HTMLElement} T
 * @returns {Ref<T>}
 */
export const $ref = () => new Ref();

/**
 * create a context that can be retrieved by calling 
 * the function returned by the createContext hook.
 * @example
 * ```javascript
 * const useTheme = createContext({ theme: 'dark' });
 * // ... later in the code
 * 
 * const theme = useTheme();
 * if( theme.theme == 'dark' ){
 *     console.log('is dark!!!');
 * }
 * ```
 * @template {{}} T
 * @param {T} ctx
 */
export const createContext = ctx => {
      return () => {
            return ctx;
      }
}

export const GApp = {
      /**
       * @type {VNodeBuilder<HTMLElement>}
       */
      builder: new VNodeBuilder( new DOMRenderer(), new Register(), LinearDiffer ),

      /**
       * method used to register a custom component
       * @param {(args: {}) => VNode<HTMLElement>[]} renderer 
       * @param {string} tag 
       * @returns {typeof GApp}
       */
      registerComponent(renderer,tag = renderer.name){
            this.builder.register(renderer,tag)
            return this;
      },


      /**
       * method used to register a custom component
       * @param {() => VNode<HTMLElement>[]} component
       * @param {HTMLElement} [root=document.body] 
       * @returns {typeof GApp}
       */
      createRoot(component, root = document.body){
            
            try {
                  const tree = component();
                  tree.forEach(node => root.append(node.render()));
            } catch (e) {
                  $error.throw(e);
            }

            return this;
      },

      /**
       * function that can be used to use a plugin. A plugin is 
       * some code that is initialized in the pluginStarter and modifies
       * the behavior of how the framework itself works
       * @param {(app: typeof GApp) => void} pluginStarter 
       */
      use( pluginStarter ){
            pluginStarter( this );
            return this;
      },

      /**
       * 
       * @param {boolean} flag 
       * @returns {typeof GApp}
       */
      setDebug( flag ){
            Out.debug = flag;
            return this;
      }
}

/**
 * create a component that can be used to scope css using `Shadow DOM API`.
 * You need to pass the mode of the root. if missing, the component will throw error
 * @param {{
 *    children: VNode<HTMLElement>[],
 *    mode: 'open' | 'closed'
 * }} param0 
 */
export function Shadow({ children, mode }) {
      const root = $ref();

      if (!mode) {
            throw new Error("[Shadow] missing attribute on <Shadow>. Attribute 'mode' is mandatory and must be settled to 'open' or 'closed'");
      }
      root.onLoad(el => {
            el.attachShadow({mode});
            //@ts-ignore
            GApp.createRoot(() => children, el.shadowRoot);
      });
      return html`<span ref=${root}></span>`
}