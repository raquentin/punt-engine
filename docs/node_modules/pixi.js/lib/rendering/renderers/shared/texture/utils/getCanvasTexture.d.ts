import { CanvasSource } from '../sources/CanvasSource';
import { Texture } from '../Texture';
import type { ICanvas } from '../../../../../environment/canvas/ICanvas';
import type { CanvasSourceOptions } from '../sources/CanvasSource';
export declare function getCanvasTexture(canvas: ICanvas, options?: CanvasSourceOptions): Texture<CanvasSource>;
export declare function hasCachedCanvasTexture(canvas: ICanvas): boolean;
