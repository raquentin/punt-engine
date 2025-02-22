'use strict';

var adapter = require('../../../../../environment/adapter.js');
var Extensions = require('../../../../../extensions/Extensions.js');
var warn = require('../../../../../utils/logging/warn.js');
var TextureSource = require('./TextureSource.js');

"use strict";
class ImageSource extends TextureSource.TextureSource {
  constructor(options) {
    if (options.resource && (globalThis.HTMLImageElement && options.resource instanceof HTMLImageElement)) {
      const canvas = adapter.DOMAdapter.get().createCanvas(options.resource.width, options.resource.height);
      const context = canvas.getContext("2d");
      context.drawImage(options.resource, 0, 0, options.resource.width, options.resource.height);
      options.resource = canvas;
      warn.warn("ImageSource: Image element passed, converting to canvas. Use CanvasSource instead.");
    }
    super(options);
    this.uploadMethodId = "image";
    this.autoGarbageCollect = true;
  }
  static test(resource) {
    return globalThis.HTMLImageElement && resource instanceof HTMLImageElement || typeof ImageBitmap !== "undefined" && resource instanceof ImageBitmap || globalThis.VideoFrame && resource instanceof VideoFrame;
  }
}
ImageSource.extension = Extensions.ExtensionType.TextureSource;

exports.ImageSource = ImageSource;
//# sourceMappingURL=ImageSource.js.map
