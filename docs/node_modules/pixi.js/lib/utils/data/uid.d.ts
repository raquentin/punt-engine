type UIDNames = 'default' | 'resource' | 'texture' | 'textureSource' | 'textureResource' | 'batcher' | 'graphicsContext' | 'graphicsView' | 'graphicsPath' | 'fillGradient' | 'fillPattern' | 'meshView' | 'renderable' | 'buffer' | 'bufferResource' | 'geometry' | 'instructionSet' | 'renderTarget' | 'uniform' | 'spriteView' | 'textView' | 'tilingSpriteView';
/**
 * Gets the next unique identifier
 * @param name - The name of the identifier.
 * @function uid
 * @returns {number} The next unique identifier to use.
 * @memberof utils
 */
export declare function uid(name?: UIDNames): number;
/** Resets the next unique identifier to 0. This is used for some tests, dont touch or things WILL explode :) */
export declare function resetUids(): void;
export {};
