import { html, css } from "../core/index.js"
import { useRestAttributes, } from "./utils.js";
/**@import {Component} from "../core"*/

/**
 * 
 * @param {{[key: string]: string}} props
 * @returns 
 */
export default function Main( props ){
      const rest = useRestAttributes( props );
      const scoped = css`
            div {
                  width: 95vw; 
                  height: 95vh;
                  min-height: 100%;
                  min-width: 100%;
                  overflow-x: hidden;
                  overflow-y: scroll;
            }
      `

      return html`
            <div scoped=${scoped} rest=${rest}>
                  <Children/>
            </div>
      `
}