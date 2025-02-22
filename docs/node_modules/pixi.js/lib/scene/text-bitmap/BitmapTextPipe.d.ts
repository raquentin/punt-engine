import { ExtensionType } from '../../extensions/Extensions';
import { Graphics } from '../graphics/shared/Graphics';
import type { InstructionSet } from '../../rendering/renderers/shared/instructions/InstructionSet';
import type { RenderPipe } from '../../rendering/renderers/shared/instructions/RenderPipe';
import type { Renderer } from '../../rendering/renderers/types';
import type { BitmapText } from './BitmapText';
export declare class BitmapTextPipe implements RenderPipe<BitmapText> {
    /** @ignore */
    static extension: {
        readonly type: readonly [ExtensionType.WebGLPipes, ExtensionType.WebGPUPipes, ExtensionType.CanvasPipes];
        readonly name: "bitmapText";
    };
    private _renderer;
    private _gpuBitmapText;
    private readonly _destroyRenderableBound;
    constructor(renderer: Renderer);
    validateRenderable(bitmapText: BitmapText): boolean;
    addRenderable(bitmapText: BitmapText, instructionSet: InstructionSet): void;
    destroyRenderable(bitmapText: BitmapText): void;
    private _destroyRenderableByUid;
    updateRenderable(bitmapText: BitmapText): void;
    private _updateContext;
    private _getGpuBitmapText;
    initGpuText(bitmapText: BitmapText): Graphics;
    private _updateDistanceField;
    destroy(): void;
}
