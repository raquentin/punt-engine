/// <reference types="@webgpu/types" />
/**
 * Helper for checking for WebGPU support.
 * @param options - The options for requesting a GPU adapter.
 * @memberof utils
 * @function isWebGPUSupported
 * @returns Is WebGPU supported.
 */
export declare function isWebGPUSupported(options?: GPURequestAdapterOptions): Promise<boolean>;
