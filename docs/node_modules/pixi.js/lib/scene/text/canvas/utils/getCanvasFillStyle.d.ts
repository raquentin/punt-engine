import type { ICanvasRenderingContext2D } from '../../../../environment/canvas/ICanvasRenderingContext2D';
import type { ConvertedFillStyle } from '../../../graphics/shared/FillTypes';
export declare function getCanvasFillStyle(fillStyle: ConvertedFillStyle, context: ICanvasRenderingContext2D): string | CanvasGradient | CanvasPattern;
