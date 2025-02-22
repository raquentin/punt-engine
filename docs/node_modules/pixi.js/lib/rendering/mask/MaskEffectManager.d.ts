import type { Effect, EffectConstructor } from '../../scene/container/Effect';
import type { PoolItem } from '../../utils/pool/Pool';
interface MaskConversionTest {
    test: (item: any) => boolean;
    maskClass: new (item: any) => Effect & PoolItem;
}
export type MaskEffect = {
    mask: unknown;
} & Effect;
/**
 * A class that manages the conversion of masks to mask effects.
 * @memberof rendering
 * @ignore
 */
export declare class MaskEffectManagerClass {
    /**
     * @private
     */
    readonly _effectClasses: EffectConstructor[];
    private readonly _tests;
    private _initialized;
    init(): void;
    add(test: MaskConversionTest): void;
    getMaskEffect(item: any): MaskEffect;
    returnMaskEffect(effect: Effect & PoolItem): void;
}
export declare const MaskEffectManager: MaskEffectManagerClass;
export {};
