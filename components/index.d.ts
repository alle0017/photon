import {GApp} from "../core";

export type Theme = {
      primary: string,
      secondary: string,
      surface: string,
      text: string,
      textLight: string,
      error: string,
      success: string,
      warning: string,
      background: string;
      backgroundSecondary: string,
      border: string;
      grey1: string;
      grey2: string;
      grey3: string;
      none: '#0000';
}

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
 * - `g-chip`: 
 * > has two slots, `<g-icon-pre>`, `<g-icon-post>`.
 * ```javascript
 * {
 *     ﹫close?: ( dispose: ()=>void )=>void,
 *     text?: string,
 *     theme?: string,
 *     closable?: boolean,
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
 *  - `g-navbar`: 
 * > accepts children, that, if had the css class `item`, 
 * > are used to identify the different items shown into the navbar. 
 * > when any g-item is clicked (different from the active one) is fired the ﹫navigate event.
 * > @example
 * > - `<div class="item">...</div>` is a valid item
 * > - `<div>...</div>` is not a valid item and displayed as "inactive", so no hover effect, no
 * > ﹫navigate event fired on click etc...
 * ```javascript
 * { 
 *    ﹫navigate?: ( e: Event ) => void,
 *    attachment?: 'bottom'|'up',
 *    theme?: string,
 *    color?: string,
 *    iconColor?: string,
 * }
 * ```
 *  - `g-main`
 * - `g-carousel`: 
 * ```javascript
 * { 
 *    theme?: string,
 *    mode?: 'inner' | 'outer',
 *    loop?: boolean,
 *    width?: string, 
 *    height?: string, 
 *    buttonColor?: string,
 *    iconColor?: string,
 * }
 * ```
 * - `g-accordion`: 
 * ```javascript
 * { 
 *    theme?: string,
 * }
 * ```
 * - `g-accordion-item`: 
 * ```javascript
 * { 
 *    theme?: string,
 *    title?: string, 
 *    dividerColor?: string,
 *    iconColor?: string, 
 *    collapsedIcon?: string, 
 *    expandedIcon?: string,
 * }
 * ```
 * - `g-breadcrumb`: 
 * > it has one slot for any number of `g-item`.
 * ```javascript
 * { 
 *    dividerIcon?: string,
 * }
 * ```
 * - `g-swipe`
 * ```javascript
 * { 
 *    ﹫swipe?: ( e: 'up' | 'down' | 'left' | 'right' ) => void,
 * }
 * ```
 */
export default function Sui( app: typeof GApp ): void;
/**
 * set an already-defined theme
 */
export const setThemeAsDefault: (name: string) => void;
/**
 * create a new theme
 */
export const createTheme: (name: string, theme: Partial<Theme>, extend?: string) => void

export const useTheme: (theme?: string) => {
    map: (callback: (value: import("./index.js").Theme) => any) => any;
}