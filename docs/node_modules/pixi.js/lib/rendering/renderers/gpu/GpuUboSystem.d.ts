import { ExtensionType } from '../../../extensions/Extensions';
import { UboSystem } from '../shared/shader/UboSystem';
/**
 * System plugin to the renderer to manage uniform buffers. With a WGSL twist!
 * @memberof rendering
 */
export declare class GpuUboSystem extends UboSystem {
    /** @ignore */
    static extension: {
        readonly type: readonly [ExtensionType.WebGPUSystem];
        readonly name: "ubo";
    };
    constructor();
}
