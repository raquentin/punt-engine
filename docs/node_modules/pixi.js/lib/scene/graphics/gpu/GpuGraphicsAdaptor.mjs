import { ExtensionType } from '../../../extensions/Extensions.mjs';
import { Matrix } from '../../../maths/matrix/Matrix.mjs';
import { getMaxTexturesPerBatch } from '../../../rendering/batcher/gl/utils/maxRecommendedTextures.mjs';
import { getTextureBatchBindGroup } from '../../../rendering/batcher/gpu/getTextureBatchBindGroup.mjs';
import { compileHighShaderGpuProgram } from '../../../rendering/high-shader/compileHighShaderToProgram.mjs';
import { colorBit } from '../../../rendering/high-shader/shader-bits/colorBit.mjs';
import { generateTextureBatchBit } from '../../../rendering/high-shader/shader-bits/generateTextureBatchBit.mjs';
import { localUniformBitGroup2 } from '../../../rendering/high-shader/shader-bits/localUniformBit.mjs';
import { roundPixelsBit } from '../../../rendering/high-shader/shader-bits/roundPixelsBit.mjs';
import { Shader } from '../../../rendering/renderers/shared/shader/Shader.mjs';
import { UniformGroup } from '../../../rendering/renderers/shared/shader/UniformGroup.mjs';

"use strict";
class GpuGraphicsAdaptor {
  init() {
    const localUniforms = new UniformGroup({
      uTransformMatrix: { value: new Matrix(), type: "mat3x3<f32>" },
      uColor: { value: new Float32Array([1, 1, 1, 1]), type: "vec4<f32>" },
      uRound: { value: 0, type: "f32" }
    });
    const gpuProgram = compileHighShaderGpuProgram({
      name: "graphics",
      bits: [
        colorBit,
        generateTextureBatchBit(getMaxTexturesPerBatch()),
        localUniformBitGroup2,
        roundPixelsBit
      ]
    });
    this.shader = new Shader({
      gpuProgram,
      resources: {
        // added on the fly!
        localUniforms
      }
    });
  }
  execute(graphicsPipe, renderable) {
    const context = renderable.context;
    const shader = context.customShader || this.shader;
    const renderer = graphicsPipe.renderer;
    const contextSystem = renderer.graphicsContext;
    const {
      batcher,
      instructions
    } = contextSystem.getContextRenderData(context);
    const encoder = renderer.encoder;
    encoder.setPipelineFromGeometryProgramAndState(
      batcher.geometry,
      shader.gpuProgram,
      graphicsPipe.state
    );
    encoder.setGeometry(batcher.geometry, shader.gpuProgram);
    const globalUniformsBindGroup = renderer.globalUniforms.bindGroup;
    encoder.setBindGroup(0, globalUniformsBindGroup, shader.gpuProgram);
    const localBindGroup = renderer.renderPipes.uniformBatch.getUniformBindGroup(shader.resources.localUniforms, true);
    encoder.setBindGroup(2, localBindGroup, shader.gpuProgram);
    const batches = instructions.instructions;
    for (let i = 0; i < instructions.instructionSize; i++) {
      const batch = batches[i];
      shader.groups[1] = batch.bindGroup;
      if (!batch.gpuBindGroup) {
        const textureBatch = batch.textures;
        batch.bindGroup = getTextureBatchBindGroup(textureBatch.textures, textureBatch.count);
        batch.gpuBindGroup = renderer.bindGroup.getBindGroup(
          batch.bindGroup,
          shader.gpuProgram,
          1
        );
      }
      encoder.setBindGroup(1, batch.bindGroup, shader.gpuProgram);
      encoder.renderPassEncoder.drawIndexed(batch.size, 1, batch.start);
    }
  }
  destroy() {
    this.shader.destroy(true);
    this.shader = null;
  }
}
/** @ignore */
GpuGraphicsAdaptor.extension = {
  type: [
    ExtensionType.WebGPUPipesAdaptor
  ],
  name: "graphics"
};

export { GpuGraphicsAdaptor };
//# sourceMappingURL=GpuGraphicsAdaptor.mjs.map
