/**
 * @template T
 * @typedef {{
 *    next: ListNode<T>
 *    value: T,
 * }} ListNode
 */
/**
 * @template T
 */
export default class List<T> {
    /**
     * @param {ListNode<T>} node
     */
    append(node: ListNode<T>): void;
    /**
     * @param {ListNode<T>} node
     */
    remove(node: ListNode<T>): void;
    /**
     * @param {(value: T) => void} callback
     */
    forEach(callback: (value: T) => void): void;
    /**
     * @param {T} value
     */
    push(value: T): ListNode<T>;
    [Symbol.iterator](): Generator<T, void, unknown>;
    #private;
}
export type ListNode<T> = {
    next: ListNode<T>;
    value: T;
};
//# sourceMappingURL=List.d.ts.map