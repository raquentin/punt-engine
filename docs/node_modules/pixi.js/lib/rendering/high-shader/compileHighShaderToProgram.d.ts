import { GlProgram } from '../renderers/gl/shader/GlProgram';
import { GpuProgram } from '../renderers/gpu/shader/GpuProgram';
import type { HighShaderBit } from './compiler/types';
export declare function compileHighShaderGpuProgram({ bits, name }: {
    bits: HighShaderBit[];
    name: string;
}): GpuProgram;
export declare function compileHighShaderGlProgram({ bits, name }: {
    bits: HighShaderBit[];
    name: string;
}): GlProgram;
