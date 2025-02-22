import { ExtensionType } from '../../../extensions/Extensions.mjs';
import { Ticker } from '../../../ticker/Ticker.mjs';

"use strict";
let uid = 1;
class SchedulerSystem {
  constructor() {
    this._tasks = [];
  }
  /** Initializes the scheduler system and starts the ticker. */
  init() {
    Ticker.system.add(this._update, this);
  }
  /**
   * Schedules a repeating task.
   * @param func - The function to execute.
   * @param duration - The interval duration in milliseconds.
   * @returns The unique identifier for the scheduled task.
   */
  repeat(func, duration) {
    const id = uid++;
    this._tasks.push({
      func,
      duration,
      start: performance.now(),
      last: performance.now(),
      repeat: true,
      id
    });
    return id;
  }
  /**
   * Cancels a scheduled task.
   * @param id - The unique identifier of the task to cancel.
   */
  cancel(id) {
    for (let i = 0; i < this._tasks.length; i++) {
      if (this._tasks[i].id === id) {
        this._tasks.splice(i, 1);
        return;
      }
    }
  }
  /**
   * Updates and executes the scheduled tasks.
   * @private
   */
  _update() {
    const now = performance.now();
    for (let i = 0; i < this._tasks.length; i++) {
      const task = this._tasks[i];
      if (now - task.last >= task.duration) {
        const elapsed = now - task.start;
        task.func(elapsed);
        task.last = now;
      }
    }
  }
  /**
   * Destroys the scheduler system and removes all tasks.
   * @internal
   * @ignore
   */
  destroy() {
    Ticker.system.remove(this._update, this);
    this._tasks.length = 0;
  }
}
/** @ignore */
SchedulerSystem.extension = {
  type: [
    ExtensionType.WebGLSystem,
    ExtensionType.WebGPUSystem,
    ExtensionType.CanvasSystem
  ],
  name: "scheduler",
  priority: 0
};

export { SchedulerSystem };
//# sourceMappingURL=SchedulerSystem.mjs.map
