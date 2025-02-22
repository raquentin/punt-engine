import { GlProgram } from '../rendering/renderers/gl/shader/GlProgram.mjs';
import { GpuProgram } from '../rendering/renderers/gpu/shader/GpuProgram.mjs';
import { Shader } from '../rendering/renderers/shared/shader/Shader.mjs';
import { State } from '../rendering/renderers/shared/state/State.mjs';

"use strict";
const _Filter = class _Filter extends Shader {
  /**
   * @param options - The optional parameters of this filter.
   */
  constructor(options) {
    options = { ..._Filter.defaultOptions, ...options };
    super(options);
    /** If enabled is true the filter is applied, if false it will not. */
    this.enabled = true;
    /**
     * The gpu state the filter requires to render.
     * @internal
     * @ignore
     */
    this._state = State.for2d();
    this.blendMode = options.blendMode;
    this.padding = options.padding;
    if (typeof options.antialias === "boolean") {
      this.antialias = options.antialias ? "on" : "off";
    } else {
      this.antialias = options.antialias;
    }
    this.resolution = options.resolution;
    this.blendRequired = options.blendRequired;
    this.addResource("uTexture", 0, 1);
  }
  /**
   * Applies the filter
   * @param filterManager - The renderer to retrieve the filter from
   * @param input - The input render target.
   * @param output - The target to output to.
   * @param clearMode - Should the output be cleared before rendering to it
   */
  apply(filterManager, input, output, clearMode) {
    filterManager.applyFilter(this, input, output, clearMode);
  }
  /**
   * Get the blend mode of the filter.
   * @default "normal"
   */
  get blendMode() {
    return this._state.blendMode;
  }
  /** Sets the blend mode of the filter. */
  set blendMode(value) {
    this._state.blendMode = value;
  }
  /**
   * A short hand function to create a filter based of a vertex and fragment shader src.
   * @param options
   * @returns A shiny new PixiJS filter!
   */
  static from(options) {
    const { gpu, gl, ...rest } = options;
    let gpuProgram;
    let glProgram;
    if (gpu) {
      gpuProgram = GpuProgram.from(gpu);
    }
    if (gl) {
      glProgram = GlProgram.from(gl);
    }
    return new _Filter({
      gpuProgram,
      glProgram,
      ...rest
    });
  }
};
/**
 * The default filter settings
 * @static
 */
_Filter.defaultOptions = {
  blendMode: "normal",
  resolution: 1,
  padding: 0,
  antialias: "off",
  blendRequired: false
};
let Filter = _Filter;

export { Filter };
//# sourceMappingURL=Filter.mjs.map
