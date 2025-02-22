import { ExtensionType } from '../../../extensions/Extensions';
import { InstructionSet } from '../../../rendering/renderers/shared/instructions/InstructionSet';
import type { Batcher } from '../../../rendering/batcher/shared/Batcher';
import type { System } from '../../../rendering/renderers/shared/system/System';
import type { BatchableGraphics } from './BatchableGraphics';
import type { GraphicsContext } from './GraphicsContext';
interface GeometryData {
    vertices: number[];
    uvs: number[];
    indices: number[];
}
/**
 * A class that holds batchable graphics data for a GraphicsContext.
 * @memberof rendering
 * @ignore
 */
export declare class GpuGraphicsContext {
    isBatchable: boolean;
    context: GraphicsContext;
    batches: BatchableGraphics[];
    geometryData: GeometryData;
    graphicsData: GraphicsContextRenderData;
}
/**
 * A class that holds the render data for a GraphicsContext.
 * @memberof rendering
 * @ignore
 */
export declare class GraphicsContextRenderData {
    batcher: Batcher;
    instructions: InstructionSet;
    init(): void;
    /**
     * @deprecated since version 8.0.0
     * Use `batcher.geometry` instead.
     * @see {Batcher#geometry}
     */
    get geometry(): import("../../..").Geometry;
}
/**
 * Options for the GraphicsContextSystem.
 * @memberof rendering
 */
export interface GraphicsContextSystemOptions {
    /** A value from 0 to 1 that controls the smoothness of bezier curves (the higher the smoother) */
    bezierSmoothness?: number;
}
/**
 * A system that manages the rendering of GraphicsContexts.
 * @memberof rendering
 */
export declare class GraphicsContextSystem implements System<GraphicsContextSystemOptions> {
    /** @ignore */
    static extension: {
        readonly type: readonly [ExtensionType.WebGLSystem, ExtensionType.WebGPUSystem, ExtensionType.CanvasSystem];
        readonly name: "graphicsContext";
    };
    /** The default options for the GraphicsContextSystem. */
    static readonly defaultOptions: GraphicsContextSystemOptions;
    private _gpuContextHash;
    private _graphicsDataContextHash;
    /**
     * Runner init called, update the default options
     * @ignore
     */
    init(options?: GraphicsContextSystemOptions): void;
    getContextRenderData(context: GraphicsContext): GraphicsContextRenderData;
    updateGpuContext(context: GraphicsContext): GpuGraphicsContext;
    getGpuContext(context: GraphicsContext): GpuGraphicsContext;
    private _initContextRenderData;
    private _initContext;
    protected onGraphicsContextDestroy(context: GraphicsContext): void;
    private _cleanGraphicsContextData;
    destroy(): void;
}
export {};
