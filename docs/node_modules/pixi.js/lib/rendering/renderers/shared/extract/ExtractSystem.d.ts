import { ExtensionType } from '../../../../extensions/Extensions';
import { Container } from '../../../../scene/container/Container';
import { Texture } from '../texture/Texture';
import type { ColorSource } from '../../../../color/Color';
import type { ICanvas } from '../../../../environment/canvas/ICanvas';
import type { Rectangle } from '../../../../maths/shapes/Rectangle';
import type { Renderer } from '../../types';
import type { System } from '../system/System';
import type { GetPixelsOutput } from '../texture/GenerateCanvas';
declare const imageTypes: {
    png: string;
    jpg: string;
    webp: string;
};
type Formats = keyof typeof imageTypes;
/**
 * Options for creating an image from a renderer.
 * @memberof rendering
 */
export interface ImageOptions {
    /** The format of the image. */
    format?: Formats;
    /** The quality of the image. */
    quality?: number;
}
/**
 * Options for extracting content from a renderer.
 * @memberof rendering
 */
export interface BaseExtractOptions {
    /** The target to extract. */
    target: Container | Texture;
    /** The region of the target to extract. */
    frame?: Rectangle;
    /** The resolution of the extracted content. */
    resolution?: number;
    /** The color used to clear the extracted content. */
    clearColor?: ColorSource;
    /** Whether to enable anti-aliasing. This may affect performance. */
    antialias?: boolean;
}
/**
 * Options for extracting an HTMLImage from the renderer.
 * @memberof rendering
 */
export type ExtractImageOptions = BaseExtractOptions & ImageOptions;
/**
 * Options for extracting and downloading content from a renderer.
 * @memberof rendering
 */
export type ExtractDownloadOptions = BaseExtractOptions & {
    /** The filename to use when downloading the content. */
    filename: string;
};
/**
 * Options for extracting content from a renderer.
 * @memberof rendering
 */
export type ExtractOptions = BaseExtractOptions | ExtractImageOptions | ExtractDownloadOptions;
/**
 * This class provides renderer-specific plugins for exporting content from a renderer.
 * For instance, these plugins can be used for saving an Image, Canvas element or for exporting the raw image data (pixels).
 *
 * Do not instantiate these plugins directly. It is available from the `renderer.extract` property.
 * @example
 * import { Application, Graphics } from 'pixi.js';
 *
 * // Create a new application (extract will be auto-added to renderer)
 * const app = new Application();
 * await app.init();
 *
 * // Draw a red circle
 * const graphics = new Graphics()
 *     .circle(0, 0, 50);
 *     .fill(0xFF0000)
 *
 * // Render the graphics as an HTMLImageElement
 * const image = await app.renderer.extract.image(graphics);
 * document.body.appendChild(image);
 * @memberof rendering
 */
export declare class ExtractSystem implements System {
    /** @ignore */
    static extension: {
        readonly type: readonly [ExtensionType.WebGLSystem, ExtensionType.WebGPUSystem];
        readonly name: "extract";
    };
    /** Default options for creating an image. */
    static defaultImageOptions: ImageOptions;
    private _renderer;
    /** @param renderer - The renderer this System works for. */
    constructor(renderer: Renderer);
    private _normalizeOptions;
    /**
     * Will return a HTML Image of the target
     * @param options - The options for creating the image, or the target to extract
     * @returns - HTML Image of the target
     */
    image(options: ExtractImageOptions | Container | Texture): Promise<HTMLImageElement>;
    /**
     * Will return a base64 encoded string of this target. It works by calling
     * `Extract.canvas` and then running toDataURL on that.
     * @param options - The options for creating the image, or the target to extract
     */
    base64(options: ExtractImageOptions | Container | Texture): Promise<string>;
    /**
     * Creates a Canvas element, renders this target to it and then returns it.
     * @param options - The options for creating the canvas, or the target to extract
     * @returns - A Canvas element with the texture rendered on.
     */
    canvas(options: ExtractOptions | Container | Texture): ICanvas;
    /**
     * Will return a one-dimensional array containing the pixel data of the entire texture in RGBA
     * order, with integer values between 0 and 255 (included).
     * @param options - The options for extracting the image, or the target to extract
     * @returns - One-dimensional array containing the pixel data of the entire texture
     */
    pixels(options: ExtractOptions | Container | Texture): GetPixelsOutput;
    /**
     * Will return a texture of the target
     * @param options - The options for creating the texture, or the target to extract
     * @returns - A texture of the target
     */
    texture(options: ExtractOptions | Container | Texture): Texture;
    /**
     * Will extract a HTMLImage of the target and download it
     * @param options - The options for downloading and extracting the image, or the target to extract
     */
    download(options: ExtractDownloadOptions | Container | Texture): void;
    /**
     * Logs the target to the console as an image. This is a useful way to debug what's happening in the renderer.
     * @param options - The options for logging the image, or the target to log
     */
    log(options: (ExtractOptions & {
        width?: number;
    }) | Container | Texture): void;
    destroy(): void;
}
export {};
