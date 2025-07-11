export function createState<T extends {}>(state: T): State<T>;
export type Accessor<T extends {}> = <K>(accessor: (t: T) => K) => Effect<K>;
export type Actuator<T extends {}> = <K extends unknown[], X extends T | Promise<T>>(t: T, ...params: K) => X;
export type Mutator<T extends {}> = <K extends unknown[]>(mutator: (t: T, ...params: K) => T | Promise<T>) => (...params: K) => void;
export type Deriver<T extends {}> = <K extends string[]>(...path: K) => State<ValueOf<T, K> extends {}? ValueOf<T, K>: {}>;
export type ValueOf<K extends {}, T extends string[]> = T extends [infer X, ...infer Z]? 
 (X extends keyof K ? 
       (Z extends [string, ...string[]]? 
             (K[X] extends infer O? O extends {}? ValueOf<O,Z>: never: never): 
             K[X]
       )
       : never
 ): 
 (T extends keyof K ? K[T]: never);
export type State<T extends {}> = {
    accessor: Accessor<T>;
    mutator: Mutator<T>;
    derive: Deriver<T>;
};
import Effect from "../docs/core/Signals/Effect.js";
//# sourceMappingURL=store.d.ts.map