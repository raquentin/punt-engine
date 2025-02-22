import type { Matrix } from '../../maths/matrix/Matrix';
import type { Batch, Batcher } from '../../rendering/batcher/shared/Batcher';
import type { DefaultBatchableQuadElement } from '../../rendering/batcher/shared/DefaultBatcher';
import type { Texture } from '../../rendering/renderers/shared/texture/Texture';
import type { BoundsData } from '../container/bounds/Bounds';
import type { ViewContainer } from '../view/View';
/**
 * A batchable sprite object.
 * @ignore
 */
export declare class BatchableSprite implements DefaultBatchableQuadElement {
    batcherName: string;
    readonly attributeSize = 4;
    readonly indexSize = 6;
    readonly packAsQuad = true;
    transform: Matrix;
    renderable: ViewContainer;
    texture: Texture;
    bounds: BoundsData;
    roundPixels: 0 | 1;
    _indexStart: number;
    _textureId: number;
    _attributeStart: number;
    _batcher: Batcher;
    _batch: Batch;
    get blendMode(): import("../..").BLEND_MODES;
    get color(): number;
    reset(): void;
}
