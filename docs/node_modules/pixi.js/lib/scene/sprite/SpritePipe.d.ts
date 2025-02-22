import { ExtensionType } from '../../extensions/Extensions';
import type { InstructionSet } from '../../rendering/renderers/shared/instructions/InstructionSet';
import type { RenderPipe } from '../../rendering/renderers/shared/instructions/RenderPipe';
import type { Renderer } from '../../rendering/renderers/types';
import type { Sprite } from './Sprite';
export declare class SpritePipe implements RenderPipe<Sprite> {
    /** @ignore */
    static extension: {
        readonly type: readonly [ExtensionType.WebGLPipes, ExtensionType.WebGPUPipes, ExtensionType.CanvasPipes];
        readonly name: "sprite";
    };
    private _renderer;
    private _gpuSpriteHash;
    private readonly _destroyRenderableBound;
    constructor(renderer: Renderer);
    addRenderable(sprite: Sprite, instructionSet: InstructionSet): void;
    updateRenderable(sprite: Sprite): void;
    validateRenderable(sprite: Sprite): boolean;
    destroyRenderable(sprite: Sprite): void;
    private _updateBatchableSprite;
    private _getGpuSprite;
    private _initGPUSprite;
    destroy(): void;
}
