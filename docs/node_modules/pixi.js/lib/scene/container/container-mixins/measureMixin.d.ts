import { Bounds } from '../bounds/Bounds';
import type { Size } from '../../../maths/misc/Size';
import type { Container } from '../Container';
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export interface MeasureMixinConstructor {
    width?: number;
    height?: number;
}
export interface MeasureMixin extends Required<MeasureMixinConstructor> {
    getSize(out?: Size): Size;
    setSize(width: number, height?: number): void;
    setSize(value: Optional<Size, 'height'>): void;
    getLocalBounds(bounds?: Bounds): Bounds;
    getBounds(skipUpdate?: boolean, bounds?: Bounds): Bounds;
    _localBoundsCacheData: LocalBoundsCacheData;
    _localBoundsCacheId: number;
    _setWidth(width: number, localWidth: number): void;
    _setHeight(height: number, localHeight: number): void;
}
interface LocalBoundsCacheData {
    data: number[];
    index: number;
    didChange: boolean;
    localBounds: Bounds;
}
export declare const measureMixin: Partial<Container>;
export {};
