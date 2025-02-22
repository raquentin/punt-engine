import { DOMAdapter } from '../../../../environment/adapter.mjs';
import { ExtensionType } from '../../../../extensions/Extensions.mjs';
import { Texture } from '../../shared/texture/Texture.mjs';
import { GlTexture } from './GlTexture.mjs';
import { glUploadBufferImageResource } from './uploaders/glUploadBufferImageResource.mjs';
import { glUploadCompressedTextureResource } from './uploaders/glUploadCompressedTextureResource.mjs';
import { glUploadImageResource } from './uploaders/glUploadImageResource.mjs';
import { glUploadVideoResource } from './uploaders/glUploadVideoResource.mjs';
import { applyStyleParams } from './utils/applyStyleParams.mjs';
import { mapFormatToGlFormat } from './utils/mapFormatToGlFormat.mjs';
import { mapFormatToGlInternalFormat } from './utils/mapFormatToGlInternalFormat.mjs';
import { mapFormatToGlType } from './utils/mapFormatToGlType.mjs';
import './utils/unpremultiplyAlpha.mjs';

"use strict";
const BYTES_PER_PIXEL = 4;
class GlTextureSystem {
  constructor(renderer) {
    this.managedTextures = [];
    this._glTextures = /* @__PURE__ */ Object.create(null);
    this._glSamplers = /* @__PURE__ */ Object.create(null);
    this._boundTextures = [];
    this._activeTextureLocation = -1;
    this._boundSamplers = /* @__PURE__ */ Object.create(null);
    this._uploads = {
      image: glUploadImageResource,
      buffer: glUploadBufferImageResource,
      video: glUploadVideoResource,
      compressed: glUploadCompressedTextureResource
    };
    // TODO - separate samplers will be a cool thing to add, but not right now!
    this._useSeparateSamplers = false;
    this._renderer = renderer;
  }
  contextChange(gl) {
    this._gl = gl;
    if (!this._mapFormatToInternalFormat) {
      this._mapFormatToInternalFormat = mapFormatToGlInternalFormat(gl, this._renderer.context.extensions);
      this._mapFormatToType = mapFormatToGlType(gl);
      this._mapFormatToFormat = mapFormatToGlFormat(gl);
    }
    this._glTextures = /* @__PURE__ */ Object.create(null);
    this._glSamplers = /* @__PURE__ */ Object.create(null);
    this._boundSamplers = /* @__PURE__ */ Object.create(null);
    for (let i = 0; i < 16; i++) {
      this.bind(Texture.EMPTY, i);
    }
  }
  initSource(source) {
    this.bind(source);
  }
  bind(texture, location = 0) {
    const source = texture.source;
    if (texture) {
      this.bindSource(source, location);
      if (this._useSeparateSamplers) {
        this._bindSampler(source.style, location);
      }
    } else {
      this.bindSource(null, location);
      if (this._useSeparateSamplers) {
        this._bindSampler(null, location);
      }
    }
  }
  bindSource(source, location = 0) {
    const gl = this._gl;
    source._touched = this._renderer.textureGC.count;
    if (this._boundTextures[location] !== source) {
      this._boundTextures[location] = source;
      this._activateLocation(location);
      source = source || Texture.EMPTY.source;
      const glTexture = this.getGlSource(source);
      gl.bindTexture(glTexture.target, glTexture.texture);
    }
  }
  _bindSampler(style, location = 0) {
    const gl = this._gl;
    if (!style) {
      this._boundSamplers[location] = null;
      gl.bindSampler(location, null);
      return;
    }
    const sampler = this._getGlSampler(style);
    if (this._boundSamplers[location] !== sampler) {
      this._boundSamplers[location] = sampler;
      gl.bindSampler(location, sampler);
    }
  }
  unbind(texture) {
    const source = texture.source;
    const boundTextures = this._boundTextures;
    const gl = this._gl;
    for (let i = 0; i < boundTextures.length; i++) {
      if (boundTextures[i] === source) {
        this._activateLocation(i);
        const glTexture = this.getGlSource(source);
        gl.bindTexture(glTexture.target, null);
        boundTextures[i] = null;
      }
    }
  }
  _activateLocation(location) {
    if (this._activeTextureLocation !== location) {
      this._activeTextureLocation = location;
      this._gl.activeTexture(this._gl.TEXTURE0 + location);
    }
  }
  _initSource(source) {
    const gl = this._gl;
    const glTexture = new GlTexture(gl.createTexture());
    glTexture.type = this._mapFormatToType[source.format];
    glTexture.internalFormat = this._mapFormatToInternalFormat[source.format];
    glTexture.format = this._mapFormatToFormat[source.format];
    if (source.autoGenerateMipmaps && (this._renderer.context.supports.nonPowOf2mipmaps || source.isPowerOfTwo)) {
      const biggestDimension = Math.max(source.width, source.height);
      source.mipLevelCount = Math.floor(Math.log2(biggestDimension)) + 1;
    }
    this._glTextures[source.uid] = glTexture;
    if (!this.managedTextures.includes(source)) {
      source.on("update", this.onSourceUpdate, this);
      source.on("resize", this.onSourceUpdate, this);
      source.on("styleChange", this.onStyleChange, this);
      source.on("destroy", this.onSourceDestroy, this);
      source.on("unload", this.onSourceUnload, this);
      source.on("updateMipmaps", this.onUpdateMipmaps, this);
      this.managedTextures.push(source);
    }
    this.onSourceUpdate(source);
    this.updateStyle(source, false);
    return glTexture;
  }
  onStyleChange(source) {
    this.updateStyle(source, false);
  }
  updateStyle(source, firstCreation) {
    const gl = this._gl;
    const glTexture = this.getGlSource(source);
    gl.bindTexture(gl.TEXTURE_2D, glTexture.texture);
    this._boundTextures[this._activeTextureLocation] = source;
    applyStyleParams(
      source.style,
      gl,
      source.mipLevelCount > 1,
      this._renderer.context.extensions.anisotropicFiltering,
      "texParameteri",
      gl.TEXTURE_2D,
      // will force a clamp to edge if the texture is not a power of two
      !this._renderer.context.supports.nonPowOf2wrapping && !source.isPowerOfTwo,
      firstCreation
    );
  }
  onSourceUnload(source) {
    const glTexture = this._glTextures[source.uid];
    if (!glTexture)
      return;
    this.unbind(source);
    this._glTextures[source.uid] = null;
    this._gl.deleteTexture(glTexture.texture);
  }
  onSourceUpdate(source) {
    const gl = this._gl;
    const glTexture = this.getGlSource(source);
    gl.bindTexture(gl.TEXTURE_2D, glTexture.texture);
    this._boundTextures[this._activeTextureLocation] = source;
    if (this._uploads[source.uploadMethodId]) {
      this._uploads[source.uploadMethodId].upload(source, glTexture, gl, this._renderer.context.webGLVersion);
    } else {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, source.pixelWidth, source.pixelHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    }
    if (source.autoGenerateMipmaps && source.mipLevelCount > 1) {
      this.onUpdateMipmaps(source, false);
    }
  }
  onUpdateMipmaps(source, bind = true) {
    if (bind)
      this.bindSource(source, 0);
    const glTexture = this.getGlSource(source);
    this._gl.generateMipmap(glTexture.target);
  }
  onSourceDestroy(source) {
    source.off("destroy", this.onSourceDestroy, this);
    source.off("update", this.onSourceUpdate, this);
    source.off("resize", this.onSourceUpdate, this);
    source.off("unload", this.onSourceUnload, this);
    source.off("styleChange", this.onStyleChange, this);
    source.off("updateMipmaps", this.onUpdateMipmaps, this);
    this.managedTextures.splice(this.managedTextures.indexOf(source), 1);
    this.onSourceUnload(source);
  }
  _initSampler(style) {
    const gl = this._gl;
    const glSampler = this._gl.createSampler();
    this._glSamplers[style._resourceId] = glSampler;
    applyStyleParams(
      style,
      gl,
      this._boundTextures[this._activeTextureLocation].mipLevelCount > 1,
      this._renderer.context.extensions.anisotropicFiltering,
      "samplerParameteri",
      glSampler,
      false,
      true
    );
    return this._glSamplers[style._resourceId];
  }
  _getGlSampler(sampler) {
    return this._glSamplers[sampler._resourceId] || this._initSampler(sampler);
  }
  getGlSource(source) {
    return this._glTextures[source.uid] || this._initSource(source);
  }
  generateCanvas(texture) {
    const { pixels, width, height } = this.getPixels(texture);
    const canvas = DOMAdapter.get().createCanvas();
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const imageData = ctx.createImageData(width, height);
      imageData.data.set(pixels);
      ctx.putImageData(imageData, 0, 0);
    }
    return canvas;
  }
  getPixels(texture) {
    const resolution = texture.source.resolution;
    const frame = texture.frame;
    const width = Math.max(Math.round(frame.width * resolution), 1);
    const height = Math.max(Math.round(frame.height * resolution), 1);
    const pixels = new Uint8Array(BYTES_PER_PIXEL * width * height);
    const renderer = this._renderer;
    const renderTarget = renderer.renderTarget.getRenderTarget(texture);
    const glRenterTarget = renderer.renderTarget.getGpuRenderTarget(renderTarget);
    const gl = renderer.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, glRenterTarget.resolveTargetFramebuffer);
    gl.readPixels(
      Math.round(frame.x * resolution),
      Math.round(frame.y * resolution),
      width,
      height,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      pixels
    );
    if (false) {
      unpremultiplyAlpha(pixels);
    }
    return { pixels: new Uint8ClampedArray(pixels.buffer), width, height };
  }
  destroy() {
    this.managedTextures.slice().forEach((source) => this.onSourceDestroy(source));
    this.managedTextures = null;
    this._renderer = null;
  }
}
/** @ignore */
GlTextureSystem.extension = {
  type: [
    ExtensionType.WebGLSystem
  ],
  name: "texture"
};

export { GlTextureSystem };
//# sourceMappingURL=GlTextureSystem.mjs.map
