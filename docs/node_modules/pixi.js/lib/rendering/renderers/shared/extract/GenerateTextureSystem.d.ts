import { type ColorSource } from '../../../../color/Color';
import { ExtensionType } from '../../../../extensions/Extensions';
import { Rectangle } from '../../../../maths/shapes/Rectangle';
import { Container } from '../../../../scene/container/Container';
import { RenderTexture } from '../texture/RenderTexture';
import type { Renderer } from '../../types';
import type { System } from '../system/System';
import type { TextureSourceOptions } from '../texture/sources/TextureSource';
export type GenerateTextureSourceOptions = Omit<TextureSourceOptions, 'resource' | 'width' | 'height' | 'resolution'>;
/**
 * Options for generating a texture from a container.
 * @memberof rendering
 */
export type GenerateTextureOptions = {
    /** The container to generate the texture from */
    target: Container;
    /**
     * The region of the container, that shall be rendered,
     * if no region is specified, defaults to the local bounds of the container.
     */
    frame?: Rectangle;
    /** The resolution of the texture being generated. */
    resolution?: number;
    /** The color used to clear the texture. */
    clearColor?: ColorSource;
    /** Whether to enable anti-aliasing. This may affect performance. */
    antialias?: boolean;
    /** The options passed to the texture source. */
    textureSourceOptions?: GenerateTextureSourceOptions;
};
/**
 * System that manages the generation of textures from the renderer
 *
 *
 * Do not instantiate these plugins directly. It is available from the `renderer.textureGenerator` property.
 * @memberof rendering
 */
export declare class GenerateTextureSystem implements System {
    /** @ignore */
    static extension: {
        readonly type: readonly [ExtensionType.WebGLSystem, ExtensionType.WebGPUSystem];
        readonly name: "textureGenerator";
    };
    private readonly _renderer;
    constructor(renderer: Renderer);
    /**
     * A Useful function that returns a texture of the display object that can then be used to create sprites
     * This can be quite useful if your container is complicated and needs to be reused multiple times.
     * @param {GenerateTextureOptions | Container} options - Generate texture options.
     * @param {Container} [options.container] - If not given, the renderer's resolution is used.
     * @param {Rectangle} options.region - The region of the container, that shall be rendered,
     * @param {number} [options.resolution] - The resolution of the texture being generated.
     *        if no region is specified, defaults to the local bounds of the container.
     * @param {GenerateTextureSourceOptions} [options.textureSourceOptions] - Texture options for GPU.
     * @returns a shiny new texture of the container passed in
     */
    generateTexture(options: GenerateTextureOptions | Container): RenderTexture;
    destroy(): void;
}
