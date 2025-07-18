/**@import {VNode} from "./VNode" */
/**@import { Tree, ParentTree } from "./Parser.js" */
/**@import ConcreteNode from "./ConcreteNode" */
import { parse, Ref } from "./Parser.js";
import { Builder } from "./VNode.js";

/**
 * reduces a `TemplateStringsArray` into a string joined 
 * using {@link Ref.ARG} as placeholder
 * @param {TemplateStringsArray} strings 
 * @throws {ReferenceError} if {@link Ref.ARG} is used inside the template
 */
function reduce(strings) {
      return strings.reduce((p,c) => { 
            if(c.indexOf(Ref.ARG) >= 0) {
                  throw new ReferenceError( 
                        Ref.ARG +
                        " is a private keyword. consider using other words instead or escaping it with codes." 
                  );
            }
            return p + Ref.ARG + c;
      });
}
/**
 * create a stack that can be 
 * pushed inside {@link StackTree}
 * @param {Tree[]} tree 
 * @returns {TreeStackLayer}
 */
function createStackLayer(tree) {
      return { 
            i: 0, 
            tree, 
            children: [] 
      };
}
/**
 * @typedef {{ 
 *    i: number, 
 *    tree: Tree[], 
 *    children: VNode<HTMLElement>[],
 * }} TreeStackLayer
 */
/**
 * @typedef {TreeStackLayer[]} TreeStack 
 */

/**
 * make the current tree goes on. if the 
 * current tree is entirely consumed, 
 * it is popped out of the stack
 * @param {TreeStack} stack 
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
 * set the properties of the leaf node 
 * where the original prop is settled as 
 * {@link Ref.ARG}
 * @param {ParentTree} leaf 
 * @param {unknown[]} args 
 * @param {number} offset 
 * @returns {number} the new offset inside the args array
 */
function setProperties(leaf, args, offset) {

      for (const [k,v] of leaf.props) {
            if (v != Ref.ARG) {
                  continue;
            }

            if (args[offset] || typeof args[offset] != 'boolean') {
                  leaf.props.set(k, args[offset]);
            }

            offset++;
      }
      return offset;
}
/**
 * 
 * @param {TemplateStringsArray} strings 
 * @param  {...unknown} args 
 * @returns {VNode<HTMLElement>[]}
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
                        //@ts-expect-error
                        stack.at(-1).children.push(...Builder.createArgElement(args[arg]));
                        arg++;
                  } else {
                        //@ts-expect-error
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
                  //@ts-expect-error
                  stack.at(-1).children.push(...Builder.createElement(leaf.tag, leaf.props, []));
                  next(stack);
            }
      }

      return root;
}