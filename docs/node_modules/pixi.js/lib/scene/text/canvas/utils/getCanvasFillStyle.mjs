import { Color } from '../../../../color/Color.mjs';
import { Matrix } from '../../../../maths/matrix/Matrix.mjs';
import { Texture } from '../../../../rendering/renderers/shared/texture/Texture.mjs';
import { warn } from '../../../../utils/logging/warn.mjs';
import { FillGradient } from '../../../graphics/shared/fill/FillGradient.mjs';
import { FillPattern } from '../../../graphics/shared/fill/FillPattern.mjs';

"use strict";
function getCanvasFillStyle(fillStyle, context) {
  if (fillStyle.texture === Texture.WHITE && !fillStyle.fill) {
    return Color.shared.setValue(fillStyle.color).setAlpha(fillStyle.alpha ?? 1).toHexa();
  } else if (!fillStyle.fill) {
    const pattern = context.createPattern(fillStyle.texture.source.resource, "repeat");
    const tempMatrix = fillStyle.matrix.copyTo(Matrix.shared);
    tempMatrix.scale(fillStyle.texture.frame.width, fillStyle.texture.frame.height);
    pattern.setTransform(tempMatrix);
    return pattern;
  } else if (fillStyle.fill instanceof FillPattern) {
    const fillPattern = fillStyle.fill;
    const pattern = context.createPattern(fillPattern.texture.source.resource, "repeat");
    const tempMatrix = fillPattern.transform.copyTo(Matrix.shared);
    tempMatrix.scale(
      fillPattern.texture.frame.width,
      fillPattern.texture.frame.height
    );
    pattern.setTransform(tempMatrix);
    return pattern;
  } else if (fillStyle.fill instanceof FillGradient) {
    const fillGradient = fillStyle.fill;
    if (fillGradient.type === "linear") {
      const gradient = context.createLinearGradient(
        fillGradient.x0,
        fillGradient.y0,
        fillGradient.x1,
        fillGradient.y1
      );
      fillGradient.gradientStops.forEach((stop) => {
        gradient.addColorStop(stop.offset, Color.shared.setValue(stop.color).toHex());
      });
      return gradient;
    }
  }
  warn("FillStyle not recognised", fillStyle);
  return "red";
}

export { getCanvasFillStyle };
//# sourceMappingURL=getCanvasFillStyle.mjs.map
