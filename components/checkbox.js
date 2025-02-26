import { html, css, } from "../core/index.js"
import {  getComponentTheme, Key, useRestAttributes, } from "./utils.js";
/**@import {Component} from "../core"*/

/**
 * 
 * @param {{ 
 *    value?: boolean, 
 *    onClick?: (newValue: boolean) => void, 
 *    icon?: string | Component | Component[],
 *    size?: number,
 *    theme?: string,
 *    disabled?: boolean,
 * } & {[key: string]: string}} param0 
 * @returns 
 */
export default function CheckBox({ value, onClick, icon, size, theme, disabled, ...other }){
      const t = getComponentTheme( theme );
      const key = Key.value;
      const ref = useRestAttributes( other );
      
      const scoped = css`
            .cb-mark {
                  
                  border-radius: 4px;
                  border: 3px solid black;
                  display: inline-grid;
                  font-weight: 900;
                  justify-content: center;
                  align-content: center;
                  box-sizing: border-box;
            }
            .cb-mark::before {
                  visibility: hidden;
            }
            .cb-mark[checked="true"]::before {
                  font-family: monospace;
                  visibility: visible;
            }
      `;

      icon = icon || 'x';

      return html`
            <style>
                  .cb-mark[idx="${key}"]::before {
                        content: "${icon || 'x'}";
                        color: ${t.map( theme => theme.surface )};
                  }
                  .cb-mark[idx="${key}"] {
                        width: ${size || 20}px;
                        height: ${size || 20}px;
                        font-size: ${ ( size || 20 ) - 4 }px;
                  }
                  
                  .cb-mark[idx="${key}"][checked="true"] {
                        background-color: ${t.map( theme => theme.primary )};
                        border-color: ${t.map( theme => theme.primary )};
                  }
            </style>
            <div 
                  ref=${ref}
                  scoped=${scoped}
                  checked=${ value ? 'true': 'false' } 
                  class="cb-mark"
                  idx=${key}
                  @click=${e =>{
                        if( disabled )
                              return;

                        value = !value;
                        e.target.setAttribute('checked', value ? 'true': 'false');
                        onClick && onClick(value)
                  }} 
            ></div>
      `
}