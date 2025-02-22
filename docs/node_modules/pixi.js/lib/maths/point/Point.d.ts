import type { PointData } from './PointData';
import type { PointLike } from './PointLike';
export interface Point extends PixiMixins.Point {
}
/**
 * The Point object represents a location in a two-dimensional coordinate system, where `x` represents
 * the position on the horizontal axis and `y` represents the position on the vertical axis.
 * <br/>
 * Many Pixi functions accept the `PointData` type as an alternative to `Point`,
 * which only requires `x` and `y` properties.
 * @class
 * @implements {PointLike}
 * @memberof maths
 */
export declare class Point implements PointLike {
    /** Position of the point on the x axis */
    x: number;
    /** Position of the point on the y axis */
    y: number;
    /**
     * Creates a new `Point`
     * @param {number} [x=0] - position of the point on the x axis
     * @param {number} [y=0] - position of the point on the y axis
     */
    constructor(x?: number, y?: number);
    /**
     * Creates a clone of this point
     * @returns A clone of this point
     */
    clone(): Point;
    /**
     * Copies `x` and `y` from the given point into this point
     * @param p - The point to copy from
     * @returns The point instance itself
     */
    copyFrom(p: PointData): this;
    /**
     * Copies this point's x and y into the given point (`p`).
     * @param p - The point to copy to. Can be any of type that is or extends `PointData`
     * @returns The point (`p`) with values updated
     */
    copyTo<T extends PointLike>(p: T): T;
    /**
     * Accepts another point (`p`) and returns `true` if the given point is equal to this point
     * @param p - The point to check
     * @returns Returns `true` if both `x` and `y` are equal
     */
    equals(p: PointData): boolean;
    /**
     * Sets the point to a new `x` and `y` position.
     * If `y` is omitted, both `x` and `y` will be set to `x`.
     * @param {number} [x=0] - position of the point on the `x` axis
     * @param {number} [y=x] - position of the point on the `y` axis
     * @returns The point instance itself
     */
    set(x?: number, y?: number): this;
    toString(): string;
    /**
     * A static Point object with `x` and `y` values of `0`. Can be used to avoid creating new objects multiple times.
     * @readonly
     */
    static get shared(): Point;
}
