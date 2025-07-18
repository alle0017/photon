/**
 *
 * @param {TemplateStringsArray} strings
 * @param  {...unknown} args
 * @returns {VNode<HTMLElement>[]}
 */
export function html(strings: TemplateStringsArray, ...args: unknown[]): VNode<HTMLElement>[];
export type TreeStackLayer = {
    i: number;
    tree: Tree[];
    children: VNode<HTMLElement>[];
};
export type TreeStack = TreeStackLayer[];
//# sourceMappingURL=index.d.ts.map