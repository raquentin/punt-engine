'use strict';

var TextureSource = require('./TextureSource.js');

"use strict";
class CompressedSource extends TextureSource.TextureSource {
  constructor(options) {
    super(options);
    this.uploadMethodId = "compressed";
    this.resource = options.resource;
    this.mipLevelCount = this.resource.length;
  }
}

exports.CompressedSource = CompressedSource;
//# sourceMappingURL=CompressedSource.js.map
