import { ExtensionType } from '../../../../extensions/Extensions.mjs';
import { fastCopy } from '../../shared/buffer/utils/fastCopy.mjs';

"use strict";
class GpuBufferSystem {
  constructor() {
    this._gpuBuffers = /* @__PURE__ */ Object.create(null);
    this._managedBuffers = [];
  }
  contextChange(gpu) {
    this._gpu = gpu;
  }
  getGPUBuffer(buffer) {
    return this._gpuBuffers[buffer.uid] || this.createGPUBuffer(buffer);
  }
  updateBuffer(buffer) {
    const gpuBuffer = this._gpuBuffers[buffer.uid] || this.createGPUBuffer(buffer);
    const data = buffer.data;
    if (buffer._updateID && data) {
      buffer._updateID = 0;
      this._gpu.device.queue.writeBuffer(
        gpuBuffer,
        0,
        data.buffer,
        0,
        // round to the nearest 4 bytes
        (buffer._updateSize || data.byteLength) + 3 & ~3
      );
    }
    return gpuBuffer;
  }
  /** dispose all WebGL resources of all managed buffers */
  destroyAll() {
    for (const id in this._gpuBuffers) {
      this._gpuBuffers[id].destroy();
    }
    this._gpuBuffers = {};
  }
  createGPUBuffer(buffer) {
    if (!this._gpuBuffers[buffer.uid]) {
      buffer.on("update", this.updateBuffer, this);
      buffer.on("change", this.onBufferChange, this);
      buffer.on("destroy", this.onBufferDestroy, this);
      this._managedBuffers.push(buffer);
    }
    const gpuBuffer = this._gpu.device.createBuffer(buffer.descriptor);
    buffer._updateID = 0;
    if (buffer.data) {
      fastCopy(buffer.data.buffer, gpuBuffer.getMappedRange());
      gpuBuffer.unmap();
    }
    this._gpuBuffers[buffer.uid] = gpuBuffer;
    return gpuBuffer;
  }
  onBufferChange(buffer) {
    const gpuBuffer = this._gpuBuffers[buffer.uid];
    gpuBuffer.destroy();
    buffer._updateID = 0;
    this._gpuBuffers[buffer.uid] = this.createGPUBuffer(buffer);
  }
  /**
   * Disposes buffer
   * @param buffer - buffer with data
   */
  onBufferDestroy(buffer) {
    this._managedBuffers.splice(this._managedBuffers.indexOf(buffer), 1);
    this._destroyBuffer(buffer);
  }
  destroy() {
    this._managedBuffers.forEach((buffer) => this._destroyBuffer(buffer));
    this._managedBuffers = null;
    this._gpuBuffers = null;
  }
  _destroyBuffer(buffer) {
    const gpuBuffer = this._gpuBuffers[buffer.uid];
    gpuBuffer.destroy();
    buffer.off("update", this.updateBuffer, this);
    buffer.off("change", this.onBufferChange, this);
    buffer.off("destroy", this.onBufferDestroy, this);
    this._gpuBuffers[buffer.uid] = null;
  }
}
/** @ignore */
GpuBufferSystem.extension = {
  type: [
    ExtensionType.WebGPUSystem
  ],
  name: "buffer"
};

export { GpuBufferSystem };
//# sourceMappingURL=GpuBufferSystem.mjs.map
