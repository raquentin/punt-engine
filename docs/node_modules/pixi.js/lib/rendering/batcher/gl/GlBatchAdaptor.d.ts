import { ExtensionType } from '../../../extensions/Extensions';
import type { Geometry } from '../../renderers/shared/geometry/Geometry';
import type { Shader } from '../../renderers/shared/shader/Shader';
import type { Batch } from '../shared/Batcher';
import type { BatcherAdaptor, BatcherPipe } from '../shared/BatcherPipe';
/**
 * A BatcherAdaptor that uses WebGL to render batches.
 * @memberof rendering
 * @ignore
 */
export declare class GlBatchAdaptor implements BatcherAdaptor {
    /** @ignore */
    static extension: {
        readonly type: readonly [ExtensionType.WebGLPipesAdaptor];
        readonly name: "batch";
    };
    private _didUpload;
    private readonly _tempState;
    init(batcherPipe: BatcherPipe): void;
    contextChange(): void;
    start(batchPipe: BatcherPipe, geometry: Geometry, shader: Shader): void;
    execute(batchPipe: BatcherPipe, batch: Batch): void;
}
