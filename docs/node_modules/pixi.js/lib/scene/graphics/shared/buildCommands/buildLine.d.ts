import type { StrokeAttributes } from '../FillTypes';
/**
 * Builds a line to draw using the polygon method.
 * @param points
 * @param lineStyle
 * @param flipAlignment
 * @param closed
 * @param vertices
 * @param _verticesStride
 * @param _verticesOffset
 * @param indices
 * @param _indicesOffset
 */
export declare function buildLine(points: number[], lineStyle: StrokeAttributes, flipAlignment: boolean, closed: boolean, vertices: number[], _verticesStride: number, _verticesOffset: number, indices: number[], _indicesOffset: number): void;
