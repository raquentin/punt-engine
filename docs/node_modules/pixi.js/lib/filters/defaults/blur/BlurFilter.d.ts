import { Filter } from '../../Filter';
import { BlurFilterPass } from './BlurFilterPass';
import type { RenderSurface } from '../../../rendering/renderers/shared/renderTarget/RenderTargetSystem';
import type { Texture } from '../../../rendering/renderers/shared/texture/Texture';
import type { FilterOptions } from '../../Filter';
import type { FilterSystem } from '../../FilterSystem';
/**
 * Options for BlurFilter
 * @memberof filters
 */
export interface BlurFilterOptions extends FilterOptions {
    /**
     * The strength of the blur filter.
     * @default 8
     */
    strength?: number;
    /**
     * The horizontal strength of the blur.
     * @default 8
     */
    strengthX?: number;
    /**
     * The vertical strength of the blur.
     * @default 8
     */
    strengthY?: number;
    /**
     * The quality of the blur filter.
     * @default 4
     */
    quality?: number;
    /**
     * The kernelSize of the blur filter.Options: 5, 7, 9, 11, 13, 15.
     * @default 5
     */
    kernelSize?: number;
}
/**
 * The BlurFilter applies a Gaussian blur to an object.
 *
 * The strength of the blur can be set for the x-axis and y-axis separately.
 * @memberof filters
 */
export declare class BlurFilter extends Filter {
    /** Default blur filter options */
    static defaultOptions: Partial<BlurFilterOptions>;
    /** The horizontal blur filter */
    blurXFilter: BlurFilterPass;
    /** The vertical blur filter */
    blurYFilter: BlurFilterPass;
    private _repeatEdgePixels;
    /**
     * @param {filters.BlurFilterOptions} options - The options of the blur filter.
     */
    constructor(options?: BlurFilterOptions);
    /** @deprecated since 8.0.0 */
    constructor(strength?: number, quality?: number, resolution?: number | null, kernelSize?: number);
    /**
     * Applies the filter.
     * @param filterManager - The manager.
     * @param input - The input target.
     * @param output - The output target.
     * @param clearMode - How to clear
     */
    apply(filterManager: FilterSystem, input: Texture, output: RenderSurface, clearMode: boolean): void;
    protected updatePadding(): void;
    /**
     * Sets the strength of both the blurX and blurY properties simultaneously
     * @default 8
     */
    get strength(): number;
    set strength(value: number);
    /**
     * Sets the number of passes for blur. More passes means higher quality bluring.
     * @default 1
     */
    get quality(): number;
    set quality(value: number);
    /**
     * Sets the strength of horizontal blur
     * @default 8
     */
    get strengthX(): number;
    set strengthX(value: number);
    /**
     * Sets the strength of the vertical blur
     * @default 8
     */
    get strengthY(): number;
    set strengthY(value: number);
    /**
     * Sets the strength of both the blurX and blurY properties simultaneously
     * @default 2
     * @deprecated since 8.3.0
     * @see BlurFilter.strength
     */
    get blur(): number;
    set blur(value: number);
    /**
     * Sets the strength of the blurX property
     * @default 2
     * @deprecated since 8.3.0
     * @see BlurFilter.strengthX
     */
    get blurX(): number;
    set blurX(value: number);
    /**
     * Sets the strength of the blurY property
     * @default 2
     * @deprecated since 8.3.0
     * @see BlurFilter.strengthY
     */
    get blurY(): number;
    set blurY(value: number);
    /**
     * If set to true the edge of the target will be clamped
     * @default false
     */
    get repeatEdgePixels(): boolean;
    set repeatEdgePixels(value: boolean);
}
