import { Rectangle } from './Rectangle';
import type { ShapePrimitive } from './ShapePrimitive';
/**
 * The `RoundedRectangle` object is an area defined by its position, as indicated by its top-left corner
 * point (`x`, `y`) and by its `width` and its `height`, including a `radius` property that
 * defines the radius of the rounded corners.
 * @memberof maths
 */
export declare class RoundedRectangle implements ShapePrimitive {
    /**
     * The X coordinate of the upper-left corner of the rounded rectangle
     * @default 0
     */
    x: number;
    /**
     * The Y coordinate of the upper-left corner of the rounded rectangle
     * @default 0
     */
    y: number;
    /**
     * The overall width of this rounded rectangle
     * @default 0
     */
    width: number;
    /**
     * The overall height of this rounded rectangle
     * @default 0
     */
    height: number;
    /**
     * Controls the radius of the rounded corners
     * @default 20
     */
    radius: number;
    /**
     * The type of the object, mainly used to avoid `instanceof` checks
     * @default 'roundedRectangle'
     */
    readonly type = "roundedRectangle";
    /**
     * @param x - The X coordinate of the upper-left corner of the rounded rectangle
     * @param y - The Y coordinate of the upper-left corner of the rounded rectangle
     * @param width - The overall width of this rounded rectangle
     * @param height - The overall height of this rounded rectangle
     * @param radius - Controls the radius of the rounded corners
     */
    constructor(x?: number, y?: number, width?: number, height?: number, radius?: number);
    /**
     * Returns the framing rectangle of the rounded rectangle as a Rectangle object
     * @param out - optional rectangle to store the result
     * @returns The framing rectangle
     */
    getBounds(out?: Rectangle): Rectangle;
    /**
     * Creates a clone of this Rounded Rectangle.
     * @returns - A copy of the rounded rectangle.
     */
    clone(): RoundedRectangle;
    /**
     * Copies another rectangle to this one.
     * @param rectangle - The rectangle to copy from.
     * @returns Returns itself.
     */
    copyFrom(rectangle: RoundedRectangle): this;
    /**
     * Copies this rectangle to another one.
     * @param rectangle - The rectangle to copy to.
     * @returns Returns given parameter.
     */
    copyTo(rectangle: RoundedRectangle): RoundedRectangle;
    /**
     * Checks whether the x and y coordinates given are contained within this Rounded Rectangle
     * @param x - The X coordinate of the point to test.
     * @param y - The Y coordinate of the point to test.
     * @returns - Whether the x/y coordinates are within this Rounded Rectangle.
     */
    contains(x: number, y: number): boolean;
    /**
     * Checks whether the x and y coordinates given are contained within this rectangle including the stroke.
     * @param pX - The X coordinate of the point to test
     * @param pY - The Y coordinate of the point to test
     * @param strokeWidth - The width of the line to check
     * @returns Whether the x/y coordinates are within this rectangle
     */
    strokeContains(pX: number, pY: number, strokeWidth: number): boolean;
    toString(): string;
}
