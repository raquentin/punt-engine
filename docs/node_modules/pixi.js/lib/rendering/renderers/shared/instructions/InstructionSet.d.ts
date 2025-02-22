import type { Renderable } from '../Renderable';
import type { Instruction } from './Instruction';
/**
 * A set of instructions that can be executed by the renderer.
 * Basically wraps an array, but with some extra properties that help the renderer
 * to keep things nice and optimised.
 *
 * Note:
 * InstructionSet.instructions contains all the instructions, but does not resize (for performance).
 * So for the true length of the instructions you need to use InstructionSet.instructionSize
 * @memberof rendering
 */
export declare class InstructionSet {
    /** a unique id for this instruction set used through the renderer */
    readonly uid: number;
    /** the array of instructions */
    readonly instructions: Instruction[];
    /** the actual size of the array (any instructions passed this should be ignored) */
    instructionSize: number;
    /** allows for access to the render pipes of the renderer */
    renderPipes: any;
    renderables: Renderable[];
    tick: number;
    /** reset the instruction set so it can be reused set size back to 0 */
    reset(): void;
    /**
     * Add an instruction to the set
     * @param instruction - add an instruction to the set
     */
    add(instruction: Instruction): void;
    /**
     * Log the instructions to the console (for debugging)
     * @internal
     * @ignore
     */
    log(): void;
}
