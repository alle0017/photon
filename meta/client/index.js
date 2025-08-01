/**@typedef {'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH'} HTTPVerb */
/**@typedef {'inner' | "outer" | "append" | "prepend"} HTMLPatchMode */
/**PURE */

import List from "./List";
/**
 * basic events are:
 * - fetch
 * - beforefetch
 * - error { result?: Response, error?: Error }
 * - hydrate
 */
export const $events = {
      /**
       * @type {Map<string, List<(e: {}) => void>>}
       */
      $$events: new Map(), 
      /**
       * 
       * @param {string} name 
       * @param {(e: {}) => void} callback 
       */
      on(name, callback) {
            if (!this.$$events.has(name)) {
                  this.$$events.set(name, new List());
            }
            let node = this.$$events.get(name).push(callback);
            return () => {
                  if (node) {
                        this.$$events.get(name).remove(node);
                        node = null;
                  }
            };
      },
      /**
       * 
       * @param {string} name 
       * @param {{}} data 
       */
      fire(name, data) {
            if (!this.$$events.has(name)) {
                  return;
            }
            this.$$events.get(name).forEach(f => f(data));
      }
}
/**
 * 
 * @param {string} v
 * @returns {v is HTTPVerb} 
 */
const isHTTPVerb = v => ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'].includes(v);
/**
 * 
 * @param {string} v
 * @returns {v is HTMLPatchMode} 
 */
const isPatchMode = v => ['inner', "outer", "append", "prepend"].includes(v);
/**
 * @typedef {{
 *    method?: HTTPVerb,
 *    href: string,
 *    data?: string,
 *    headers?: HeadersInit
 *    mode?: RequestMode
 * }} FetchOptions
 */
/**
 * Attribute constants for element bindings.
 */
const Attribs = {
      HREF: 'f-href',
      METHOD: 'f-method',
      DATA: 'f-data',
      HEADERS: 'f-headers',
      MODE: 'f-mode',
      EVENT: 'f-trigger',
      TARGET: 'f-target',
      PATCH: 'f-patch',

}
/**
 * Perform a fetch request and apply the returned HTML to the DOM.
 *
 * @param {string} target 
 * @param {FetchOptions} http 
 * @param {HTMLPatchMode} patchMode
 */
async function replace(target, http, patchMode) {
      http.method ||= 'GET';
      $events.fire('beforefetch', { target, http, patchMode });

      try {
            const result = await fetch(http.href, {
                  ...http,
                  body: http.data? http.data : undefined
            });

            if (!result.ok) {
                  $events.fire('error', { result, error: undefined });
                  return;
            }

            const html = await result.text();
            const node = document.querySelector(target);
            $events.fire('fetch', { target, http, patchMode });


            if (!node) {
                  console.error(`no node found for query selector ${target}`);
                  return;
            }

            switch (patchMode) {
                  case "inner": 
                        node.innerHTML = html;
                        break;
                  case "outer":
                        node.outerHTML = html;
                        break;
                  case "append":
                        node.append(html);
                        break;
                  case "prepend":
                        node.prepend(html);
                        break;
            }
      } catch (e) {
            $events.fire('error', { result: undefined, error: e });
      }
}
/**
 * Extract fetch-related options from an HTML element's attributes.
 * @param {Element} el 
 * @returns {FetchOptions}
 */
const getFetchOptions = el => {
      const verb = el.getAttribute(Attribs.METHOD);
      
      return {
            href: el.getAttribute(Attribs.HREF),
            method: verb && isHTTPVerb(verb) ? verb: 'GET',
            headers: el.hasAttribute(Attribs.HEADERS)? el.getAttribute(Attribs.HEADERS).split(';').map(v => /**@type {[string,string]}*/(v.split(':', 2))): undefined,
            mode:  el.hasAttribute(Attribs.MODE)? /**@type {RequestMode}*/(el.getAttribute(Attribs.MODE)): undefined,
            data:  el.hasAttribute(Attribs.DATA)? el.getAttribute(Attribs.DATA): undefined,
      }
}
/**
 * Scans the document for elements with fetch attributes
 * and wires up event listeners to enable dynamic content replacement.
 * attributes, except for `f-trigger` are checked dynamically, to apply 
 * two-way-data-binding easy
 *
 * @returns {void}
 */
const addLibFunctionalities = (() => {
      const watched = new WeakSet();

      return () => {
            const targets = document.querySelectorAll(`[${Attribs.HREF}]`);

            for (const target of targets) {
                  if (watched.has(target)) {
                        continue;
                  }
                  const event = target.hasAttribute(Attribs.EVENT) ? target.getAttribute(Attribs.EVENT) : 'click';
                  $events.fire('hydrate', { target });

                  target.addEventListener(event, async () => {
                        const patchAttrib = target.getAttribute(Attribs.PATCH);
                        const patchMode = patchAttrib && isPatchMode(patchAttrib) ? patchAttrib: 'inner';

                        replace(
                              target.hasAttribute(Attribs.TARGET) ? target.getAttribute(Attribs.TARGET) : 'body',
                              getFetchOptions(target),
                              patchMode
                        );
                  });
                  watched.add(target);
            }
      }
})()

window.addEventListener('load', e => {
      // Create an observer instance linked to the callback function
      const observer = new MutationObserver((mutationList, observer) => {
            let mut = false;
            
            for (const mutation of mutationList) {
                  if (mutation.type !== "childList") {
                        return;
                  }
                  mut = true;
            }

            if (mut) {
                  addLibFunctionalities();
            }
      });

      // Start observing the target node for configured mutations
      observer.observe(document.body, { 
            childList: true, 
            subtree: true 
      });
})