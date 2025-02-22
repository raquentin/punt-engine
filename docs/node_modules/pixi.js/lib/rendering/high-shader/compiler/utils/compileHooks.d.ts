export declare const findHooksRx: RegExp;
/**
 * takes a program string and returns an hash mapping the hooks to empty arrays
 * @param programSrc - the program containing hooks
 */
export declare function compileHooks(programSrc: string): Record<string, string[]>;
