import { MeshGeometry } from '../../../mesh/shared/MeshGeometry';
import { GraphicsPath } from '../path/GraphicsPath';
import type { Matrix } from '../../../../maths/matrix/Matrix';
export interface GeometryPathOptions {
    /** the path to build the geometry from */
    path: GraphicsPath;
    /** a `Matrix` that can be used to modify the the texture UVs of the the path being built */
    textureMatrix?: Matrix;
    /** an optional `MeshGeometry` to write too instead of creating a new one*/
    out?: MeshGeometry;
}
/**
 * When building a mesh, it helps to leverage the simple API we have in `GraphicsPath` as it can often be easier to
 * to define the geometry in a more human readable way. This function takes a `GraphicsPath` and returns a `MeshGeometry`.
 * @example
 * ```ts
 *
 * const path = new GraphicsPath()
 *    .drawRect(0, 0, 100, 100)
 *
 * const geometry:MeshGeometry = buildGeometryFromPath(path);
 *
 * const mesh = new Mesh({geometry});
 *
 * ```
 * You can also pass in a Matrix to transform the uvs as by default you may want to control how they are set up.
 * @param options - either a `GraphicsPath` or `GeometryPathOptions`
 * @returns a new `MeshGeometry` instance build from the path
 */
export declare function buildGeometryFromPath(options: GraphicsPath | GeometryPathOptions): MeshGeometry;
