import { Rectangle } from '../../maths/shapes/Rectangle';
import type { ICanvas } from '../../environment/canvas/ICanvas';
/**
 * Measuring the bounds of a canvas' visible (non-transparent) pixels.
 * @param canvas - The canvas to measure.
 * @param resolution - The resolution of the canvas.
 * @returns The bounding box of the canvas' visible pixels.
 * @since 7.1.0
 * @memberof utils
 */
export declare function getCanvasBoundingBox(canvas: ICanvas, resolution?: number): Rectangle;
