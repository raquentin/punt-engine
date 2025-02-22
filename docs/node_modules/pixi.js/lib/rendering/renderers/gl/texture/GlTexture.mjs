import { GL_TARGETS, GL_TYPES, GL_FORMATS } from './const.mjs';

"use strict";
class GlTexture {
  constructor(texture) {
    this.target = GL_TARGETS.TEXTURE_2D;
    this.texture = texture;
    this.width = -1;
    this.height = -1;
    this.type = GL_TYPES.UNSIGNED_BYTE;
    this.internalFormat = GL_FORMATS.RGBA;
    this.format = GL_FORMATS.RGBA;
    this.samplerType = 0;
  }
}

export { GlTexture };
//# sourceMappingURL=GlTexture.mjs.map
