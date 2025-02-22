/// <reference types="@webgpu/types" />
import { ExtensionType } from '../../../../extensions/Extensions';
import type { ShaderSystem } from '../../shared/shader/ShaderSystem';
import type { GPU } from '../GpuDeviceSystem';
import type { GpuProgram } from './GpuProgram';
export interface GPUProgramData {
    bindGroups: GPUBindGroupLayout[];
    pipeline: GPUPipelineLayout;
}
/**
 * A system that manages the rendering of GpuPrograms.
 * @memberof rendering
 */
export declare class GpuShaderSystem implements ShaderSystem {
    /** @ignore */
    static extension: {
        readonly type: readonly [ExtensionType.WebGPUSystem];
        readonly name: "shader";
    };
    maxTextures: number;
    private _gpu;
    private readonly _gpuProgramData;
    protected contextChange(gpu: GPU): void;
    getProgramData(program: GpuProgram): GPUProgramData;
    private _createGPUProgramData;
    destroy(): void;
}
