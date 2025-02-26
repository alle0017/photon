import { html, css, Component, $ref, $signal } from "../core/index.js";
import { getComponentTheme, Key, useRestAttributes } from "./utils.js";
/**
 * 
 * @param {{ 
 *    theme?: string,
 *    mode?: 'inner' | 'outer',
 *    loop?: boolean,
 *    __children: import("../core/index.js").Tree[]
 * } & { [key: string]: string, }} param0 
 * @returns 
 */
export default function Carousel({ theme, width, height, buttonColor, loop, iconColor, mode, __children, ...other }){
      const t = getComponentTheme( theme );
      const ref = useRestAttributes( other );
      const key = Key.value;
      const left = $signal(0);
      const scoped = css`
            .carousel {
                  overflow: hidden;
                  padding: 0px;
                  display: flex;
                  gap: 10px;
                  margin-left: 10px;
                  z-index: 99;
            }

            .carousel-container {
                  display: flex;
                  gap: 10px;
                  position: relative;
                  transition: .4s linear;
            }

            button {
                  border-radius: 10px;
                  width: 40px;
                  height: 40px;
                  border: none;
                  font-size: 32px;
                  padding: 0;
                  display: inline-flex;
                  justify-content: center;
                  align-items: center;
                  z-index: 100;
            }
            button:hover {
                  filter: brightness(85%);
            }
            button:active {
                  filter: brightness(70%);
                  transform: scale(95%);
            }

      `;

      const max = __children.filter( c => !c.isTextNode ).length;
      const min = 0;


      return html`
            <style>
                  button[idx="${key}"] {
                        background-color: ${t.map( theme => theme[ buttonColor || 'backgroundSecondary' ] || theme.backgroundSecondary)};
                        color: ${ t.map( theme => theme[ iconColor || 'primary' ] || theme.primary )};
                        margin: ${mode == 'outer'? 0: -70}px;
                  }
                  .carousel[idx="${key}"] {
                        width: ${width || '200px'};
                        height: ${height || '200px'};
                  }
                  .carousel-container[idx="${key}"] > * {
                        width: calc( ${width || '200px'} - 10px );
                        height: calc( ${height || '200px'} - 10px );
                  }
            </style>
            <div scoped=${scoped} style="display: flex; align-items: center;">
                  <button idx=${key} @click=${() => left.value <= min ? loop? left.value = max - 1: undefined: left.value--}>
                        ‹
                  </button>
                  <div idx=${key} class="carousel" ref=${ref}>
                        <div idx=${key} class="carousel-container" style=${left.map(val => `left: calc(${-val}*${width || '200px'});`)}>
                              <Children/>
                        </div>
                  </div>
                  <button idx=${key} @click=${() => left.value >= max - 1 ? loop? left.value = min: undefined: left.value++}>
                        ›
                  </button>
            </div>
      `;
}