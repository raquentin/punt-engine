import { ExtensionType } from '../../extensions/Extensions';
import { Texture } from '../../rendering/renderers/shared/texture/Texture';
import { BatchableSprite } from '../sprite/BatchableSprite';
import type { InstructionSet } from '../../rendering/renderers/shared/instructions/InstructionSet';
import type { RenderPipe } from '../../rendering/renderers/shared/instructions/RenderPipe';
import type { Renderer } from '../../rendering/renderers/types';
import type { HTMLText } from './HTMLText';
export declare class HTMLTextPipe implements RenderPipe<HTMLText> {
    /** @ignore */
    static extension: {
        readonly type: readonly [ExtensionType.WebGLPipes, ExtensionType.WebGPUPipes, ExtensionType.CanvasPipes];
        readonly name: "htmlText";
    };
    private _renderer;
    private _gpuText;
    private readonly _destroyRenderableBound;
    constructor(renderer: Renderer);
    resolutionChange(): void;
    validateRenderable(htmlText: HTMLText): boolean;
    addRenderable(htmlText: HTMLText, instructionSet: InstructionSet): void;
    updateRenderable(htmlText: HTMLText): void;
    destroyRenderable(htmlText: HTMLText): void;
    private _destroyRenderableById;
    private _updateText;
    private _updateGpuText;
    private _getGpuText;
    initGpuText(htmlText: HTMLText): {
        textureNeedsUploading: boolean;
        generatingTexture: boolean;
        texture: Texture<import("../..").TextureSource<any>>;
        currentKey: string;
        batchableSprite: BatchableSprite;
    };
    destroy(): void;
}
