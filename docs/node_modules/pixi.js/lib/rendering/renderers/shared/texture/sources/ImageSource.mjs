import { DOMAdapter } from '../../../../../environment/adapter.mjs';
import { ExtensionType } from '../../../../../extensions/Extensions.mjs';
import { warn } from '../../../../../utils/logging/warn.mjs';
import { TextureSource } from './TextureSource.mjs';

"use strict";
class ImageSource extends TextureSource {
  constructor(options) {
    if (options.resource && (globalThis.HTMLImageElement && options.resource instanceof HTMLImageElement)) {
      const canvas = DOMAdapter.get().createCanvas(options.resource.width, options.resource.height);
      const context = canvas.getContext("2d");
      context.drawImage(options.resource, 0, 0, options.resource.width, options.resource.height);
      options.resource = canvas;
      warn("ImageSource: Image element passed, converting to canvas. Use CanvasSource instead.");
    }
    super(options);
    this.uploadMethodId = "image";
    this.autoGarbageCollect = true;
  }
  static test(resource) {
    return globalThis.HTMLImageElement && resource instanceof HTMLImageElement || typeof ImageBitmap !== "undefined" && resource instanceof ImageBitmap || globalThis.VideoFrame && resource instanceof VideoFrame;
  }
}
ImageSource.extension = ExtensionType.TextureSource;

export { ImageSource };
//# sourceMappingURL=ImageSource.mjs.map
