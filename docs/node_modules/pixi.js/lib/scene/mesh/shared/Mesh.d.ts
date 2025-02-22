import { Geometry } from '../../../rendering/renderers/shared/geometry/Geometry';
import { State } from '../../../rendering/renderers/shared/state/State';
import { Texture } from '../../../rendering/renderers/shared/texture/Texture';
import { ViewContainer } from '../../view/View';
import { MeshGeometry } from './MeshGeometry';
import type { PointData } from '../../../maths/point/PointData';
import type { Topology } from '../../../rendering/renderers/shared/geometry/const';
import type { Instruction } from '../../../rendering/renderers/shared/instructions/Instruction';
import type { Shader } from '../../../rendering/renderers/shared/shader/Shader';
import type { View } from '../../../rendering/renderers/shared/view/View';
import type { Bounds } from '../../container/bounds/Bounds';
import type { ContainerOptions } from '../../container/Container';
import type { DestroyOptions } from '../../container/destroyTypes';
export interface TextureShader extends Shader {
    texture: Texture;
}
/**
 * Constructor options used for `Mesh` instances. Extends {@link scene.MeshViewOptions}
 * ```js
 * const mesh = new Mesh({
 *    texture: Texture.from('assets/image.png'),
 *    geometry: new PlaneGeometry(),
 *    shader: Shader.from(VERTEX, FRAGMENT),
 * });
 * ```
 * @see {@link scene.Mesh}
 * @see {@link scene.MeshViewOptions}
 * @memberof scene
 */
/**
 * @memberof scene
 */
export interface MeshOptions<GEOMETRY extends Geometry = MeshGeometry, SHADER extends Shader = TextureShader> extends ContainerOptions {
    /**
     * Includes vertex positions, face indices, colors, UVs, and
     * custom attributes within buffers, reducing the cost of passing all
     * this data to the GPU. Can be shared between multiple Mesh objects.
     */
    geometry: GEOMETRY;
    /**
     * Represents the vertex and fragment shaders that processes the geometry and runs on the GPU.
     * Can be shared between multiple Mesh objects.
     */
    shader?: SHADER | null;
    /** The state of WebGL required to render the mesh. */
    state?: State;
    /** The texture that the Mesh uses. Null for non-MeshMaterial shaders */
    texture?: Texture;
    /** Whether or not to round the x/y position. */
    roundPixels?: boolean;
}
/**
 * Base mesh class.
 *
 * This class empowers you to have maximum flexibility to render any kind of WebGL/WebGPU visuals you can think of.
 * This class assumes a certain level of WebGL/WebGPU knowledge.
 * If you know a bit this should abstract enough away to make your life easier!
 *
 * Pretty much ALL WebGL/WebGPU can be broken down into the following:
 * - Geometry - The structure and data for the mesh. This can include anything from positions, uvs, normals, colors etc..
 * - Shader - This is the shader that PixiJS will render the geometry with (attributes in the shader must match the geometry)
 * - State - This is the state of WebGL required to render the mesh.
 *
 * Through a combination of the above elements you can render anything you want, 2D or 3D!
 * @memberof scene
 */
export declare class Mesh<GEOMETRY extends Geometry = MeshGeometry, SHADER extends Shader = TextureShader> extends ViewContainer implements View, Instruction {
    readonly renderPipeId: string;
    state: State;
    /** @ignore */
    _texture: Texture;
    /** @ignore */
    _geometry: GEOMETRY;
    /** @ignore */
    _shader: SHADER | null;
    /**
     * @param {scene.MeshOptions} options - options for the mesh instance
     */
    constructor(options: MeshOptions<GEOMETRY, SHADER>);
    /** @deprecated since 8.0.0 */
    constructor(geometry: GEOMETRY, shader: SHADER, state?: State, drawMode?: Topology);
    /** Alias for {@link scene.Mesh#shader}. */
    get material(): SHADER;
    /**
     * Represents the vertex and fragment shaders that processes the geometry and runs on the GPU.
     * Can be shared between multiple Mesh objects.
     */
    set shader(value: SHADER | null);
    get shader(): SHADER | null;
    /**
     * Includes vertex positions, face indices, colors, UVs, and
     * custom attributes within buffers, reducing the cost of passing all
     * this data to the GPU. Can be shared between multiple Mesh objects.
     */
    set geometry(value: GEOMETRY);
    get geometry(): GEOMETRY;
    /** The texture that the Mesh uses. Null for non-MeshMaterial shaders */
    set texture(value: Texture);
    get texture(): Texture;
    get batched(): boolean;
    /**
     * The local bounds of the mesh.
     * @type {rendering.Bounds}
     */
    get bounds(): Bounds;
    /**
     * Adds the bounds of this object to the bounds object.
     * @param bounds - The output bounds object.
     */
    addBounds(bounds: Bounds): void;
    /**
     * Checks if the object contains the given point.
     * @param point - The point to check
     */
    containsPoint(point: PointData): boolean;
    /** @ignore */
    onViewUpdate(): void;
    /**
     * Destroys this sprite renderable and optionally its texture.
     * @param options - Options parameter. A boolean will act as if all options
     *  have been set to that value
     * @param {boolean} [options.texture=false] - Should it destroy the current texture of the renderable as well
     * @param {boolean} [options.textureSource=false] - Should it destroy the textureSource of the renderable as well
     */
    destroy(options?: DestroyOptions): void;
}
