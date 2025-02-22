import { AbstractText, ensureOptions } from '../text/AbstractText.mjs';
import { TextStyle } from '../text/TextStyle.mjs';
import { BitmapFontManager } from './BitmapFontManager.mjs';

"use strict";
class BitmapText extends AbstractText {
  constructor(...args) {
    var _a;
    const options = ensureOptions(args, "BitmapText");
    options.style ?? (options.style = options.style || {});
    (_a = options.style).fill ?? (_a.fill = 16777215);
    super(options, TextStyle);
    this.renderPipeId = "bitmapText";
  }
  _updateBounds() {
    const bounds = this._bounds;
    const anchor = this._anchor;
    const bitmapMeasurement = BitmapFontManager.measureText(this.text, this._style);
    const scale = bitmapMeasurement.scale;
    const offset = bitmapMeasurement.offsetY * scale;
    let width = bitmapMeasurement.width * scale;
    let height = bitmapMeasurement.height * scale;
    const stroke = this._style._stroke;
    if (stroke) {
      width += stroke.width;
      height += stroke.width;
    }
    bounds.minX = -anchor._x * width;
    bounds.maxX = bounds.minX + width;
    bounds.minY = -anchor._y * (height + offset);
    bounds.maxY = bounds.minY + height;
  }
}

export { BitmapText };
//# sourceMappingURL=BitmapText.mjs.map
