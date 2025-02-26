import { createTheme, setThemeAsDefault, useThemes } from "./utils.js";
import CheckBox from "./checkbox.js"
import Switch from "./switch.js";
import Button from "./button.js";
import Input from "./input.js";
import Chip from "./chip.js";
import Card from "./card.js";
import Navbar from "./navbar.js";
import Main from "./main.js";
import Carousel from "./carousel.js";
import { Swipe } from "./swipe.js";
import Accordion from "./accordion.js";
import AccordionItem from "./accordionItem.js";
/**@import {GApp} from "../core" */

/**
 * Plugin that exposes different components 
 * - `g-checkbox`: 
 * ```javascript
 * {
 *   ﹫click?: (newValue: boolean) => void;
 *   value?: boolean;
 *   icon?: string | Component | Component[];
 *   size?: number;
 *   theme?: string;
 *   disabled?: boolean;
 * }
 * ```
 * - `g-switch`: 
 * ```javascript
 * {
 *   ﹫click?: (newValue: boolean) => void;
 *   value?: boolean;
 *   theme?: string;
 *   disabled?: boolean;
 * }
 * ```
 * - `g-btn`: 
 * > has two slots, `<g-icon>`, `<g-text>` that is used for 
 * > the button icon and the button text
 * 
 * ```javascript
 * {
 *    ﹫click?: () => void;
 *    theme?: string;
 *    disabled?: boolean;
 *    mode?: "outline" | "fill";
 *    text?: string;
 * }
 * ```
 * - `g-input`: 
 * ```javascript
 * {
 *     ﹫input?: (value: string) => void;
 *     theme?: string;
 *     disabled?: boolean;
 *     value?: string;
 *     placeholder?: string;
 *     mode?: "outline" | "fill";
 *     label?: string;
 *     rules?: Array<(value: string) => boolean>;
 *     description?: string;
 *     bind?: Record<string,string>;
 *     bindKey?: string; // default set to 'value'. is the key of `bind` where is saved the input value
 * }
 * ```
 * - `g-card`: 
 * ```javascript
 * { 
 *    title?: string,
 *    subtitle?: string,
 *    theme?: string,
 * }
 * ```
 * @param {typeof GApp} app 
 */
export default function Sui( app ){

      createTheme('base-default', {
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
            border: '3px solid black'
      });
      setThemeAsDefault('base-default')
      
      app
      .registerComponent(CheckBox, 'g-checkbox')
      .registerComponent(Switch, 'g-switch')
      .registerComponent(Button, 'g-btn')
      .registerComponent(Input, 'g-input')
      .registerComponent(Chip, 'g-chip')
      .registerComponent(Card, 'g-card')
      .registerComponent(Navbar, 'g-navbar')
      .registerComponent(Main, 'g-main')
      .registerComponent(Carousel, 'g-carousel')
      .registerComponent(Swipe,'g-swipe')
      .registerComponent(Accordion,'g-accordion')
      .registerComponent(AccordionItem,'g-accordion-item')
}

/**
* utility used to get the needed theme
* @param {string|undefined} theme 
*/
export const useTheme = theme => {
     const themes = useThemes();
     /**
      * @type {{map: ( callback: ( value: import("./index.js").Theme ) => any ) => any}}
      */
     let t = themes.default;

     if( theme && themes.themes.has( theme ) ){
           t = { map: f => f( themes.themes.get( theme ) ) };
     }

     return t;
}

export { setThemeAsDefault, createTheme, }