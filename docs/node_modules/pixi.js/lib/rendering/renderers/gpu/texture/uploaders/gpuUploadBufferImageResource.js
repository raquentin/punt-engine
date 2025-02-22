'use strict';

"use strict";
const gpuUploadBufferImageResource = {
  type: "image",
  upload(source, gpuTexture, gpu) {
    const resource = source.resource;
    const total = (source.pixelWidth | 0) * (source.pixelHeight | 0);
    const bytesPerPixel = resource.byteLength / total;
    gpu.device.queue.writeTexture(
      { texture: gpuTexture },
      resource,
      {
        offset: 0,
        rowsPerImage: source.pixelHeight,
        bytesPerRow: source.pixelHeight * bytesPerPixel
      },
      {
        width: source.pixelWidth,
        height: source.pixelHeight,
        depthOrArrayLayers: 1
      }
    );
  }
};

exports.gpuUploadBufferImageResource = gpuUploadBufferImageResource;
//# sourceMappingURL=gpuUploadBufferImageResource.js.map
