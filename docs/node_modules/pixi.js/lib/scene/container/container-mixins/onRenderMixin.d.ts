import type { Container } from '../Container';
export interface OnRenderMixinConstructor {
    onRender?: (() => void | null);
}
export interface OnRenderMixin extends Required<OnRenderMixinConstructor> {
    _onRender: (() => void) | null;
}
export declare const onRenderMixin: Partial<Container>;
