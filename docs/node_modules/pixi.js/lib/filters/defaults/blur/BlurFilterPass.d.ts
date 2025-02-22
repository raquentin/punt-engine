import { Filter } from '../../Filter';
import type { RenderSurface } from '../../../rendering/renderers/shared/renderTarget/RenderTargetSystem';
import type { Texture } from '../../../rendering/renderers/shared/texture/Texture';
import type { FilterSystem } from '../../FilterSystem';
import type { BlurFilterOptions } from './BlurFilter';
/**
 * Options for BlurFilterPass
 * @memberof filters
 */
export interface BlurFilterPassOptions extends BlurFilterOptions {
    /** Do pass along the x-axis (`true`) or y-axis (`false`). */
    horizontal: boolean;
}
/**
 * The BlurFilterPass applies a horizontal or vertical Gaussian blur to an object.
 * @memberof filters
 */
export declare class BlurFilterPass extends Filter {
    /** Default blur filter pass options */
    static defaultOptions: Partial<BlurFilterPassOptions>;
    /** Do pass along the x-axis (`true`) or y-axis (`false`). */
    horizontal: boolean;
    /** The number of passes to run the filter. */
    passes: number;
    /** The strength of the blur filter. */
    strength: number;
    private _quality;
    private readonly _uniforms;
    /**
     * @param options
     * @param options.horizontal - Do pass along the x-axis (`true`) or y-axis (`false`).
     * @param options.strength - The strength of the blur filter.
     * @param options.quality - The quality of the blur filter.
     * @param options.kernelSize - The kernelSize of the blur filter.Options: 5, 7, 9, 11, 13, 15.
     */
    constructor(options: BlurFilterPassOptions);
    /**
     * Applies the filter.
     * @param filterManager - The manager.
     * @param input - The input target.
     * @param output - The output target.
     * @param clearMode - How to clear
     */
    apply(filterManager: FilterSystem, input: Texture, output: RenderSurface, clearMode: boolean): void;
    /**
     * Sets the strength of both the blur.
     * @default 16
     */
    get blur(): number;
    set blur(value: number);
    /**
     * Sets the quality of the blur by modifying the number of passes. More passes means higher
     * quality blurring but the lower the performance.
     * @default 4
     */
    get quality(): number;
    set quality(value: number);
}
