import { Bounds } from '../container/bounds/Bounds';
import { Container } from '../container/Container';
import type { PointData } from '../../maths/point/PointData';
import type { View } from '../../rendering/renderers/shared/view/View';
import type { BoundsData } from '../container/bounds/Bounds';
import type { DestroyOptions } from '../container/destroyTypes';
/**
 * A ViewContainer is a type of container that represents a view.
 * This view can be a Sprite, a Graphics object, or any other object that can be rendered.
 * This class is abstract and should not be used directly.
 * @memberof scene
 */
export declare abstract class ViewContainer extends Container implements View {
    /** @private */
    readonly renderPipeId: string;
    /** @private */
    readonly canBundle = true;
    /** @private */
    allowChildren: boolean;
    /** @private */
    _roundPixels: 0 | 1;
    /** @private */
    _lastUsed: number;
    /** @private */
    _lastInstructionTick: number;
    protected _bounds: Bounds;
    protected _boundsDirty: boolean;
    /**
     * The local bounds of the view.
     * @type {rendering.Bounds}
     */
    abstract get bounds(): BoundsData;
    /** @private */
    abstract addBounds(bounds: Bounds): void;
    /** @private */
    protected _updateBounds(): void;
    /**
     * Whether or not to round the x/y position of the sprite.
     * @type {boolean}
     */
    get roundPixels(): boolean;
    set roundPixels(value: boolean);
    /**
     * Checks if the object contains the given point.
     * @param point - The point to check
     */
    containsPoint(point: PointData): boolean;
    /** @private */
    abstract batched: boolean;
    /** @private */
    protected abstract onViewUpdate(): void;
    destroy(options?: DestroyOptions): void;
}
