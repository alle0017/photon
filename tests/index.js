//import { html } from "../core/Parser/node/index.js"
import {$signal,html} from "../core/index.js"
/**@import {VNode} from "../core/Parser/node/VNode"*/

/**
 * 
 * @param {VNode<HTMLElement>[]} tree 
 */
function render(tree) {
      document.body.append(...(tree).flatMap(v => v.render()))
}
console.time('simple node rendering')
render(html`
      <div style="display: flex; justify-content: center; flex-direction: column;">
            <h1>hello world</h1>
            <p style="color: #aaa">my simple renderer</p>
            <div>testing new renderer that uses new functional parser</div>
      </div>
`)
console.timeEnd('simple node rendering')

console.time('simple node rendering with interpolation')
render(html`
      <h1>hello world ${'hi'}</h1>
`)
console.timeEnd('simple node rendering with interpolation')


console.time('rendering of a list of values')
render(html`
      - List
      <ul>${new Array(1000).fill(1).map((_,i) => html`<li style=${i%2? 'color: red;': 'color: blue;'}>${i}</li>`)}</ul>
`)
console.timeEnd('rendering of a list of values')

console.time('counter implementation')
const test_counter = $signal(0)
render(html`
      <button @click=${() => test_counter.value++}>${test_counter}</button>
`)
console.timeEnd('counter implementation')
