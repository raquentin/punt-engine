import { Rectangle } from '../../../../maths/shapes/Rectangle';
import type { TextureSource } from '../texture/sources/TextureSource';
/**
 * Takes a Texture source and a normalised frame
 * and returns a viewport for that frame.
 * @param viewport - The viewport rectangle to set.
 * @param source - The source to get the pixel width and height from.
 * @param frame - The frame to get the viewport from.
 * @returns the passed in viewport.
 */
export declare function viewportFromFrame(viewport: Rectangle, source: TextureSource, frame?: Rectangle): Rectangle;
