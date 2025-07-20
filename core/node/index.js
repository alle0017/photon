
/**
 * index.js - Core HTML template parser and VNode builder for Photon.
 *
 * This module provides the `html` template tag function, which parses template strings
 * into a tree of VNodes using a stack-based approach. It supports argument interpolation,
 * property assignment, and recursive tree construction. The implementation is designed
 * to be efficient and extensible, using a stack to manage tree traversal and node creation.
 *
 * Implementation Notes:
 * - The parser uses a stack (`TreeStack`) to manage traversal and construction of the VNode tree.
 * - Arguments in the template are replaced with a special placeholder (`Ref.ARG`), and then
 *   substituted into the tree during construction.
 * - The `next` function manages stack unwinding and node completion.
 * - Properties set to `Ref.ARG` are replaced with actual argument values via `setProperties`.
 * - The code is designed to be generic and extensible for different node types and templates.
 */

/** @import {VNode} from "./VNode" */
/** @import { Tree, ParentTree } from "./Parser.js" */
/** @import ConcreteNode from "./ConcreteNode" */
import { parse, Ref } from "./Parser.js";
import { Builder } from "./VNode.js";

/**
 * Reduces a `TemplateStringsArray` into a single string, joining segments with the
 * special argument placeholder {@link Ref.ARG}. Throws if the placeholder is used
 * directly in the template, to avoid accidental collisions.
 *
 * @param {TemplateStringsArray} strings - The template string segments.
 * @throws {ReferenceError} if {@link Ref.ARG} is used inside the template.
 * @returns {string} The joined template string with placeholders.
 */
function reduce(strings) {
      return strings.reduce((p, c) => {
            if (c.indexOf(Ref.ARG) >= 0) {
                  throw new ReferenceError(
                        Ref.ARG +
                        " is a private keyword. consider using other words instead or escaping it with codes."
                  );
            }
            return p + Ref.ARG + c;
      });
}
/**
 * Creates a new stack layer for tree traversal.
 * Each layer tracks the current index, the tree segment, and the children collected so far.
 *
 * @param {Tree[]} tree - The tree segment for this layer.
 * @returns {TreeStackLayer} The new stack layer object.
 */
function createStackLayer(tree) {
      return {
            i: 0,
            tree,
            children: []
      };
}

/**
 * @typedef {Object} TreeStackLayer
 * @property {number} i - Current index in the tree segment.
 * @property {Tree[]} tree - The tree segment for this layer.
 * @property {VNode<HTMLElement>[]} children - Collected children for this layer.
 */

/**
 * @typedef {TreeStackLayer[]} TreeStack
 * Stack of tree layers used for iterative tree traversal and construction.
 */

/**
 * Advances the current stack layer. If the current tree segment is fully consumed,
 * pops the layer and attaches its children to the parent node. This is the core
 * mechanism for unwinding the stack and building up the VNode tree.
 *
 * @param {TreeStack} stack - The stack of tree layers.
 */
function next(stack) {
      const curr = stack.at(-1);
      curr.i++;
      if (curr.i < curr.tree.length) {
            return;
      }
      const layer = stack.pop();
      if (stack.length <= 0) {
            return;
      }
      const tree = stack.at(-1).tree;
      const i = stack.at(-1).i;
      const leaf = /**@type {ParentTree}*/(tree[i]);
      stack.at(-1).children.push(...Builder.createElement(leaf.tag, leaf.props, layer.children));
      stack.at(-1).i++;
}
/**
 * Sets the properties of a leaf node, replacing any property value equal to {@link Ref.ARG}
 * with the next argument from the args array. If the argument is falsy (except for boolean false),
 * the property is deleted. Returns the new offset in the args array.
 *
 * @param {ParentTree} leaf - The node whose properties to set.
 * @param {unknown[]} args - The arguments to substitute.
 * @param {number} offset - The current offset in the args array.
 * @returns {number} The new offset inside the args array.
 */
function setProperties(leaf, args, offset) {
      for (const [k, v] of leaf.props) {
            if (v != Ref.ARG) {
                  continue;
            }
            if (args[offset] || typeof args[offset] != 'boolean') {
                  leaf.props.set(k, args[offset]);
            } else {
                  leaf.props.delete(k);
            }
            offset++;
      }
      return offset;
}
/**
 * Main template tag function for parsing HTML-like templates into VNode trees.
 *
 * Implementation Notes:
 * - Uses a stack to iteratively traverse and build the tree, avoiding recursion.
 * - Text nodes and argument placeholders are handled specially.
 * - For each node, if it has children, a new stack layer is pushed; otherwise, the node is created directly.
 * - Arguments are substituted into the tree at placeholder positions and as property values.
 *
 * @param {TemplateStringsArray} strings - The template string segments.
 * @param  {...unknown} args - The arguments to interpolate into the template.
 * @returns {VNode<HTMLElement>[]} The resulting array of VNodes.
 */
export function html(strings, ...args) {
      const template = reduce(strings);
      const tree = parse(template);
      const stack = [createStackLayer(tree)];
      const root = stack[0].children;
      let arg = 0;
      while (stack.length > 0) {
            const tree = stack.at(-1).tree;
            const i = stack.at(-1).i;
            if (tree[i].isText) {
                  if (tree[i].text == Ref.ARG) {
                        // Argument placeholder: insert argument as VNode(s)
                        // @ts-expect-error
                        stack.at(-1).children.push(...Builder.createArgElement(args[arg]));
                        arg++;
                  } else {
                        // Regular text node
                        // @ts-expect-error
                        stack.at(-1).children.push(...Builder.createText(tree[i].text));
                  }
                  next(stack);
                  continue;
            }
            const leaf = /**@type {ParentTree} */(tree[i]);
            arg = setProperties(leaf, args, arg);
            if (leaf.children.length >= 1) {
                  stack.push(createStackLayer(leaf.children));
            } else {
                  // Leaf node with no children
                  // @ts-expect-error
                  stack.at(-1).children.push(...Builder.createElement(leaf.tag, leaf.props, []));
                  next(stack);
            }
      }
      return root;
}