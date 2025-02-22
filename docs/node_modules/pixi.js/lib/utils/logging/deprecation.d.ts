/**
 * deprecation name for version 8.0.0
 * @ignore
 */
export declare const v8_0_0 = "8.0.0";
export declare const v8_3_4 = "8.3.4";
/**
 * Helper for warning developers about deprecated features & settings.
 * A stack track for warnings is given; useful for tracking-down where
 * deprecated methods/properties/classes are being used within the code.
 * @memberof utils
 * @ignore
 * @function deprecation
 * @param {string} version - The version where the feature became deprecated
 * @param {string} message - Message should include what is deprecated, where, and the new solution
 * @param {number} [ignoreDepth=3] - The number of steps to ignore at the top of the error stack
 *        this is mostly to ignore internal deprecation calls.
 */
export declare function deprecation(version: string, message: string, ignoreDepth?: number): void;
