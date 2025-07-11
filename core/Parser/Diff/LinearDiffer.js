/**@import ConcreteNode from "../Nodes/ConcreteNode";*/
/**@import VNode from "../Nodes/VNode";*/

/**
 * class that implements diffing between
 * two trees by checking index by index.
 */
export default class LinearDiffer {
      /**
       * Compare two trees index by index
       * @param {VNode<ConcreteNode>[]} oldTree 
       * @param {VNode<ConcreteNode>[]} newTree 
       * @returns map that has as key the index in old tree that contains the difference,
       * and as value the new node that should be inserted in the old tree at the same index
       */
      static getDifference( oldTree, newTree ) {
            const diff = new Map();
            const min = Math.min( oldTree.length, newTree.length );

            for( let i = 0; i < min; i++ ){

                  const oldNode = oldTree[i];
                  const newNode = newTree[i];

                  if( !oldNode.equals( newNode ) ){
                        diff.set(i, newNode);
                  }
            }   

            return diff;
      }
}