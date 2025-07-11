export default class Out {
      static debug = false;

      /**
       * @param  {...unknown} args 
       * @returns 
       */
      static log( ...args ){
            if( !this.debug )
                  return;
            console.log( '[UI Logger]', ...args );
      }

      /**
       * @param  {...unknown} args 
       * @returns 
       */
      static internalError( ...args ){
            if( !this.debug )
                  return;
            console.log( '%c[UI Logger::internalErrorLog]', 'color: #ff9d52;', ...args,  );
      }

      /**
       * @param  {...unknown} args 
       * @returns 
       */
      static error( ...args ){
            if( !this.debug )
                  return;
            console.error( '[UI Logger::errorLog]', ...args,  );
      }
} 