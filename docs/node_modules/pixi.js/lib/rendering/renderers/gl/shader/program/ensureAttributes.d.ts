import type { Geometry } from '../../../shared/geometry/Geometry';
import type { ExtractedAttributeData } from './extractAttributesFromGlProgram';
/**
 * This function looks at the attribute information provided to the geometry and attempts
 * to fill in an gaps. WE do this by looking at the extracted data from the shader and
 * making best guesses.
 *
 * Most of th etime users don't need to provide all the attribute info beyond the data itself, so we
 * can fill in the gaps for them. If you are using attributes in a more advanced way, you can
 * don't forget to add all the info at creation!
 * @param geometry - the geometry to ensure attributes for
 * @param extractedData - the extracted data from the shader
 */
export declare function ensureAttributes(geometry: Geometry, extractedData: Record<string, ExtractedAttributeData>): void;
