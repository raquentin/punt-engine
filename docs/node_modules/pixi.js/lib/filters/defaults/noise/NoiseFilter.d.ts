import { Filter } from '../../Filter';
import type { FilterOptions } from '../../Filter';
/**
 * Options for NoiseFilter
 * @memberof filters
 */
export interface NoiseFilterOptions extends FilterOptions {
    /** The amount of noise to apply, this value should be in the range (0, 1]. */
    noise?: number;
    /** A seed value to apply to the random noise generation. `Math.random()` is a good value to use. */
    seed?: number;
}
/**
 * A Noise effect filter.
 *
 * original filter: https://github.com/evanw/glfx.js/blob/master/src/filters/adjust/noise.js
 * @memberof filters
 * @author Vico @vicocotea
 */
export declare class NoiseFilter extends Filter {
    static readonly defaultOptions: NoiseFilterOptions;
    /**
     * @param options - The options of the noise filter.
     */
    constructor(options?: NoiseFilterOptions);
    /**
     * The amount of noise to apply, this value should be in the range (0, 1].
     * @default 0.5
     */
    get noise(): number;
    set noise(value: number);
    /** A seed value to apply to the random noise generation. `Math.random()` is a good value to use. */
    get seed(): number;
    set seed(value: number);
}
