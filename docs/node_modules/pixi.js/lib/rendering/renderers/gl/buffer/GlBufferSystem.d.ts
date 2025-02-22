import { ExtensionType } from '../../../../extensions/Extensions';
import { GlBuffer } from './GlBuffer';
import type { Buffer } from '../../shared/buffer/Buffer';
import type { System } from '../../shared/system/System';
import type { WebGLRenderer } from '../WebGLRenderer';
/**
 * System plugin to the renderer to manage buffers.
 *
 * WebGL uses Buffers as a way to store objects to the GPU.
 * This system makes working with them a lot easier.
 *
 * Buffers are used in three main places in WebGL
 * - geometry information
 * - Uniform information (via uniform buffer objects - a WebGL 2 only feature)
 * - Transform feedback information. (WebGL 2 only feature)
 *
 * This system will handle the binding of buffers to the GPU as well as uploading
 * them. With this system, you never need to work directly with GPU buffers, but instead work with
 * the Buffer class.
 * @class
 * @memberof rendering
 */
export declare class GlBufferSystem implements System {
    /** @ignore */
    static extension: {
        readonly type: readonly [ExtensionType.WebGLSystem];
        readonly name: "buffer";
    };
    private _gl;
    private _gpuBuffers;
    /** Cache keeping track of the base bound buffer bases */
    private readonly _boundBufferBases;
    private _renderer;
    /**
     * @param {Renderer} renderer - The renderer this System works for.
     */
    constructor(renderer: WebGLRenderer);
    /**
     * @ignore
     */
    destroy(): void;
    /** Sets up the renderer context and necessary buffers. */
    protected contextChange(): void;
    getGlBuffer(buffer: Buffer): GlBuffer;
    /**
     * This binds specified buffer. On first run, it will create the webGL buffers for the context too
     * @param buffer - the buffer to bind to the renderer
     */
    bind(buffer: Buffer): void;
    /**
     * Binds an uniform buffer to at the given index.
     *
     * A cache is used so a buffer will not be bound again if already bound.
     * @param buffer - the buffer to bind
     * @param index - the base index to bind it to.
     */
    bindBufferBase(buffer: Buffer, index: number): void;
    /**
     * Binds a buffer whilst also binding its range.
     * This will make the buffer start from the offset supplied rather than 0 when it is read.
     * @param buffer - the buffer to bind
     * @param index - the base index to bind at, defaults to 0
     * @param offset - the offset to bind at (this is blocks of 256). 0 = 0, 1 = 256, 2 = 512 etc
     */
    bindBufferRange(buffer: Buffer, index?: number, offset?: number): void;
    /**
     * Will ensure the data in the buffer is uploaded to the GPU.
     * @param {Buffer} buffer - the buffer to update
     */
    updateBuffer(buffer: Buffer): GlBuffer;
    /** dispose all WebGL resources of all managed buffers */
    destroyAll(): void;
    /**
     * Disposes buffer
     * @param {Buffer} buffer - buffer with data
     * @param {boolean} [contextLost=false] - If context was lost, we suppress deleteVertexArray
     */
    protected onBufferDestroy(buffer: Buffer, contextLost?: boolean): void;
    /**
     * creates and attaches a GLBuffer object tied to the current context.
     * @param buffer
     * @protected
     */
    protected createGLBuffer(buffer: Buffer): GlBuffer;
}
