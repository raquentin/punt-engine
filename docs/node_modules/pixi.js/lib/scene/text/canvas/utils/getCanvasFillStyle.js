'use strict';

var Color = require('../../../../color/Color.js');
var Matrix = require('../../../../maths/matrix/Matrix.js');
var Texture = require('../../../../rendering/renderers/shared/texture/Texture.js');
var warn = require('../../../../utils/logging/warn.js');
var FillGradient = require('../../../graphics/shared/fill/FillGradient.js');
var FillPattern = require('../../../graphics/shared/fill/FillPattern.js');

"use strict";
function getCanvasFillStyle(fillStyle, context) {
  if (fillStyle.texture === Texture.Texture.WHITE && !fillStyle.fill) {
    return Color.Color.shared.setValue(fillStyle.color).setAlpha(fillStyle.alpha ?? 1).toHexa();
  } else if (!fillStyle.fill) {
    const pattern = context.createPattern(fillStyle.texture.source.resource, "repeat");
    const tempMatrix = fillStyle.matrix.copyTo(Matrix.Matrix.shared);
    tempMatrix.scale(fillStyle.texture.frame.width, fillStyle.texture.frame.height);
    pattern.setTransform(tempMatrix);
    return pattern;
  } else if (fillStyle.fill instanceof FillPattern.FillPattern) {
    const fillPattern = fillStyle.fill;
    const pattern = context.createPattern(fillPattern.texture.source.resource, "repeat");
    const tempMatrix = fillPattern.transform.copyTo(Matrix.Matrix.shared);
    tempMatrix.scale(
      fillPattern.texture.frame.width,
      fillPattern.texture.frame.height
    );
    pattern.setTransform(tempMatrix);
    return pattern;
  } else if (fillStyle.fill instanceof FillGradient.FillGradient) {
    const fillGradient = fillStyle.fill;
    if (fillGradient.type === "linear") {
      const gradient = context.createLinearGradient(
        fillGradient.x0,
        fillGradient.y0,
        fillGradient.x1,
        fillGradient.y1
      );
      fillGradient.gradientStops.forEach((stop) => {
        gradient.addColorStop(stop.offset, Color.Color.shared.setValue(stop.color).toHex());
      });
      return gradient;
    }
  }
  warn.warn("FillStyle not recognised", fillStyle);
  return "red";
}

exports.getCanvasFillStyle = getCanvasFillStyle;
//# sourceMappingURL=getCanvasFillStyle.js.map
