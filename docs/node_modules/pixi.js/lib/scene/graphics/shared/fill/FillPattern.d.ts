import { Matrix } from '../../../../maths/matrix/Matrix';
import type { Texture } from '../../../../rendering/renderers/shared/texture/Texture';
export type PatternRepetition = 'repeat' | 'repeat-x' | 'repeat-y' | 'no-repeat';
export declare class FillPattern implements CanvasPattern {
    /** unique id for this fill pattern */
    readonly uid: number;
    texture: Texture;
    transform: Matrix;
    private _styleKey;
    constructor(texture: Texture, repetition?: PatternRepetition);
    setTransform(transform?: Matrix): void;
    get styleKey(): string;
}
