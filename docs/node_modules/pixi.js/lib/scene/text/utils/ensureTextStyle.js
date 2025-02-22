'use strict';

var HtmlTextStyle = require('../../text-html/HtmlTextStyle.js');
var TextStyle = require('../TextStyle.js');

"use strict";
function ensureTextStyle(renderMode, style) {
  if (style instanceof TextStyle.TextStyle || style instanceof HtmlTextStyle.HTMLTextStyle) {
    return style;
  }
  return renderMode === "html" ? new HtmlTextStyle.HTMLTextStyle(style) : new TextStyle.TextStyle(style);
}

exports.ensureTextStyle = ensureTextStyle;
//# sourceMappingURL=ensureTextStyle.js.map
