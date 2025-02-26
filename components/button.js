import { getComponentTheme, Key, useRestAttributes } from "./utils.js";
import { html, css, Component, $ref } from "../core/index.js";

/**
 * @slot
 * - `g-text`: equal to using the attribute `text`. 
 * if the two are used together, `g-text` is appended 
 * after `text` attribute
 * - `g-icon`: contains the icon appended before the text
 * @param {{  
*    onClick?: () => void, 
*    theme?: string;
*    __children: Readonly<import("../core/index.js").Tree[]>
*    mode?: 'outline' | 'fill',
*    text?: string,
* } & { [key: string]: string }} param0 
* @returns 
*/
export default function Button({ theme, mode, __children, onClick, text, ...other }){
      const t = getComponentTheme( theme );
      const key = Key.value;
      const ref = $ref();
      const rest = useRestAttributes( other );
      const scoped = css`
            .btn {
                  border-radius: 5px;
                  padding: 10px;
                  min-width: 100px;
                  text-transform: uppercase;
                  font-weight: 700;
                  font-size: 14px;
            }

            .btn:hover {
                  filter: brightness(85%);
            }
            .btn:active {
                  filter: brightness(70%);
                  transform: scale(95%);
            }
      `;
      let icon = '';

      text = text || '';

      __children.forEach( child => {
            if( child.tagName == 'g-icon' ){
                  icon += Component.toString( child.children );
            }

            if( child.tagName == 'g-text' ){
                  text += Component.toString( child.children );
            }
      });
      
      ref.onLoad( e => e.innerHTML = icon );

      return html`
            <style>
                  .btn[idx="${key}"] {
                        background-color: ${t.map( theme => mode == 'outline'? theme.background: theme.primary)};
                        color: ${t.map( theme => mode == 'outline'? theme.primary: theme.background )};
                        border: ${t.map( theme => mode == 'outline'? `3px ${theme.primary} solid`: 'none' )};
                  }
            </style>
            <button ontouchstart="" rest=${rest} class="btn" idx=${key} scoped=${scoped} @click=${() => onClick && onClick()}>
                  <div style="display: inline-flex; gap: 10px;">
                        <span ref=${ref}></span>
                        <span>
                              ${text}
                        </span>
                  <div>
            </button>
      `
}