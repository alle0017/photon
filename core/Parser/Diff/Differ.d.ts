import ConcreteNode from "../Nodes/ConcreteNode";
import VNode from "../Nodes/VNode";

export default interface Differ {
      /**
       * Compare two trees and return the different nodes
       * @param {VNode<ConcreteNode>[]} oldTree 
       * @param {VNode<ConcreteNode>[]} newTree 
       * @returns map that has as key the index in old tree that contains the difference,
       * and as value the new node that should be inserted in the old tree at the same index
       */
      getDifference: ( oldTree: VNode<ConcreteNode>[], newTree: VNode<ConcreteNode>[] ) => Map<number,VNode<ConcreteNode>>;
}