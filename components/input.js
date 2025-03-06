import { getComponentTheme, Key, useRestAttributes, } from "./utils.js";
import { html, css, $ref } from "../core/index.js";
/**@import { Signal } from "../core/index.js"*/;

/**
 * @slot
 * - `g-text`: equal to using the attribute `text`. 
 * if the two are used together, `g-text` is appended 
 * after `text` attribute
 * - `g-icon`: contains the icon appended before the text
 * @param {{  
*    onInput?: ( value: string ) => void, 
*    theme?: string;
*    disabled?: boolean;
*    value?: string,
*    placeholder?: string,
*    mode?: 'outline' | 'fill',
*    label?: string,
*    rules?: Array<( value: string )=>boolean>,
*    description?: string,
*    bind?: Record<string,string>,
*    bindKey?: string,
* } & { [key: string]: string}} param0 
* @returns 
*/
export default function Input({ theme, onInput, value, placeholder, background, mode, label, rules, description, disabled, bind, bindKey, ...other }){
      const t = getComponentTheme( theme );
      const key = Key.value;
      const ref = $ref();
      const rest = useRestAttributes( other );
      const input = e => {
            let flag = true;

            if( onInput ){
                  onInput( e.target.value )
            }

            if( rules && rules.length ){
                  flag = rules
                  .map( f => f(e.target.value) )
                  .reduce( (p,v) => p && v );

                  if( flag ){
                        e.target.classList.remove('error')
                  }else{
                        e.target.classList.add('error')
                  }
            }

            if( bind && flag ){
                  bind[ bindKey || 'value' ] = e.target.value;
            }
      }
      let scoped;

      if( mode == 'outline' ){
            scoped = css`
                  .input {
                        padding: 5px;
                        min-width: 300px;
                        font-size: 16px;
                        border-radius: 10px;
                        min-height: 45px;
                        box-sizing: border-box;
                        margin-top: 5px;
                  }
                  .input:focus{
                        outline: none;
                  }
                  .label {
                        font-size: 14px;
                        padding-left: 10px;
                  }
            `;
      }else{
            scoped = css`
                  .input {
                        padding: 15px;
                        min-width: 300px;
                        font-size: 16px;
                        border-radius: 6px 6px 0px 0px;
                        min-height: 65px;
                        padding-top: 30px;
                        padding-bottom: 0px;
                        box-sizing: border-box;
                  }
                  .input:focus{
                        outline: none;
                  }
                  .label {
                        font-size: 12px;
                        position: relative;
                        top: 19px;
                        left: 15px;
                        width: fit-content;
                  }
            `;
      }

      value = value || '';
      placeholder = placeholder || '';
      label = label || '';
      description = description || '';

      if( description.length > 50 ){
            description = description.slice(0, 46) + '...'
      }

      if( bind ){
            bind[ bindKey || 'value' ] = value;
      }

      ref.onLoad( e => disabled && e.setAttribute('disabled', 'true' ) )

      return html`
            <style>
                  .input[idx="${key}"] {
                        background-color: ${t.map( theme => theme[background || 'background'] || theme.background )};
                        color: ${t.map( theme => theme.text )};
                        border: none;
                  }
                  .input[idx="${key}"]:focus {
                        border: ${t.map( theme => mode == 'outline'? `3px ${theme.primary} solid`: 'none' )};
                        border-bottom: ${t.map( theme => `3px ${theme.primary} solid` )};
                  }
                  .label[idx="${key}"] {
                        color: ${t.map( theme => theme.textLight )};
                  }
                  .error[idx="${key}"] {
                        border-color: ${t.map( theme => theme.error )} !important;
                        color: ${t.map( theme => theme.error )};
                  }
            </style>
            <div style="display: inline-block; width: fit-content;">
                  <div class="label" idx=${key} scoped=${scoped}>
                        ${label}
                  </div>
                  <input 
                        class="input"
                        rest=${rest}
                        ref=${ref}
                        value=${value} 
                        placeholder="${placeholder}" 
                        idx=${key} 
                        @input=${input}
                  />
                  <div style="max-width: 300px; padding: 10px;">
                        ${description}
                  </div>
            </div>
      `
}