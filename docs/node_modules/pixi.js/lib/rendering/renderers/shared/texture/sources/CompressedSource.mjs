import { TextureSource } from './TextureSource.mjs';

"use strict";
class CompressedSource extends TextureSource {
  constructor(options) {
    super(options);
    this.uploadMethodId = "compressed";
    this.resource = options.resource;
    this.mipLevelCount = this.resource.length;
  }
}

export { CompressedSource };
//# sourceMappingURL=CompressedSource.mjs.map
