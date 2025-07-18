/**
 * create a component that can be used to scope css using `Shadow DOM API`.
 * You need to pass the mode of the root. if missing, the component will throw error
 * @param {{
 *    children: VNode<HTMLElement>[],
 *    mode: 'open' | 'closed'
 * }} param0
 */
export function Shadow({ children, mode }: {
    children: VNode<HTMLElement>[];
    mode: 'open' | 'closed';
}): VNode<HTMLElement>[];
export const $error: typeof Exception;
export function $signal<T>(value: T): Signal<T>;
export function $effect<T>(callback: (() => T) | ((oldValue: T) => T), ...signals: Signal<unknown>[]): Effect<T>;
export function $watcher(callback: () => void, signal: Signal<unknown>): Unsubscriber;
export function $ref<T extends HTMLElement>(): Ref<T>;
export function createContext<T extends {}>(ctx: T): () => T;
export namespace GApp {
    /**
     * method used to register a custom component
     * @param {(args: {}) => VNode<HTMLElement>[]} renderer
     * @param {string} tag
     * @returns {typeof GApp}
     */
    function registerComponent(renderer: (args: {}) => VNode<HTMLElement>[], tag?: string): {
        registerComponent(renderer: (args: {}) => VNode<HTMLElement>[], tag?: string): any;
        /**
         * method used to register a custom component
         * @param {() => VNode<HTMLElement>[]} component
         * @param {HTMLElement} [root=document.body]
         * @returns {typeof GApp}
         */
        createRoot(component: () => VNode<HTMLElement>[], root?: HTMLElement): any;
        /**
         * function that can be used to use a plugin. A plugin is
         * some code that is initialized in the pluginStarter and modifies
         * the behavior of how the framework itself works
         * @param {(app: typeof GApp) => void} pluginStarter
         */
        use(pluginStarter: (app: any) => void): any;
        /**
         *
         * @param {boolean} flag
         * @returns {typeof GApp}
         */
        setDebug(flag: boolean): any;
    };
    /**
     * method used to register a custom component
     * @param {() => VNode<HTMLElement>[]} component
     * @param {HTMLElement} [root=document.body]
     * @returns {typeof GApp}
     */
    function createRoot(component: () => VNode<HTMLElement>[], root?: HTMLElement): {
        /**
         * method used to register a custom component
         * @param {(args: {}) => VNode<HTMLElement>[]} renderer
         * @param {string} tag
         * @returns {typeof GApp}
         */
        registerComponent(renderer: (args: {}) => VNode<HTMLElement>[], tag?: string): any;
        createRoot(component: () => VNode<HTMLElement>[], root?: HTMLElement): any;
        /**
         * function that can be used to use a plugin. A plugin is
         * some code that is initialized in the pluginStarter and modifies
         * the behavior of how the framework itself works
         * @param {(app: typeof GApp) => void} pluginStarter
         */
        use(pluginStarter: (app: any) => void): any;
        /**
         *
         * @param {boolean} flag
         * @returns {typeof GApp}
         */
        setDebug(flag: boolean): any;
    };
    /**
     * function that can be used to use a plugin. A plugin is
     * some code that is initialized in the pluginStarter and modifies
     * the behavior of how the framework itself works
     * @param {(app: typeof GApp) => void} pluginStarter
     */
    function use(pluginStarter: (app: {
        /**
         * method used to register a custom component
         * @param {(args: {}) => VNode<HTMLElement>[]} renderer
         * @param {string} tag
         * @returns {typeof GApp}
         */
        registerComponent(renderer: (args: {}) => VNode<HTMLElement>[], tag?: string): any;
        /**
         * method used to register a custom component
         * @param {() => VNode<HTMLElement>[]} component
         * @param {HTMLElement} [root=document.body]
         * @returns {typeof GApp}
         */
        createRoot(component: () => VNode<HTMLElement>[], root?: HTMLElement): any;
        use(pluginStarter: (app: any) => void): any;
        /**
         *
         * @param {boolean} flag
         * @returns {typeof GApp}
         */
        setDebug(flag: boolean): any;
    }) => void): {
        /**
         * method used to register a custom component
         * @param {(args: {}) => VNode<HTMLElement>[]} renderer
         * @param {string} tag
         * @returns {typeof GApp}
         */
        registerComponent(renderer: (args: {}) => VNode<HTMLElement>[], tag?: string): any;
        /**
         * method used to register a custom component
         * @param {() => VNode<HTMLElement>[]} component
         * @param {HTMLElement} [root=document.body]
         * @returns {typeof GApp}
         */
        createRoot(component: () => VNode<HTMLElement>[], root?: HTMLElement): any;
        use(pluginStarter: (app: any) => void): any;
        /**
         *
         * @param {boolean} flag
         * @returns {typeof GApp}
         */
        setDebug(flag: boolean): any;
    };
    /**
     *
     * @param {boolean} flag
     * @returns {typeof GApp}
     */
    function setDebug(flag: boolean): {
        /**
         * method used to register a custom component
         * @param {(args: {}) => VNode<HTMLElement>[]} renderer
         * @param {string} tag
         * @returns {typeof GApp}
         */
        registerComponent(renderer: (args: {}) => VNode<HTMLElement>[], tag?: string): any;
        /**
         * method used to register a custom component
         * @param {() => VNode<HTMLElement>[]} component
         * @param {HTMLElement} [root=document.body]
         * @returns {typeof GApp}
         */
        createRoot(component: () => VNode<HTMLElement>[], root?: HTMLElement): any;
        /**
         * function that can be used to use a plugin. A plugin is
         * some code that is initialized in the pluginStarter and modifies
         * the behavior of how the framework itself works
         * @param {(app: typeof GApp) => void} pluginStarter
         */
        use(pluginStarter: (app: any) => void): any;
        setDebug(flag: boolean): any;
    };
}
import css from "./css/CssParser.js";
import Signal from "./signals/Signal.js";
import Ref from "./signals/Reference.js";
import { html } from "./node/index.js";
import Exception from "./signals/Exception.js";
import Effect from "./signals/Effect.js";
export { css, Signal, Ref, html };
//# sourceMappingURL=index.d.ts.map