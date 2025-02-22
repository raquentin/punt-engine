import { ExtensionType } from '../../extensions/Extensions';
import type { InstructionSet } from '../../rendering/renderers/shared/instructions/InstructionSet';
import type { RenderPipe } from '../../rendering/renderers/shared/instructions/RenderPipe';
import type { Renderer } from '../../rendering/renderers/types';
import type { NineSliceSprite } from './NineSliceSprite';
export declare class NineSliceSpritePipe implements RenderPipe<NineSliceSprite> {
    /** @ignore */
    static extension: {
        readonly type: readonly [ExtensionType.WebGLPipes, ExtensionType.WebGPUPipes, ExtensionType.CanvasPipes];
        readonly name: "nineSliceSprite";
    };
    private readonly _renderer;
    private readonly _gpuSpriteHash;
    private readonly _destroyRenderableBound;
    constructor(renderer: Renderer);
    addRenderable(sprite: NineSliceSprite, instructionSet: InstructionSet): void;
    updateRenderable(sprite: NineSliceSprite): void;
    validateRenderable(sprite: NineSliceSprite): boolean;
    destroyRenderable(sprite: NineSliceSprite): void;
    private _updateBatchableSprite;
    private _getGpuSprite;
    private _initGPUSprite;
    destroy(): void;
}
