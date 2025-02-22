import type { Container, ContainerChild } from '../Container';
export interface ChildrenHelperMixin<C = ContainerChild> {
    allowChildren: boolean;
    addChild<U extends C[]>(...children: U): U[0];
    removeChild<U extends C[]>(...children: U): U[0];
    removeChildren(beginIndex?: number, endIndex?: number): C[];
    removeChildAt<U extends C>(index: number): U;
    getChildAt<U extends C>(index: number): U;
    setChildIndex(child: C, index: number): void;
    getChildIndex(child: C): number;
    addChildAt<U extends C>(child: U, index: number): U;
    swapChildren<U extends C>(child: U, child2: U): void;
    removeFromParent(): void;
    reparentChild<U extends C[]>(...child: U): U[0];
    reparentChildAt<U extends C>(child: U, index: number): U;
}
export declare const childrenHelperMixin: Partial<Container>;
