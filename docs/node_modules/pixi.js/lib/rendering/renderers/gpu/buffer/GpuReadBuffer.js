'use strict';

var Buffer = require('../../shared/buffer/Buffer.js');
var _const = require('../../shared/buffer/const.js');

"use strict";
function GpuReadBuffer(buffer, renderer) {
  const bufferSize = buffer.descriptor.size;
  const device = renderer.gpu.device;
  const stagingBuffer = new Buffer.Buffer({
    data: new Float32Array(24e5),
    usage: _const.BufferUsage.MAP_READ | _const.BufferUsage.COPY_DST
  });
  const stagingGPUBuffer = renderer.buffer.createGPUBuffer(stagingBuffer);
  const commandEncoder = device.createCommandEncoder();
  commandEncoder.copyBufferToBuffer(
    renderer.buffer.getGPUBuffer(buffer),
    0,
    // Source offset
    stagingGPUBuffer,
    0,
    // Destination offset
    bufferSize
  );
  device.queue.submit([commandEncoder.finish()]);
  void stagingGPUBuffer.mapAsync(
    GPUMapMode.READ,
    0,
    // Offset
    bufferSize
    // Length
  ).then(() => {
    stagingGPUBuffer.getMappedRange(0, bufferSize);
    stagingGPUBuffer.unmap();
  });
}

exports.GpuReadBuffer = GpuReadBuffer;
//# sourceMappingURL=GpuReadBuffer.js.map
