export interface Parent<T = any> {
      appendChild(child: T): T;
      removeChild(child: T): void;
      parentNode: T | null;
      replaceChild(node: T, newNode: T): void;
      after(node: T): void;
}
export default interface Renderer<T extends Parent> {
      createElement: ( tag: string ) => T;
      createRoot: () => T;
}