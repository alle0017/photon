import { html, css, Component, $ref } from "../core/index.js";
import { getComponentTheme, useRestAttributes, Key } from "./utils.js";
/**
 * 
 * @param {{ 
 *    text?: string,
 *    theme?: string,
 *    __children: import("../core/index.js").Tree[],
 *    closable?: boolean,
 *    onClose?: ( dispose: ()=>void ) => void,
 * } & { [key: string]: string, }} param0 
 * @returns 
 */
export default function Chip({ text, theme, __children, closable, onClose, ...other }){
      const t = getComponentTheme( theme );
      const pre = $ref();
      const post = $ref();
      const ref = useRestAttributes( other );
      const key = Key.value;
      const scoped = css`
            .chip {
                  padding: 5px 15px;
                  border-radius: 30px;
            }
            .close {
                  border-radius: 50%;
                  font-size: 14px;
                  font-family: monospace;
                  width: 20px;
                  height: 20px;
                  text-align: center;
                  padding-top: 1px;
                  box-sizing: border-box;
                  font-weight: bolder;
                  cursor: pointer;
            }
            .close:hover {
                  filter: brightness(90%);
            }
            .close:active {
                  filter: brightness(70%);
            }
      `;
      let preIcon = '';
      let postIcon = '';

      __children.forEach( child => {
            if( child.tagName == 'g-icon-pre' ){
                  preIcon += Component.toString( child.children );
            }

            if( child.tagName == 'g-icon-post' ){
                  postIcon += Component.toString( child.children );
            }
      });

      pre.onLoad( e => e.innerHTML = preIcon );
      post.onLoad( e => e.innerHTML = postIcon );

      const component = html`
            <style>
                  .chip[idx="${key}"] {
                        background-color: ${t.map( theme => theme.backgroundSecondary )}
                  }
                  .close[idx="${key}"] {
                        background-color: ${t.map( theme => theme.background )};
                        color: ${t.map( theme => theme.backgroundSecondary )};
                  }
            </style>
            <span 
                  ref=${ref}
                  class="chip" 
                  style="display: flex; max-width: fit-content; gap: 10px;" 
                  scoped=${scoped}
                  idx=${key}
            >
                  <span ref=${pre}></span>
                  <span>${text}</span>
                  <span ref=${post}></span>
                  ${ closable? html`<span idx=${key} scoped=${scoped} class="close" @click=${() => onClose && onClose( () => component.dispose() )}>x<span>`: html`` }
            </span>
      `

      return component;
}