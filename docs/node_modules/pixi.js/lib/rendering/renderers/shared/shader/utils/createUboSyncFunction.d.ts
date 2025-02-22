import type { UboElement, UNIFORM_TYPES_SINGLE, UniformsSyncCallback } from '../types';
export declare function createUboSyncFunction(uboElements: UboElement[], parserCode: 'uboWgsl' | 'uboStd40', arrayGenerationFunction: (uboElement: UboElement, offsetToAdd: number) => string, singleSettersMap: Record<UNIFORM_TYPES_SINGLE, string>): UniformsSyncCallback;
