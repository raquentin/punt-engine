import type { Matrix } from '../../../maths/matrix/Matrix';
import type { Batch, Batcher } from '../../../rendering/batcher/shared/Batcher';
import type { DefaultBatchableMeshElement } from '../../../rendering/batcher/shared/DefaultBatcher';
import type { Texture } from '../../../rendering/renderers/shared/texture/Texture';
import type { ViewContainer } from '../../view/View';
import type { MeshGeometry } from './MeshGeometry';
/**
 * A batchable mesh object.
 * @ignore
 */
export declare class BatchableMesh implements DefaultBatchableMeshElement {
    batcherName: string;
    readonly packAsQuad = false;
    location: number;
    renderable: ViewContainer;
    indexOffset: number;
    attributeOffset: number;
    texture: Texture;
    geometry: MeshGeometry;
    transform: Matrix;
    roundPixels: 0 | 1;
    _attributeStart: number;
    _batcher: Batcher;
    _batch: Batch;
    _indexStart: number;
    _textureId: number;
    private _transformedUvs;
    private _uvUpdateId;
    private _textureMatrixUpdateId;
    get blendMode(): import("../../..").BLEND_MODES;
    reset(): void;
    get uvs(): Float32Array;
    get positions(): Float32Array;
    get indices(): Uint32Array;
    get color(): number;
    get groupTransform(): Matrix;
    get attributeSize(): number;
    get indexSize(): number;
}
