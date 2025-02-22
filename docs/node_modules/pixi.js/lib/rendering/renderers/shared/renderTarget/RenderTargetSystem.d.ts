import { Matrix } from '../../../../maths/matrix/Matrix';
import { Rectangle } from '../../../../maths/shapes/Rectangle';
import { CLEAR } from '../../gl/const';
import { SystemRunner } from '../system/SystemRunner';
import { TextureSource } from '../texture/sources/TextureSource';
import { Texture } from '../texture/Texture';
import { RenderTarget } from './RenderTarget';
import type { RgbaArray } from '../../../../color/Color';
import type { ICanvas } from '../../../../environment/canvas/ICanvas';
import type { CLEAR_OR_BOOL } from '../../gl/const';
import type { GlRenderTarget } from '../../gl/GlRenderTarget';
import type { GpuRenderTarget } from '../../gpu/renderTarget/GpuRenderTarget';
import type { Renderer } from '../../types';
import type { System } from '../system/System';
import type { BindableTexture } from '../texture/Texture';
/**
 * A render surface is a texture, canvas, or render target
 * @memberof rendering
 * @see environment.ICanvas
 * @see rendering.Texture
 * @see rendering.RenderTarget
 */
export type RenderSurface = ICanvas | BindableTexture | RenderTarget;
/**
 * An adaptor interface for RenderTargetSystem to support WebGL and WebGPU.
 * This is used internally by the renderer, and is not intended to be used directly.
 * @ignore
 */
export interface RenderTargetAdaptor<RENDER_TARGET extends GlRenderTarget | GpuRenderTarget> {
    init(
    /** the renderer */
    renderer: Renderer, 
    /** the render target system */
    renderTargetSystem: RenderTargetSystem<RENDER_TARGET>): void;
    /** A function copies the contents of a render surface to a texture */
    copyToTexture(
    /** the render surface to copy from  */
    sourceRenderSurfaceTexture: RenderTarget, 
    /** the texture to copy to */
    destinationTexture: Texture, 
    /** the origin of the copy */
    originSrc: {
        x: number;
        y: number;
    }, 
    /** the size of the copy */
    size: {
        width: number;
        height: number;
    }, 
    /** the destination origin (top left to paste from!) */
    originDest?: {
        x: number;
        y: number;
    }): Texture;
    /** starts a render pass on the render target */
    startRenderPass(
    /** the render target to start the render pass on */
    renderTarget: RenderTarget, clear: CLEAR_OR_BOOL, 
    /** the color to clear to */
    clearColor?: RgbaArray, 
    /** the viewport to use */
    viewport?: Rectangle): void;
    /** clears the current render target to the specified color */
    clear(
    /** the render target to clear */
    renderTarget: RenderTarget, 
    /** the clear mode to use. Can be true or a CLEAR number 'COLOR | DEPTH | STENCIL' 0b111 */
    clear: CLEAR_OR_BOOL, 
    /** the color to clear to   */
    clearColor?: RgbaArray, 
    /** the viewport to use */
    viewport?: Rectangle): void;
    /** finishes the current render pass */
    finishRenderPass(renderTarget: RenderTarget): void;
    /** called after the render pass is finished */
    postrender?(renderTarget: RenderTarget): void;
    /**
     * initializes a gpu render target. Both renderers use this function to initialize a gpu render target
     * Its different type of object depending on the renderer.
     */
    initGpuRenderTarget(
    /** the render target to initialize */
    renderTarget: RenderTarget): RENDER_TARGET;
    /** called when a render target is resized */
    resizeGpuRenderTarget(
    /** the render target to resize */
    renderTarget: RenderTarget): void;
    /** destroys the gpu render target */
    destroyGpuRenderTarget(
    /** the render target to destroy */
    gpuRenderTarget: RENDER_TARGET): void;
}
/**
 * A system that manages render targets. A render target is essentially a place where the shaders can color in the pixels.
 * The render target system is responsible for binding the render target to the renderer, and managing the viewport.
 * Render targets can be pushed and popped.
 *
 * To make it easier, you can also bind textures and canvases too. This will automatically create a render target for you.
 * The render target itself is a lot more powerful than just a texture or canvas,
 * as it can have multiple textures attached to it.
 * It will also give ou fine grain control over the stencil buffer / depth texture.
 * @example
 *
 * ```js
 *
 * // create a render target
 * const renderTarget = new RenderTarget({
 *   colorTextures: [new TextureSource({ width: 100, height: 100 })],
 * });
 *
 * // bind the render target
 * renderer.renderTarget.bind(renderTarget);
 *
 * // draw something!
 * ```
 * @memberof rendering
 */
