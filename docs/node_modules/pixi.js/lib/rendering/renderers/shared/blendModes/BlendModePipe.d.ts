import { ExtensionType } from '../../../../extensions/Extensions';
import type { Renderer } from '../../types';
import type { Instruction } from '../instructions/Instruction';
import type { InstructionSet } from '../instructions/InstructionSet';
import type { InstructionPipe } from '../instructions/RenderPipe';
import type { Renderable } from '../Renderable';
import type { BLEND_MODES } from '../state/const';
interface AdvancedBlendInstruction extends Instruction {
    renderPipeId: 'blendMode';
    blendMode: BLEND_MODES;
    activeBlend: Renderable[];
}
/**
 * This Pipe handles the blend mode switching of the renderer.
 * It will insert instructions into the {@link renderers.InstructionSet} to switch the blend mode according to the
 * blend modes of the scene graph.
 *
 * This pipe is were wwe handle Advanced blend modes. Advanced blend modes essentially wrap the renderables
 * in a filter that applies the blend mode.
 *
 * You only need to use this class if you are building your own render instruction set rather than letting PixiJS build
 * the instruction set for you by traversing the scene graph
 * @memberof rendering
 */
export declare class BlendModePipe implements InstructionPipe<AdvancedBlendInstruction> {
    /** @ignore */
    static extension: {
        readonly type: readonly [ExtensionType.WebGLPipes, ExtensionType.WebGPUPipes, ExtensionType.CanvasPipes];
        readonly name: "blendMode";
    };
    private _renderer;
    private _renderableList;
    private _activeBlendMode;
    private _isAdvanced;
    private _filterHash;
    constructor(renderer: Renderer);
    /**
     * This ensures that a blendMode switch is added to the instruction set if the blend mode has changed.
     * @param renderable - The renderable we are adding to the instruction set
     * @param blendMode - The blend mode of the renderable
     * @param instructionSet - The instruction set we are adding to
     */
    setBlendMode(renderable: Renderable, blendMode: BLEND_MODES, instructionSet: InstructionSet): void;
    private _beginAdvancedBlendMode;
    private _endAdvancedBlendMode;
    /**
     * called when the instruction build process is starting this will reset internally to the default blend mode
     * @internal
     * @ignore
     */
    buildStart(): void;
    /**
     * called when the instruction build process is finished, ensuring that if there is an advanced blend mode
     * active, we add the final render instructions added to the instruction set
     * @param instructionSet - The instruction set we are adding to
     * @internal
     * @ignore
     */
    buildEnd(instructionSet: InstructionSet): void;
    /**
     * @internal
     * @ignore
     */
    destroy(): void;
}
export {};
