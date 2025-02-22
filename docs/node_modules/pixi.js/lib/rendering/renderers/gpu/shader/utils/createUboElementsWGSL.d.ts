import type { UboLayout, UNIFORM_TYPES, UniformData } from '../../../shared/shader/types';
export declare const WGSL_ALIGN_SIZE_DATA: Record<UNIFORM_TYPES | string, {
    align: number;
    size: number;
}>;
export declare function createUboElementsWGSL(uniformData: UniformData[]): UboLayout;
