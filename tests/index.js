import { html } from "../core/Parser/node/index.js"
/**@import {VNode} from "../core/Parser/node/VNode"*/

/**
 * 
 * @param {VNode<HTMLElement>[]} tree 
 */
function render(tree) {
      document.body.append(...(tree).flatMap(v => v.render()))
}
// simple
render(html`
      <h1>hello world</h1>
`)

// interpolation
render(html`
      <h1>hello world ${'hi'}</h1>
`)