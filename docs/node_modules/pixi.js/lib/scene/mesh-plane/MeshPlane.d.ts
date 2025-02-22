import { Mesh } from '../mesh/shared/Mesh';
import type { Texture } from '../../rendering/renderers/shared/texture/Texture';
import type { DestroyOptions } from '../container/destroyTypes';
import type { MeshOptions } from '../mesh/shared/Mesh';
/**
 * Constructor options used for `MeshPlane` instances.
 * ```js
 * const meshPlane = new MeshPlane({
 *    texture: Texture.from('snake.png'),
 *    verticesX: 20,
 *    verticesY: 20,
 * });
 * ```
 * @see {@link scene.MeshPlane}
 * @memberof scene
 */
export interface MeshPlaneOptions extends Omit<MeshOptions, 'geometry'> {
    /** The texture to use on the plane. */
    texture: Texture;
    /** The number of vertices in the x-axis */
    verticesX?: number;
    /** The number of vertices in the y-axis */
    verticesY?: number;
}
/**
 * The MeshPlane allows you to draw a texture across several points and then manipulate these points
 * @example
 * import { Point, MeshPlane, Texture } from 'pixi.js';
 *
 * for (let i = 0; i < 20; i++) {
 *     points.push(new Point(i * 50, 0));
 * }
 * const MeshPlane = new MeshPlane({ texture: Texture.from('snake.png'), verticesX: points });
 * @memberof scene
 */
export declare class MeshPlane extends Mesh {
    /** The geometry is automatically updated when the texture size changes. */
    autoResize: boolean;
    protected _textureID: number;
    /**
     * @param options - Options to be applied to MeshPlane
     */
    constructor(options: MeshPlaneOptions);
    /**
     * Method used for overrides, to do something in case texture frame was changed.
     * Meshes based on plane can override it and change more details based on texture.
     */
    textureUpdated(): void;
    set texture(value: Texture);
    /** The texture of the MeshPlane */
    get texture(): Texture;
    /**
     * Destroys this sprite renderable and optionally its texture.
     * @param options - Options parameter. A boolean will act as if all options
     *  have been set to that value
     * @param {boolean} [options.texture=false] - Should it destroy the current texture of the renderable as well
     * @param {boolean} [options.textureSource=false] - Should it destroy the textureSource of the renderable as well
     */
    destroy(options?: DestroyOptions): void;
}
