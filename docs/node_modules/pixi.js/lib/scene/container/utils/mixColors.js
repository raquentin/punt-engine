'use strict';

var mixHexColors = require('./mixHexColors.js');

"use strict";
const WHITE_BGR = 16777215;
function mixColors(localBGRColor, parentBGRColor) {
  if (localBGRColor === WHITE_BGR || parentBGRColor === WHITE_BGR) {
    return localBGRColor + parentBGRColor - WHITE_BGR;
  }
  return mixHexColors.mixHexColors(localBGRColor, parentBGRColor, 0.5);
}
function mixStandardAnd32BitColors(localColorRGB, localAlpha, parentColor) {
  const parentAlpha = (parentColor >> 24 & 255) / 255;
  const globalAlpha = localAlpha * parentAlpha * 255;
  const localBGRColor = ((localColorRGB & 255) << 16) + (localColorRGB & 65280) + (localColorRGB >> 16 & 255);
  const parentBGRColor = parentColor & 16777215;
  let sharedBGRColor;
  if (localBGRColor === WHITE_BGR || parentBGRColor === WHITE_BGR) {
    sharedBGRColor = localBGRColor + parentBGRColor - WHITE_BGR;
  } else {
    sharedBGRColor = mixHexColors.mixHexColors(localBGRColor, parentBGRColor, 0.5);
  }
  return sharedBGRColor + (globalAlpha << 24);
}

exports.mixColors = mixColors;
exports.mixStandardAnd32BitColors = mixStandardAnd32BitColors;
//# sourceMappingURL=mixColors.js.map
