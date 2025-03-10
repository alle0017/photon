import { html, GApp, $ref } from "./core/index.js"
import Sui from "./components/index.js"
import createRouter from "./router.js";

function App(){
      const root = $ref();
      root.onLoad( e => {
            const useRouter = createRouter({
                  debug: true,
                  root: e,
                  routes: {
                        '/a': {
                              keepMounted: false,
                              accessibleRoutes: ['/b', '/c',],
                              page: () => html`a`
                        },
                        '/b': {
                              keepMounted: false,
                              accessibleRoutes: ['/c',],
                              page: () => html`b`
                        },
                        '/c': {
                              accessibleRoutes: ['/a', '/e'],
                              page: ({ a }) => {
                                    console.log( a )
                                    const page = 
                                    html`
                                          <h1>
                                                ${a}
                                          </h1>
                                    `
                                    console.log( page )
                                    return page;
                              }
                        },
                        '/e': {
                              accessibleRoutes: ['/a'],
                              page: () => html`c`
                        },
                  },
                  default: '/a'
            });
      })
      

      return html`
            <div ref=${root}></div>
      `
}

GApp
.use(Sui)
.createRoot(
      App(), document.body
)