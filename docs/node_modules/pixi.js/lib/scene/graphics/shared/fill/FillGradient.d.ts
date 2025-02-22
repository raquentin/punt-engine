import { Matrix } from '../../../../maths/matrix/Matrix';
import { Texture } from '../../../../rendering/renderers/shared/texture/Texture';
import type { ColorSource } from '../../../../color/Color';
export type GradientType = 'linear' | 'radial';
export interface LinearGradientFillStyle {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
    colors: number[];
    stops: number[];
}
export declare class FillGradient implements CanvasGradient {
    static defaultTextureSize: number;
    /** unique id for this fill gradient */
    readonly uid: number;
    readonly type: GradientType;
    x0: number;
    y0: number;
    x1: number;
    y1: number;
    texture: Texture;
    transform: Matrix;
    gradientStops: Array<{
        offset: number;
        color: string;
    }>;
    private _styleKey;
    constructor(x0: number, y0: number, x1: number, y1: number);
    addColorStop(offset: number, color: ColorSource): this;
    buildLinearGradient(): void;
    get styleKey(): string;
}
