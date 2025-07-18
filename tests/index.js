import { html as v2 } from "../core/Parser/node/index.js"
import {$signal, html as v1} from "../core/index.js"
/**@import {VNode} from "../core/Parser/node/VNode"*/
/**
 * 
 * @param {VNode<HTMLElement>[]} tree 
 */
function render(tree) {
      document.body.append(...(tree).flatMap(v => v.render()))
}
setTimeout(() => {
      
      tests(v2, 'framework v2');
      tests(v1, 'framework v1');
}, 100);

function test_1(html) {
      console.log("TEST 1\n")
      console.time('simple node rendering')
      render(html`
            <div style="display: flex; justify-content: center; flex-direction: column;">
                  <h1>hello world</h1>
                  <p style="color: #aaa">my simple renderer</p>
                  <div>testing new renderer that uses new functional parser</div>
            </div>
      `)
      console.timeEnd('simple node rendering')
}
function test_2(html) {
      console.log("\nTEST 2\n")
      console.time('simple node rendering with interpolation')
      render(html`
            <h1>hello world ${'hi'}</h1>
      `)
      console.timeEnd('simple node rendering with interpolation')
}
function test_3(html) {
      console.log("\nTEST 3\n")
      console.time('rendering of a list of values')
      render(html`
            - List
            <ul>${new Array(10000).fill(1).map((_,i) => html`<li style=${i%2? 'color: red;': 'color: blue;'}>${i}</li>`)}</ul>
      `)
      console.timeEnd('rendering of a list of values')
}
function test_4(html) {
      console.log("\nTEST 4\n")
      console.time('counter implementation')
      const test_counter = $signal(0)
      render(html`
            <button @click=${() => test_counter.value++}>${test_counter}</button>
      `)
      console.timeEnd('counter implementation')
}
function test_5(html) {
      console.log("\nTEST 5\n")
      console.time('rendering of a list of reactive values with change')
      const s = $signal([1,2,3,4,5,6]);
      render(html`
            - List
            <ul>${s.map((i) => html`<li style=${i%2? 'color: red;': 'color: blue;'}>${i}</li>`)}</ul>
            <button @click=${() => {
                  s.value.splice((s.value.length/2), 1);
                  console.log(s.value)
                  s.set(s.value);
            }}>remove</button>
            <button @click=${() => {
                  s.value.push(s.value.length > 0? (s.value.at(-1) + 1): 0);
                  s.set(s.value);
            }}>add</button>
      `)
      console.timeEnd('rendering of a list of reactive values with change')
}
function tests(html, label) {
      console.log(`TESTING IMPLEMENTATION OF HTML FUNCTION ${label}\n\n\n\n\n`)
      test_3(html)
}