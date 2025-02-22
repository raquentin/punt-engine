import type { Attribute } from '../../../shared/geometry/Geometry';
export interface ExtractedAttributeData extends Omit<Attribute, 'buffer'> {
    /** set where the shader location is for this attribute */
    location?: number;
}
/**
 * returns the attribute data from the program
 * @private
 * @param {WebGLProgram} [program] - the WebGL program
 * @param {WebGLRenderingContext} [gl] - the WebGL context
 * @returns {object} the attribute data for this program
 */
export declare function extractAttributesFromGlProgram(program: WebGLProgram, gl: WebGLRenderingContextBase, sortAttributes?: boolean): Record<string, ExtractedAttributeData>;
