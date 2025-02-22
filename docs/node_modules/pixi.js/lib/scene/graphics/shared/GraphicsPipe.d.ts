import { ExtensionType } from '../../../extensions/Extensions';
import { State } from '../../../rendering/renderers/shared/state/State';
import type { InstructionSet } from '../../../rendering/renderers/shared/instructions/InstructionSet';
import type { BatchPipe, RenderPipe } from '../../../rendering/renderers/shared/instructions/RenderPipe';
import type { Shader } from '../../../rendering/renderers/shared/shader/Shader';
import type { Graphics } from './Graphics';
import type { GraphicsContextSystem } from './GraphicsContextSystem';
export interface GraphicsAdaptor {
    shader: Shader;
    init(): void;
    execute(graphicsPipe: GraphicsPipe, renderable: Graphics): void;
    destroy(): void;
}
export interface GraphicsSystem {
    graphicsContext: GraphicsContextSystem;
    renderPipes: {
        batch: BatchPipe;
    };
    _roundPixels: 0 | 1;
}
export declare class GraphicsPipe implements RenderPipe<Graphics> {
    /** @ignore */
    static extension: {
        readonly type: readonly [ExtensionType.WebGLPipes, ExtensionType.WebGPUPipes, ExtensionType.CanvasPipes];
        readonly name: "graphics";
    };
    renderer: GraphicsSystem;
    state: State;
    private _graphicsBatchesHash;
    private _adaptor;
    private readonly _destroyRenderableBound;
    constructor(renderer: GraphicsSystem, adaptor: GraphicsAdaptor);
    validateRenderable(graphics: Graphics): boolean;
    addRenderable(graphics: Graphics, instructionSet: InstructionSet): void;
    updateRenderable(graphics: Graphics): void;
    destroyRenderable(graphics: Graphics): void;
    execute(graphics: Graphics): void;
    private _rebuild;
    private _addToBatcher;
    private _getBatchesForRenderable;
    private _initBatchesForRenderable;
    private _removeBatchForRenderable;
    destroy(): void;
}
