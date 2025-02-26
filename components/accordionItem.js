import { html, css, Component, $ref, $signal, $watcher } from "../core/index.js";
import { getComponentTheme, Key, useRestAttributes } from "./utils.js";
/**
 * 
 * @param {{ 
 *    theme?: string,
 * } & { [key: string]: string, }} param0 
 * @returns 
 */
export default function AccordionItem({ title, dividerColor, iconColor, collapsedIcon, expandedIcon, theme, ...other }){
      collapsedIcon ||= '+';
      expandedIcon ||= '-';
      const t = getComponentTheme( theme );
      const ref = useRestAttributes( other );
      const visible = $signal(false);
      const key = Key.value;
      const icon = visible.map(v => v? expandedIcon: collapsedIcon);
      const scoped = css`
            .container {
                  display: grid;
                  width: 100%;
                  height: fit-content;
                  gap: 10px;
                  padding: 10px;
                  box-sizing: border-box;
            }
            .title {
                  font-size: 20px;
                  font-weight: bolder;
                  height: 50px;
                  text-align: center;
                  display: flex;
                  justify-content: space-around;
                  gap: 20px;
                  width: 100%;
            }
            .content {
                  overflow: hidden;
                  transition: .7s;
            }
            .icon {
                  font-size: 48px;
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
                  .content[idx="${key}"] {
                        color: ${t.map( theme => theme.textLight )};
                  }
                  .icon[idx="${key}"] {
                        color: ${t.map( theme => theme[iconColor || 'primary'] || theme.primary )};
                  }
                  .container[idx="${key}"] {
                        border-bottom: 2px solid ${t.map( theme => theme[dividerColor || 'primary'] || theme.primary )};
                  }
            </style>
            <div class="container" idx="${key}" rest=${ref}>
                  <div class="title" @click=${() => visible.value = !visible.value}>
                        <div style="width: 95%;">
                              ${title}
                        </div>
                        <div class="icon" idx=${key}>
                              ${icon}
                        </div>
                  </div>
                  <div class="content" idx=${key} style=${visible.map( value => value ? 'max-height: 500px;': 'max-height: 0px;')}>
                        <Children/>
                  </div>
            </div>
      `;
}