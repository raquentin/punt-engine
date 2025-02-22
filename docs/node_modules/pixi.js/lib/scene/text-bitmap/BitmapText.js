'use strict';

var AbstractText = require('../text/AbstractText.js');
var TextStyle = require('../text/TextStyle.js');
var BitmapFontManager = require('./BitmapFontManager.js');

"use strict";
class BitmapText extends AbstractText.AbstractText {
  constructor(...args) {
    var _a;
    const options = AbstractText.ensureOptions(args, "BitmapText");
    options.style ?? (options.style = options.style || {});
    (_a = options.style).fill ?? (_a.fill = 16777215);
    super(options, TextStyle.TextStyle);
    this.renderPipeId = "bitmapText";
  }
  _updateBounds() {
    const bounds = this._bounds;
    const anchor = this._anchor;
    const bitmapMeasurement = BitmapFontManager.BitmapFontManager.measureText(this.text, this._style);
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

exports.BitmapText = BitmapText;
//# sourceMappingURL=BitmapText.js.map
