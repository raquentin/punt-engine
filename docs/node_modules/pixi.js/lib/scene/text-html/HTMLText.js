'use strict';

var AbstractText = require('../text/AbstractText.js');
var HtmlTextStyle = require('./HtmlTextStyle.js');
var measureHtmlText = require('./utils/measureHtmlText.js');

"use strict";
class HTMLText extends AbstractText.AbstractText {
  constructor(...args) {
    const options = AbstractText.ensureOptions(args, "HtmlText");
    super(options, HtmlTextStyle.HTMLTextStyle);
    this.renderPipeId = "htmlText";
  }
  _updateBounds() {
    const bounds = this._bounds;
    const anchor = this._anchor;
    const htmlMeasurement = measureHtmlText.measureHtmlText(this.text, this._style);
    const { width, height } = htmlMeasurement;
    bounds.minX = -anchor._x * width;
    bounds.maxX = bounds.minX + width;
    bounds.minY = -anchor._y * height;
    bounds.maxY = bounds.minY + height;
  }
}

exports.HTMLText = HTMLText;
//# sourceMappingURL=HTMLText.js.map
