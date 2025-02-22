import { Rectangle } from './Rectangle';
import type { SHAPE_PRIMITIVE } from '../misc/const';
import type { PointData } from '../point/PointData';
import type { ShapePrimitive } from './ShapePrimitive';
/**
 * A class to define a shape via user defined coordinates.
 *
 *
 * `Polygon` can accept the following different constructor arguments:
 * - An array of `Point` objects
 * - An array of coordinate pairs
 *
 *
 * These can be passed as a single array, or as a sequence of arguments.
 * ```js
 * import { Polygon } from 'pixi.js';
 *
 * // create a polygon object from an array of points, or an array of coordinate pairs
 * const polygon1 = new Polygon([ new Point(0, 0), new Point(0, 100), new Point(100, 100) ]);
 * const polygon2 = new Polygon([ 0, 0, 0, 100, 100, 100 ]);
 *
 * // or create a polygon object from a sequence of points, or coordinate pairs
 * const polygon3 = new Polygon(new Point(0, 0), new Point(0, 100), new Point(100, 100));
 * const polygon4 = new Polygon(0, 0, 0, 100, 100, 100);
 * ```
 * @memberof maths
 */
export declare class Polygon implements ShapePrimitive {
    /** An array of the points of this polygon. */
    points: number[];
    /** `false` after moveTo, `true` after `closePath`. In all other cases it is `true`. */
    closePath: boolean;
    /**
     * The type of the object, mainly used to avoid `instanceof` checks
     * @default 'polygon'
     */
    readonly type: SHAPE_PRIMITIVE;
    constructor(points: PointData[] | number[]);
    constructor(...points: PointData[] | number[]);
    /**
     * Creates a clone of this polygon.
     * @returns - A copy of the polygon.
     */
    clone(): Polygon;
    /**
     * Checks whether the x and y coordinates passed to this function are contained within this polygon.
     * @param x - The X coordinate of the point to test.
     * @param y - The Y coordinate of the point to test.
     * @returns - Whether the x/y coordinates are within this polygon.
     */
    contains(x: number, y: number): boolean;
    /**
     * Checks whether the x and y coordinates given are contained within this polygon including the stroke.
     * @param x - The X coordinate of the point to test
     * @param y - The Y coordinate of the point to test
     * @param strokeWidth - The width of the line to check
     * @returns Whether the x/y coordinates are within this polygon
     */
    strokeContains(x: number, y: number, strokeWidth: number): boolean;
    /**
     * Returns the framing rectangle of the polygon as a Rectangle object
     * @param out - optional rectangle to store the result
     * @returns The framing rectangle
     */
    getBounds(out?: Rectangle): Rectangle;
    /**
     * Copies another polygon to this one.
     * @param polygon - The polygon to copy from.
     * @returns Returns itself.
     */
    copyFrom(polygon: Polygon): this;
    /**
     * Copies this polygon to another one.
     * @param polygon - The polygon to copy to.
     * @returns Returns given parameter.
     */
    copyTo(polygon: Polygon): Polygon;
    toString(): string;
    /**
     * Get the last X coordinate of the polygon
     * @readonly
     */
    get lastX(): number;
    /**
     * Get the last Y coordinate of the polygon
     * @readonly
     */
    get lastY(): number;
    /**
     * Get the first X coordinate of the polygon
     * @readonly
     */
    get x(): number;
    /**
     * Get the first Y coordinate of the polygon
     * @readonly
     */
    get y(): number;
}
