import { GlProgram } from '../../../rendering/renderers/gl/shader/GlProgram.mjs';
import { GpuProgram } from '../../../rendering/renderers/gpu/shader/GpuProgram.mjs';
import { UniformGroup } from '../../../rendering/renderers/shared/shader/UniformGroup.mjs';
import { Filter } from '../../Filter.mjs';
import vertex from '../defaultFilter.vert.mjs';
import fragment from './noise.frag.mjs';
import source from './noise.wgsl.mjs';

"use strict";
const _NoiseFilter = class _NoiseFilter extends Filter {
  /**
   * @param options - The options of the noise filter.
   */
  constructor(options = {}) {
    options = { ..._NoiseFilter.defaultOptions, ...options };
    const gpuProgram = GpuProgram.from({
      vertex: {
        source,
        entryPoint: "mainVertex"
      },
      fragment: {
        source,
        entryPoint: "mainFragment"
      }
    });
    const glProgram = GlProgram.from({
      vertex,
      fragment,
      name: "noise-filter"
    });
    const { noise, seed, ...rest } = options;
    super({
      ...rest,
      gpuProgram,
      glProgram,
      resources: {
        noiseUniforms: new UniformGroup({
          uNoise: { value: 1, type: "f32" },
          uSeed: { value: 1, type: "f32" }
        })
      }
    });
    this.noise = noise;
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

export { NoiseFilter };
//# sourceMappingURL=NoiseFilter.mjs.map
