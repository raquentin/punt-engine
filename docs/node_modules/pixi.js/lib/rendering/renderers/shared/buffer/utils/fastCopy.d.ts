/**
 * Copies from one buffer to another.
 * This is an optimised function that will use `Float64Array` window.
 * This means it can copy twice as fast!
 * @param sourceBuffer - the array buffer to copy from
 * @param destinationBuffer - the array buffer to copy to
 * @private
 */
export declare function fastCopy(sourceBuffer: ArrayBuffer, destinationBuffer: ArrayBuffer): void;
