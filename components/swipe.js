import { html } from "../core/index.js";
/**
 * @param {{ onSwipe: ( direction: 'up' | 'down' | 'left' | 'right' ) => void }} param0 
 */
export function Swipe({ onSwipe }){
      const isNotTouchEvt = e => !('touches' in e) || !('length' in e.touches) || e.touches <= 0 || !('clientX' in e.touches[0]) || !('clientY' in e.touches[0]);
      let xi;
      let xf;
      let yi;
      let yf;
      return html`
            <span @touchstart=${e => { 
                  if( isNotTouchEvt( e ) )
                        return;

                  xi = e.touches[0].clientX;
                  yi = e.touches[0].clientY;
            }} @touchmove=${e => {
                  if( isNotTouchEvt( e ) )
                        return;

                  xf = e.touches[0].clientX;
                  yf = e.touches[0].clientY;

                  const dx = xf - xi;
                  const dy = yf - yi;

                  if( Math.abs( dx ) > Math.abs( dy ) ){
                        if( dx > 0 ){
                              onSwipe && onSwipe('right')
                        }else{
                              // left
                              onSwipe && onSwipe('left')
                        }
                  }else{
                        if( dy > 0 ){
                              // down
                              onSwipe && onSwipe('down')
                        }else{
                              // up
                              onSwipe && onSwipe('up')
                        }
                  }
            }}>
                  <Children/>
            </span>
      `
}