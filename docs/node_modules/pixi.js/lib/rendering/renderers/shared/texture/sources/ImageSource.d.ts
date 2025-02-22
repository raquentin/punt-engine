import { TextureSource } from './TextureSource';
import type { ICanvas } from '../../../../../environment/canvas/ICanvas';
import type { ExtensionMetadata } from '../../../../../extensions/Extensions';
import type { TextureSourceOptions } from './TextureSource';
export type ImageResource = ImageBitmap | HTMLCanvasElement | OffscreenCanvas | ICanvas | VideoFrame | HTMLImageElement | HTMLVideoElement;
export declare class ImageSource extends TextureSource<ImageResource> {
    static extension: ExtensionMetadata;
    uploadMethodId: string;
    constructor(options: TextureSourceOptions<ImageResource>);
    static test(resource: any): resource is ImageResource;
}
