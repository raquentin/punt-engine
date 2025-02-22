import { uid } from '../../../../utils/data/uid.mjs';

"use strict";
let _tick = 0;
class InstructionSet {
  constructor() {
    /** a unique id for this instruction set used through the renderer */
    this.uid = uid("instructionSet");
    /** the array of instructions */
    this.instructions = [];
    /** the actual size of the array (any instructions passed this should be ignored) */
    this.instructionSize = 0;
    this.renderables = [];
    this.tick = 0;
  }
  /** reset the instruction set so it can be reused set size back to 0 */
  reset() {
    this.instructionSize = 0;
    this.tick = _tick++;
  }
  /**
   * Add an instruction to the set
   * @param instruction - add an instruction to the set
   */
  add(instruction) {
    this.instructions[this.instructionSize++] = instruction;
  }
  /**
   * Log the instructions to the console (for debugging)
   * @internal
   * @ignore
   */
  log() {
    this.instructions.length = this.instructionSize;
    console.table(this.instructions, ["type", "action"]);
  }
}

export { InstructionSet };
//# sourceMappingURL=InstructionSet.mjs.map
