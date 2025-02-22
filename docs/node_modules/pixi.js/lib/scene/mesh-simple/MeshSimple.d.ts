import { Mesh } from '../mesh/shared/Mesh';
import type { TypedArray } from '../../rendering/renderers/shared/buffer/Buffer';
import type { Topology } from '../../rendering/renderers/shared/geometry/const';
import type { Texture } from '../../rendering/renderers/shared/texture/Texture';
import type { MeshOptions } from '../mesh/shared/Mesh';
/**
 * Options for the simple mesh.
 * @memberof scene
 */
export interface SimpleMeshOptions extends Omit<MeshOptions, 'geometry'> {
    /** The texture to use */
    texture: Texture;
    /** if you want to specify the vertices */
    vertices?: Float32Array;
    /** if you want to specify the uvs */
    uvs?: Float32Array;
    /** if you want to specify the indices */
    indices?: Uint32Array;
    /** the topology, can be any of the Topology values */
    topology?: Topology;
}
/**
 * The Simple Mesh class mimics Mesh in PixiJS, providing easy-to-use constructor arguments.
 * For more robust customization, use {@link scene.Mesh}.
 * @memberof scene
 */
export declare class MeshSimple extends Mesh {
    /** Upload vertices buffer each frame. */
    autoUpdate: boolean;
    /**
     * @param options - Options to be used for construction
     */
    constructor(options: SimpleMeshOptions);
    /**
     * Collection of vertices data.
     * @type {Float32Array}
     */
    get vertices(): TypedArray;
    set vertices(value: TypedArray);
    private _render;
}
