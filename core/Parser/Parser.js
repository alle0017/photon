import Reactive from "../Signals/Reactive.js";
import VNode from "./Nodes/VNode.js";
import VNodeBuilder from "./Nodes/VNodeBuilder.js";
/**@import {Unsubscriber} from "../Signals/Notifier" */

/**
 * @template T
 * @typedef {{
 *     push(...value: T[]): void;
 *     pop(): T;
 *     at(index: -1): T;
 *     length: number;
 *}} Stack
 */
/** 
 @typedef {{
      children: VNode[],
      props: Map<string,unknown>,
      tag: string|Reactive<string>,
      scope: Unsubscriber[]
 }} Root
 */

/*
 * class that implements parsing of html-like trees into VNodes.
 * parsing is done using an inverse stack algorithm that 
 * prefers creation of child first. parents are stored on a stack as 
 * representation that will become VNode later
 */
export default class Parser {

      /**
       * it starts with a strange sequence for regular text. This is done for 
       * the parsing stage, to check if is regular text or is a keyword. If the compared text is not
       * this keyword, the check should end in maximum 4 characters.
       * @readonly
       */
      static #pointerToReactive = '£:_--pRiVaTe__REACTIVE_PTR__v0\.0\/2024£';

      /**
       * @readonly
       */
      static #tagRegex = new RegExp(`<\\s*(${this.#pointerToReactive}|([a-zA-Z][a-zA-Z0-9-]*))(\\s+(${this.#pointerToReactive}|@?[a-zA-Z_:][a-zA-Z0-9_.:-]*)(\\s*=\\s*(?:"[^"]*"|'[^']*'|[^\\s>]*))?)*\\s*\/?>`);
      /**
       * @readonly
       */
      static #tagAttrRegex = new RegExp(`((${this.#pointerToReactive})|@?[a-zA-Z_:][a-zA-Z0-9_\.:-]*)\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]*))|([a-zA-Z_:][a-zA-Z0-9_.:-]*)`, 'g');
      /**
       * @readonly
       */
      static #tagNameRegex = new RegExp(`<\\s*(${this.#pointerToReactive}|([a-zA-Z][a-zA-Z0-9-]*))`);
      /**
       * @readonly
       */
      static #closingTagRegex = /<\/\s*[a-zA-Z][a-zA-Z0-9-]*\s*>/;
      /**
       * @readonly
       */
      static #selfClosingTagRegex = /\s*\/>/;


      /**
       * @type {VNodeBuilder}
       * @readonly
       */
      #builder;

      /**
       * 
       * @param {VNodeBuilder} builder 
       */
      constructor( builder ){
            this.#builder = builder;
      }

      /**
       * is guaranteed that if isTag is true, it returns 1 and only 1 Tree Node
       * @param {Root} parent
       * @param {Readonly<string>} slice 
       * @param {unknown[]} args
       * @returns {Root}
       */
      #parsePossibleTag( parent, slice, args  ){

