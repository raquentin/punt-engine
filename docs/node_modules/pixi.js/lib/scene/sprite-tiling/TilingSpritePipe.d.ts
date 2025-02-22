import { ExtensionType } from '../../extensions/Extensions';
import { type Renderer } from '../../rendering/renderers/types';
import type { InstructionSet } from '../../rendering/renderers/shared/instructions/InstructionSet';
import type { RenderPipe } from '../../rendering/renderers/shared/instructions/RenderPipe';
import type { TilingSprite } from './TilingSprite';
export declare class TilingSpritePipe implements RenderPipe<TilingSprite> {
    /** @ignore */
    static extension: {
        readonly type: readonly [ExtensionType.WebGLPipes, ExtensionType.WebGPUPipes, ExtensionType.CanvasPipes];
        readonly name: "tilingSprite";
    };
    private _renderer;
    private readonly _state;
    private readonly _tilingSpriteDataHash;
    private readonly _destroyRenderableBound;
    constructor(renderer: Renderer);
    validateRenderable(renderable: TilingSprite): boolean;
    addRenderable(tilingSprite: TilingSprite, instructionSet: InstructionSet): void;
    execute(tilingSprite: TilingSprite): void;
    updateRenderable(tilingSprite: TilingSprite): void;
    destroyRenderable(tilingSprite: TilingSprite): void;
    private _getTilingSpriteData;
    private _initTilingSpriteData;
    private _updateBatchableMesh;
    destroy(): void;
    private _updateCanBatch;
}
