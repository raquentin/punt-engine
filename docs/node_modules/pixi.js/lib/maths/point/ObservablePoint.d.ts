import type { PointData } from './PointData';
import type { PointLike } from './PointLike';
export interface ObservablePoint extends PixiMixins.ObservablePoint {
}
/**
 * Observer used to listen for observable point changes.
 * @memberof maths
 */
export interface Observer<T> {
    /** Callback to call when the point has updated. */
    _onUpdate: (point?: T) => void;
}
/**
 * The ObservablePoint object represents a location in a two-dimensional coordinate system, where `x` represents
 * the position on the horizontal axis and `y` represents the position on the vertical axis.
 *
 * An `ObservablePoint` is a point that triggers the `onUpdate` method on an observer when the point's position is changed.
 * @memberof maths
 */
export declare class ObservablePoint implements PointLike {
    /** @ignore */
    _x: number;
    /** @ignore */
    _y: number;
    /** This object used to call the `onUpdate` callback when the point changes. */
    private readonly _observer;
    /**
     * Creates a new `ObservablePoint`
     * @param observer - Observer to pass to listen for change events.
     * @param {number} [x=0] - position of the point on the x axis
     * @param {number} [y=0] - position of the point on the y axis
     */
    constructor(observer: Observer<ObservablePoint>, x?: number, y?: number);
    /**
     * Creates a clone of this point.
     * @param observer - Optional observer to pass to the new observable point.
     * @returns a copy of this observable point
     */
    clone(observer?: Observer<ObservablePoint>): ObservablePoint;
    /**
     * Sets the point to a new `x` and `y` position.
     * If `y` is omitted, both `x` and `y` will be set to `x`.
     * @param {number} [x=0] - position of the point on the x axis
     * @param {number} [y=x] - position of the point on the y axis
     * @returns The observable point instance itself
     */
    set(x?: number, y?: number): this;
    /**
     * Copies x and y from the given point (`p`)
     * @param p - The point to copy from. Can be any of type that is or extends `PointData`
     * @returns The observable point instance itself
     */
    copyFrom(p: PointData): this;
    /**
     * Copies this point's x and y into that of the given point (`p`)
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
    toString(): string;
    /** Position of the observable point on the x axis. */
    get x(): number;
    set x(value: number);
    /** Position of the observable point on the y axis. */
    get y(): number;
    set y(value: number);
}
