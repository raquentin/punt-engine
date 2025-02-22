import type { HighShaderBit, HighShaderSource } from './types';
/** A high template consists of vertex and fragment source */
export interface HighShaderTemplate {
    name?: string;
    fragment: string;
    vertex: string;
}
export interface CompileHighShaderOptions {
    template: HighShaderTemplate;
    bits: HighShaderBit[];
}
/**
 * This function will take a HighShader template, some High fragments and then merge them in to a shader source.
 * @param options
 * @param options.template
 * @param options.bits
 */
export declare function compileHighShader({ template, bits }: CompileHighShaderOptions): HighShaderSource;
export declare function compileHighShaderGl({ template, bits }: CompileHighShaderOptions): HighShaderSource;
