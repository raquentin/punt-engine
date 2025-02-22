import { Matrix } from '../../maths/matrix/Matrix';
import { ObservablePoint } from '../../maths/point/ObservablePoint';
import type { Observer } from '../../maths/point/ObservablePoint';
/**
 * Options for the {@link utils.Transform} constructor.
 * @memberof utils.Transform
 */
export interface TransformOptions {
    /** The matrix to use. */
    matrix?: Matrix;
    /** The observer to use. */
    observer?: {
        _onUpdate: (transform: Transform) => void;
    };
}
/**
 * The Transform class facilitates the manipulation of a 2D transformation matrix through
 * user-friendly properties: position, scale, rotation, skew, and pivot.
 * @memberof utils
 */
export declare class Transform {
    /**
     * The local transformation matrix.
     * @internal
     * @private
     */
    _matrix: Matrix;
    /** The coordinate of the object relative to the local coordinates of the parent. */
    position: ObservablePoint;
    /** The scale factor of the object. */
    scale: ObservablePoint;
    /** The pivot point of the container that it rotates around. */
    pivot: ObservablePoint;
    /** The skew amount, on the x and y axis. */
    skew: ObservablePoint;
    /** The rotation amount. */
    protected _rotation: number;
    /**
     * The X-coordinate value of the normalized local X axis,
     * the first column of the local transformation matrix without a scale.
     */
    protected _cx: number;
    /**
     * The Y-coordinate value of the normalized local X axis,
     * the first column of the local transformation matrix without a scale.
     */
    protected _sx: number;
    /**
     * The X-coordinate value of the normalized local Y axis,
     * the second column of the local transformation matrix without a scale.
     */
    protected _cy: number;
    /**
     * The Y-coordinate value of the normalized local Y axis,
     * the second column of the local transformation matrix without a scale.
     */
    protected _sy: number;
    protected dirty: boolean;
    protected observer: Observer<Transform>;
    /**
     * @param options - Options for the transform.
     * @param options.matrix - The matrix to use.
     * @param options.observer - The observer to use.
     */
    constructor({ matrix, observer }?: TransformOptions);
    /**
     * This matrix is computed by combining this Transforms position, scale, rotation, skew, and pivot
     * properties into a single matrix.
     * @readonly
     */
    get matrix(): Matrix;
    /**
     * Called when a value changes.
     * @param point
     * @internal
     * @private
     */
    _onUpdate(point?: ObservablePoint): void;
    /** Called when the skew or the rotation changes. */
    protected updateSkew(): void;
    toString(): string;
    /**
     * Decomposes a matrix and sets the transforms properties based on it.
     * @param matrix - The matrix to decompose
     */
    setFromMatrix(matrix: Matrix): void;
    /** The rotation of the object in radians. */
    get rotation(): number;
    set rotation(value: number);
}
