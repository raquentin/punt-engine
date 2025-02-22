import { AbstractText, ensureOptions } from './AbstractText.mjs';
import { CanvasTextMetrics } from './canvas/CanvasTextMetrics.mjs';
import { TextStyle } from './TextStyle.mjs';

"use strict";
class Text extends AbstractText {
  constructor(...args) {
    const options = ensureOptions(args, "Text");
    super(options, TextStyle);
    this.renderPipeId = "text";
  }
  _updateBounds() {
    const bounds = this._bounds;
    const anchor = this._anchor;
    const canvasMeasurement = CanvasTextMetrics.measureText(
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

export { Text };
//# sourceMappingURL=Text.mjs.map
