/**
 * @typedef {{
 *    isText: false,
 *    tag: string,
 *    props: Map<string,unknown>
 *    children: Tree[],
 * }} ParentTree
 */
/**
 * @typedef {ParentTree | { 
 *    isText: true, 
 *    text: string 
 * }} Tree
 */
const Ref = {
      ARG: '£:_--pRiVaTe__REACTIVE_PTR__v0\.0\/2024£'
}

const ATTRIB_REGEX = new RegExp(`((${Ref.ARG})|@?[a-zA-Z_:][a-zA-Z0-9_\.:-]*)\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]*))|([a-zA-Z_:][a-zA-Z0-9_.:-]*)`, 'g');

/**
 * checks whether a token is a opening tag
 * @param {string} str 
 */
function isOpeningTag(str) {
      return new RegExp(`<\\s*([a-zA-Z][a-zA-Z0-9-]*)(\\s+(${Ref.ARG}|@?[a-zA-Z_:][a-zA-Z0-9_.:-]*)(\\s*=\\s*(?:"[^"]*"|'[^']*'|[^\\s>]*))?)*\\s*\/?>`).test(str);
}
/**
 * checks whether a token is a closing tag
 * @param {string} str 
 * @returns 
 */
function isClosingTag(str) {
      return /<\/\s*[a-zA-Z][a-zA-Z0-9-]*\s*>/.test(str);
}
/**
 * checks whether the string starts with 
 * the {@link Ref.ARG} keyword
 * @param {string} str 
 * @returns 
 */
function isArgReference(str) {
      return str.startsWith(Ref.ARG);
}
/**
 * create vanilla Tree node with no settled `props` map
 * @param {string} name 
 * @param {Map<string,unknown>} [map=undefined] 
 * @returns {ParentTree}
 */
function createNode(name = "", map = undefined) {
      return {
            isText: false,
            tag: name,
            props: map,
            children: []
      }
}
/**
 * create text node Tree node
 * @param {string} text 
 * @returns {Tree}
 */
function createText(text = "") {
      return {
            isText: true,
            text
      }
}
/**
 * create a node from a valid token (a tag)
 * @param {string} token 
 */
function tokenize(token) {
      const clean = token
            .replace('<', '')
            .replace('>', '')
            .replace('/', '')
            .replaceAll(/ ( )+/ig, ' ')
            .replaceAll(/( |\n)+=( |\n)+/ig, '=')
            .replaceAll('\n', ' ');
      const separator = clean.includes(' ')? clean.indexOf(' '): clean.length;
      const name = clean.slice(0, separator);
      const attrs = clean.slice(separator).match(ATTRIB_REGEX) || [];
      const props = new Map();

      for (let i = 0; i < attrs.length; i++) {
            if (!attrs[i].includes('=')) {
                  props.set(attrs[i], true);
                  continue;
            }

            const [k,v] = attrs[i].split('=');
            props.set(k, v.replaceAll('"', '').replaceAll("'", ''));
      }

      return createNode(name, props);
}

/**
 * parse a string into tokens
 * that follows {@link Tree} structure
 * @param {string} template 
 */
export function parse(template) {
      /**@type {ParentTree[]} */
      const stack = [createNode()];
      let last = 0;
      let i = 0;

      while (i < template.length) {
            if (template[i] == Ref.ARG[0] && isArgReference(template.substring(i))) {
                  stack.at(-1).children.push(createText(Ref.ARG));
                  i += Ref.ARG.length + 1;
                  continue;
            }

            if (template[i] !== '<') {
                  i++;
                  continue;
            }

            const end = template.indexOf('>', i);
            const token = template.slice(i, end+1);

            if (!isOpeningTag(token)) {

                  if (isClosingTag(token)) {
                        stack.at(-1).children.push(createText(template.slice(last,i-1)));
                        stack.pop();
                        last = end + 1;
                        i = end + 1;
                  } else {
                        i++;
                  }


                  continue;
            }

            stack.at(-1).children.push(createText(template.slice(last,i-1)));
            last = end + 1;

            const node = tokenize(token);

            stack.at(-1).children.push(node);

            if (token.at(-2) !== '/') {
                  stack.push(node);
            }
            i = end + 1;
      }

      stack.at(-1).children.push(createText(template.slice(last,template.length)));
      return stack[0].children;
}
/**
 * print a Tree structure. useful for debug
 * @param {Tree[]} a
 */
function print(a) {
      for (const c of a) {
            if (c.isText) { 
                  console.log(`[TEXT]: ${c.text}`);
            } else if (c.isText === false) {
                  console.log(`[TAG]: ${c.tag} [PROPS]: ${[...c.props.entries()].map(([k,v]) => `${k}=${v}`).reduce((p,c) => p + ',' + c, '')}`);
            }


            if (c.isText == false) {
                  print(c.children)
            }
      }
}

