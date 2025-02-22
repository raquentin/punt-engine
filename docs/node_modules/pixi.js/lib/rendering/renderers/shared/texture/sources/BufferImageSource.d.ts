import { TextureSource } from './TextureSource';
import type { ExtensionMetadata } from '../../../../../extensions/Extensions';
import type { TypedArray } from '../../buffer/Buffer';
import type { TextureSourceOptions } from './TextureSource';
export interface BufferSourceOptions extends TextureSourceOptions<TypedArray | ArrayBuffer> {
    width: number;
    height: number;
}
export declare class BufferImageSource extends TextureSource<TypedArray | ArrayBuffer> {
    static extension: ExtensionMetadata;
    uploadMethodId: string;
    constructor(options: BufferSourceOptions);
    static test(resource: any): resource is TypedArray | ArrayBuffer;
}
