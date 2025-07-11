import { Parent } from "../View/Renderer";
interface TokenList {
      add( ...args: string[] ): void
      remove( ...args: string[] ): void;
}

/**
 * class that represent a node that can hold events and 
 * that has attributes. it respect the DOM representation, 
 * but is preferred for portability the use of this interface
 */
export default interface ConcreteNode extends Parent {
      addEventListener: ( event: string, callback: Function ) => void;
      setAttribute: ( name: string, value: string ) => void;
      classList: TokenList;
}