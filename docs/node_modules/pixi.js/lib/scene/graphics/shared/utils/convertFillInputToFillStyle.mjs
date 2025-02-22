import { Color } from '../../../../color/Color.mjs';
import { Matrix } from '../../../../maths/matrix/Matrix.mjs';
import { Texture } from '../../../../rendering/renderers/shared/texture/Texture.mjs';
import { FillGradient } from '../fill/FillGradient.mjs';
import { FillPattern } from '../fill/FillPattern.mjs';

"use strict";
function isColorLike(value) {
  return Color.isColorLike(value);
}
function isFillPattern(value) {
  return value instanceof FillPattern;
}
function isFillGradient(value) {
  return value instanceof FillGradient;
}
function handleColorLike(fill, value, defaultStyle) {
  const temp = Color.shared.setValue(value ?? 0);
  fill.color = temp.toNumber();
  fill.alpha = temp.alpha === 1 ? defaultStyle.alpha : temp.alpha;
  fill.texture = Texture.WHITE;
  return { ...defaultStyle, ...fill };
}
function handleFillPattern(fill, value, defaultStyle) {
  fill.fill = value;
  fill.color = 16777215;
  fill.texture = value.texture;
  fill.matrix = value.transform;
  return { ...defaultStyle, ...fill };
}
function handleFillGradient(fill, value, defaultStyle) {
  value.buildLinearGradient();
  fill.fill = value;
  fill.color = 16777215;
  fill.texture = value.texture;
  fill.matrix = value.transform;
  return { ...defaultStyle, ...fill };
}
function handleFillObject(value, defaultStyle) {
  const style = { ...defaultStyle, ...value };
  if (style.texture) {
    if (style.texture !== Texture.WHITE) {
      const m = style.matrix?.invert() || new Matrix();
      m.translate(style.texture.frame.x, style.texture.frame.y);
      m.scale(1 / style.texture.source.width, 1 / style.texture.source.height);
      style.matrix = m;
    }
    const sourceStyle = style.texture.source.style;
    if (sourceStyle.addressMode === "clamp-to-edge") {
      sourceStyle.addressMode = "repeat";
      sourceStyle.update();
    }
  }
  const color = Color.shared.setValue(style.color);
  style.alpha *= color.alpha;
  style.color = color.toNumber();
  style.matrix = style.matrix ? style.matrix.clone() : null;
  return style;
}
function toFillStyle(value, defaultStyle) {
  if (value === void 0 || value === null) {
    return null;
  }
  const fill = {};
  const objectStyle = value;
  if (isColorLike(value)) {
    return handleColorLike(fill, value, defaultStyle);
  } else if (isFillPattern(value)) {
    return handleFillPattern(fill, value, defaultStyle);
  } else if (isFillGradient(value)) {
    return handleFillGradient(fill, value, defaultStyle);
  } else if (objectStyle.fill && isFillPattern(objectStyle.fill)) {
    return handleFillPattern(objectStyle, objectStyle.fill, defaultStyle);
  } else if (objectStyle.fill && isFillGradient(objectStyle.fill)) {
    return handleFillGradient(objectStyle, objectStyle.fill, defaultStyle);
  }
  return handleFillObject(objectStyle, defaultStyle);
}
function toStrokeStyle(value, defaultStyle) {
  const { width, alignment, miterLimit, cap, join, ...rest } = defaultStyle;
  const fill = toFillStyle(value, rest);
  if (!fill) {
    return null;
  }
  return {
    width,
    alignment,
    miterLimit,
    cap,
    join,
    ...fill
  };
}

export { toFillStyle, toStrokeStyle };
//# sourceMappingURL=convertFillInputToFillStyle.mjs.map
