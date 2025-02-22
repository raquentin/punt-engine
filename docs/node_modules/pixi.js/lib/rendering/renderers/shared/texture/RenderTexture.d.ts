import { Texture } from './Texture';
import type { TextureSourceOptions } from './sources/TextureSource';
/**
 * A render texture, extends `Texture`.
 * @see {@link rendering.Texture}
 * @memberof rendering
 */
export declare class RenderTexture extends Texture {
    static create(options: TextureSourceOptions): RenderTexture;
    /**
     * Resizes the render texture.
     * @param width - The new width of the render texture.
     * @param height - The new height of the render texture.
     * @param resolution - The new resolution of the render texture.
     * @returns This texture.
     */
    resize(width: number, height: number, resolution?: number): this;
}
