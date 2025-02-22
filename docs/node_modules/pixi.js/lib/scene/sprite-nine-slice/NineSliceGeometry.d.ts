import { PlaneGeometry } from '../mesh-plane/PlaneGeometry';
/**
 * Options for the NineSliceGeometry.
 * @memberof scene
 */
export interface NineSliceGeometryOptions {
    /** The width of the NineSlicePlane, setting this will actually modify the vertices and UV's of this plane. */
    width?: number;
    /** The height of the NineSlicePlane, setting this will actually modify the vertices and UV's of this plane. */
    height?: number;
    /** The original width of the texture */
    originalWidth?: number;
    /** The original height of the texture */
    originalHeight?: number;
    /** The width of the left column. */
    leftWidth?: number;
    /** The height of the top row. */
    topHeight?: number;
    /** The width of the right column. */
    rightWidth?: number;
    /** The height of the bottom row. */
    bottomHeight?: number;
}
/**
 * The NineSliceGeometry class allows you to create a NineSlicePlane object.
 * @memberof scene
 */
export declare class NineSliceGeometry extends PlaneGeometry {
    /** The default options for the NineSliceGeometry. */
    static defaultOptions: NineSliceGeometryOptions;
    _leftWidth: number;
    _rightWidth: number;
    _topHeight: number;
    _bottomHeight: number;
    private _originalWidth;
    private _originalHeight;
    constructor(options?: NineSliceGeometryOptions);
    /**
     * Updates the NineSliceGeometry with the options.
     * @param options - The options of the NineSliceGeometry.
     */
    update(options: NineSliceGeometryOptions): void;
    /** Updates the positions of the vertices. */
    updatePositions(): void;
    /** Updates the UVs of the vertices. */
    updateUvs(): void;
}
