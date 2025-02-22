import { ExtensionType } from '../../../extensions/Extensions';
import { Matrix } from '../../../maths/matrix/Matrix';
import { BindGroup } from '../../../rendering/renderers/gpu/shader/BindGroup';
import { UniformGroup } from '../../../rendering/renderers/shared/shader/UniformGroup';
import type { InstructionSet } from '../../../rendering/renderers/shared/instructions/InstructionSet';
import type { InstructionPipe, RenderPipe } from '../../../rendering/renderers/shared/instructions/RenderPipe';
import type { Renderer } from '../../../rendering/renderers/types';
import type { Mesh } from './Mesh';
export interface MeshAdaptor {
    init(): void;
    execute(meshPipe: MeshPipe, mesh: Mesh): void;
    destroy(): void;
}
export declare class MeshPipe implements RenderPipe<Mesh>, InstructionPipe<Mesh> {
    /** @ignore */
    static extension: {
        readonly type: readonly [ExtensionType.WebGLPipes, ExtensionType.WebGPUPipes, ExtensionType.CanvasPipes];
        readonly name: "mesh";
    };
    localUniforms: UniformGroup<{
        uTransformMatrix: {
            value: Matrix;
            type: "mat3x3<f32>";
        };
        uColor: {
            value: Float32Array;
            type: "vec4<f32>";
        };
        uRound: {
            value: number;
            type: "f32";
        };
    }>;
    localUniformsBindGroup: BindGroup;
    renderer: Renderer;
    private _meshDataHash;
    private _gpuBatchableMeshHash;
    private _adaptor;
    private readonly _destroyRenderableBound;
    constructor(renderer: Renderer, adaptor: MeshAdaptor);
    validateRenderable(mesh: Mesh): boolean;
    addRenderable(mesh: Mesh, instructionSet: InstructionSet): void;
    updateRenderable(mesh: Mesh): void;
    destroyRenderable(mesh: Mesh): void;
    execute(mesh: Mesh): void;
    private _getMeshData;
    private _initMeshData;
    private _getBatchableMesh;
    private _initBatchableMesh;
    destroy(): void;
}
