import { DOMAdapter } from '../../../../environment/adapter.mjs';
import { ExtensionType } from '../../../../extensions/Extensions.mjs';
import { UniformGroup } from '../../shared/shader/UniformGroup.mjs';
import { CanvasPool } from '../../shared/texture/CanvasPool.mjs';
import { BindGroup } from '../shader/BindGroup.mjs';
import { gpuUploadBufferImageResource } from './uploaders/gpuUploadBufferImageResource.mjs';
import { gpuUploadCompressedTextureResource, blockDataMap } from './uploaders/gpuUploadCompressedTextureResource.mjs';
import { gpuUploadImageResource } from './uploaders/gpuUploadImageSource.mjs';
import { gpuUploadVideoResource } from './uploaders/gpuUploadVideoSource.mjs';
import { GpuMipmapGenerator } from './utils/GpuMipmapGenerator.mjs';

"use strict";
class GpuTextureSystem {
  constructor(renderer) {
    this.managedTextures = [];
    this._gpuSources = /* @__PURE__ */ Object.create(null);
    this._gpuSamplers = /* @__PURE__ */ Object.create(null);
    this._bindGroupHash = /* @__PURE__ */ Object.create(null);
    this._textureViewHash = /* @__PURE__ */ Object.create(null);
    this._uploads = {
      image: gpuUploadImageResource,
      buffer: gpuUploadBufferImageResource,
      video: gpuUploadVideoResource,
      compressed: gpuUploadCompressedTextureResource
    };
    this._renderer = renderer;
  }
  contextChange(gpu) {
    this._gpu = gpu;
  }
  initSource(source) {
    if (source.autoGenerateMipmaps) {
      const biggestDimension = Math.max(source.pixelWidth, source.pixelHeight);
      source.mipLevelCount = Math.floor(Math.log2(biggestDimension)) + 1;
    }
    let usage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST;
    if (source.uploadMethodId !== "compressed") {
      usage |= GPUTextureUsage.RENDER_ATTACHMENT;
      usage |= GPUTextureUsage.COPY_SRC;
    }
    const blockData = blockDataMap[source.format] || { blockBytes: 4, blockWidth: 1, blockHeight: 1 };
    const width = Math.ceil(source.pixelWidth / blockData.blockWidth) * blockData.blockWidth;
    const height = Math.ceil(source.pixelHeight / blockData.blockHeight) * blockData.blockHeight;
    const textureDescriptor = {
      label: source.label,
      size: { width, height },
      format: source.format,
      sampleCount: source.sampleCount,
      mipLevelCount: source.mipLevelCount,
      dimension: source.dimension,
      usage
    };
    const gpuTexture = this._gpu.device.createTexture(textureDescriptor);
    this._gpuSources[source.uid] = gpuTexture;
    if (!this.managedTextures.includes(source)) {
      source.on("update", this.onSourceUpdate, this);
      source.on("resize", this.onSourceResize, this);
      source.on("destroy", this.onSourceDestroy, this);
      source.on("unload", this.onSourceUnload, this);
      source.on("updateMipmaps", this.onUpdateMipmaps, this);
      this.managedTextures.push(source);
    }
    this.onSourceUpdate(source);
    return gpuTexture;
  }
  onSourceUpdate(source) {
    const gpuTexture = this.getGpuSource(source);
    if (!gpuTexture)
      return;
    if (this._uploads[source.uploadMethodId]) {
      this._uploads[source.uploadMethodId].upload(source, gpuTexture, this._gpu);
    }
    if (source.autoGenerateMipmaps && source.mipLevelCount > 1) {
      this.onUpdateMipmaps(source);
    }
  }
  onSourceUnload(source) {
    const gpuTexture = this._gpuSources[source.uid];
    if (gpuTexture) {
      this._gpuSources[source.uid] = null;
      gpuTexture.destroy();
    }
  }
  onUpdateMipmaps(source) {
    if (!this._mipmapGenerator) {
      this._mipmapGenerator = new GpuMipmapGenerator(this._gpu.device);
    }
    const gpuTexture = this.getGpuSource(source);
    this._mipmapGenerator.generateMipmap(gpuTexture);
  }
  onSourceDestroy(source) {
    source.off("update", this.onSourceUpdate, this);
    source.off("unload", this.onSourceUnload, this);
    source.off("destroy", this.onSourceDestroy, this);
    source.off("resize", this.onSourceResize, this);
    source.off("updateMipmaps", this.onUpdateMipmaps, this);
    this.managedTextures.splice(this.managedTextures.indexOf(source), 1);
    this.onSourceUnload(source);
  }
  onSourceResize(source) {
    const gpuTexture = this._gpuSources[source.uid];
    if (!gpuTexture) {
      this.initSource(source);
    } else if (gpuTexture.width !== source.pixelWidth || gpuTexture.height !== source.pixelHeight) {
      this._textureViewHash[source.uid] = null;
      this._bindGroupHash[source.uid] = null;
      this.onSourceUnload(source);
      this.initSource(source);
    }
  }
  _initSampler(sampler) {
    this._gpuSamplers[sampler._resourceId] = this._gpu.device.createSampler(sampler);
    return this._gpuSamplers[sampler._resourceId];
  }
  getGpuSampler(sampler) {
    return this._gpuSamplers[sampler._resourceId] || this._initSampler(sampler);
  }
  getGpuSource(source) {
    return this._gpuSources[source.uid] || this.initSource(source);
  }
  /**
   * this returns s bind group for a specific texture, the bind group contains
   * - the texture source
   * - the texture style
   * - the texture matrix
   * This is cached so the bind group should only be created once per texture
   * @param texture - the texture you want the bindgroup for
   * @returns the bind group for the texture
   */
  getTextureBindGroup(texture) {
    return this._bindGroupHash[texture.uid] ?? this._createTextureBindGroup(texture);
  }
  _createTextureBindGroup(texture) {
    const source = texture.source;
    this._bindGroupHash[texture.uid] = new BindGroup({
      0: source,
      1: source.style,
      2: new UniformGroup({
        uTextureMatrix: { type: "mat3x3<f32>", value: texture.textureMatrix.mapCoord }
      })
    });
    return this._bindGroupHash[texture.uid];
  }
  getTextureView(texture) {
    const source = texture.source;
    return this._textureViewHash[source.uid] ?? this._createTextureView(source);
  }
  _createTextureView(texture) {
    this._textureViewHash[texture.uid] = this.getGpuSource(texture).createView();
    return this._textureViewHash[texture.uid];
  }
  generateCanvas(texture) {
    const renderer = this._renderer;
    const commandEncoder = renderer.gpu.device.createCommandEncoder();
    const canvas = DOMAdapter.get().createCanvas();
    canvas.width = texture.source.pixelWidth;
    canvas.height = texture.source.pixelHeight;
    const context = canvas.getContext("webgpu");
    context.configure({
      device: renderer.gpu.device,
      // eslint-disable-next-line max-len
      usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.COPY_SRC,
      format: DOMAdapter.get().getNavigator().gpu.getPreferredCanvasFormat(),
      alphaMode: "premultiplied"
    });
    commandEncoder.copyTextureToTexture({
      texture: renderer.texture.getGpuSource(texture.source),
      origin: {
        x: 0,
        y: 0
      }
    }, {
      texture: context.getCurrentTexture()
    }, {
      width: canvas.width,
      height: canvas.height
    });
    renderer.gpu.device.queue.submit([commandEncoder.finish()]);
    return canvas;
  }
  getPixels(texture) {
    const webGPUCanvas = this.generateCanvas(texture);
    const canvasAndContext = CanvasPool.getOptimalCanvasAndContext(webGPUCanvas.width, webGPUCanvas.height);
    const context = canvasAndContext.context;
    context.drawImage(webGPUCanvas, 0, 0);
    const { width, height } = webGPUCanvas;
    const imageData = context.getImageData(0, 0, width, height);
    const pixels = new Uint8ClampedArray(imageData.data.buffer);
    CanvasPool.returnCanvasAndContext(canvasAndContext);
    return { pixels, width, height };
  }
  destroy() {
    this.managedTextures.slice().forEach((source) => this.onSourceDestroy(source));
    this.managedTextures = null;
    for (const k of Object.keys(this._bindGroupHash)) {
      const key = Number(k);
      const bindGroup = this._bindGroupHash[key];
      bindGroup?.destroy();
      this._bindGroupHash[key] = null;
    }
    this._gpu = null;
    this._mipmapGenerator = null;
    this._gpuSources = null;
    this._bindGroupHash = null;
    this._textureViewHash = null;
    this._gpuSamplers = null;
  }
}
/** @ignore */
GpuTextureSystem.extension = {
  type: [
    ExtensionType.WebGPUSystem
  ],
  name: "texture"
};

export { GpuTextureSystem };
//# sourceMappingURL=GpuTextureSystem.mjs.map
