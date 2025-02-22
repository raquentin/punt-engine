'use strict';

var AbstractText = require('./AbstractText.js');
var CanvasTextMetrics = require('./canvas/CanvasTextMetrics.js');
var TextStyle = require('./TextStyle.js');

"use strict";
class Text extends AbstractText.AbstractText {
  constructor(...args) {
    const options = AbstractText.ensureOptions(args, "Text");
    super(options, TextStyle.TextStyle);
    this.renderPipeId = "text";
  }
  _updateBounds() {
    const bounds = this._bounds;
    const anchor = this._anchor;
    const canvasMeasurement = CanvasTextMetrics.CanvasTextMetrics.measureText(
      this._text,
      this._style
    );
    const { width, height } = canvasMeasurement;
    bounds.minX = -anchor._x * width;
    bounds.maxX = bounds.minX + width;
    bounds.minY = -anchor._y * height;
    bounds.maxY = bounds.minY + height;
  }
}

exports.Text = Text;
//# sourceMappingURL=Text.js.map
