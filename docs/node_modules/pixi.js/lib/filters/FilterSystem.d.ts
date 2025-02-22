import { ExtensionType } from '../extensions/Extensions';
import { Matrix } from '../maths/matrix/Matrix';
import { Texture } from '../rendering/renderers/shared/texture/Texture';
import { type Renderer } from '../rendering/renderers/types';
import { Bounds } from '../scene/container/bounds/Bounds';
import type { Instruction } from '../rendering/renderers/shared/instructions/Instruction';
import type { Renderable } from '../rendering/renderers/shared/Renderable';
import type { RenderTarget } from '../rendering/renderers/shared/renderTarget/RenderTarget';
import type { RenderSurface } from '../rendering/renderers/shared/renderTarget/RenderTargetSystem';
import type { System } from '../rendering/renderers/shared/system/System';
import type { Container } from '../scene/container/Container';
import type { Sprite } from '../scene/sprite/Sprite';
import type { Filter } from './Filter';
import type { FilterEffect } from './FilterEffect';
type FilterAction = 'pushFilter' | 'popFilter';
/**
 * The filter pipeline is responsible for applying filters scene items!
 *
 * KNOWN BUGS:
 * 1. Global bounds calculation is incorrect if it is used when flip flopping filters. The maths can be found below
 * eg: filters [noiseFilter, blurFilter] noiseFilter will calculate the global bounds incorrectly.
 *
 * 2. RenderGroups do not work with filters. This is because the renderGroup matrix is not currently taken into account.
 *
 * Implementation notes:
 * 1. Gotcha - nesting filters that require blending will not work correctly. This creates a chicken and egg problem
 * the complexity and performance required to do this is not worth it i feel.. but lets see if others agree!
 *
 * 2. Filters are designed to be changed on the fly, this is means that changing filter information each frame will
 * not trigger an instruction rebuild. If you are constantly turning a filter on and off.. its therefore better to set
 * enabled to true or false on the filter. Or setting an empty array.
 *
 * 3. Need to look at perhaps aliasing when flip flopping filters. Really we should only need to antialias the FIRST
 * Texture we render too. The rest can be non aliased. This might help performance.
 * Currently we flip flop with an antialiased texture if antialiasing is enabled on the filter.
 */
export interface FilterInstruction extends Instruction {
    renderPipeId: 'filter';
    action: FilterAction;
    container?: Container;
    renderables?: Renderable[];
    filterEffect: FilterEffect;
}
export interface FilterData {
    skip: boolean;
    enabledLength?: number;
    inputTexture: Texture;
    bounds: Bounds;
    blendRequired: boolean;
    container: Container;
    filterEffect: FilterEffect;
    previousRenderSurface: RenderSurface;
    backTexture?: Texture;
}
/**
 * System that manages the filter pipeline
 * @memberof rendering
 */
export declare class FilterSystem implements System {
    /** @ignore */
    static extension: {
        readonly type: readonly [ExtensionType.WebGLSystem, ExtensionType.WebGPUSystem];
        readonly name: "filter";
    };
    readonly renderer: Renderer;
    private _filterStackIndex;
    private _filterStack;
    private readonly _filterGlobalUniforms;
    private readonly _globalFilterBindGroup;
    private _activeFilterData;
    constructor(renderer: Renderer);
    /**
     * The back texture of the currently active filter. Requires the filter to have `blendRequired` set to true.
     * @readonly
     */
    get activeBackTexture(): Texture | undefined;
    push(instruction: FilterInstruction): void;
    pop(): void;
    getBackTexture(lastRenderSurface: RenderTarget, bounds: Bounds, previousBounds?: Bounds): Texture<import("..").TextureSource<any>>;
    applyFilter(filter: Filter, input: Texture, output: RenderSurface, clear: boolean): void;
    private _getFilterData;
    /**
     * Multiply _input normalized coordinates_ to this matrix to get _sprite texture normalized coordinates_.
     *
     * Use `outputMatrix * vTextureCoord` in the shader.
     * @param outputMatrix - The matrix to output to.
     * @param {Sprite} sprite - The sprite to map to.
     * @returns The mapped matrix.
     */
    calculateSpriteMatrix(outputMatrix: Matrix, sprite: Sprite): Matrix;
    destroy?: () => void;
}
export {};
