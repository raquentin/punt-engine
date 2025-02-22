'use strict';

var Rectangle = require('../../../../maths/shapes/Rectangle.js');
var warn = require('../../../../utils/logging/warn.js');
var CanvasSource = require('../../shared/texture/sources/CanvasSource.js');
var _const = require('../const.js');
var GlRenderTarget = require('../GlRenderTarget.js');

"use strict";
class GlRenderTargetAdaptor {
  constructor() {
    this._clearColorCache = [0, 0, 0, 0];
    this._viewPortCache = new Rectangle.Rectangle();
  }
  init(renderer, renderTargetSystem) {
    this._renderer = renderer;
    this._renderTargetSystem = renderTargetSystem;
    renderer.runners.contextChange.add(this);
  }
  contextChange() {
    this._clearColorCache = [0, 0, 0, 0];
    this._viewPortCache = new Rectangle.Rectangle();
  }
  copyToTexture(sourceRenderSurfaceTexture, destinationTexture, originSrc, size, originDest) {
    const renderTargetSystem = this._renderTargetSystem;
    const renderer = this._renderer;
    const glRenderTarget = renderTargetSystem.getGpuRenderTarget(sourceRenderSurfaceTexture);
    const gl = renderer.gl;
    this.finishRenderPass(sourceRenderSurfaceTexture);
    gl.bindFramebuffer(gl.FRAMEBUFFER, glRenderTarget.resolveTargetFramebuffer);
    renderer.texture.bind(destinationTexture, 0);
    gl.copyTexSubImage2D(
      gl.TEXTURE_2D,
      0,
      originDest.x,
      originDest.y,
      originSrc.x,
      originSrc.y,
      size.width,
      size.height
    );
    return destinationTexture;
  }
  startRenderPass(renderTarget, clear = true, clearColor, viewport) {
    const renderTargetSystem = this._renderTargetSystem;
    const source = renderTarget.colorTexture;
    const gpuRenderTarget = renderTargetSystem.getGpuRenderTarget(renderTarget);
    let viewPortY = viewport.y;
    if (renderTarget.isRoot) {
      viewPortY = source.pixelHeight - viewport.height;
    }
    renderTarget.colorTextures.forEach((texture) => {
      this._renderer.texture.unbind(texture);
    });
    const gl = this._renderer.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, gpuRenderTarget.framebuffer);
    const viewPortCache = this._viewPortCache;
    if (viewPortCache.x !== viewport.x || viewPortCache.y !== viewPortY || viewPortCache.width !== viewport.width || viewPortCache.height !== viewport.height) {
      viewPortCache.x = viewport.x;
      viewPortCache.y = viewPortY;
      viewPortCache.width = viewport.width;
      viewPortCache.height = viewport.height;
      gl.viewport(
        viewport.x,
        viewPortY,
        viewport.width,
        viewport.height
      );
    }
    if (!gpuRenderTarget.depthStencilRenderBuffer && (renderTarget.stencil || renderTarget.depth)) {
      this._initStencil(gpuRenderTarget);
    }
    this.clear(renderTarget, clear, clearColor);
  }
  finishRenderPass(renderTarget) {
    const renderTargetSystem = this._renderTargetSystem;
    const glRenderTarget = renderTargetSystem.getGpuRenderTarget(renderTarget);
    if (!glRenderTarget.msaa)
      return;
    const gl = this._renderer.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, glRenderTarget.resolveTargetFramebuffer);
    gl.bindFramebuffer(gl.READ_FRAMEBUFFER, glRenderTarget.framebuffer);
    gl.blitFramebuffer(
      0,
      0,
      glRenderTarget.width,
      glRenderTarget.height,
      0,
      0,
      glRenderTarget.width,
      glRenderTarget.height,
      gl.COLOR_BUFFER_BIT,
      gl.NEAREST
    );
    gl.bindFramebuffer(gl.FRAMEBUFFER, glRenderTarget.framebuffer);
  }
  initGpuRenderTarget(renderTarget) {
    const renderer = this._renderer;
    const gl = renderer.gl;
    const glRenderTarget = new GlRenderTarget.GlRenderTarget();
    const colorTexture = renderTarget.colorTexture;
    if (CanvasSource.CanvasSource.test(colorTexture.resource)) {
      this._renderer.context.ensureCanvasSize(renderTarget.colorTexture.resource);
      glRenderTarget.framebuffer = null;
      return glRenderTarget;
    }
    this._initColor(renderTarget, glRenderTarget);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return glRenderTarget;
  }
  destroyGpuRenderTarget(gpuRenderTarget) {
    const gl = this._renderer.gl;
    if (gpuRenderTarget.framebuffer) {
      gl.deleteFramebuffer(gpuRenderTarget.framebuffer);
      gpuRenderTarget.framebuffer = null;
    }
    if (gpuRenderTarget.resolveTargetFramebuffer) {
      gl.deleteFramebuffer(gpuRenderTarget.resolveTargetFramebuffer);
      gpuRenderTarget.resolveTargetFramebuffer = null;
    }
    if (gpuRenderTarget.depthStencilRenderBuffer) {
      gl.deleteRenderbuffer(gpuRenderTarget.depthStencilRenderBuffer);
      gpuRenderTarget.depthStencilRenderBuffer = null;
    }
    gpuRenderTarget.msaaRenderBuffer.forEach((renderBuffer) => {
      gl.deleteRenderbuffer(renderBuffer);
    });
    gpuRenderTarget.msaaRenderBuffer = null;
  }
  clear(_renderTarget, clear, clearColor) {
    if (!clear)
      return;
    const renderTargetSystem = this._renderTargetSystem;
    if (typeof clear === "boolean") {
      clear = clear ? _const.CLEAR.ALL : _const.CLEAR.NONE;
    }
    const gl = this._renderer.gl;
    if (clear & _const.CLEAR.COLOR) {
      clearColor ?? (clearColor = renderTargetSystem.defaultClearColor);
      const clearColorCache = this._clearColorCache;
      const clearColorArray = clearColor;
      if (clearColorCache[0] !== clearColorArray[0] || clearColorCache[1] !== clearColorArray[1] || clearColorCache[2] !== clearColorArray[2] || clearColorCache[3] !== clearColorArray[3]) {
        clearColorCache[0] = clearColorArray[0];
        clearColorCache[1] = clearColorArray[1];
        clearColorCache[2] = clearColorArray[2];
        clearColorCache[3] = clearColorArray[3];
        gl.clearColor(clearColorArray[0], clearColorArray[1], clearColorArray[2], clearColorArray[3]);
      }
    }
    gl.clear(clear);
  }
  resizeGpuRenderTarget(renderTarget) {
    if (renderTarget.isRoot)
      return;
    const renderTargetSystem = this._renderTargetSystem;
    const glRenderTarget = renderTargetSystem.getGpuRenderTarget(renderTarget);
    this._resizeColor(renderTarget, glRenderTarget);
    if (renderTarget.stencil || renderTarget.depth) {
      this._resizeStencil(glRenderTarget);
    }
  }
  _initColor(renderTarget, glRenderTarget) {
    const renderer = this._renderer;
    const gl = renderer.gl;
    const resolveTargetFramebuffer = gl.createFramebuffer();
    glRenderTarget.resolveTargetFramebuffer = resolveTargetFramebuffer;
    gl.bindFramebuffer(gl.FRAMEBUFFER, resolveTargetFramebuffer);
    glRenderTarget.width = renderTarget.colorTexture.source.pixelWidth;
    glRenderTarget.height = renderTarget.colorTexture.source.pixelHeight;
    renderTarget.colorTextures.forEach((colorTexture, i) => {
      const source = colorTexture.source;
      if (source.antialias) {
        if (renderer.context.supports.msaa) {
          glRenderTarget.msaa = true;
        } else {
          warn.warn("[RenderTexture] Antialiasing on textures is not supported in WebGL1");
        }
      }
      renderer.texture.bindSource(source, 0);
      const glSource = renderer.texture.getGlSource(source);
      const glTexture = glSource.texture;
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0 + i,
        3553,
        // texture.target,
        glTexture,
        0
      );
    });
    if (glRenderTarget.msaa) {
      const viewFramebuffer = gl.createFramebuffer();
      glRenderTarget.framebuffer = viewFramebuffer;
      gl.bindFramebuffer(gl.FRAMEBUFFER, viewFramebuffer);
      renderTarget.colorTextures.forEach((_, i) => {
        const msaaRenderBuffer = gl.createRenderbuffer();
        glRenderTarget.msaaRenderBuffer[i] = msaaRenderBuffer;
      });
    } else {
      glRenderTarget.framebuffer = resolveTargetFramebuffer;
    }
    this._resizeColor(renderTarget, glRenderTarget);
  }
  _resizeColor(renderTarget, glRenderTarget) {
    const source = renderTarget.colorTexture.source;
    glRenderTarget.width = source.pixelWidth;
    glRenderTarget.height = source.pixelHeight;
    renderTarget.colorTextures.forEach((colorTexture, i) => {
      if (i === 0)
        return;
      colorTexture.source.resize(source.width, source.height, source._resolution);
    });
    if (glRenderTarget.msaa) {
      const renderer = this._renderer;
      const gl = renderer.gl;
      const viewFramebuffer = glRenderTarget.framebuffer;
      gl.bindFramebuffer(gl.FRAMEBUFFER, viewFramebuffer);
      renderTarget.colorTextures.forEach((colorTexture, i) => {
        const source2 = colorTexture.source;
        renderer.texture.bindSource(source2, 0);
        const glSource = renderer.texture.getGlSource(source2);
        const glInternalFormat = glSource.internalFormat;
        const msaaRenderBuffer = glRenderTarget.msaaRenderBuffer[i];
        gl.bindRenderbuffer(
          gl.RENDERBUFFER,
          msaaRenderBuffer
        );
        gl.renderbufferStorageMultisample(
          gl.RENDERBUFFER,
          4,
          glInternalFormat,
          source2.pixelWidth,
          source2.pixelHeight
        );
        gl.framebufferRenderbuffer(
          gl.FRAMEBUFFER,
          gl.COLOR_ATTACHMENT0 + i,
          gl.RENDERBUFFER,
          msaaRenderBuffer
        );
      });
    }
  }
  _initStencil(glRenderTarget) {
    if (glRenderTarget.framebuffer === null)
      return;
    const gl = this._renderer.gl;
    const depthStencilRenderBuffer = gl.createRenderbuffer();
    glRenderTarget.depthStencilRenderBuffer = depthStencilRenderBuffer;
    gl.bindRenderbuffer(
      gl.RENDERBUFFER,
      depthStencilRenderBuffer
    );
    gl.framebufferRenderbuffer(
      gl.FRAMEBUFFER,
      gl.DEPTH_STENCIL_ATTACHMENT,
      gl.RENDERBUFFER,
      depthStencilRenderBuffer
    );
    this._resizeStencil(glRenderTarget);
  }
  _resizeStencil(glRenderTarget) {
    const gl = this._renderer.gl;
    gl.bindRenderbuffer(
      gl.RENDERBUFFER,
      glRenderTarget.depthStencilRenderBuffer
    );
    if (glRenderTarget.msaa) {
      gl.renderbufferStorageMultisample(
        gl.RENDERBUFFER,
        4,
        gl.DEPTH24_STENCIL8,
        glRenderTarget.width,
        glRenderTarget.height
      );
    } else {
      gl.renderbufferStorage(
        gl.RENDERBUFFER,
        this._renderer.context.webGLVersion === 2 ? gl.DEPTH24_STENCIL8 : gl.DEPTH_STENCIL,
        glRenderTarget.width,
        glRenderTarget.height
      );
    }
  }
  postrender(renderTarget) {
    if (!this._renderer.context.multiView)
      return;
    if (CanvasSource.CanvasSource.test(renderTarget.colorTexture.resource)) {
      const contextCanvas = this._renderer.context.canvas;
      const canvasSource = renderTarget.colorTexture;
      canvasSource.context2D.drawImage(
        contextCanvas,
        0,
        canvasSource.pixelHeight - contextCanvas.height
      );
    }
  }
}

exports.GlRenderTargetAdaptor = GlRenderTargetAdaptor;
//# sourceMappingURL=GlRenderTargetAdaptor.js.map
