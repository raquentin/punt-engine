import { Container } from '../../../scene/container/Container';
import type { ExtensionMetadata } from '../../../extensions/Extensions';
import type { Point } from '../../../maths/point/Point';
import type { Bounds } from '../../../scene/container/bounds/Bounds';
import type { Effect } from '../../../scene/container/Effect';
import type { PoolItem } from '../../../utils/pool/Pool';
export declare class StencilMask implements Effect, PoolItem {
    static extension: ExtensionMetadata;
    priority: number;
    mask: Container;
    pipe: string;
    constructor(options: {
        mask: Container;
    });
    init(mask: Container): void;
    reset(): void;
    addBounds(bounds: Bounds, skipUpdateTransform: boolean): void;
    addLocalBounds(bounds: Bounds, localRoot: Container): void;
    containsPoint(point: Point, hitTestFn: (container: Container, point: Point) => boolean): boolean;
    destroy(): void;
    static test(mask: any): boolean;
}
