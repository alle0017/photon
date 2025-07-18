export namespace Builder {
    /**
     * Creates a VNode array for a given tag, props, and children.
     * If the tag is registered, delegates to Register; otherwise, creates a standard element.
     *
     * @template {ConcreteNode} T
     * @param {string} tag - The tag name.
     * @param {Map<string,unknown>} props - Properties/attributes.
     * @param {VNode<T>[]} children - Child VNodes.
     * @returns {VNode<T>[]} Array of VNodes.
     */
    function createElement<T extends ConcreteNode>(tag: string, props: Map<string, unknown>, children: VNode<T>[]): VNode<T>[];
    /**
     * Creates a VNode array containing a single text node.
     *
     * @template {ConcreteNode} T
     * @param {string} text - The text content.
     * @returns {VNode<T>[]} Array with one text VNode.
     */
    function createText<T extends ConcreteNode>(text: string): VNode<T>[];
    /**
     * Creates a VNode array from an argument, handling reactivity and arrays.
     *
     * @template {ConcreteNode} T
     * @param {unknown} arg - The argument to convert.
     * @returns {VNode<T>[]} Array of VNodes.
     */
    function createArgElement<T extends ConcreteNode>(arg: unknown): VNode<T>[];
}
/**
 * Tag type accepted by VNode creation functions. Can be a string (HTML tag),
 * an array of VNodes, or a Reactive value wrapping a string or VNode array.
 */
export type Tag<T extends ConcreteNode> = string | VNode<T>[] | Reactive<string> | Reactive<VNode<T>[]>;
export type VNode<T extends ConcreteNode> = {
    /**
     * - The tag or value representing this node (string, Reactive, etc).
     */
    tag: unknown;
    /**
     * - Map of properties/attributes for this node.
     */
    props: Map<string, unknown>;
    /**
     * - List of cleanup functions for reactivity/event listeners.
     */
    subscriptions: List<Unsubscriber>;
    /**
     * - Array of child VNodes.
     */
    children: VNode<T>[];
    /**
     * - Renders the VNode and returns an array of concrete nodes.
     */
    render: () => T[];
};
import Reactive from "../signals/Reactive.js";
import List from "../Util/List.js";
//# sourceMappingURL=VNode.d.ts.map