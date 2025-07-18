import { $ref, $signal, GApp, html,} from "./core/index.js";
/**@typedef {{ name: string, children: Tree[]}} Tree*/
/**
 * 
 * @param {{
 *    content: Tree
 * }} param0 
 */
export function Tree({ content }) {
      const CLOSE = `▶ ${content.name} ...`;
      const OPEN = `▼ ${content.name}`;
      const label = $signal(OPEN);
      const ul = $ref();
      return html`
            <Shadow>
                  <style>
                        ul {
                              list-style-type: none;
                              text-indent: 5px;
                              padding-inline-start: 20px;
                              border-left: 0.01px solid var(--c3);
                        }
                        li {
                              width: 200px;
                              height: 18px;
                              padding: 5px;
                              border-radius: 7px;
                        }
                        li:hover {
                              background-color: var(--n1);
                              cursor: pointer;
                        }
                  </style>
                  <li 
                        style="font-weight: bolder;" 
                        class="parent" 
                        title=${content.name}
                        @click=${() => {
                              if (label.value === OPEN) {
                                    ul.element.style.display = 'none';
                                    label.value = CLOSE;
                              } else {
                                    ul.element.style.display = 'block';
                                    label.value = OPEN;
                              }
                        }}
                  >
                        ${label}
                  </li>
                  <ul ref=${ul}>
                        ${content.children.map(child => {
                              if (child.children.length > 0) {
                                    return Tree({ content: child });
                              }

                              return html`<li title=${child.name}> ${`${child.name} `} </li>`
                        })}
                  </ul>
            </Shadow>
      `
}

function App() {
      //$error.catch(console.error);
      return Tree({
            content: {
                  name: 'root',
                  children:  [
                        { name: 'A', children: [] },
                        { name: 'B', children: [
                              { name: 'B1', children: [] },
                              { name: 'B2', children: [] },
                              { name: 'B3', children: [
                                    { name: 'B31', children: [] },
                              ] },
                        ] },
                        { name: 'C', children: [] },
                        { name: 'D', children: [
                              { name: 'B', children: [
                              { name: 'B1', children: [] },
                              { name: 'B2', children: [] },
                              { name: 'B3', children: [
                                    { name: 'B31', children: [] },
                              ] },
                        ] },] },
                  ]
            }
      })
}

GApp
.createRoot(App)