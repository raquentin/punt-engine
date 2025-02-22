import { ExtensionType } from '../../../extensions/Extensions';
import { Batcher } from './Batcher';
import { BatchGeometry } from './BatchGeometry';
import type { Matrix } from '../../../maths/matrix/Matrix';
import type { Shader } from '../../renderers/shared/shader/Shader';
import type { BatchableMeshElement, BatchableQuadElement } from './Batcher';
/**
 * Represents the common elements for default batch rendering.
 * This interface defines the properties that are used by the DefaultBatcher
 * to render elements efficiently in a batch.
 * @memberof rendering
 */
export interface DefaultBatchElements {
    /**
     * The color of the element that will be multiplied with the texture color.
     * This is typically represented as a 32-bit integer in RGBA format.
     */
    color: number;
    /**
     * Determines whether the element should be rounded to the nearest pixel.
     * - 0: No rounding (default)
     * - 1: Round to nearest pixel
     * This can help with visual consistency, especially for pixel art styles.
     */
    roundPixels: 0 | 1;
    /**
     * The transform matrix of the element.
     * This matrix represents the position, scale, rotation, and skew of the element.
     */
    transform: Matrix;
}
/**
 * Represents a batchable quad element with default batch properties.
 * @memberof rendering
 */
export interface DefaultBatchableQuadElement extends BatchableQuadElement, DefaultBatchElements {
}
/**
 * Represents a batchable mesh element with default batch properties.
 * @memberof rendering
 */
export interface DefaultBatchableMeshElement extends BatchableMeshElement, DefaultBatchElements {
}
/**
 * The default batcher is used to batch quads and meshes. This batcher will batch the following elements:
 * - tints
 * - roundPixels
 * - texture
 * - transform
 * @memberof rendering
 */
export declare class DefaultBatcher extends Batcher {
    /** @ignore */
    static extension: {
        readonly type: readonly [ExtensionType.Batcher];
        readonly name: "default";
    };
    geometry: BatchGeometry;
    shader: Shader;
    name: "default";
    /** The size of one attribute. 1 = 32 bit. x, y, u, v, color, textureIdAndRound -> total = 6 */
    vertexSize: number;
    /**
     * Packs the attributes of a DefaultBatchableMeshElement into the provided views.
     * @param element - The DefaultBatchableMeshElement to pack.
     * @param float32View - The Float32Array view to pack into.
     * @param uint32View - The Uint32Array view to pack into.
     * @param index - The starting index in the views.
     * @param textureId - The texture ID to use.
     */
    packAttributes(element: DefaultBatchableMeshElement, float32View: Float32Array, uint32View: Uint32Array, index: number, textureId: number): void;
    /**
     * Packs the attributes of a DefaultBatchableQuadElement into the provided views.
     * @param element - The DefaultBatchableQuadElement to pack.
     * @param float32View - The Float32Array view to pack into.
     * @param uint32View - The Uint32Array view to pack into.
     * @param index - The starting index in the views.
     * @param textureId - The texture ID to use.
     */
    packQuadAttributes(element: DefaultBatchableQuadElement, float32View: Float32Array, uint32View: Uint32Array, index: number, textureId: number): void;
}
