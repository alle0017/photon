/**
 * parse a string into tokens
 * that follows {@link Tree} structure
 * @param {string} template
 */
export function parse(template: string): Tree[];
export namespace Ref {
    const ARG: string;
}
export type ParentTree = {
    isText: false;
    tag: string;
    props: Map<string, unknown>;
    children: Tree[];
};
export type Tree = ParentTree | {
    isText: true;
    text: string;
};
//# sourceMappingURL=Parser.d.ts.map