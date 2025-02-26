import { html, css, Component, $ref, } from "../core/index.js";
import { getComponentTheme, Key, useRestAttributes } from "./utils.js";
/**
 * 
 * @param {{ 
 *    attachment?: 'bottom'|'up',
 *    theme?: string,
 *    color?: string,
 *    iconColor?: string,
 *    onNavigate?: ( e: Event ) => void,
 *    __children: import("../core/index.js").Tree[],
 * } & { [key: string]: string, }} param0 
 * @returns 
 */
export default function Navbar({ attachment, theme, color, iconColor, __children, onNavigate, ...other }){
      const t = getComponentTheme( theme );
      const rest = useRestAttributes( other );
      const ref = $ref();
      const key = Key.value;
      const scoped = css`
            .navbar {
                  position: fixed;
                  left: 0;
                  width: 100vw;
                  min-width: 100%;
                  height: 64px;
                  display: flex;
                  gap: 30px;
                  align-content: center;
                  justify-content: space-around;
                  padding-top: 10px;
            }
      `;
      /**
       * @type {HTMLElement}
       */
      let current;

      
      return html`
            <style>
                  .navbar[idx="${key}"] {
                        background-color: ${t.map( theme => theme[ color || 'backgroundSecondary' ] || theme.backgroundSecondary )};
                        ${attachment == 'up' ? 'top: 0;' : 'bottom: 0;'} 
                  }
                  .navbar[idx="${key}"] > * {
                        width: 64px;
                        height: calc( inherit - 4px );
                        font-size: 40px;
                        color: ${t.map( theme => theme[ iconColor || 'primary' ] || theme.primary )};
                  }
                  .navbar[idx="${key}"] > .item:hover {
                        filter: brightness(80%);
                  }
                  .navbar[idx="${key}"] > .item:active {
                        filter: brightness(60%);
                  }
                  .active {
                        border-bottom: 4px solid ${t.map( theme => theme[ iconColor || 'primary' ] || theme.primary )};
                  }
            </style>
            <div 
                  class="navbar" 
                  scoped=${scoped} 
                  idx=${key} 
                  rest=${rest}
                  ref=${ref}>
                  <Children/>
            </div>
      `.onMounted(() => {
            ref.element.childNodes.forEach( child => {

                  if( child.nodeType !== Node.ELEMENT_NODE ||  !/**@type {HTMLElement}*/(child).classList.contains('item') )
                        return;

                  child.addEventListener('click', e =>{ 
                        if( current == e.target )
                              return;
                        if( current ){
                              current.classList.remove('active');
                        }

                        //@ts-ignore
                        e.target.classList.add('active');
                        //@ts-ignore
                        current = e.target;

                        if( onNavigate ) 
                              onNavigate( e );
                  })
            })
      });
}