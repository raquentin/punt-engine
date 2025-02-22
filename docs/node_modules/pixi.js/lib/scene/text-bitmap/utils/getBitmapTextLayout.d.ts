import type { TextStyle } from '../../text/TextStyle';
import type { AbstractBitmapFont } from '../AbstractBitmapFont';
export interface BitmapTextLayoutData {
    width: number;
    height: number;
    scale: number;
    offsetY: number;
    lines: {
        width: number;
        charPositions: number[];
        chars: string[];
        spaceWidth: number;
        spacesIndex: number[];
    }[];
}
export declare function getBitmapTextLayout(chars: string[], style: TextStyle, font: AbstractBitmapFont<any>, trimEnd: boolean): BitmapTextLayoutData;
