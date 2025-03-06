import { html, css, Component, $ref, $watcher,} from "../core/index.js";
import { getComponentTheme, Key, useRestAttributes } from "./utils.js";
/**@import { Signal } from "../core/index.js";*/

/**
 * 
 * @param {{ 
 *    open?: Signal<boolean>,
 *    theme?: string,
 * } & { [key: string]: string, }} param0 
 * @returns 
 */
export default function Modal({ open, theme, ...other }){
      const t = getComponentTheme( theme );
      const ref = useRestAttributes( other );
      const key = Key.value;

      $watcher(() => {
            if( open.value )
                  //@ts-ignore
                  ref.element.showModal();
            else 
                  //@ts-ignore
                  ref.element.close();
      }, open )

      return html`
            <style>
                  dialog[idx="${key}"] {
                        background-color: ${t.map(theme => theme.background)};
                        border: none;
                        width: fit-content;
                        height: fit-content;
                  }
            </style>
            <dialog rest=${ref} idx=${key}>
                  <Children/>
            </dialog>
      `;
}