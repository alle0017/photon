/**@import {Node} from "./Notifier.js" */
export default class Exception {
    /**
     * @type {List<(e: Error) => void>}
     */
    static "__#2@#subs": List<(e: Error) => void>;
    /**
     * @type {Node<Error>}
     */
    static "__#2@#queue": any;
    /**
     * @type {Node<Error>}
     */
    static "__#2@#tail": any;
    static notify(): void;
    /**
     * handler used to catch any exception
     * that happens during app
     * execution
     * @param {(e: Error) => void} sub
     */
    static catch(sub: (e: Error) => void): () => void;
    /**
     * add an error to the queue. must
     * be used in combination with {@link Exception.notify}
     * to notify all subscribers that an error happened
     * @param {Error} error
     */
    static throw(error: Error): void;
}
import List from "../Util/List.js";
//# sourceMappingURL=Exception.d.ts.map