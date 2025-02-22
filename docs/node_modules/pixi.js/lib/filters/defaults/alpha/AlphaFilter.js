'use strict';

var GlProgram = require('../../../rendering/renderers/gl/shader/GlProgram.js');
var GpuProgram = require('../../../rendering/renderers/gpu/shader/GpuProgram.js');
var UniformGroup = require('../../../rendering/renderers/shared/shader/UniformGroup.js');
var Filter = require('../../Filter.js');
var defaultFilter = require('../defaultFilter.vert.js');
var alpha$1 = require('./alpha.frag.js');
var alpha = require('./alpha.wgsl.js');

"use strict";
const _AlphaFilter = class _AlphaFilter extends Filter.Filter {
  constructor(options) {
    options = { ..._AlphaFilter.defaultOptions, ...options };
    const gpuProgram = GpuProgram.GpuProgram.from({
      vertex: {
        source: alpha.default,
        entryPoint: "mainVertex"
      },
      fragment: {
        source: alpha.default,
        entryPoint: "mainFragment"
      }
    });
    const glProgram = GlProgram.GlProgram.from({
      vertex: defaultFilter.default,
      fragment: alpha$1.default,
      name: "alpha-filter"
    });
    const { alpha: alpha$2, ...rest } = options;
    const alphaUniforms = new UniformGroup.UniformGroup({
      uAlpha: { value: alpha$2, type: "f32" }
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

exports.AlphaFilter = AlphaFilter;
//# sourceMappingURL=AlphaFilter.js.map
