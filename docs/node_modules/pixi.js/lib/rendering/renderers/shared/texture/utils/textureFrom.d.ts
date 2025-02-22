import { TextureSource } from '../sources/TextureSource';
import { Texture } from '../Texture';
import type { BufferSourceOptions } from '../sources/BufferImageSource';
import type { CanvasSourceOptions } from '../sources/CanvasSource';
import type { ImageResource } from '../sources/ImageSource';
import type { TextureSourceOptions } from '../sources/TextureSource';
import type { TextureSourceLike } from '../Texture';
export type TextureResourceOrOptions = ImageResource | TextureSourceOptions<ImageResource> | BufferSourceOptions | CanvasSourceOptions;
/**
 * @param options
 * @deprecated since v8.2.0
 * @see TextureSource.from
 */
export declare function autoDetectSource(options?: TextureResourceOrOptions): TextureSource;
export declare function resourceToTexture(options?: TextureResourceOrOptions, skipCache?: boolean): Texture;
/**
 * Helper function that creates a returns Texture based on the source you provide.
 * The source should be loaded and ready to go. If not its best to grab the asset using Assets.
 * @param id - String or Source to create texture from
 * @param skipCache - Skip adding the texture to the cache
 * @returns The texture based on the Id provided
 */
export declare function textureFrom(id: TextureSourceLike, skipCache?: boolean): Texture;
