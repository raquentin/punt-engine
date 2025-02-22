import type { CompressedSource } from '../../../shared/texture/sources/CompressedSource';
import type { GpuTextureUploader } from './GpuTextureUploader';
export declare const blockDataMap: Record<string, {
    blockBytes: number;
    blockWidth: number;
    blockHeight: number;
}>;
export declare const gpuUploadCompressedTextureResource: GpuTextureUploader<CompressedSource>;
