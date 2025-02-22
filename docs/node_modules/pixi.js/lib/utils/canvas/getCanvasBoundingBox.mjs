import { Rectangle } from '../../maths/shapes/Rectangle.mjs';

"use strict";
function checkRow(data, width, y) {
  for (let x = 0, index = 4 * y * width; x < width; ++x, index += 4) {
    if (data[index + 3] !== 0)
      return false;
  }
  return true;
}
function checkColumn(data, width, x, top, bottom) {
  const stride = 4 * width;
  for (let y = top, index = top * stride + 4 * x; y <= bottom; ++y, index += stride) {
    if (data[index + 3] !== 0)
      return false;
  }
  return true;
}
function getCanvasBoundingBox(canvas, resolution = 1) {
  const { width, height } = canvas;
  const context = canvas.getContext("2d", {
    willReadFrequently: true
  });
  if (context === null) {
    throw new TypeError("Failed to get canvas 2D context");
  }
  const imageData = context.getImageData(0, 0, width, height);
  const data = imageData.data;
  let left = 0;
  let top = 0;
  let right = width - 1;
  let bottom = height - 1;
  while (top < height && checkRow(data, width, top))
    ++top;
  if (top === height)
    return Rectangle.EMPTY;
  while (checkRow(data, width, bottom))
    --bottom;
  while (checkColumn(data, width, left, top, bottom))
    ++left;
  while (checkColumn(data, width, right, top, bottom))
    --right;
  ++right;
  ++bottom;
  return new Rectangle(left / resolution, top / resolution, (right - left) / resolution, (bottom - top) / resolution);
}

export { getCanvasBoundingBox };
//# sourceMappingURL=getCanvasBoundingBox.mjs.map
