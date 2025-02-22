import type { Container } from '../Container';
export interface SortMixinConstructor {
    zIndex?: number;
    sortDirty?: boolean;
    sortableChildren?: boolean;
}
export interface SortMixin extends Required<SortMixinConstructor> {
    _zIndex: number;
    sortChildren: () => void;
    depthOfChildModified: () => void;
}
export declare const sortMixin: Partial<Container>;
