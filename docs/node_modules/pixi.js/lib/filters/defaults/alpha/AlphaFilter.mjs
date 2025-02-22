import { GlProgram } from '../../../rendering/renderers/gl/shader/GlProgram.mjs';
import { GpuProgram } from '../../../rendering/renderers/gpu/shader/GpuProgram.mjs';
import { UniformGroup } from '../../../rendering/renderers/shared/shader/UniformGroup.mjs';
import { Filter } from '../../Filter.mjs';
import vertex from '../defaultFilter.vert.mjs';
import fragment from './alpha.frag.mjs';
import source from './alpha.wgsl.mjs';

"use strict";
const _AlphaFilter = class _AlphaFilter extends Filter {
  constructor(options) {
    options = { ..._AlphaFilter.defaultOptions, ...options };
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
      name: "alpha-filter"
    });
    const { alpha, ...rest } = options;
    const alphaUniforms = new UniformGroup({
      uAlpha: { value: alpha, type: "f32" }
    });
    super({
      ...rest,
      gpuProgram,
      glProgram,
      resources: {
        alphaUniforms
      }
    });
  }
  /**
   * Coefficient for alpha multiplication
   * @default 1
   */
  get alpha() {
    return this.resources.alphaUniforms.uniforms.uAlpha;
  }
  set alpha(value) {
    this.resources.alphaUniforms.uniforms.uAlpha = value;
  }
};
/** Default filter options */
_AlphaFilter.defaultOptions = {
  /** Amount of alpha from 0 to 1, where 0 is transparent */
  alpha: 1
};
let AlphaFilter = _AlphaFilter;

export { AlphaFilter };
//# sourceMappingURL=AlphaFilter.mjs.map
