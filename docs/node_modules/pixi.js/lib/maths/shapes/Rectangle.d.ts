import type { Bounds } from '../../scene/container/bounds/Bounds';
import type { Matrix } from '../matrix/Matrix';
import type { SHAPE_PRIMITIVE } from '../misc/const';
import type { ShapePrimitive } from './ShapePrimitive';
export interface Rectangle extends PixiMixins.Rectangle {
}
/**
 * The `Rectangle` object is an area defined by its position, as indicated by its top-left corner
 * point (`x`, `y`) and by its `width` and its `height`.
 *
 * It also provides convenience methods to get and set the position and size of the rectangle such as
 * {@link maths.Rectangle#bottom|bottom}, {@link maths.Rectangle#right|right} and {@link maths.Rectangle#isEmpty|isEmpty}.
 * @memberof maths
 */
export declare class Rectangle implements ShapePrimitive {
    /**
     * The type of the object, mainly used to avoid `instanceof` checks
     * @default 'rectangle'
     */
    readonly type: SHAPE_PRIMITIVE;
    /**
     * The X coordinate of the upper-left corner of the rectangle
     * @default 0
     */
    x: number;
    /**
     * The Y coordinate of the upper-left corner of the rectangle
     * @default 0
     */
    y: number;
    /**
     * The overall width of this rectangle
     *  @default 0
     */
    width: number;
    /**
     * The overall height of this rectangle
     * @default 0
     */
    height: number;
    /**
     * @param x - The X coordinate of the upper-left corner of the rectangle
     * @param y - The Y coordinate of the upper-left corner of the rectangle
     * @param width - The overall width of the rectangle
     * @param height - The overall height of the rectangle
     */
    constructor(x?: string | number, y?: string | number, width?: string | number, height?: string | number);
    /** Returns the left edge of the rectangle. */
    get left(): number;
    /** Returns the right edge of the rectangle. */
    get right(): number;
    /** Returns the top edge of the rectangle. */
    get top(): number;
    /** Returns the bottom edge of the rectangle. */
    get bottom(): number;
    /** Determines whether the Rectangle is empty. */
    isEmpty(): boolean;
    /** A constant empty rectangle. This is a new object every time the property is accessed */
    static get EMPTY(): Rectangle;
    /**
     * Creates a clone of this Rectangle
     * @returns a copy of the rectangle
     */
    clone(): Rectangle;
    /**
     * Converts a Bounds object to a Rectangle object.
     * @param bounds - The bounds to copy and convert to a rectangle.
     * @returns Returns itself.
     */
    copyFromBounds(bounds: Bounds): this;
    /**
     * Copies another rectangle to this one.
     * @param rectangle - The rectangle to copy from.
     * @returns Returns itself.
     */
    copyFrom(rectangle: Rectangle): Rectangle;
    /**
     * Copies this rectangle to another one.
     * @param rectangle - The rectangle to copy to.
     * @returns Returns given parameter.
     */
    copyTo(rectangle: Rectangle): Rectangle;
    /**
     * Checks whether the x and y coordinates given are contained within this Rectangle
     * @param x - The X coordinate of the point to test
     * @param y - The Y coordinate of the point to test
     * @returns Whether the x/y coordinates are within this Rectangle
     */
    contains(x: number, y: number): boolean;
    /**
     * Checks whether the x and y coordinates given are contained within this rectangle including the stroke.
     * @param x - The X coordinate of the point to test
     * @param y - The Y coordinate of the point to test
     * @param strokeWidth - The width of the line to check
     * @returns Whether the x/y coordinates are within this rectangle
     */
    strokeContains(x: number, y: number, strokeWidth: number): boolean;
    /**
     * Determines whether the `other` Rectangle transformed by `transform` intersects with `this` Rectangle object.
     * Returns true only if the area of the intersection is >0, this means that Rectangles
     * sharing a side are not overlapping. Another side effect is that an arealess rectangle
     * (width or height equal to zero) can't intersect any other rectangle.
     * @param {Rectangle} other - The Rectangle to intersect with `this`.
     * @param {Matrix} transform - The transformation matrix of `other`.
     * @returns {boolean} A value of `true` if the transformed `other` Rectangle intersects with `this`; otherwise `false`.
     */
    intersects(other: Rectangle, transform?: Matrix): boolean;
    /**
     * Pads the rectangle making it grow in all directions.
     * If paddingY is omitted, both paddingX and paddingY will be set to paddingX.
     * @param paddingX - The horizontal padding amount.
     * @param paddingY - The vertical padding amount.
     * @returns Returns itself.
     */
    pad(paddingX?: number, paddingY?: number): this;
    /**
     * Fits this rectangle around the passed one.
     * @param rectangle - The rectangle to fit.
     * @returns Returns itself.
     */
    fit(rectangle: Rectangle): this;
    /**
     * Enlarges rectangle that way its corners lie on grid
     * @param resolution - resolution
     * @param eps - precision
     * @returns Returns itself.
     */
    ceil(resolution?: number, eps?: number): this;
    /**
     * Enlarges this rectangle to include the passed rectangle.
     * @param rectangle - The rectangle to include.
     * @returns Returns itself.
     */
    enlarge(rectangle: Rectangle): this;
    /**
     * Returns the framing rectangle of the rectangle as a Rectangle object
     * @param out - optional rectangle to store the result
     * @returns The framing rectangle
     */
    getBounds(out?: Rectangle): Rectangle;
    toString(): string;
}
