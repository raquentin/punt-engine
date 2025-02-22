import type { TextureSourceOptions } from '../../../../rendering/renderers/shared/texture/sources/TextureSource';
import type { Texture } from '../../../../rendering/renderers/shared/texture/Texture';
import type { ResolvedAsset } from '../../../types';
import type { LoaderParser } from '../LoaderParser';
/**
 * Configuration for the [loadTextures]{@link assets.loadTextures} plugin.
 * @see assets.loadTextures
 * @memberof assets
 */
export interface LoadTextureConfig {
    /**
     * When set to `true`, loading and decoding images will happen with Worker thread,
     * if available on the browser. This is much more performant as network requests
     * and decoding can be expensive on the CPU. However, not all environments support
     * Workers, in some cases it can be helpful to disable by setting to `false`.
     * @default true
     */
    preferWorkers: boolean;
    /**
     * When set to `true`, loading and decoding images will happen with `createImageBitmap`,
     * otherwise it will use `new Image()`.
     * @default true
     */
    preferCreateImageBitmap: boolean;
    /**
     * The crossOrigin value to use for images when `preferCreateImageBitmap` is `false`.
     * @default 'anonymous'
     */
    crossOrigin: HTMLImageElement['crossOrigin'];
}
/**
 * Returns a promise that resolves an ImageBitmaps.
 * This function is designed to be used by a worker.
 * Part of WorkerManager!
 * @param url - The image to load an image bitmap for
 * @ignore
 */
export declare function loadImageBitmap(url: string, asset?: ResolvedAsset<TextureSourceOptions<any>>): Promise<ImageBitmap>;
/**
 * A simple plugin to load our textures!
 * This makes use of imageBitmaps where available.
 * We load the `ImageBitmap` on a different thread using workers if possible.
 * We can then use the `ImageBitmap` as a source for a Pixi texture
 *
 * You can customize the behavior of this loader by setting the `config` property.
 * Which can be found [here]{@link assets.LoadTextureConfig}
 * ```js
 * // Set the config
 * import { loadTextures } from 'pixi.js';
 *
 * loadTextures.config = {
 *    // If true we will use a worker to load the ImageBitmap
 *    preferWorkers: true,
 *    // If false we will use new Image() instead of createImageBitmap,
 *    // we'll also disable the use of workers as it requires createImageBitmap
 *    preferCreateImageBitmap: true,
 *    crossOrigin: 'anonymous',
 * };
 * ```
 * @memberof assets
 */
export declare const loadTextures: LoaderParser<Texture, TextureSourceOptions, LoadTextureConfig>;
