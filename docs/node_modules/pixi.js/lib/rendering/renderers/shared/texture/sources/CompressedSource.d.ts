import { TextureSource } from './TextureSource';
import type { TextureSourceOptions } from './TextureSource';
export declare class CompressedSource extends TextureSource<Uint8Array[]> {
    readonly uploadMethodId = "compressed";
    constructor(options: TextureSourceOptions);
}
