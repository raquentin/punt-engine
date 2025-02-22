import { Matrix } from '../../../maths/matrix/Matrix';
import { Rectangle } from '../../../maths/shapes/Rectangle';
/**
 * Simple bounds implementation instead of more ambiguous [number, number, number, number]
 * @memberof rendering
 */
export interface BoundsData {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
}
/**
 * A representation of an AABB bounding box.
 * @memberof rendering
 */
export declare class Bounds {
    /** @default Infinity */
    minX: number;
    /** @default Infinity */
    minY: number;
    /** @default -Infinity */
    maxX: number;
    /** @default -Infinity */
    maxY: number;
    matrix: Matrix;
    private _rectangle;
    constructor(minX?: number, minY?: number, maxX?: number, maxY?: number);
    /**
     * Checks if bounds are empty.
     * @returns - True if empty.
     */
    isEmpty(): boolean;
    /** The bounding rectangle of the bounds. */
    get rectangle(): Rectangle;
    /** Clears the bounds and resets. */
    clear(): this;
    /**
     * Sets the bounds.
     * @param x0 - left X of frame
     * @param y0 - top Y of frame
     * @param x1 - right X of frame
     * @param y1 - bottom Y of frame
     */
    set(x0: number, y0: number, x1: number, y1: number): void;
    /**
     * Adds sprite frame
     * @param x0 - left X of frame
     * @param y0 - top Y of frame
     * @param x1 - right X of frame
     * @param y1 - bottom Y of frame
     * @param matrix
     */
    addFrame(x0: number, y0: number, x1: number, y1: number, matrix?: Matrix): void;
    /**
     * Adds a rectangle to the bounds.
     * @param rect - The rectangle to be added.
     * @param matrix - The matrix to apply to the bounds.
     */
    addRect(rect: Rectangle, matrix?: Matrix): void;
    /**
     * Adds other {@link Bounds}.
     * @param bounds - The Bounds to be added
     * @param matrix
     */
    addBounds(bounds: BoundsData, matrix?: Matrix): void;
    /**
     * Adds other Bounds, masked with Bounds.
     * @param mask - The Bounds to be added.
     */
    addBoundsMask(mask: Bounds): void;
    /**
     * Adds other Bounds, multiplied with matrix.
     * @param matrix - The matrix to apply to the bounds.
     */
    applyMatrix(matrix: Matrix): void;
    /**
     * Resizes the bounds object to include the given rectangle.
     * @param rect - The rectangle to be included.
     */
    fit(rect: Rectangle): this;
    /**
     * Resizes the bounds object to include the given bounds.
     * @param left - The left value of the bounds.
     * @param right - The right value of the bounds.
     * @param top - The top value of the bounds.
     * @param bottom - The bottom value of the bounds.
     */
    fitBounds(left: number, right: number, top: number, bottom: number): this;
    /**
     * Pads bounds object, making it grow in all directions.
     * If paddingY is omitted, both paddingX and paddingY will be set to paddingX.
     * @param paddingX - The horizontal padding amount.
     * @param paddingY - The vertical padding amount.
     */
    pad(paddingX: number, paddingY?: number): this;
    /** Ceils the bounds. */
    ceil(): this;
    /** Clones the bounds. */
    clone(): Bounds;
    /**
     * Scales the bounds by the given values
     * @param x - The X value to scale by.
     * @param y - The Y value to scale by.
     */
    scale(x: number, y?: number): this;
    /** the x value of the bounds. */
    get x(): number;
    set x(value: number);
    /** the y value of the bounds. */
    get y(): number;
    set y(value: number);
    /** the width value of the bounds. */
    get width(): number;
    set width(value: number);
    /** the height value of the bounds. */
    get height(): number;
    set height(value: number);
    /** the left value of the bounds. */
    get left(): number;
    /** the right value of the bounds. */
    get right(): number;
    /** the top value of the bounds. */
    get top(): number;
    /** the bottom value of the bounds. */
    get bottom(): number;
    /** Is the bounds positive. */
    get isPositive(): boolean;
    get isValid(): boolean;
    /**
     * Adds screen vertices from array
     * @param vertexData - calculated vertices
     * @param beginOffset - begin offset
     * @param endOffset - end offset, excluded
     * @param matrix
     */
    addVertexData(vertexData: Float32Array, beginOffset: number, endOffset: number, matrix?: Matrix): void;
    /**
     * Checks if the point is contained within the bounds.
     * @param x - x coordinate
     * @param y - y coordinate
     */
    containsPoint(x: number, y: number): boolean;
    toString(): string;
}
