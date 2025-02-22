import { glUploadImageResource } from './glUploadImageResource.mjs';

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
    glUploadImageResource.upload(source, glTexture, gl, webGLVersion);
  }
};

export { glUploadVideoResource };
//# sourceMappingURL=glUploadVideoResource.mjs.map
