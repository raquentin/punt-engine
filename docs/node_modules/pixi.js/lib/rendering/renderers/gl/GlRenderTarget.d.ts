/**
 * Represents a render target.
 * @memberof rendering
 * @ignore
 */
export declare class GlRenderTarget {
    width: number;
    height: number;
    msaa: boolean;
    framebuffer: WebGLFramebuffer;
    resolveTargetFramebuffer: WebGLFramebuffer;
    msaaRenderBuffer: WebGLRenderbuffer[];
    depthStencilRenderBuffer: WebGLRenderbuffer;
}
