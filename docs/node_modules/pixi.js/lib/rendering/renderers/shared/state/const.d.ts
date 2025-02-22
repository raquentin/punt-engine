/**
 * Various blend modes supported by Pixi
 * @memberof filters
 */
export type BLEND_MODES = 'inherit' | 'normal' | 'add' | 'multiply' | 'screen' | 'darken' | 'lighten' | 'erase' | 'color-dodge' | 'color-burn' | 'linear-burn' | 'linear-dodge' | 'linear-light' | 'hard-light' | 'soft-light' | 'pin-light' | 'difference' | 'exclusion' | 'overlay' | 'saturation' | 'color' | 'luminosity' | 'normal-npm' | 'add-npm' | 'screen-npm' | 'none' | 'subtract' | 'divide' | 'vivid-light' | 'hard-mix' | 'negation' | 'min' | 'max';
/**
 * The map of blend modes supported by Pixi
 * @memberof rendering
 */
export declare const BLEND_TO_NPM: {
    normal: string;
    add: string;
    screen: string;
};
/**
 * The stencil operation to perform when using the stencil buffer
 * @memberof rendering
 */
export declare enum STENCIL_MODES {
    DISABLED = 0,
    RENDERING_MASK_ADD = 1,
    MASK_ACTIVE = 2,
    RENDERING_MASK_REMOVE = 3,
    NONE = 4
}
/**
 * The culling mode to use. It can be either `none`, `front` or `back`.
 * @memberof rendering
 */
export type CULL_MODES = 'none' | 'back' | 'front';
