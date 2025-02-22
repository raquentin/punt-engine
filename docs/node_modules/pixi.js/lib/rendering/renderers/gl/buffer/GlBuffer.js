'use strict';

"use strict";
class GlBuffer {
  constructor(buffer, type) {
    this.buffer = buffer || null;
    this.updateID = -1;
    this.byteLength = -1;
    this.type = type;
  }
}

exports.GlBuffer = GlBuffer;
//# sourceMappingURL=GlBuffer.js.map
