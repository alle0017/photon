/**
 * Compare two trees index by index
 * @template {ConcreteNode} T
 * @param {VNode<T>[]} oldTree
 * @param {VNode<T>[]} newTree
 * @returns {List<{ idx: number, node: VNode<T>}>} map that has as key the index in old tree that contains the difference,
 * and as value the new node that should be inserted in the old tree at the same index
 */
export function getDifference<T extends ConcreteNode>(oldTree: VNode<T>[], newTree: VNode<T>[]): List<{
    idx: number;
    node: VNode<T>;
}>;
export function isNode<T extends ConcreteNode>(value: unknown): value is VNode<T>;
export function isNodeArray(arr: unknown[]): arr is VNode<ConcreteNode>[];
import List from "../Util/List.js";
//# sourceMappingURL=Diff.d.ts.map