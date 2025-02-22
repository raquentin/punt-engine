import { Point } from '../../../maths/point/Point';
import { Sprite } from '../../../scene/sprite/Sprite';
import { Filter } from '../../Filter';
import type { PointData } from '../../../maths/point/PointData';
import type { Texture } from '../../../rendering/renderers/shared/texture/Texture';
import type { FilterOptions } from '../../Filter';
import type { FilterSystem } from '../../FilterSystem';
/**
 * Options for DisplacementFilter
 * @memberof filters
 */
export interface DisplacementFilterOptions extends FilterOptions {
    /** The texture used for the displacement map. */
    sprite: Sprite;
    /** The scale of the displacement. */
    scale?: number | PointData;
}
/**
 * A Noise effect filter.
 *
 * original filter: https://github.com/evanw/glfx.js/blob/master/src/filters/adjust/noise.js
 * @memberof filters
 * @author Vico @vicocotea
 */
export declare class DisplacementFilter extends Filter {
    private readonly _sprite;
    /**
     * **Note:** Our docs parser struggles to properly understand the constructor signature.
     * This is the correct signature.
     * ```ts
     * new DisplacementFilter(options?: DisplacementFilterOptions);
     * ```
     * @param options - The options for the filter.
     * @param options.sprite - The texture used for the displacement map.
     * @param options.scale - The scale of the displacement.
     */
    constructor(options: Sprite | DisplacementFilterOptions);
    constructor(sprite: Sprite, scale?: number | PointData);
    /**
     * Applies the filter.
     * @param filterManager - The manager.
     * @param input - The input target.
     * @param output - The output target.
     * @param clearMode - clearMode.
     */
    apply(filterManager: FilterSystem, input: Texture, output: Texture, clearMode: boolean): void;
    /** scaleX, scaleY for displacements */
    get scale(): Point;
}
