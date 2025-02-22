'use strict';

var gpuUploadImageSource = require('./gpuUploadImageSource.js');

"use strict";
const gpuUploadVideoResource = {
  type: "video",
  upload(source, gpuTexture, gpu) {
    gpuUploadImageSource.gpuUploadImageResource.upload(source, gpuTexture, gpu);
  }
};

exports.gpuUploadVideoResource = gpuUploadVideoResource;
//# sourceMappingURL=gpuUploadVideoSource.js.map
