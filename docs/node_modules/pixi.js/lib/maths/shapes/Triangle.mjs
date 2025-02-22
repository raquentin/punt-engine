import { squaredDistanceToLineSegment } from '../misc/squaredDistanceToLineSegment.mjs';
import { Rectangle } from './Rectangle.mjs';

"use strict";
class Triangle {
  /**
   * @param x - The X coord of the first point.
   * @param y - The Y coord of the first point.
   * @param x2 - The X coord of the second point.
   * @param y2 - The Y coord of the second point.
   * @param x3 - The X coord of the third point.
   * @param y3 - The Y coord of the third point.
   */
  constructor(x = 0, y = 0, x2 = 0, y2 = 0, x3 = 0, y3 = 0) {
    /**
     * The type of the object, mainly used to avoid `instanceof` checks
     * @default 'triangle'
     */
    this.type = "triangle";
    this.x = x;
    this.y = y;
    this.x2 = x2;
    this.y2 = y2;
    this.x3 = x3;
    this.y3 = y3;
  }
  /**
   * Checks whether the x and y coordinates given are contained within this triangle
   * @param x - The X coordinate of the point to test
   * @param y - The Y coordinate of the point to test
   * @returns Whether the x/y coordinates are within this Triangle
   */
  contains(x, y) {
    const s = (this.x - this.x3) * (y - this.y3) - (this.y - this.y3) * (x - this.x3);
    const t = (this.x2 - this.x) * (y - this.y) - (this.y2 - this.y) * (x - this.x);
    if (s < 0 !== t < 0 && s !== 0 && t !== 0) {
      return false;
    }
    const d = (this.x3 - this.x2) * (y - this.y2) - (this.y3 - this.y2) * (x - this.x2);
    return d === 0 || d < 0 === s + t <= 0;
  }
  /**
   * Checks whether the x and y coordinates given are contained within this triangle including the stroke.
   * @param pointX - The X coordinate of the point to test
   * @param pointY - The Y coordinate of the point to test
   * @param strokeWidth - The width of the line to check
   * @returns Whether the x/y coordinates are within this triangle
   */
  strokeContains(pointX, pointY, strokeWidth) {
    const halfStrokeWidth = strokeWidth / 2;
    const halfStrokeWidthSquared = halfStrokeWidth * halfStrokeWidth;
    const { x, x2, x3, y, y2, y3 } = this;
    if (squaredDistanceToLineSegment(pointX, pointY, x, y, x2, y3) <= halfStrokeWidthSquared || squaredDistanceToLineSegment(pointX, pointY, x2, y2, x3, y3) <= halfStrokeWidthSquared || squaredDistanceToLineSegment(pointX, pointY, x3, y3, x, y) <= halfStrokeWidthSquared) {
      return true;
    }
    return false;
  }
  /**
   * Creates a clone of this Triangle
   * @returns a copy of the triangle
   */
  clone() {
    const triangle = new Triangle(
      this.x,
      this.y,
      this.x2,
      this.y2,
      this.x3,
      this.y3
    );
    return triangle;
  }
  /**
   * Copies another triangle to this one.
   * @param triangle - The triangle to copy from.
   * @returns Returns itself.
   */
  copyFrom(triangle) {
    this.x = triangle.x;
    this.y = triangle.y;
    this.x2 = triangle.x2;
    this.y2 = triangle.y2;
    this.x3 = triangle.x3;
    this.y3 = triangle.y3;
    return this;
  }
  /**
   * Copies this triangle to another one.
   * @param triangle - The triangle to copy to.
   * @returns Returns given parameter.
   */
  copyTo(triangle) {
    triangle.copyFrom(this);
    return triangle;
  }
  /**
   * Returns the framing rectangle of the triangle as a Rectangle object
   * @param out - optional rectangle to store the result
   * @returns The framing rectangle
   */
  getBounds(out) {
    out = out || new Rectangle();
    const minX = Math.min(this.x, this.x2, this.x3);
    const maxX = Math.max(this.x, this.x2, this.x3);
    const minY = Math.min(this.y, this.y2, this.y3);
    const maxY = Math.max(this.y, this.y2, this.y3);
    out.x = minX;
    out.y = minY;
    out.width = maxX - minX;
    out.height = maxY - minY;
    return out;
  }
}

export { Triangle };
//# sourceMappingURL=Triangle.mjs.map
