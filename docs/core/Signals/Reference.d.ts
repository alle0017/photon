/**
 * @template {ConcreteNode} T
 */
export default class Ref<T extends ConcreteNode> {
    /**
     * @param {T} value
     */
    set element(arg: T);
    get element(): T;
    /**
     *
     * @param {(e: T) => void} hook
     */
    onLoad(hook: (e: T) => void): () => void;
    /**
     *
     * @param {() => void} hook
     */
    onUnload(hook: () => void): () => void;
    #private;
}
//# sourceMappingURL=Reference.d.ts.map