import { Filter } from '../Filter';
import type { Texture } from '../../rendering/renderers/shared/texture/Texture';
import type { Sprite } from '../../scene/sprite/Sprite';
import type { FilterOptions } from '../Filter';
import type { FilterSystem } from '../FilterSystem';
export interface MaskFilterOptions extends FilterOptions {
    sprite: Sprite;
    scale?: number | {
        x: number;
        y: number;
    };
}
export declare class MaskFilter extends Filter {
    sprite: Sprite;
    private readonly _textureMatrix;
    constructor(options: MaskFilterOptions);
    apply(filterManager: FilterSystem, input: Texture, output: Texture, clearMode: boolean): void;
}
