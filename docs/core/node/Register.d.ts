/**@import ConcreteNode from "./ConcreteNode" */
/**@import {VNode} from "./VNode" */
export default class Register {
    /**
     * @type {Map<string,(props: {}) => VNode<ConcreteNode>[]>}
     */
    static "__#9@#map": Map<string, (props: {}) => VNode<ConcreteNode>[]>;
    /**
     * register new component.
     * @param {(props: {}) => VNode<ConcreteNode>[]} creator
     * @param {string} key
     */
    static register(creator: (props: {}) => VNode<ConcreteNode>[], key?: string): void;
    /**
     * check if exists any component with
     * the specified name
     * @param {string} key
     */
    static exists(key: string): boolean;
    /**
     * return the component with the specified name
     * @param {string} key
     * @param {Map<string,unknown>} props
     */
    static get(key: string, props: Map<string, unknown>): VNode<ConcreteNode>[];
}
//# sourceMappingURL=Register.d.ts.map