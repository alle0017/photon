import { html, css, Component, $ref, $signal, $watcher } from "../core/index.js";
import { getComponentTheme, Key, useRestAttributes } from "./utils.js";
/**
 * 
 * @param {{ 
 *    dividerIcon?: string,
 * } & { [key: string]: string, }} param0 
 * @returns 
 */
export default function Breadcrumb({ dividerIcon, ...other }){
      dividerIcon ||= '›';
      const ref = useRestAttributes( other );
      const key = Key.value;
      const scoped = css`
            g-item {
                  display: block;
            }

            g-item:hover {
                  font-weight: bolder;
                  filter: brightness(70%);
                  cursor: pointer;
            }
            .container {
                  display: flex;
                  gap: 10px;
            }
            
      `;

      return html`
            <style scoped=${scoped}>
                  *[idx="${key}"] > g-item::after {
                        content: "${dividerIcon}";
                        margin-left: 10px;
                  }
            </style>
            <div class="container" idx="${key}" rest=${ref}>
                  <Children/>
            </div>
      `;
}