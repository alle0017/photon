import { html, css, Component, $ref } from "../core/index.js";
import { getComponentTheme, Key, useRestAttributes } from "./utils.js";
/**
 * 
 * @param {{ 
 *    title?: string,
 *    subtitle?: string,
 *    theme?: string,
 * } & { [key: string]: string, }} param0 
 * @returns 
 */
export default function Card({ title, subtitle, theme, ...other }){
      const t = getComponentTheme( theme );
      const ref = useRestAttributes( other );
      const key = Key.value;
      const scoped = css`
            .card {
                  min-width: 200px;
                  min-height: 200px;
                  border-radius: 10px;
                  display: grid;
                  gap: 10px;
                  padding: 20px;
            }
            .subtitle {
                  font-size: 16px;
            }
            .title {
                  font-weight: 900;
                  font-size: 18px;
                  text-transform: uppercase;
            }
      `;

      title = title || '';
      subtitle = subtitle || '';

      return html`
            <style>
                  .card[idx="${key}"] {
                        background-color: ${t.map( theme => theme.backgroundSecondary )};
                  }
                  .subtitle[idx="${key}"] {
                        color: ${t.map( theme => theme.textLight )};
                  }
                  .title[idx="${key}"] {
                        color: ${t.map( theme => theme.text )};
                  }
            </style>
            <div class="card" scoped=${scoped} idx=${key} ref=${ref}>
                  <div class="title" idx=${key}>
                        ${title}
                  </div>
                  <div class="subtitle" idx=${key}>
                        ${subtitle}
                  </div>
                  <div>
                        <Children/>
                  </div>
            </div>
      `;
}