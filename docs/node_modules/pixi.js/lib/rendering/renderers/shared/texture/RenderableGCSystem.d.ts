import { ExtensionType } from '../../../../extensions/Extensions';
import type { Renderer } from '../../types';
import type { InstructionSet } from '../instructions/InstructionSet';
import type { Renderable } from '../Renderable';
import type { System } from '../system/System';
/**
 * Options for the {@link RenderableGCSystem}.
 * @memberof rendering
 * @property {boolean} [renderableGCActive=true] - If set to true, this will enable the garbage collector on the renderables.
 * @property {number} [renderableGCAMaxIdle=60000] -
 * The maximum idle frames before a texture is destroyed by garbage collection.
 * @property {number} [renderableGCCheckCountMax=60000] - time between two garbage collections.
 */
export interface RenderableGCSystemOptions {
    /**
     * If set to true, this will enable the garbage collector on the GPU.
     * @default true
     * @memberof rendering.SharedRendererOptions
     */
    renderableGCActive: boolean;
    /**
     * The maximum idle frames before a texture is destroyed by garbage collection.
     * @default 60 * 60
     * @memberof rendering.SharedRendererOptions
     */
    renderableGCMaxUnusedTime: number;
    /**
     * Frames between two garbage collections.
     * @default 600
     * @memberof rendering.SharedRendererOptions
     */
    renderableGCFrequency: number;
}
/**
 * System plugin to the renderer to manage renderable garbage collection. When rendering
 * stuff with the renderer will assign resources to each renderable. This could be for example
 * a batchable Sprite, or a text texture. If the renderable is not used for a certain amount of time
 * its resources will be tided up by its render pipe.
 * @memberof rendering
 */
export declare class RenderableGCSystem implements System<RenderableGCSystemOptions> {
    /** @ignore */
    static extension: {
        readonly type: readonly [ExtensionType.WebGLSystem, ExtensionType.WebGPUSystem];
        readonly name: "renderableGC";
    };
    /** default options for the renderableGCSystem */
    static defaultOptions: RenderableGCSystemOptions;
    /**
     * Maximum idle frames before a texture is destroyed by garbage collection.
     * @see renderableGCSystem.defaultMaxIdle
     */
    maxUnusedTime: number;
    private _renderer;
    private readonly _managedRenderables;
    private _handler;
    private _frequency;
    private _now;
    /** @param renderer - The renderer this System works for. */
    constructor(renderer: Renderer);
    init(options: RenderableGCSystemOptions): void;
    get enabled(): boolean;
    set enabled(value: boolean);
    prerender(): void;
    addRenderable(renderable: Renderable, instructionSet: InstructionSet): void;
    /** Runs the scheduled garbage collection */
    run(): void;
    destroy(): void;
    private _removeRenderable;
}
