import { html, css, Component, $ref, $signal, $watcher, $effect } from "../core/index.js";
import { getComponentTheme, Key, useRestAttributes } from "./utils.js";
/**
 * @param {number} month 
 * @param {number} year 
 */
function getBaseAvailabilityForMonth( month, year ){
      const last = new Date( year, month + 1, 0 ).getDate();
      /**
       * @type {number[]}
       */
      const days = [];

      for( let i = 0; i < last; i++ ){
            days.push(i+1);
      }

      return days;
}

/**
 * @type {(month: number, year: number, f?: (day: number, month: number, year: number) => boolean) => number[]}
 */
function filter( month, year, f ){
      const dates = getBaseAvailabilityForMonth( month, year );
      const res = [];

      if( !f )
            return dates;

      for( let i = 0; i < dates.length; i++ ){
            if( f( dates[i], month, year ) ){
                  res.push( dates[i] );
            }
      }

      return res;
}

/**
 * 
 * @param {Date} date 
 */
function getMonthName( date ){
      let lang;

      try {
            lang = navigator.language;
      }catch{
            lang = "en-EN";
      }

      return date.toLocaleString(lang, {month: 'long'});

}
/**
 * @param {Date} d 
 * @returns 
 */
const dateKey = d => `${d.getMonth()}x${d.getFullYear()}`
/**
 * @param {{ 
 *    filterFunction?: (day: number, month: number, year: number) => boolean,
 *    mode?: 'default' | 'multiple' | 'range',
 *    onSingleSelection?: (date: Date) => void,
 *    onMultipleSelection?: (date: Date[]) => void,
 * } & { [key: string]: string, }} param0 
 * @returns 
 */
export default function Datepicker({ filterFunction, theme, mode, onMultipleSelection, onSingleSelection, buttonColor, backgroundColor, activeColor, ...other }){
      const t = getComponentTheme( theme );
      const ref = useRestAttributes( other );
      const key = Key.value;
      const scoped = css`
            .container {
                  display: grid;
                  grid-template-columns: repeat(7,40px);
                  gap: 10px;
                  align-items: center;
            }
            .wrapper {
                  display: inline-grid;
                  gap: 20px;
                  align-items: center;
                  padding: 10px;
            }
            .title {
                  display: flex;
                  font-weight: bolder;
                  text-transform: capitalize;
                  justify-content: space-around;
            }
            button {
                  font-size: 24px;
                  border: none;
                  width: 28px;
                  height: 28px;
                  display: inline-flex;
                  justify-content: center;
                  align-items: center;
                  border-radius: 50%;
            }

            button:hover {
                  filter: brightness(70%);
            }
            button:active {
                  filter: brightness(60%);
            }
      `;

      const tmpDate = new Date();
      const date = $signal( new Date() );
      const dates = [];
      /**
       * @type {Map<string,HTMLElement>}
       */
      const selected = new Map();

      /**
       * @type {Map<string,number[]>}
       */
      const memo = new Map();
      let available = filter( date.value.getMonth(), date.value.getFullYear(), filterFunction );
      /**
       * @type {Date}
       */
      let start;

      memo.set( dateKey(date.value), available );


      for( let i = 0; i < 31; i++ ){
            dates.push(i + 1);
      }

      /**
       * @param {1|-1} idx 
       */
      const go = idx => {
            const d = new Date( date.value.getFullYear(), date.value.getMonth() + idx, 1 );

            if( memo.has(dateKey(d)) ){
                  available = memo.get( dateKey( d ) );
            }else{
                  available = filter( date.value.getMonth(), date.value.getFullYear(), filterFunction );
                  memo.set( dateKey(date.value), available );
            }

            date.value = d;
      }
      /**
       * @param {{ target: HTMLElement }} e
       */
      const select = e => {
            const day = parseInt( e.target.innerHTML );

            tmpDate.setDate(day)
            tmpDate.setFullYear( date.value.getFullYear() );
            tmpDate.setMonth( date.value.getMonth() );

            const key = tmpDate.toISOString();


            if( selected.size >= 1 && mode != 'multiple' && mode != 'range' ){
                  const flag = selected.has(key);

                  selected.forEach( v => v.classList.remove('selected') );
                  selected.clear();

                  // click on the same date
                  if( flag )
                        return;

                  onSingleSelection && onSingleSelection( new Date(tmpDate) );
            }else if( mode == 'multiple' && selected.has(key) ){

                  selected.delete( key );
                  e.target.classList.remove('selected');

                  onMultipleSelection && onMultipleSelection( [...selected.keys()].map( v => new Date(v) ));
                  return;
            }else if( mode == 'range' && selected.size > 0  ){
                  

            }
            e.target.classList.add('selected')
            selected.set( 
                  key, 
                  e.target 
            );

            if( mode == 'multiple' || mode == 'range' ){
                  onMultipleSelection && onMultipleSelection( [...selected.keys()].map( v => new Date(v) ));
            }
      }

      /**
       * @param {number} i 
       */
      const cssClassesGenerator = i => {
            tmpDate.setDate(i);
            tmpDate.setFullYear( date.value.getFullYear() );
            tmpDate.setMonth( date.value.getMonth() );

            const key = tmpDate.toISOString();

            return `${available.includes(i) ? 'active': 'inactive'} ${selected.has(key)? 'selected': ''}`
      }

      

      

      return html`
            <style scoped=${scoped}>
                  .wrapper[idx="${key}"] {
                        background-color: ${t.map( theme => theme[backgroundColor || 'backgroundSecondary'] || theme.backgroundSecondary )};

                  }
                  .inactive[idx="${key}"],.active[idx="${key}"] {
                        border-radius: 50%;
                        width: 30px;
                        height: 30px;
                        display: inline-flex;
                        justify-content: center;
                        align-items: center;
                  }

                  .inactive[idx="${key}"]:hover {
                        cursor: default;
                  }
                  .active[idx="${key}"]:hover {
                        cursor: pointer;
                  }
                  .active[idx="${key}"]:hover {
                        background-color: ${t.map( theme => theme[backgroundColor || 'backgroundSecondary'] || theme.backgroundSecondary )};
                  }
                  .inactive[idx="${key}"] {
                        color: ${t.map( theme => theme.textLight )};
                  }
                  .selected[idx="${key}"] {
                        background-color: ${t.map( theme => theme[activeColor || 'primary'] || theme.primary )};
                  }
                  .selected[idx="${key}"]:hover {
                        background-color: ${t.map( theme => theme[activeColor || 'primary'] || theme.primary )};
                        filter: brightness(70%);
                  }

                  button[idx="${key}"] {
                        background-color: ${t.map( theme => theme[buttonColor || 'background'] || theme.background )};
                  }
            </style>
            <div class="wrapper" idx=${key}>
                  <div class="title">
                        <button idx="${key}" ontouchstart="" @click=${() => go(-1)}>‹</button>
                        ${date.map(d => getMonthName(d))} 
                        ${date.map(d => d.getFullYear())}
                        <button idx="${key}" ontouchstart="" @click=${() => go(1)}>›</button>
                  </div>
                  <div class="container" idx="${key}" rest=${ref}>
                        ${date.map(() => 
                              dates.map( i => 
                                    html`
                                    <div idx="${key}" @click=${e => available.includes(i) && select(e)} class=${cssClassesGenerator(i)}>
                                          ${i}
                                    </div>
                                    `
                              )
                        )}
                  </div>
            </div>
      `;
}