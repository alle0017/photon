export function isCssKey(obj: unknown): obj is ScopedCss;
export default css;
/**
 * creates a new scoped css module and return a unique key
 * that can be inserted later as an attribute in the html.
 * All the tags that **follows** the tag with the key attribute get the scope.\
 * the scoped css is made adding a class to all the css selectors.
 * the class used is `.--Component--Scope__Key__` followed by a unique, randomly generated number
 * @example
 * ```javascript
 * const key = css`
 *  p {
 *      background-color: #fff;
 *  }`
 *
 * html`
 *      <p>i'm not scoped</p>
 *      <p scope=${key}> // <= this is not scoped
 *            <p> i'm scoped !!!</p>
 *      </p>
 *      <p> i'm scoped too!</p>
 * `
 * ```
 * @param {TemplateStringsArray} strings
 * @param  {...unknown} args
 */
declare function css(strings: TemplateStringsArray, ...args: unknown[]): any;
//# sourceMappingURL=CssParser.d.ts.map