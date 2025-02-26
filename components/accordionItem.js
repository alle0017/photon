import { html, css, Component, $ref, $signal } from "../core/index.js";
import { getComponentTheme, Key, useRestAttributes } from "./utils.js";
/**
 * 
 * @param {{ 
 *    theme?: string,
 * } & { [key: string]: string, }} param0 
 * @returns 
 */
export default function AccordionItem({ title, collapsedIcon, expandedIcon, theme, ...other }){
      expandedIcon = expandedIcon || '';
      collapsedIcon = collapsedIcon || '⌄';

      const t = getComponentTheme( theme );
      const ref = useRestAttributes( other );
      const visible = $signal(false);
      const icon = visible.map( v => v? expandedIcon: collapsedIcon );
      const key = Key.value;
      const scoped = css`
            .container {
                  display: grid;
                  width: inherit;
                  height: 50px;
            }
            .title {
                  font-size: 20px;
                  font-weight: bolder;
                  height: 50px;
                  text-align: center;
                  display: flex;
                  justify-content: space-around;
                  gap: 20px;
            }
            .content {
                  height: 0px;
                  overflow: hidden;
            }
            .icon {
                  font-size: 32px;
            }
            .icon:hover {
                  filter: brightness(70%);
                  cursor: pointer;
            }
            .icon:active {
                  filter: brightness(50%);
            }
      `;

      return html`
            <style scoped=${scoped}>
                  .container[idx="${key}"] {
                        
                  }
                  .icon[idx="${key}"] {
                        color: ${t.map( theme => theme.primary )}
                  }
            </style>
            <div class="container" idx=${key} rest=${ref}>
                  <div class="title">
                        <div style="width: 95%;">
                              ${title}
                        </div>
                        <div class="icon" idx=${key} @click=${() => visible.value = !visible.value}>
                              ${ html`
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
                              </svg>`}
                        </div>
                  </div>
                  <div class="content" style=${visible.map( value => value ? 'height: fit-content;': 'height: 0px;')}>
                        <Children/>
                  </div>
            </div>
      `;
}