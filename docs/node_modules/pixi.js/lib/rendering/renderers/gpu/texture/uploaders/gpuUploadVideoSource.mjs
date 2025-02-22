import { gpuUploadImageResource } from './gpuUploadImageSource.mjs';

"use strict";
const gpuUploadVideoResource = {
  type: "video",
  upload(source, gpuTexture, gpu) {
    gpuUploadImageResource.upload(source, gpuTexture, gpu);
  }
};

export { gpuUploadVideoResource };
//# sourceMappingURL=gpuUploadVideoSource.mjs.map
