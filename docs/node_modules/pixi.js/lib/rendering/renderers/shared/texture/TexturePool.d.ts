import { TextureSource } from './sources/TextureSource';
import { Texture } from './Texture';
import type { TextureSourceOptions } from './sources/TextureSource';
/**
 * Texture pool, used by FilterSystem and plugins.
 *
 * Stores collection of temporary pow2 or screen-sized renderTextures
 *
 * If you use custom RenderTexturePool for your filters, you can use methods
 * `getFilterTexture` and `returnFilterTexture` same as in default pool
 * @memberof rendering
 * @name TexturePool
 */
export declare class TexturePoolClass {
    /** The default options for texture pool */
    textureOptions: TextureSourceOptions;
    /**
     * Allow renderTextures of the same size as screen, not just pow2
     *
     * Automatically sets to true after `setScreenSize`
     * @default false
     */
    enableFullScreen: boolean;
    private _texturePool;
    private _poolKeyHash;
    /**
     * @param textureOptions - options that will be passed to BaseRenderTexture constructor
     * @param {SCALE_MODE} [textureOptions.scaleMode] - See {@link SCALE_MODE} for possible values.
     */
    constructor(textureOptions?: TextureSourceOptions);
    /**
     * Creates texture with params that were specified in pool constructor.
     * @param pixelWidth - Width of texture in pixels.
     * @param pixelHeight - Height of texture in pixels.
     * @param antialias
     */
    createTexture(pixelWidth: number, pixelHeight: number, antialias: boolean): Texture;
    /**
     * Gets a Power-of-Two render texture or fullScreen texture
     * @param frameWidth - The minimum width of the render texture.
     * @param frameHeight - The minimum height of the render texture.
     * @param resolution - The resolution of the render texture.
     * @param antialias
     * @returns The new render texture.
     */
    getOptimalTexture(frameWidth: number, frameHeight: number, resolution: number, antialias: boolean): Texture;
    /**
     * Gets extra texture of the same size as input renderTexture
     * @param texture - The texture to check what size it is.
     * @param antialias - Whether to use antialias.
     * @returns A texture that is a power of two
     */
    getSameSizeTexture(texture: Texture, antialias?: boolean): Texture<TextureSource<any>>;
    /**
     * Place a render texture back into the pool.
     * @param renderTexture - The renderTexture to free
     */
    returnTexture(renderTexture: Texture): void;
    /**
     * Clears the pool.
     * @param destroyTextures - Destroy all stored textures.
     */
    clear(destroyTextures?: boolean): void;
}
export declare const TexturePool: TexturePoolClass;
