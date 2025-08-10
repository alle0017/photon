export type Reactive<T> = { 
    value: T,
    /**
     * Subscribes a callback to be executed whenever the signal's value changes.
     * @param {() => void} callback - The callback to execute on value change.
     * @returns {() => void} - A function to unsubscribe the callback.
     */
    subscribe(callback: () => void): () => void;
};

export declare const $error: {
    /**
     * register an event handler that is
     * called each time an exception is thrown.
     * @param sub 
     */
    catch(sub: (e: Error) => void): void
}
/**
 * Represents a reactive signal that tracks a value and notifies subscribers when it changes.
 * Signals are the core of the framework's reactivity system.
 * @template T - The type of the value being tracked.
 */
export type Signal<T> = {
    /**
     * discouraged way of setting
     * signal value. bypass type checking,
     * useful for objects that keep their reference
     * @param value 
     */
    set(value: T): void,
    map<V>(callback: T extends (infer K)[] ? (v: K, index: number) => V : (v: T) => V): Effect<any>
} & Reactive<T>;

/**
 * Represents a reactive signal that tracks a value and notifies subscribers when it changes.
 * Signals are the core of the framework's reactivity system.
 * @template T - The type of the value being tracked.
 */
export type Effect<T> = Reactive<T>;

/**
 * Represents a virtual DOM node, which can be rendered into an actual DOM element.
 * @template T - The type of the HTML element.
 */
export type VNode<T extends HTMLElement> = {
    /**
     * Renders the virtual DOM node into an actual DOM element.
     * @returns {T} - The rendered DOM element.
     */
    render(): T;
};
/**
 * Creates a virtual DOM tree from a template literal.
 * This function is used to define the structure of the UI declaratively.
 * @param {TemplateStringsArray} strings - The template strings.
 * @param {...unknown} args - The template arguments.
 * @returns {VNode<HTMLElement>[]} - An array of virtual DOM nodes.
 */
export declare function html(strings: TemplateStringsArray, ...args: unknown[]): VNode<HTMLElement>[];

/**
 * Creates a reactive signal, which tracks a value and notifies subscribers when it changes.
 * Each time variable `value` property changes, 
 * it triggers the reload of each component that uses it.
 * `Signal` is the most important class of the frameworks.
 * it enables fine-grained reactivity and dependency tracking.
 * > important note: at current state, `Signal` are shallow, 
 * > so if you change an internal property or you call a modifier
 * > method the ui will not be updated.
 *  @example 
 * ```js
 * const signal = $signal(0);
 * 
 * html`
 *    ${signal}
 *    <button ＠click=${() => signal.value++} > ADD </button>
 * `
 * 
 * ```
 * @template T - The type of the value being tracked.
 * @param {T} value - The initial value of the signal.
 * @returns {Signal<T>} - The reactive signal.
 */
export declare function $signal<T>(value: T): Signal<T>;

/**
 * Creates a reactive effect that recalculates whenever its dependencies change.
 * Effects are used for computed properties and side effects.
 *  Effect are useful also for reactive conditional rendering.
 * @example 
 * ```js
 * const signal = $signal(0);
 * const effect = $effect(() => signal.value + 10, signal)
 * 
 * 
 * html`
 *    <div>${signal} + 10 = ${effect}</div>
 * `
 * 
 * ```
 * @template T - The type of the computed value.
 * @param {() => T} callback - The effect callback.
 * @param {...Signal<unknown>} signals - The dependencies of the effect.
 */
export declare function $effect<T>(callback: () => T, ...signals: Reactive<unknown>[]): void;

/**
 * Subscribes to a signal and executes a callback whenever the signal's value changes.
 * This is used for non-computed side effects.
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
 * @param {() => void} callback - The callback to execute on value change.
 * @param {Signal<unknown>} signal - The signal to subscribe to.
 * @returns {() => void} - A function to unsubscribe the callback.
 */
export declare function $watcher(callback: () => void, signal: Reactive<unknown>): () => void;
/**
 * Creates a context that can be retrieved later, enabling dependency injection.
 * Context can be retrieved using the returned function.
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
 * @template T - The type of the context value.
 * @param {T} ctx - The context value.
 * @returns {() => T} - A function to retrieve the context value.
 */
export declare function createContext<T>(ctx: T): () => T;

/**
 * Represents the main application object, providing methods for component registration, root creation, and plugin usage.
 */
export declare const GApp: {
    /**
     * The builder responsible for managing virtual DOM nodes and rendering.
     */
    builder: unknown;

    /**
     * Registers a custom component, making it available for use in templates.
     * @param {(args: {}) => VNode<HTMLElement>[]} renderer - The component renderer function.
     * @param {string} [tag] - The tag name for the component.
     * @returns {typeof GApp} - The application object for chaining.
     */
    registerComponent(renderer: (args: {}) => VNode<HTMLElement>[], tag?: string): typeof GApp;

    /**
     * Creates a root component and attaches it to a DOM element.
     * @param {() => VNode<HTMLElement>[]} component - The root component function.
     * @param {HTMLElement} [root] - The DOM element to attach the root component to.
     * @returns {typeof GApp} - The application object for chaining.
     */
    createRoot(component: () => VNode<HTMLElement>[], root?: HTMLElement): typeof GApp;

    /**
     * Uses a plugin to modify the application's behavior or add functionality.
     * @param {(app: typeof GApp) => void} pluginStarter - The plugin starter function.
     * @returns {typeof GApp} - The application object for chaining.
     */
    use(pluginStarter: (app: typeof GApp) => void): typeof GApp;

    /**
     * Enables or disables debug mode for the application.
     * @param {boolean} flag - Whether to enable debug mode.
     * @returns {typeof GApp} - The application object for chaining.
     */
    setDebug(flag: boolean): typeof GApp;
};

/**
 * Creates a shadow DOM component, encapsulating its children in a shadow root.
 * @param {{ children: VNode<HTMLElement>[]; mode: 'open' | 'closed'; }} param0 - The shadow component options.
 * @returns {VNode<HTMLElement>} - The shadow DOM component.
 */
export declare function Shadow({ children, mode }: { children: VNode<HTMLElement>[]; mode: 'open' | 'closed'; }): VNode<HTMLElement>;
/**
 * Represents a reference to an HTML element, allowing lifecycle hooks and direct DOM manipulation.
 * @template T - The type of the HTML element.
 */
export type Ref<T> = {
    /**
     * The referenced HTML element.
     */
    readonly element: T;
    /**
     * set the value of the reference
     * to the specified value. 
     * this function can be used to 
     * enable dependency injection
     * of native html elements
     * @param value 
        @example
        ```js
        const ref = $ref()
        ...
        html`<input ref=${ref.bind}/>`
        ```
     */
    bind(value: T): void;
    /**
     * Registers a callback to be executed when the element is loaded.
     * @param {(element: T) => void} watcher - The callback to execute on load.
     */
    onLoad(watcher: (el: T) => void): () => void,
}
/**
 * Creates a reference to an HTML element, allowing lifecycle hooks and direct DOM manipulation.
 * @template T - The type of the HTML element.
 * @returns {Ref<T>} - The reference object.
 */
export declare const $ref: <T>() => Ref<T>;
/**
 * returns a promise that will be resolved when all signals 
 * have been updated
 */
export declare const $tick: () => Promise<void>;
/**
 * utility type that represent any
 * element that can be mapped in a
 * black-box oriented manner.
 */
export type Mappable<T> = { 
    map(lambda: (item: T) => void): void 
}