'use strict';

var glUploadImageResource = require('./glUploadImageResource.js');

"use strict";
const glUploadVideoResource = {
  id: "video",
  upload(source, glTexture, gl, webGLVersion) {
    if (!source.isValid) {
      gl.texImage2D(
        glTexture.target,
        0,
        glTexture.internalFormat,
        1,
        1,
        0,
        glTexture.format,
        glTexture.type,
        null
      );
      return;
    }
    glUploadImageResource.glUploadImageResource.upload(source, glTexture, gl, webGLVersion);
  }
};

exports.glUploadVideoResource = glUploadVideoResource;
//# sourceMappingURL=glUploadVideoResource.js.map
