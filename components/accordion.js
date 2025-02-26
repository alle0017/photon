import { html, css, Component, $ref } from "../core/index.js";
import { getComponentTheme, Key, useRestAttributes } from "./utils.js";
/**
 * 
 * @param {{ 
 *    theme?: string,
 * } & { [key: string]: string, }} param0 
 * @returns 
 */
export default function Accordion({ theme, ...other }){
      const t = getComponentTheme( theme );
      const ref = useRestAttributes( other );
      const key = Key.value;
      const scoped = css`
            .container {
                  display: grid;
                  width: 90%;
                  padding: 10px;
                  height: fit-content;
            }
      `;

      return html`
            <style scoped=${scoped}>
                  .container[idx="${key}"] {
                        background-color: ${t.map( theme => theme.backgroundSecondary )};
                  }
            </style>
            <div class="container" idx=${key} rest=${ref}>
                  <Children/>
            </div>
      `;
}