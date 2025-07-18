type Unsubscriber = () => void;

export default interface Notifier<T> {
      subscribe: ( callback: ( value: T ) => void ) => Unsubscriber;
}

export type Node<T> = {
      value: T,
      next: Node<T>
}

type ValueOf<K extends {}, T extends string[]> = 
T extends [infer X, ...infer Z]? 
      (X extends keyof K ? 
            (Z extends string[]? 
                  (ValueOf<K[X] extends infer T? T: never, Z>): 
                  K[X]
            )
            :never
      ): 
      never