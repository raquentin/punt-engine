import { Rectangle } from './Rectangle.mjs';

"use strict";
class Circle {
  /**
   * @param x - The X coordinate of the center of this circle
   * @param y - The Y coordinate of the center of this circle
   * @param radius - The radius of the circle
   */
  constructor(x = 0, y = 0, radius = 0) {
    /**
     * The type of the object, mainly used to avoid `instanceof` checks
     * @default 'circle'
     */
    this.type = "circle";
    this.x = x;
    this.y = y;
    this.radius = radius;
  }
  /**
   * Creates a clone of this Circle instance
   * @returns A copy of the Circle
   */
  clone() {
    return new Circle(this.x, this.y, this.radius);
  }
  /**
   * Checks whether the x and y coordinates given are contained within this circle
   * @param x - The X coordinate of the point to test
   * @param y - The Y coordinate of the point to test
   * @returns Whether the x/y coordinates are within this Circle
   */
  contains(x, y) {
    if (this.radius <= 0)
      return false;
    const r2 = this.radius * this.radius;
    let dx = this.x - x;
    let dy = this.y - y;
    dx *= dx;
    dy *= dy;
    return dx + dy <= r2;
  }
  /**
   * Checks whether the x and y coordinates given are contained within this circle including the stroke.
   * @param x - The X coordinate of the point to test
   * @param y - The Y coordinate of the point to test
   * @param width - The width of the line to check
   * @returns Whether the x/y coordinates are within this Circle
   */
  strokeContains(x, y, width) {
    if (this.radius === 0)
      return false;
    const dx = this.x - x;
    const dy = this.y - y;
    const r = this.radius;
    const w2 = width / 2;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < r + w2 && distance > r - w2;
  }
  /**
   * Returns the framing rectangle of the circle as a Rectangle object
   * @param out
   * @returns The framing rectangle
   */
  getBounds(out) {
    out = out || new Rectangle();
    out.x = this.x - this.radius;
    out.y = this.y - this.radius;
    out.width = this.radius * 2;
    out.height = this.radius * 2;
    return out;
  }
  /**
   * Copies another circle to this one.
   * @param circle - The circle to copy from.
   * @returns Returns itself.
   */
  copyFrom(circle) {
    this.x = circle.x;
    this.y = circle.y;
    this.radius = circle.radius;
    return this;
  }
  /**
   * Copies this circle to another one.
   * @param circle - The circle to copy to.
   * @returns Returns given parameter.
   */
  copyTo(circle) {
    circle.copyFrom(this);
    return circle;
  }
  toString() {
    return `[pixi.js/math:Circle x=${this.x} y=${this.y} radius=${this.radius}]`;
  }
}

export { Circle };
//# sourceMappingURL=Circle.mjs.map
