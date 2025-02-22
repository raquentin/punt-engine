import type { Point } from '../../../maths/point/Point';
import type { Bounds } from '../../../scene/container/bounds/Bounds';
import type { Container } from '../../../scene/container/Container';
import type { Effect } from '../../../scene/container/Effect';
export declare class ScissorMask implements Effect {
    priority: number;
    mask: Container;
    pipe: string;
    constructor(mask: Container);
    addBounds(bounds: Bounds, skipUpdateTransform?: boolean): void;
    addLocalBounds(bounds: Bounds, localRoot: Container): void;
    containsPoint(point: Point, hitTestFn: (container: Container, point: Point) => boolean): boolean;
    reset(): void;
    destroy(): void;
}
