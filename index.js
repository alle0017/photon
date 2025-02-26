import { html, GApp, } from "./core/index.js"
import Sui, { createTheme, setThemeAsDefault, useTheme } from "./components/index.js"
/**@import {Signal} from "./core" */

function App(){
      const themes = useTheme();

      return html`
            <style>
                  #swipe {
                        background-color: ${themes.map( t => t.primary )};
                        width: 100px;
                        height: 100px;
                        border-radius: 5px;
                        margin: 50px;
                  }
            </style>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" />
            <g-switch circleColor="text"/>
            <g-accordion>
                  <g-accordion-item 
                        title="100,000 views - how much is it? "
                        dividerColor="text"
                        iconColor="text">
                        <div style="margin-bottom: 100px;">
                              The number of views equals the number of times the app loads on your website. 
                              As usual, 100,000 views approximately equals 100,000 of visits to your site per month. 
                              But it still depends on each specific case and the numbers may differ.
                              More details about views are here.
                        </div>
                  </g-accordion-item>
                  <g-accordion-item 
                        title="100,000 views - how much is it? "
                        dividerColor="text"
                        iconColor="text">
                        The number of views equals the number of times the app loads on your website. 
                        As usual, 100,000 views approximately equals 100,000 of visits to your site per month. 
                        But it still depends on each specific case and the numbers may differ.
                        More details about views are here.
                  </g-accordion-item>
            </g-accordion>
      `
}

GApp
.use( Sui )
.createRoot(App(), document.body)