/// <reference types="bun-types" />
/// <reference types="deno" />

/**
 * 
 * @param {number} port 
 * @param {((req: Request) => Response) | ((req: Request) => Promise<Response>) } handler 
 */
export const serve = (port, handler) => {
      if (Bun) {
            Bun.serve({
                  port,
                  fetch: handler,
            });
      } else if (Deno) {
            Deno.serve({
                  port,
                  //cert: Deno.readTextFileSync("./cert.pem"),
                  //key: Deno.readTextFileSync("./key.pem"),
            }, handler);
      }
}