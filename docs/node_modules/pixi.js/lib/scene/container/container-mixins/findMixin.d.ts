import type { Container } from '../Container';
export interface FindMixinConstructor {
    label?: string;
}
export interface FindMixin extends Required<FindMixinConstructor> {
    /**
     * @deprecated since 8.0.0
     * @see Container#label
     */
    name: string;
    getChildByName(label: RegExp | string, deep?: boolean): Container | null;
    getChildByLabel(label: RegExp | string, deep?: boolean): Container | null;
    getChildrenByLabel(label: RegExp | string, deep?: boolean, out?: Container[]): Container[];
}
export declare const findMixin: Partial<Container>;
