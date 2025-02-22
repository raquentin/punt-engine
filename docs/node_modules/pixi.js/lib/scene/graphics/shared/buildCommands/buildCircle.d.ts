import { ExtensionType } from '../../../../extensions/Extensions';
import type { Circle } from '../../../../maths/shapes/Circle';
import type { Ellipse } from '../../../../maths/shapes/Ellipse';
import type { RoundedRectangle } from '../../../../maths/shapes/RoundedRectangle';
import type { ShapeBuildCommand } from './ShapeBuildCommand';
type RoundedShape = Circle | Ellipse | RoundedRectangle;
/**
 * Builds a rectangle to draw
 *
 * Ignored from docs since it is not directly exposed.
 * @ignore
 * @private
 */
export declare const buildCircle: ShapeBuildCommand<RoundedShape>;
export declare const buildEllipse: {
    extension: {
        name: string;
        type: ExtensionType | ExtensionType[];
        priority?: number;
    };
    build(shape: RoundedShape, points: number[]): void;
    triangulate(points: number[], vertices: number[], verticesStride: number, verticesOffset: number, indices: number[], indicesOffset: number): void;
};
export declare const buildRoundedRectangle: {
    extension: {
        name: string;
        type: ExtensionType | ExtensionType[];
        priority?: number;
    };
    build(shape: RoundedShape, points: number[]): void;
    triangulate(points: number[], vertices: number[], verticesStride: number, verticesOffset: number, indices: number[], indicesOffset: number): void;
};
export {};