export declare class RenderTargetSystem<RENDER_TARGET extends GlRenderTarget | GpuRenderTarget> implements System {
    /** When rendering of a scene begins, this is where the root render surface is stored */
    rootRenderTarget: RenderTarget;
    /** This is the root viewport for the render pass*/
    rootViewPort: Rectangle;
    /** A boolean that lets the dev know if the current render pass is rendering to the screen. Used by some plugins */
    renderingToScreen: boolean;
    /** the current active render target */
    renderTarget: RenderTarget;
    /** the current active render surface that the render target is created from */
    renderSurface: RenderSurface;
    /** the current viewport that the gpu is using */
    readonly viewport: Rectangle;
    /**
     * a runner that lets systems know if the active render target has changed.
     * Eg the Stencil System needs to know so it can manage the stencil buffer
     */
    readonly onRenderTargetChange: SystemRunner;
    /** the projection matrix that is used by the shaders based on the active render target and the viewport */
    readonly projectionMatrix: Matrix;
    /** the default clear color for render targets */
    readonly defaultClearColor: RgbaArray;
    /** a reference to the adaptor that interfaces with WebGL / WebGP */
    readonly adaptor: RenderTargetAdaptor<RENDER_TARGET>;
    /**
     * a hash that stores the render target for a given render surface. When you pass in a texture source,
     * a render target is created for it. This map stores and makes it easy to retrieve the render target
     */
    private readonly _renderSurfaceToRenderTargetHash;
    /** A hash that stores a gpu render target for a given render target. */
    private _gpuRenderTargetHash;
    /**
     * A stack that stores the render target and frame that is currently being rendered to.
     * When push is called, the current render target is stored in this stack.
     * When pop is called, the previous render target is restored.
     */
    private readonly _renderTargetStack;
    /** A reference to the renderer */
    private readonly _renderer;
    constructor(renderer: Renderer);
    /** called when dev wants to finish a render pass */
    finishRenderPass(): void;
    /**
     * called when the renderer starts to render a scene.
     * @param options
     * @param options.target - the render target to render to
     * @param options.clear - the clear mode to use. Can be true or a CLEAR number 'COLOR | DEPTH | STENCIL' 0b111
     * @param options.clearColor - the color to clear to
     * @param options.frame - the frame to render to
     */
    renderStart({ target, clear, clearColor, frame }: {
        target: RenderSurface;
        clear: CLEAR_OR_BOOL;
        clearColor: RgbaArray;
        frame?: Rectangle;
    }): void;
    postrender(): void;
    /**
     * Binding a render surface! This is the main function of the render target system.
     * It will take the RenderSurface (which can be a texture, canvas, or render target) and bind it to the renderer.
     * Once bound all draw calls will be rendered to the render surface.
     *
     * If a frame is not provide and the render surface is a texture, the frame of the texture will be used.
     * @param renderSurface - the render surface to bind
     * @param clear - the clear mode to use. Can be true or a CLEAR number 'COLOR | DEPTH | STENCIL' 0b111
     * @param clearColor - the color to clear to
     * @param frame - the frame to render to
     * @returns the render target that was bound
     */
    bind(renderSurface: RenderSurface, clear?: CLEAR_OR_BOOL, clearColor?: RgbaArray, frame?: Rectangle): RenderTarget;
    clear(target?: RenderSurface, clear?: CLEAR_OR_BOOL, clearColor?: RgbaArray): void;
    protected contextChange(): void;
    /**
     * Push a render surface to the renderer. This will bind the render surface to the renderer,
     * @param renderSurface - the render surface to push
     * @param clear - the clear mode to use. Can be true or a CLEAR number 'COLOR | DEPTH | STENCIL' 0b111
     * @param clearColor - the color to clear to
     * @param frame - the frame to use when rendering to the render surface
     */
    push(renderSurface: RenderSurface, clear?: CLEAR | boolean, clearColor?: RgbaArray, frame?: Rectangle): RenderTarget;
    /** Pops the current render target from the renderer and restores the previous render target. */
    pop(): void;
    /**
     * Gets the render target from the provide render surface. Eg if its a texture,
     * it will return the render target for the texture.
     * If its a render target, it will return the same render target.
     * @param renderSurface - the render surface to get the render target for
     * @returns the render target for the render surface
     */
    getRenderTarget(renderSurface: RenderSurface): RenderTarget;
    /**
     * Copies a render surface to another texture
     * @param sourceRenderSurfaceTexture - the render surface to copy from
     * @param destinationTexture - the texture to copy to
     * @param originSrc - the origin of the copy
     * @param originSrc.x - the x origin of the copy
     * @param originSrc.y - the y origin of the copy
     * @param size - the size of the copy
     * @param size.width - the width of the copy
     * @param size.height - the height of the copy
     * @param originDest - the destination origin (top left to paste from!)
     * @param originDest.x - the x origin of the paste
     * @param originDest.y - the y origin of the paste
     */
    copyToTexture(sourceRenderSurfaceTexture: RenderTarget, destinationTexture: Texture, originSrc: {
        x: number;
        y: number;
    }, size: {
        width: number;
        height: number;
    }, originDest: {
        x: number;
        y: number;
    }): Texture<TextureSource<any>>;
    /**
     * ensures that we have a depth stencil buffer available to render to
     * This is used by the mask system to make sure we have a stencil buffer.
     */
    ensureDepthStencil(): void;
    /** nukes the render target system */
    destroy(): void;
    private _initRenderTarget;
    getGpuRenderTarget(renderTarget: RenderTarget): RENDER_TARGET;
}
