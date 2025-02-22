/// <reference types="@webgpu/types" />
import { ExtensionType } from '../../../../extensions/Extensions';
import type { Buffer } from '../../shared/buffer/Buffer';
import type { System } from '../../shared/system/System';
import type { GPU } from '../GpuDeviceSystem';
/**
 * System plugin to the renderer to manage buffers.
 * @memberof rendering
 */
export declare class GpuBufferSystem implements System {
    /** @ignore */
    static extension: {
        readonly type: readonly [ExtensionType.WebGPUSystem];
        readonly name: "buffer";
    };
    protected CONTEXT_UID: number;
    private _gpuBuffers;
    private readonly _managedBuffers;
    private _gpu;
    protected contextChange(gpu: GPU): void;
    getGPUBuffer(buffer: Buffer): GPUBuffer;
    updateBuffer(buffer: Buffer): GPUBuffer;
    /** dispose all WebGL resources of all managed buffers */
    destroyAll(): void;
    createGPUBuffer(buffer: Buffer): GPUBuffer;
    protected onBufferChange(buffer: Buffer): void;
    /**
     * Disposes buffer
     * @param buffer - buffer with data
     */
    protected onBufferDestroy(buffer: Buffer): void;
    destroy(): void;
    private _destroyBuffer;
}
