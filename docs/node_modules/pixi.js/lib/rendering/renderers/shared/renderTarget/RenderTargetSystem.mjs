import { Matrix } from '../../../../maths/matrix/Matrix.mjs';
import { Rectangle } from '../../../../maths/shapes/Rectangle.mjs';
import { CLEAR } from '../../gl/const.mjs';
import { calculateProjection } from '../../gpu/renderTarget/calculateProjection.mjs';
import { SystemRunner } from '../system/SystemRunner.mjs';
import { CanvasSource } from '../texture/sources/CanvasSource.mjs';
import { TextureSource } from '../texture/sources/TextureSource.mjs';
import { Texture } from '../texture/Texture.mjs';
import { getCanvasTexture } from '../texture/utils/getCanvasTexture.mjs';
import { isRenderingToScreen } from './isRenderingToScreen.mjs';
import { RenderTarget } from './RenderTarget.mjs';

"use strict";
class RenderTargetSystem {
  constructor(renderer) {
    /** This is the root viewport for the render pass*/
    this.rootViewPort = new Rectangle();
    /** the current viewport that the gpu is using */
    this.viewport = new Rectangle();
    /**
     * a runner that lets systems know if the active render target has changed.
     * Eg the Stencil System needs to know so it can manage the stencil buffer
     */
    this.onRenderTargetChange = new SystemRunner("onRenderTargetChange");
    /** the projection matrix that is used by the shaders based on the active render target and the viewport */
    this.projectionMatrix = new Matrix();
    /** the default clear color for render targets */
    this.defaultClearColor = [0, 0, 0, 0];
    /**
     * a hash that stores the render target for a given render surface. When you pass in a texture source,
     * a render target is created for it. This map stores and makes it easy to retrieve the render target
     */
    this._renderSurfaceToRenderTargetHash = /* @__PURE__ */ new Map();
    /** A hash that stores a gpu render target for a given render target. */
    this._gpuRenderTargetHash = /* @__PURE__ */ Object.create(null);
    /**
     * A stack that stores the render target and frame that is currently being rendered to.
     * When push is called, the current render target is stored in this stack.
     * When pop is called, the previous render target is restored.
     */
    this._renderTargetStack = [];
    this._renderer = renderer;
  }
  /** called when dev wants to finish a render pass */
  finishRenderPass() {
    this.adaptor.finishRenderPass(this.renderTarget);
  }
  /**
   * called when the renderer starts to render a scene.
   * @param options
   * @param options.target - the render target to render to
   * @param options.clear - the clear mode to use. Can be true or a CLEAR number 'COLOR | DEPTH | STENCIL' 0b111
   * @param options.clearColor - the color to clear to
   * @param options.frame - the frame to render to
   */
  renderStart({
    target,
    clear,
    clearColor,
    frame
  }) {
    this._renderTargetStack.length = 0;
    this.push(
      target,
      clear,
      clearColor,
      frame
    );
    this.rootViewPort.copyFrom(this.viewport);
    this.rootRenderTarget = this.renderTarget;
    this.renderingToScreen = isRenderingToScreen(this.rootRenderTarget);
  }
  postrender() {
    this.adaptor.postrender?.(this.rootRenderTarget);
  }
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
  bind(renderSurface, clear = true, clearColor, frame) {
    const renderTarget = this.getRenderTarget(renderSurface);
    const didChange = this.renderTarget !== renderTarget;
    this.renderTarget = renderTarget;
    this.renderSurface = renderSurface;
    const gpuRenderTarget = this.getGpuRenderTarget(renderTarget);
    if (renderTarget.pixelWidth !== gpuRenderTarget.width || renderTarget.pixelHeight !== gpuRenderTarget.height) {
      this.adaptor.resizeGpuRenderTarget(renderTarget);
      gpuRenderTarget.width = renderTarget.pixelWidth;
      gpuRenderTarget.height = renderTarget.pixelHeight;
    }
    const source = renderTarget.colorTexture;
    const viewport = this.viewport;
    const pixelWidth = source.pixelWidth;
    const pixelHeight = source.pixelHeight;
    if (!frame && renderSurface instanceof Texture) {
      frame = renderSurface.frame;
    }
    if (frame) {
      const resolution = source._resolution;
      viewport.x = frame.x * resolution + 0.5 | 0;
      viewport.y = frame.y * resolution + 0.5 | 0;
      viewport.width = frame.width * resolution + 0.5 | 0;
      viewport.height = frame.height * resolution + 0.5 | 0;
    } else {
      viewport.x = 0;
      viewport.y = 0;
      viewport.width = pixelWidth;
      viewport.height = pixelHeight;
    }
    calculateProjection(
      this.projectionMatrix,
      0,
      0,
      viewport.width / source.resolution,
      viewport.height / source.resolution,
      !renderTarget.isRoot
    );
    this.adaptor.startRenderPass(renderTarget, clear, clearColor, viewport);
    if (didChange) {
      this.onRenderTargetChange.emit(renderTarget);
    }
    return renderTarget;
  }
  clear(target, clear = CLEAR.ALL, clearColor) {
    if (!clear)
      return;
    if (target) {
      target = this.getRenderTarget(target);
    }
    this.adaptor.clear(
      target || this.renderTarget,
      clear,
      clearColor,
      this.viewport
    );
  }
  contextChange() {
    this._gpuRenderTargetHash = /* @__PURE__ */ Object.create(null);
  }
  /**
   * Push a render surface to the renderer. This will bind the render surface to the renderer,
   * @param renderSurface - the render surface to push
   * @param clear - the clear mode to use. Can be true or a CLEAR number 'COLOR | DEPTH | STENCIL' 0b111
   * @param clearColor - the color to clear to
   * @param frame - the frame to use when rendering to the render surface
   */
  push(renderSurface, clear = CLEAR.ALL, clearColor, frame) {
    const renderTarget = this.bind(renderSurface, clear, clearColor, frame);
    this._renderTargetStack.push({
      renderTarget,
      frame
    });
    return renderTarget;
  }
  /** Pops the current render target from the renderer and restores the previous render target. */
  pop() {
    this._renderTargetStack.pop();
    const currentRenderTargetData = this._renderTargetStack[this._renderTargetStack.length - 1];
    this.bind(currentRenderTargetData.renderTarget, false, null, currentRenderTargetData.frame);
  }
  /**
   * Gets the render target from the provide render surface. Eg if its a texture,
   * it will return the render target for the texture.
   * If its a render target, it will return the same render target.
   * @param renderSurface - the render surface to get the render target for
   * @returns the render target for the render surface
   */
  getRenderTarget(renderSurface) {
    if (renderSurface.isTexture) {
      renderSurface = renderSurface.source;
    }
    return this._renderSurfaceToRenderTargetHash.get(renderSurface) ?? this._initRenderTarget(renderSurface);
  }
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
  copyToTexture(sourceRenderSurfaceTexture, destinationTexture, originSrc, size, originDest) {
    if (originSrc.x < 0) {
      size.width += originSrc.x;
      originDest.x -= originSrc.x;
      originSrc.x = 0;
    }
    if (originSrc.y < 0) {
      size.height += originSrc.y;
      originDest.y -= originSrc.y;
      originSrc.y = 0;
    }
    const { pixelWidth, pixelHeight } = sourceRenderSurfaceTexture;
    size.width = Math.min(size.width, pixelWidth - originSrc.x);
    size.height = Math.min(size.height, pixelHeight - originSrc.y);
    return this.adaptor.copyToTexture(
      sourceRenderSurfaceTexture,
      destinationTexture,
      originSrc,
      size,
      originDest
    );
  }
  /**
   * ensures that we have a depth stencil buffer available to render to
   * This is used by the mask system to make sure we have a stencil buffer.
   */
  ensureDepthStencil() {
    if (!this.renderTarget.stencil) {
      this.renderTarget.stencil = true;
      this.adaptor.startRenderPass(this.renderTarget, false, null, this.viewport);
    }
  }
  /** nukes the render target system */
  destroy() {
    this._renderer = null;
    this._renderSurfaceToRenderTargetHash.forEach((renderTarget, key) => {
      if (renderTarget !== key) {
        renderTarget.destroy();
      }
    });
    this._renderSurfaceToRenderTargetHash.clear();
    this._gpuRenderTargetHash = /* @__PURE__ */ Object.create(null);
  }
  _initRenderTarget(renderSurface) {
    let renderTarget = null;
    if (CanvasSource.test(renderSurface)) {
      renderSurface = getCanvasTexture(renderSurface).source;
    }
    if (renderSurface instanceof RenderTarget) {
      renderTarget = renderSurface;
    } else if (renderSurface instanceof TextureSource) {
      renderTarget = new RenderTarget({
        colorTextures: [renderSurface]
      });
      if (CanvasSource.test(renderSurface.source.resource)) {
        renderTarget.isRoot = true;
      }
      renderSurface.once("destroy", () => {
        renderTarget.destroy();
        this._renderSurfaceToRenderTargetHash.delete(renderSurface);
        const gpuRenderTarget = this._gpuRenderTargetHash[renderTarget.uid];
        if (gpuRenderTarget) {
          this._gpuRenderTargetHash[renderTarget.uid] = null;
          this.adaptor.destroyGpuRenderTarget(gpuRenderTarget);
        }
      });
    }
    this._renderSurfaceToRenderTargetHash.set(renderSurface, renderTarget);
    return renderTarget;
  }
  getGpuRenderTarget(renderTarget) {
    return this._gpuRenderTargetHash[renderTarget.uid] || (this._gpuRenderTargetHash[renderTarget.uid] = this.adaptor.initGpuRenderTarget(renderTarget));
  }
}

export { RenderTargetSystem };
//# sourceMappingURL=RenderTargetSystem.mjs.map
