import { createContext, $signal, $ref } from "../core/index.js";
/**@import { Signal } from "../core/index.js";*/
/**@import {Theme} from "./index.js" */


export const useThemes = createContext({
      /**
       * @type {Signal<Theme>}
       */
      default: $signal({
            primary: '#3F51B5',
            secondary: '#5C6BC0',
            surface: '#fff',
            background: '#eee',
            backgroundSecondary: '#bbb',
            text: '#000',
            textLight: '#666',
            error: '#b00020',
            warning: '#fef07a',
            success: '#bfff5e',
            grey1: '#aaa',
            grey2: '#999',
            grey3: '#555',
            border: '3px solid black',
            none: '#0000',
      }),
      themes: /**@type {Map<string,Theme>}*/(new Map()),
});

/**
 * @type {(name: string, theme: Partial<Theme>, extend?: string) => void}
 */
export const createTheme = ( name,theme, extend ) => {

      const themes = useThemes();
      let base = themes.default.value;

      if( extend && themes.themes.has( extend ) ){
            base = themes.themes.get( extend );
      }

      themes.themes.set( name, {
            ...base,
            ...theme,
      });
}     

/**
 * @param {string} name
 */
export const setThemeAsDefault = name => {
      const themes = useThemes();
      const theme = themes.themes.get( name )

      if( !theme ){
            throw new Error('no theme name found with name ' + name );
      }
      document.body.style.backgroundColor = theme.background;
      document.body.style.color = theme.text;
      themes.default.value = theme;
}

/**
 * utility used to get the needed theme
 * @param {string|undefined} theme 
 */
export const getComponentTheme = theme => {
      const themes = useThemes();
      /**
       * @type {{map: ( callback: ( value: Theme ) => any ) => any}}
       */
      let t = themes.default;

      if( theme && themes.themes.has( theme ) ){
            t = { map: f => f( themes.themes.get( theme ) ) };
      }

      return t;
}


export class Key {
      static #value = 0;

      static get value(){
            return this.#value++;
      }
}

/**
 * 
 * @param {Record<string,string>} other 
 */
export const useRestAttributes = other => {
      const ref = $ref();

      ref.onLoad( e => {
            Object.entries( other ).forEach(([k,v]) => {
                  if( k[0] != '_' ){
                        if( k != 'class'){
                              e.setAttribute( k, v );
                        }else{
                              e.classList.add(v)
                        }
                  }
            });
      });
      
      return ref;
}
