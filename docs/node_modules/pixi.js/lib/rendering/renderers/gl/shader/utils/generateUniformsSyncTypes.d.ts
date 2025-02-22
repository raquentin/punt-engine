import type { UNIFORM_TYPES } from '../../../shared/shader/types';
export type ArraySetterFunction = (v: any, location: WebGLUniformLocation, gl: any) => void;
export declare const UNIFORM_TO_SINGLE_SETTERS: Record<UNIFORM_TYPES | string, string>;
export declare const UNIFORM_TO_ARRAY_SETTERS: Record<UNIFORM_TYPES | string, string>;
