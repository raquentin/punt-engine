"use strict";
const gpuUploadImageResource = {
  type: "image",
  upload(source, gpuTexture, gpu) {
    const resource = source.resource;
    if (!resource)
      return;
    const width = Math.min(gpuTexture.width, source.resourceWidth || source.pixelWidth);
    const height = Math.min(gpuTexture.height, source.resourceHeight || source.pixelHeight);
    const premultipliedAlpha = source.alphaMode === "premultiply-alpha-on-upload";
    gpu.device.queue.copyExternalImageToTexture(
      { source: resource },
      { texture: gpuTexture, premultipliedAlpha },
      {
        width,
        height
      }
    );
  }
};

export { gpuUploadImageResource };
//# sourceMappingURL=gpuUploadImageSource.mjs.map
