import { html, css, } from "../core/index.js";
import { useThemes, getComponentTheme, Key, useRestAttributes } from "./utils.js";
/**
 * 
 * @param {{ 
*    value?: boolean, 
*    onClick?: (newValue: boolean) => void, 
*    theme?: string;
*    disabled?: boolean;
* } & { [key: string]: string }} param0 
* @returns 
*/
export default function Switch({ onClick, value, theme, disabled, circleColor, ...other }){
      const t = getComponentTheme( theme );
      const key = Key.value;
      const rest = useRestAttributes( other );
      const scoped = css`
                  .slider {
                        width: 60px;
                        height: 30px;
                        display: inline-grid;
                        border-radius: 20px;
                        transition: .4s; 
                  }

                  .slider::before {
                        content: " ";
                        border-radius: 50%;
                        width: 20px;
                        height: 20px;
                        margin-top: 5px;
                        margin-left: 5px;
                        -webkit-transition: .4s;
                        transition: .4s;
                  }

                  .slider[checked="true"]::before {
                        -webkit-transform: translateX(29px);
                        -ms-transform: translateX(29px);
                        transform: translateX(29px);
                  }
      `;

      value = value || false;
      return html`
            <style>
                  .slider[idx="${key}"] {
                        background-color: ${t.map( theme => theme.grey1 )};
                  }

                  .slider[idx="${key}"]::before {
                        background: ${t.map( theme => theme[circleColor || 'background'] || theme.background )};
                  }
                  
                  .slider[checked="true"][idx="${key}"] {
                        background-color: ${t.map( theme => theme.primary )};
                  }
            </style>
            <span class="slider border" rest=${rest} scoped=${scoped} idx=${key} @click=${e => {
                  if( disabled )
                        return;
                  value = !value;
                  e.target.setAttribute('checked', value);
                  onClick && onClick(value);
            }} ></span>
      `
}