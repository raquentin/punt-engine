'use strict';

var GlProgram = require('../../../rendering/renderers/gl/shader/GlProgram.js');
var GpuProgram = require('../../../rendering/renderers/gpu/shader/GpuProgram.js');
var UniformGroup = require('../../../rendering/renderers/shared/shader/UniformGroup.js');
var Filter = require('../../Filter.js');
var defaultFilter = require('../defaultFilter.vert.js');
var noise$1 = require('./noise.frag.js');
var noise = require('./noise.wgsl.js');

"use strict";
const _NoiseFilter = class _NoiseFilter extends Filter.Filter {
  /**
   * @param options - The options of the noise filter.
   */
  constructor(options = {}) {
    options = { ..._NoiseFilter.defaultOptions, ...options };
    const gpuProgram = GpuProgram.GpuProgram.from({
      vertex: {
        source: noise.default,
        entryPoint: "mainVertex"
      },
      fragment: {
        source: noise.default,
        entryPoint: "mainFragment"
      }
    });
    const glProgram = GlProgram.GlProgram.from({
      vertex: defaultFilter.default,
      fragment: noise$1.default,
      name: "noise-filter"
    });
    const { noise: noise$2, seed, ...rest } = options;
    super({
      ...rest,
      gpuProgram,
      glProgram,
      resources: {
        noiseUniforms: new UniformGroup.UniformGroup({
          uNoise: { value: 1, type: "f32" },
          uSeed: { value: 1, type: "f32" }
        })
      }
    });
    this.noise = noise$2;
    this.seed = seed ?? Math.random();
  }
  /**
   * The amount of noise to apply, this value should be in the range (0, 1].
   * @default 0.5
   */
  get noise() {
    return this.resources.noiseUniforms.uniforms.uNoise;
  }
  set noise(value) {
    this.resources.noiseUniforms.uniforms.uNoise = value;
  }
  /** A seed value to apply to the random noise generation. `Math.random()` is a good value to use. */
  get seed() {
    return this.resources.noiseUniforms.uniforms.uSeed;
  }
  set seed(value) {
    this.resources.noiseUniforms.uniforms.uSeed = value;
  }
};
_NoiseFilter.defaultOptions = {
  noise: 0.5
};
let NoiseFilter = _NoiseFilter;

exports.NoiseFilter = NoiseFilter;
//# sourceMappingURL=NoiseFilter.js.map
