import { Matrix } from '../../../maths/matrix/Matrix.mjs';
import { Rectangle } from '../../../maths/shapes/Rectangle.mjs';

"use strict";
const defaultMatrix = new Matrix();
class Bounds {
  constructor(minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity) {
    /** @default Infinity */
    this.minX = Infinity;
    /** @default Infinity */
    this.minY = Infinity;
    /** @default -Infinity */
    this.maxX = -Infinity;
    /** @default -Infinity */
    this.maxY = -Infinity;
    this.matrix = defaultMatrix;
    this.minX = minX;
    this.minY = minY;
    this.maxX = maxX;
    this.maxY = maxY;
  }
  /**
   * Checks if bounds are empty.
   * @returns - True if empty.
   */
  isEmpty() {
    return this.minX > this.maxX || this.minY > this.maxY;
  }
  /** The bounding rectangle of the bounds. */
  get rectangle() {
    if (!this._rectangle) {
      this._rectangle = new Rectangle();
    }
    const rectangle = this._rectangle;
    if (this.minX > this.maxX || this.minY > this.maxY) {
      rectangle.x = 0;
      rectangle.y = 0;
      rectangle.width = 0;
      rectangle.height = 0;
    } else {
      rectangle.copyFromBounds(this);
    }
    return rectangle;
  }
  /** Clears the bounds and resets. */
  clear() {
    this.minX = Infinity;
    this.minY = Infinity;
    this.maxX = -Infinity;
    this.maxY = -Infinity;
    this.matrix = defaultMatrix;
    return this;
  }
  /**
   * Sets the bounds.
   * @param x0 - left X of frame
   * @param y0 - top Y of frame
   * @param x1 - right X of frame
   * @param y1 - bottom Y of frame
   */
  set(x0, y0, x1, y1) {
    this.minX = x0;
    this.minY = y0;
    this.maxX = x1;
    this.maxY = y1;
  }
  /**
   * Adds sprite frame
   * @param x0 - left X of frame
   * @param y0 - top Y of frame
   * @param x1 - right X of frame
   * @param y1 - bottom Y of frame
   * @param matrix
   */
  addFrame(x0, y0, x1, y1, matrix) {
    matrix || (matrix = this.matrix);
    const a = matrix.a;
    const b = matrix.b;
    const c = matrix.c;
    const d = matrix.d;
    const tx = matrix.tx;
    const ty = matrix.ty;
    let minX = this.minX;
    let minY = this.minY;
    let maxX = this.maxX;
    let maxY = this.maxY;
    let x = a * x0 + c * y0 + tx;
    let y = b * x0 + d * y0 + ty;
    if (x < minX)
      minX = x;
    if (y < minY)
      minY = y;
    if (x > maxX)
      maxX = x;
    if (y > maxY)
      maxY = y;
    x = a * x1 + c * y0 + tx;
    y = b * x1 + d * y0 + ty;
    if (x < minX)
      minX = x;
    if (y < minY)
      minY = y;
    if (x > maxX)
      maxX = x;
    if (y > maxY)
      maxY = y;
    x = a * x0 + c * y1 + tx;
    y = b * x0 + d * y1 + ty;
    if (x < minX)
      minX = x;
    if (y < minY)
      minY = y;
    if (x > maxX)
      maxX = x;
    if (y > maxY)
      maxY = y;
    x = a * x1 + c * y1 + tx;
    y = b * x1 + d * y1 + ty;
    if (x < minX)
      minX = x;
    if (y < minY)
      minY = y;
    if (x > maxX)
      maxX = x;
    if (y > maxY)
      maxY = y;
    this.minX = minX;
    this.minY = minY;
    this.maxX = maxX;
    this.maxY = maxY;
  }
  /**
   * Adds a rectangle to the bounds.
   * @param rect - The rectangle to be added.
   * @param matrix - The matrix to apply to the bounds.
   */
  addRect(rect, matrix) {
    this.addFrame(rect.x, rect.y, rect.x + rect.width, rect.y + rect.height, matrix);
  }
  /**
   * Adds other {@link Bounds}.
   * @param bounds - The Bounds to be added
   * @param matrix
   */
  addBounds(bounds, matrix) {
    this.addFrame(bounds.minX, bounds.minY, bounds.maxX, bounds.maxY, matrix);
  }
  /**
   * Adds other Bounds, masked with Bounds.
   * @param mask - The Bounds to be added.
   */
  addBoundsMask(mask) {
    this.minX = this.minX > mask.minX ? this.minX : mask.minX;
    this.minY = this.minY > mask.minY ? this.minY : mask.minY;
    this.maxX = this.maxX < mask.maxX ? this.maxX : mask.maxX;
    this.maxY = this.maxY < mask.maxY ? this.maxY : mask.maxY;
  }
  /**
   * Adds other Bounds, multiplied with matrix.
   * @param matrix - The matrix to apply to the bounds.
   */
  applyMatrix(matrix) {
    const minX = this.minX;
    const minY = this.minY;
    const maxX = this.maxX;
    const maxY = this.maxY;
    const { a, b, c, d, tx, ty } = matrix;
    let x = a * minX + c * minY + tx;
    let y = b * minX + d * minY + ty;
    this.minX = x;
    this.minY = y;
    this.maxX = x;
    this.maxY = y;
    x = a * maxX + c * minY + tx;
    y = b * maxX + d * minY + ty;
    this.minX = x < this.minX ? x : this.minX;
    this.minY = y < this.minY ? y : this.minY;
    this.maxX = x > this.maxX ? x : this.maxX;
    this.maxY = y > this.maxY ? y : this.maxY;
    x = a * minX + c * maxY + tx;
    y = b * minX + d * maxY + ty;
    this.minX = x < this.minX ? x : this.minX;
    this.minY = y < this.minY ? y : this.minY;
    this.maxX = x > this.maxX ? x : this.maxX;
    this.maxY = y > this.maxY ? y : this.maxY;
    x = a * maxX + c * maxY + tx;
    y = b * maxX + d * maxY + ty;
    this.minX = x < this.minX ? x : this.minX;
    this.minY = y < this.minY ? y : this.minY;
    this.maxX = x > this.maxX ? x : this.maxX;
    this.maxY = y > this.maxY ? y : this.maxY;
  }
  /**
   * Resizes the bounds object to include the given rectangle.
   * @param rect - The rectangle to be included.
   */
  fit(rect) {
    if (this.minX < rect.left)
      this.minX = rect.left;
    if (this.maxX > rect.right)
      this.maxX = rect.right;
    if (this.minY < rect.top)
      this.minY = rect.top;
    if (this.maxY > rect.bottom)
      this.maxY = rect.bottom;
    return this;
  }
  /**
   * Resizes the bounds object to include the given bounds.
   * @param left - The left value of the bounds.
   * @param right - The right value of the bounds.
   * @param top - The top value of the bounds.
   * @param bottom - The bottom value of the bounds.
   */
  fitBounds(left, right, top, bottom) {
    if (this.minX < left)
      this.minX = left;
    if (this.maxX > right)
      this.maxX = right;
    if (this.minY < top)
      this.minY = top;
    if (this.maxY > bottom)
      this.maxY = bottom;
    return this;
  }
  /**
   * Pads bounds object, making it grow in all directions.
   * If paddingY is omitted, both paddingX and paddingY will be set to paddingX.
   * @param paddingX - The horizontal padding amount.
   * @param paddingY - The vertical padding amount.
   */
  pad(paddingX, paddingY = paddingX) {
    this.minX -= paddingX;
    this.maxX += paddingX;
    this.minY -= paddingY;
    this.maxY += paddingY;
    return this;
  }
  /** Ceils the bounds. */
  ceil() {
    this.minX = Math.floor(this.minX);
    this.minY = Math.floor(this.minY);
    this.maxX = Math.ceil(this.maxX);
    this.maxY = Math.ceil(this.maxY);
    return this;
  }
  /** Clones the bounds. */
  clone() {
    return new Bounds(this.minX, this.minY, this.maxX, this.maxY);
  }
  /**
   * Scales the bounds by the given values
   * @param x - The X value to scale by.
   * @param y - The Y value to scale by.
   */
  scale(x, y = x) {
    this.minX *= x;
    this.minY *= y;
    this.maxX *= x;
    this.maxY *= y;
    return this;
  }
  /** the x value of the bounds. */
  get x() {
    return this.minX;
  }
  set x(value) {
    const width = this.maxX - this.minX;
    this.minX = value;
    this.maxX = value + width;
  }
  /** the y value of the bounds. */
  get y() {
    return this.minY;
  }
  set y(value) {
    const height = this.maxY - this.minY;
    this.minY = value;
    this.maxY = value + height;
  }
  /** the width value of the bounds. */
  get width() {
    return this.maxX - this.minX;
  }
  set width(value) {
    this.maxX = this.minX + value;
  }
  /** the height value of the bounds. */
  get height() {
    return this.maxY - this.minY;
  }
  set height(value) {
    this.maxY = this.minY + value;
  }
  /** the left value of the bounds. */
  get left() {
    return this.minX;
  }
  /** the right value of the bounds. */
  get right() {
    return this.maxX;
  }
  /** the top value of the bounds. */
  get top() {
    return this.minY;
  }
  /** the bottom value of the bounds. */
  get bottom() {
    return this.maxY;
  }
  /** Is the bounds positive. */
  get isPositive() {
    return this.maxX - this.minX > 0 && this.maxY - this.minY > 0;
  }
  get isValid() {
    return this.minX + this.minY !== Infinity;
  }
  /**
   * Adds screen vertices from array
   * @param vertexData - calculated vertices
   * @param beginOffset - begin offset
   * @param endOffset - end offset, excluded
   * @param matrix
   */
  addVertexData(vertexData, beginOffset, endOffset, matrix) {
    let minX = this.minX;
    let minY = this.minY;
    let maxX = this.maxX;
    let maxY = this.maxY;
    matrix || (matrix = this.matrix);
    const a = matrix.a;
    const b = matrix.b;
    const c = matrix.c;
    const d = matrix.d;
    const tx = matrix.tx;
    const ty = matrix.ty;
    for (let i = beginOffset; i < endOffset; i += 2) {
      const localX = vertexData[i];
      const localY = vertexData[i + 1];
      const x = a * localX + c * localY + tx;
      const y = b * localX + d * localY + ty;
      minX = x < minX ? x : minX;
      minY = y < minY ? y : minY;
      maxX = x > maxX ? x : maxX;
      maxY = y > maxY ? y : maxY;
    }
    this.minX = minX;
    this.minY = minY;
    this.maxX = maxX;
    this.maxY = maxY;
  }
  /**
   * Checks if the point is contained within the bounds.
   * @param x - x coordinate
   * @param y - y coordinate
   */
  containsPoint(x, y) {
    if (this.minX <= x && this.minY <= y && this.maxX >= x && this.maxY >= y) {
      return true;
    }
    return false;
  }
  toString() {
    return `[pixi.js:Bounds minX=${this.minX} minY=${this.minY} maxX=${this.maxX} maxY=${this.maxY} width=${this.width} height=${this.height}]`;
  }
}

export { Bounds };
//# sourceMappingURL=Bounds.mjs.map
