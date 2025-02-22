import { TextureSource } from './TextureSource';
import type { ICanvas } from '../../../../../environment/canvas/ICanvas';
import type { ExtensionMetadata } from '../../../../../extensions/Extensions';
import type { TextureSourceOptions } from './TextureSource';
export interface CanvasSourceOptions extends TextureSourceOptions<ICanvas> {
    /** should the canvas be resized to preserve its screen width and height regardless of the resolution of the renderer */
    autoDensity?: boolean;
    /** if true, this canvas will be set up to be transparent where possible */
    transparent?: boolean;
}
export declare class CanvasSource extends TextureSource<ICanvas> {
    static extension: ExtensionMetadata;
    uploadMethodId: string;
    autoDensity: boolean;
    transparent: boolean;
    private _context2D;
    constructor(options: CanvasSourceOptions);
    resizeCanvas(): void;
    resize(width?: number, height?: number, resolution?: number): boolean;
    static test(resource: any): resource is ICanvas;
    /**
     * Returns the 2D rendering context for the canvas.
     * Caches the context after creating it.
     * @returns The 2D rendering context of the canvas.
     */
    get context2D(): CanvasRenderingContext2D;
}
