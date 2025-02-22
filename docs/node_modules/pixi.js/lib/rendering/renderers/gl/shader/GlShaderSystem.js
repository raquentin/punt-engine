'use strict';

var Extensions = require('../../../../extensions/Extensions.js');
var maxRecommendedTextures = require('../../../batcher/gl/utils/maxRecommendedTextures.js');
var GenerateShaderSyncCode = require('./GenerateShaderSyncCode.js');
var generateProgram = require('./program/generateProgram.js');

"use strict";
const defaultSyncData = {
  textureCount: 0,
  blockIndex: 0
};
class GlShaderSystem {
  constructor(renderer) {
    /**
     * @internal
     * @private
     */
    this._activeProgram = null;
    this._programDataHash = /* @__PURE__ */ Object.create(null);
    this._nextIndex = 0;
    this._boundUniformsIdsToIndexHash = /* @__PURE__ */ Object.create(null);
    this._boundIndexToUniformsHash = /* @__PURE__ */ Object.create(null);
    this._shaderSyncFunctions = /* @__PURE__ */ Object.create(null);
    this._renderer = renderer;
  }
  contextChange(gl) {
    this._gl = gl;
    this._maxBindings = gl.MAX_UNIFORM_BUFFER_BINDINGS ? gl.getParameter(gl.MAX_UNIFORM_BUFFER_BINDINGS) : 0;
    this._programDataHash = /* @__PURE__ */ Object.create(null);
    this._boundUniformsIdsToIndexHash = /* @__PURE__ */ Object.create(null);
    this._boundIndexToUniformsHash = /* @__PURE__ */ Object.create(null);
    this._shaderSyncFunctions = /* @__PURE__ */ Object.create(null);
    this._activeProgram = null;
    this.maxTextures = maxRecommendedTextures.getMaxTexturesPerBatch();
  }
  /**
   * Changes the current shader to the one given in parameter.
   * @param shader - the new shader
   * @param skipSync - false if the shader should automatically sync its uniforms.
   * @returns the glProgram that belongs to the shader.
   */
  bind(shader, skipSync) {
    this._setProgram(shader.glProgram);
    if (skipSync)
      return;
    defaultSyncData.textureCount = 0;
    defaultSyncData.blockIndex = 0;
    let syncFunction = this._shaderSyncFunctions[shader.glProgram._key];
    if (!syncFunction) {
      syncFunction = this._shaderSyncFunctions[shader.glProgram._key] = this._generateShaderSync(shader, this);
    }
    syncFunction(this._renderer, shader, defaultSyncData);
  }
  /**
   * Updates the uniform group.
   * @param uniformGroup - the uniform group to update
   */
  updateUniformGroup(uniformGroup) {
    this._renderer.uniformGroup.updateUniformGroup(uniformGroup, this._activeProgram, defaultSyncData);
  }
  /**
   * Binds a uniform block to the shader.
   * @param uniformGroup - the uniform group to bind
   * @param name - the name of the uniform block
   * @param index - the index of the uniform block
   */
  bindUniformBlock(uniformGroup, name, index = 0) {
    const bufferSystem = this._renderer.buffer;
    const programData = this._getProgramData(this._activeProgram);
    const isBufferResource = uniformGroup._bufferResource;
    if (isBufferResource) {
      this._renderer.ubo.updateUniformGroup(uniformGroup);
    }
    bufferSystem.updateBuffer(uniformGroup.buffer);
    let boundIndex = this._boundUniformsIdsToIndexHash[uniformGroup.uid];
    if (boundIndex === void 0) {
      const nextIndex = this._nextIndex++ % this._maxBindings;
      const currentBoundUniformGroup = this._boundIndexToUniformsHash[nextIndex];
      if (currentBoundUniformGroup) {
        this._boundUniformsIdsToIndexHash[currentBoundUniformGroup.uid] = void 0;
      }
      boundIndex = this._boundUniformsIdsToIndexHash[uniformGroup.uid] = nextIndex;
      this._boundIndexToUniformsHash[nextIndex] = uniformGroup;
      if (isBufferResource) {
        bufferSystem.bindBufferRange(uniformGroup.buffer, nextIndex, uniformGroup.offset);
      } else {
        bufferSystem.bindBufferBase(uniformGroup.buffer, nextIndex);
      }
    }
    const gl = this._gl;
    const uniformBlockIndex = this._activeProgram._uniformBlockData[name].index;
    if (programData.uniformBlockBindings[index] === boundIndex)
      return;
    programData.uniformBlockBindings[index] = boundIndex;
    gl.uniformBlockBinding(programData.program, uniformBlockIndex, boundIndex);
  }
  _setProgram(program) {
    if (this._activeProgram === program)
      return;
    this._activeProgram = program;
    const programData = this._getProgramData(program);
    this._gl.useProgram(programData.program);
  }
  /**
   * @param program - the program to get the data for
   * @internal
   * @private
   */
  _getProgramData(program) {
    return this._programDataHash[program._key] || this._createProgramData(program);
  }
  _createProgramData(program) {
    const key = program._key;
    this._programDataHash[key] = generateProgram.generateProgram(this._gl, program);
    return this._programDataHash[key];
  }
  destroy() {
    for (const key of Object.keys(this._programDataHash)) {
      const programData = this._programDataHash[key];
      programData.destroy();
      this._programDataHash[key] = null;
    }
    this._programDataHash = null;
    this._boundUniformsIdsToIndexHash = null;
  }
  /**
   * Creates a function that can be executed that will sync the shader as efficiently as possible.
   * Overridden by the unsafe eval package if you don't want eval used in your project.
   * @param shader - the shader to generate the sync function for
   * @param shaderSystem - the shader system to use
   * @returns - the generated sync function
   * @ignore
   */
  _generateShaderSync(shader, shaderSystem) {
    return GenerateShaderSyncCode.generateShaderSyncCode(shader, shaderSystem);
  }
}
/** @ignore */
GlShaderSystem.extension = {
  type: [
    Extensions.ExtensionType.WebGLSystem
  ],
  name: "shader"
};

exports.GlShaderSystem = GlShaderSystem;
//# sourceMappingURL=GlShaderSystem.js.map