            const check = slice.match( Parser.#tagRegex );

            if( !check || check.index !== 0 ){
                  return null;
            }

            /**
             * @type {Map<string,unknown>}
             */
            const attributes = new Map();
            // get the tag type
            /**
             * @type {string|Reactive<string>}
             */
            let tagName = slice.match( Parser.#tagNameRegex )[0].replace('<', '');
            // get attributes="value", or, if the match returns nul, pass empty array 
            // it also removes the tag name, to avoid the
            // case where the tag name is considered as an attribute
            const attribNameAndVal = slice.replace( new RegExp(`(${tagName})`), '' ).match( Parser.#tagAttrRegex ) || [];

            if( tagName == Parser.#pointerToReactive ){
                  const arg = args.shift();

                  if( ( !(arg instanceof Reactive) || !(typeof arg.value == 'string') ) && !(typeof arg == 'string') ){
                        throw new TypeError( 'The tag name must be a string or a Signal<string> ' + arg );
                  }

                  tagName = arg;
            }

            for( const props of attribNameAndVal ){

                  let [name,value] = props.split( '=' );

                  
                  if( value && typeof value == 'string' && ( value.startsWith('\'') || value.startsWith('"') ) ){
                        value = value.slice( 1, value.length - 1 );
                  }

                  if( value == Parser.#pointerToReactive ){
                        value = /**@type {string}*/(args.shift());
                  }

                  attributes.set(
                        name, 
                        value
                  );
            }

            return {
                  scope: [],
                  tag: tagName,
                  props: attributes,
                  children: []
            }
      }


      /**
       * 
       * @param {Readonly<string>} string 
       */
      #compareWithReactivePointer( string ){
            const keyword = Parser.#pointerToReactive;
            let j = 1;

            while( j < keyword.length ){
                  if( keyword[j] !== string[j] )
                        return false;
                  j++;
            }

            return true;
      }


      /**
       * @throws {TypeError} if the tag name is an argument but it's type is different both from `string` and `Signal<string>`
       * @throws {DOMException} if the parsing phase notice an error. some scenarios are when a tag is closed but is never opened
       * @param {Readonly<string>} template the template string that needs to be parsed
       * @param {unknown[]} args arguments interpolated into the template
       * @returns {VNode[]} VNode representation of the string
       */
      #createHtmlTree( template, args ){

            /**
             * @type {Root}
             */
            const root = {
                  scope: [],
                  children: [],
                  tag: '',
                  props: undefined,
            }

            
            /**
             * @type {Stack<Root>}
             */
            const stack = [ root ];
            let text = '';

            for( let i = 0; i < template.length; i++ ){


                  if( template[i] == Parser.#pointerToReactive[0] && this.#compareWithReactivePointer( template.slice(i) ) ){
                        const {subs,tree} = this.#builder.create( 
                              /**@type {string}*/(args.shift()), 
                              new Map(), 
                              [],
                              []
                        );

                        stack
                        .at( -1 )
                        .children
                        .push(
                              this.#builder.createTextNode(text),
                              ...tree,
                        );

                        stack.at(-1).scope.push(...subs);

                        text = '';

                        i += Parser.#pointerToReactive.length - 1;

                        continue;
                  }

                  if( template[i] == '\\' ){
                        // skip the next character
                        text += ('\\'+ template[ i + 1 ]);
                        i++;
                        continue;
                  }

                  if( template[i] == '<' ){
                        const last = template.indexOf( '>', i + 1 );

                        if( last >= 0 ){
                              const tag = template.slice( i, last + 1 );

                              if( tag.match( Parser.#closingTagRegex ) ){
                                    stack
                                    .at(-1)
                                    .children
                                    .push(this.#builder.createTextNode(text));
                                    
                                    text = '';
                                    // we don't have to parse anything, just pop what was the last opened tag
                                    const el = stack.pop();
                                    const {subs,tree} = this.#builder.create(el.tag, el.props, el.children,el.scope);

                                    stack
                                    .at(-1)
                                    .children
                                    .push(...tree);

                                    stack.at(-1).scope.push(...subs);
                                    
                                    if( stack.length < 1 )
                                          throw new DOMException('Invalid closing tag in template');
                                    // we already analyzed until last index
                                    i = last;
                                    continue;
                              }

                              const res = this.#parsePossibleTag( stack.at(-1), tag, args );

                              if( !res ){
                                    text += template[i];
                                    continue;
                              }

                              stack
                              .at( -1 )
                              .children
                              .push(this.#builder.createTextNode(text));


                              if( !tag.match( Parser.#selfClosingTagRegex ) ){
                                    // will be rendered when all children are parsed
                                    stack.push( res );
                              }else{
                                    const {tree,subs} = this.#builder.create(res.tag, res.props, res.children, res.scope);
                                    // if it's self closing tag, 
                                    //it doesn't need to be pushed inside the stack
                                    // but needs to be converted into VNode
                                    // immediately
                                    stack
                                    .at(-1)
                                    .children
                                    .push(...tree);

                                    stack.at(-1).scope.push(...subs);
                              }

                              // clean up the already-processed text
                              text = '';

                              // we already analyzed until last index
                              i = last;

                              continue;
                        }
                  }

                  text += template[i];
            }

            root
            .children
            .push(this.#builder.createTextNode(text));


            return root.children;
      }

      /**
       * @throws {ReferenceError} if the private pointer key is used by the user inside the template
       * @param {TemplateStringsArray} strings 
       * @returns {string}
       */
      #reduceTemplateStringArray( strings ){
            return strings.reduce( (p,c) =>{ 
                  if( c.indexOf( Parser.#pointerToReactive ) >= 0 ){
                        throw new ReferenceError( 
                              Parser.#pointerToReactive +
                              " is a private keyword. consider using other words instead or escaping it with codes." 
                        );
                  }
                  return p + Parser.#pointerToReactive + c;
            });
      }

      /**
       * parse an html-like string
       * @throws {ReferenceError} if there is an internal error caused by incorrect usage of special words
       * @throws {TypeError} if the type of the tag name is not compatible with something usable by the renderer
       * @throws {DOMException} if the parsing operation fail
       * @param {TemplateStringsArray} strings 
       * @param  {...unknown} args 
       */
      parse( strings, ...args ){
            const hash = this.#reduceTemplateStringArray( strings );
            const template = this.#createHtmlTree( hash, args );
            return template;
      }
}