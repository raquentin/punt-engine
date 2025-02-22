import type { Matrix } from '../../../../../maths/matrix/Matrix';
/**
 * Takes a vertices array and a matrix and transforms the vertices based on the matrix.
 * this out put is written to the uvs array
 * @param vertices - the vertices to calculate uvs from
 * @param verticesStride - the stride of the vertice
 * @param verticesOffset - the offset of the vertices
 * @param uvs - the uvs to fill
 * @param uvsOffset - the offset of the uvs
 * @param uvsStride - the stride of the uvs
 * @param size - the size of the vertices
 * @param matrix - the matrix to apply to the uvs
 * @memberof rendering
 */
export declare function buildUvs(vertices: number[], verticesStride: number, verticesOffset: number, uvs: number[], uvsOffset: number, uvsStride: number, size: number, matrix?: Matrix): void;
export declare function buildSimpleUvs(uvs: number[], uvsOffset: number, uvsStride: number, size: number): void;
