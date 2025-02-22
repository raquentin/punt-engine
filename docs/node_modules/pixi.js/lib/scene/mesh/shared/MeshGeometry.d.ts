import { Geometry } from '../../../rendering/renderers/shared/geometry/Geometry';
import type { Topology } from '../../../rendering/renderers/shared/geometry/const';
import type { BatchMode } from '../../graphics/shared/GraphicsContext';
/**
 * Options for the mesh geometry.
 * @memberof scene
 */
export interface MeshGeometryOptions {
    /** The positions of the mesh. */
    positions?: Float32Array;
    /** The UVs of the mesh. */
    uvs?: Float32Array;
    /** The indices of the mesh. */
    indices?: Uint32Array;
    /** The topology of the mesh. */
    topology?: Topology;
    /** Whether to shrink the buffers to fit the data. */
    shrinkBuffersToFit?: boolean;
}
/**
 * A geometry used to batch multiple meshes with the same texture.
 * @memberof scene
 */
export declare class MeshGeometry extends Geometry {
    static defaultOptions: MeshGeometryOptions;
    batchMode: BatchMode;
    /**
     * @param {scene.MeshGeometryOptions} options - The options of the mesh geometry.
     */
    constructor(options: MeshGeometryOptions);
    /** @deprecated since 8.0.0 */
    constructor(positions: Float32Array, uvs: Float32Array, indices: Uint32Array);
    /** The positions of the mesh. */
    get positions(): Float32Array;
    set positions(value: Float32Array);
    /** The UVs of the mesh. */
    get uvs(): Float32Array;
    set uvs(value: Float32Array);
    /** The indices of the mesh. */
    get indices(): Uint32Array;
    set indices(value: Uint32Array);
}
