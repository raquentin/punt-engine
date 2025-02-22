import { ExtensionType } from '../../../../extensions/Extensions';
import { Texture } from '../../shared/texture/Texture';
import { GlTexture } from './GlTexture';
import type { ICanvas } from '../../../../environment/canvas/ICanvas';
import type { System } from '../../shared/system/System';
import type { CanvasGenerator, GetPixelsOutput } from '../../shared/texture/GenerateCanvas';
import type { TextureSource } from '../../shared/texture/sources/TextureSource';
import type { BindableTexture } from '../../shared/texture/Texture';
import type { GlRenderingContext } from '../context/GlRenderingContext';
import type { WebGLRenderer } from '../WebGLRenderer';
/**
 * The system for managing textures in WebGL.
 * @memberof rendering
 */
export declare class GlTextureSystem implements System, CanvasGenerator {
    /** @ignore */
    static extension: {
        readonly type: readonly [ExtensionType.WebGLSystem];
        readonly name: "texture";
    };
    readonly managedTextures: TextureSource[];
    private readonly _renderer;
    private _glTextures;
    private _glSamplers;
    private _boundTextures;
    private _activeTextureLocation;
    private _boundSamplers;
    private readonly _uploads;
    private _gl;
    private _mapFormatToInternalFormat;
    private _mapFormatToType;
    private _mapFormatToFormat;
    private readonly _useSeparateSamplers;
    constructor(renderer: WebGLRenderer);
    protected contextChange(gl: GlRenderingContext): void;
    initSource(source: TextureSource): void;
    bind(texture: BindableTexture, location?: number): void;
    bindSource(source: TextureSource, location?: number): void;
    private _bindSampler;
    unbind(texture: BindableTexture): void;
    private _activateLocation;
    private _initSource;
    protected onStyleChange(source: TextureSource): void;
    protected updateStyle(source: TextureSource, firstCreation: boolean): void;
    protected onSourceUnload(source: TextureSource): void;
    protected onSourceUpdate(source: TextureSource): void;
    protected onUpdateMipmaps(source: TextureSource, bind?: boolean): void;
    protected onSourceDestroy(source: TextureSource): void;
    private _initSampler;
    private _getGlSampler;
    getGlSource(source: TextureSource): GlTexture;
    generateCanvas(texture: Texture): ICanvas;
    getPixels(texture: Texture): GetPixelsOutput;
    destroy(): void;
}
