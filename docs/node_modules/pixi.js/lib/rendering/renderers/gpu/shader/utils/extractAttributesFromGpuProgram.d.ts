import type { ExtractedAttributeData } from '../../../gl/shader/program/extractAttributesFromGlProgram';
import type { ProgramSource } from '../GpuProgram';
export declare function extractAttributesFromGpuProgram({ source, entryPoint }: ProgramSource): Record<string, ExtractedAttributeData>;
