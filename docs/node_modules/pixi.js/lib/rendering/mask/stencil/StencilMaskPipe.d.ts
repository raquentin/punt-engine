import { ExtensionType } from '../../../extensions/Extensions';
import type { Container } from '../../../scene/container/Container';
import type { Effect } from '../../../scene/container/Effect';
import type { Instruction } from '../../renderers/shared/instructions/Instruction';
import type { InstructionSet } from '../../renderers/shared/instructions/InstructionSet';
import type { InstructionPipe } from '../../renderers/shared/instructions/RenderPipe';
import type { Renderer } from '../../renderers/types';
import type { StencilMask } from './StencilMask';
type MaskMode = 'pushMaskBegin' | 'pushMaskEnd' | 'popMaskBegin' | 'popMaskEnd';
export interface StencilMaskInstruction extends Instruction {
    renderPipeId: 'stencilMask';
    action: MaskMode;
    mask: StencilMask;
}
export declare class StencilMaskPipe implements InstructionPipe<StencilMaskInstruction> {
    static extension: {
        readonly type: readonly [ExtensionType.WebGLPipes, ExtensionType.WebGPUPipes, ExtensionType.CanvasPipes];
        readonly name: "stencilMask";
    };
    private _renderer;
    private _maskStackHash;
    private _maskHash;
    constructor(renderer: Renderer);
    push(mask: Effect, _container: Container, instructionSet: InstructionSet): void;
    pop(mask: Effect, _container: Container, instructionSet: InstructionSet): void;
    execute(instruction: StencilMaskInstruction): void;
    destroy(): void;
}
export {};
