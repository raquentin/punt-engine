'use strict';

var squaredDistanceToLineSegment = require('../misc/squaredDistanceToLineSegment.js');
var Rectangle = require('./Rectangle.js');

"use strict";
class Polygon {
  /**
   * @param points - This can be an array of Points
   *  that form the polygon, a flat array of numbers that will be interpreted as [x,y, x,y, ...], or
   *  the arguments passed can be all the points of the polygon e.g.
   *  `new Polygon(new Point(), new Point(), ...)`, or the arguments passed can be flat
   *  x,y values e.g. `new Polygon(x,y, x,y, x,y, ...)` where `x` and `y` are Numbers.
   */
  constructor(...points) {
    /**
     * The type of the object, mainly used to avoid `instanceof` checks
     * @default 'polygon'
     */
    this.type = "polygon";
    let flat = Array.isArray(points[0]) ? points[0] : points;
    if (typeof flat[0] !== "number") {
      const p = [];
      for (let i = 0, il = flat.length; i < il; i++) {
        p.push(flat[i].x, flat[i].y);
      }
      flat = p;
    }
    this.points = flat;
    this.closePath = true;
  }
  /**
   * Creates a clone of this polygon.
   * @returns - A copy of the polygon.
   */
  clone() {
    const points = this.points.slice();
    const polygon = new Polygon(points);
    polygon.closePath = this.closePath;
    return polygon;
  }
  /**
   * Checks whether the x and y coordinates passed to this function are contained within this polygon.
   * @param x - The X coordinate of the point to test.
   * @param y - The Y coordinate of the point to test.
   * @returns - Whether the x/y coordinates are within this polygon.
   */
  contains(x, y) {
    let inside = false;
    const length = this.points.length / 2;
    for (let i = 0, j = length - 1; i < length; j = i++) {
      const xi = this.points[i * 2];
      const yi = this.points[i * 2 + 1];
      const xj = this.points[j * 2];
      const yj = this.points[j * 2 + 1];
      const intersect = yi > y !== yj > y && x < (xj - xi) * ((y - yi) / (yj - yi)) + xi;
      if (intersect) {
        inside = !inside;
      }
    }
    return inside;
  }
  /**
   * Checks whether the x and y coordinates given are contained within this polygon including the stroke.
   * @param x - The X coordinate of the point to test
   * @param y - The Y coordinate of the point to test
   * @param strokeWidth - The width of the line to check
   * @returns Whether the x/y coordinates are within this polygon
   */
  strokeContains(x, y, strokeWidth) {
    const halfStrokeWidth = strokeWidth / 2;
    const halfStrokeWidthSqrd = halfStrokeWidth * halfStrokeWidth;
    const { points } = this;
    const iterationLength = points.length - (this.closePath ? 0 : 2);
    for (let i = 0; i < iterationLength; i += 2) {
      const x1 = points[i];
      const y1 = points[i + 1];
      const x2 = points[(i + 2) % points.length];
      const y2 = points[(i + 3) % points.length];
      const distanceSqrd = squaredDistanceToLineSegment.squaredDistanceToLineSegment(x, y, x1, y1, x2, y2);
      if (distanceSqrd <= halfStrokeWidthSqrd) {
        return true;
      }
    }
    return false;
  }
  /**
   * Returns the framing rectangle of the polygon as a Rectangle object
   * @param out - optional rectangle to store the result
   * @returns The framing rectangle
   */
  getBounds(out) {
    out = out || new Rectangle.Rectangle();
    const points = this.points;
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    for (let i = 0, n = points.length; i < n; i += 2) {
      const x = points[i];
      const y = points[i + 1];
      minX = x < minX ? x : minX;
      maxX = x > maxX ? x : maxX;
      minY = y < minY ? y : minY;
      maxY = y > maxY ? y : maxY;
    }
    out.x = minX;
    out.width = maxX - minX;
    out.y = minY;
    out.height = maxY - minY;
    return out;
  }
  /**
   * Copies another polygon to this one.
   * @param polygon - The polygon to copy from.
   * @returns Returns itself.
   */
  copyFrom(polygon) {
    this.points = polygon.points.slice();
    this.closePath = polygon.closePath;
    return this;
  }
  /**
   * Copies this polygon to another one.
   * @param polygon - The polygon to copy to.
   * @returns Returns given parameter.
   */
  copyTo(polygon) {
    polygon.copyFrom(this);
    return polygon;
  }
  toString() {
    return `[pixi.js/math:PolygoncloseStroke=${this.closePath}points=${this.points.reduce((pointsDesc, currentPoint) => `${pointsDesc}, ${currentPoint}`, "")}]`;
  }
  /**
   * Get the last X coordinate of the polygon
   * @readonly
   */
  get lastX() {
    return this.points[this.points.length - 2];
  }
  /**
   * Get the last Y coordinate of the polygon
   * @readonly
   */
  get lastY() {
    return this.points[this.points.length - 1];
  }
  /**
   * Get the first X coordinate of the polygon
   * @readonly
   */
  get x() {
    return this.points[this.points.length - 2];
  }
  /**
   * Get the first Y coordinate of the polygon
   * @readonly
   */
  get y() {
    return this.points[this.points.length - 1];
  }
}

exports.Polygon = Polygon;
//# sourceMappingURL=Polygon.js.map
