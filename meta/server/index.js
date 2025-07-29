import { serve } from "./adapter.js";

const log = (...params) => console.log(`[SERVER_LOG] `, ...params);
/**@typedef {Request & {params: {[k: string]: string;}}} HTTPRequest */
/**@typedef {((req: HTTPRequest) => Response) | ((req: HTTPRequest) => Promise<Response>)} HTTPHandler */
class Server {
      /**
       * @type {Map<string,{ method: string, handler: HTTPHandler }>}
       */
      #routes = new Map();
      /**
       * @param {'GET' | 'POST' | 'DELETE'} method 
       * @param {`/${string}`} route 
       * @param {HTTPHandler} handler 
       */
      route(method, route, handler) {
            this.#routes.set(route, {
                  method,
                  handler
            });
      }

      /**
       * @param {number} port 
       */
      listen(port) {
            log(`Listening on http://localhost:${port}`);

            serve(port,
                  /**
                   * @param {Request} req 
                   */
                  async req => {
                        const url = new URL(req.url);
                        const params = Object.fromEntries(
                              [...url.searchParams.entries()]
                        );

                        /**@type {HTTPRequest} */
                        const internalRequest = Object.assign(req, { params });

                        if (!this.#routes.has(url.pathname)) {
                              return new Response(`Route ${url.pathname} not found`, { status: 404 });
                        }

                        const handler = this.#routes.get(url.pathname);

                        if (handler.method !== req.method) {
                              log(`method ${req.method} not registered`);
                              return new Response(`Method ${req.method} not allowed`, { status: 405 });
                        }

                        return await handler.handler(internalRequest);
                  }
            );
      }     
}