import { Rectangle } from './Rectangle';
import type { SHAPE_PRIMITIVE } from '../misc/const';
import type { ShapePrimitive } from './ShapePrimitive';
/**
 * A class to define a shape of a triangle via user defined coordinates.
 *
 * Create a `Triangle` object with the `x`, `y`, `x2`, `y2`, `x3`, `y3` properties.
 *
 * ```js
 * import { Triangle } from 'pixi.js';
 *
 * const triangle = new Triangle(0, 0, 100, 0, 50, 50);
 * ```
 * @memberof maths
 */
export declare class Triangle implements ShapePrimitive {
    /**
     * The type of the object, mainly used to avoid `instanceof` checks
     * @default 'triangle'
     */
    readonly type: SHAPE_PRIMITIVE;
    /**
     * The X coord of the first point.
     * @default 0
     */
    x: number;
    /**
     * The Y coord of the first point.
     * @default 0
     */
    y: number;
    /**
     * The X coord of the second point.
     * @default 0
     */
    x2: number;
    /**
     * The Y coord of the second point.
     * @default 0
     */
    y2: number;
    /**
     * The X coord of the third point.
     * @default 0
     */
    x3: number;
    /**
     * The Y coord of the third point.
     * @default 0
     */
    y3: number;
    /**
     * @param x - The X coord of the first point.
     * @param y - The Y coord of the first point.
     * @param x2 - The X coord of the second point.
     * @param y2 - The Y coord of the second point.
     * @param x3 - The X coord of the third point.
     * @param y3 - The Y coord of the third point.
     */
    constructor(x?: number, y?: number, x2?: number, y2?: number, x3?: number, y3?: number);
    /**
     * Checks whether the x and y coordinates given are contained within this triangle
     * @param x - The X coordinate of the point to test
     * @param y - The Y coordinate of the point to test
     * @returns Whether the x/y coordinates are within this Triangle
     */
    contains(x: number, y: number): boolean;
    /**
     * Checks whether the x and y coordinates given are contained within this triangle including the stroke.
     * @param pointX - The X coordinate of the point to test
     * @param pointY - The Y coordinate of the point to test
     * @param strokeWidth - The width of the line to check
     * @returns Whether the x/y coordinates are within this triangle
     */
    strokeContains(pointX: number, pointY: number, strokeWidth: number): boolean;
    /**
     * Creates a clone of this Triangle
     * @returns a copy of the triangle
     */
    clone(): ShapePrimitive;
    /**
     * Copies another triangle to this one.
     * @param triangle - The triangle to copy from.
     * @returns Returns itself.
     */
    copyFrom(triangle: Triangle): this;
    /**
     * Copies this triangle to another one.
     * @param triangle - The triangle to copy to.
     * @returns Returns given parameter.
     */
    copyTo(triangle: Triangle): Triangle;
    /**
     * Returns the framing rectangle of the triangle as a Rectangle object
     * @param out - optional rectangle to store the result
     * @returns The framing rectangle
     */
    getBounds(out?: Rectangle): Rectangle;
}
