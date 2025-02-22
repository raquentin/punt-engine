import type { BUFFER_TYPE } from './const';
export declare class GlBuffer {
    buffer: WebGLBuffer;
    updateID: number;
    byteLength: number;
    type: number;
    constructor(buffer: WebGLBuffer, type: BUFFER_TYPE);
}
