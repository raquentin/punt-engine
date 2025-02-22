import { HTMLTextStyle } from '../../text-html/HtmlTextStyle';
import { TextStyle } from '../TextStyle';
import type { HTMLTextStyleOptions } from '../../text-html/HtmlTextStyle';
import type { TextStyleOptions } from '../TextStyle';
/**
 * converts the style input into the correct type of TextStyle
 * either HTMLTextStyle or TextStyle based on the renderMode.
 * @param renderMode - The render mode to use
 * @param style - The style to use
 * @returns - The style class
 */
export declare function ensureTextStyle(renderMode: string, style: TextStyle | HTMLTextStyle | TextStyleOptions | HTMLTextStyleOptions): TextStyle;
