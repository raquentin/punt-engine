import { Matrix } from '../../../../maths/matrix/Matrix';
import { Pool } from '../../../../utils/pool/Pool';
import { Bounds } from '../Bounds';
import type { PoolItem } from '../../../../utils/pool/Pool';
type MatrixPoolItem = Matrix & PoolItem;
type BoundsPoolItem = Bounds & PoolItem;
export declare const matrixPool: Pool<MatrixPoolItem>;
export declare const boundsPool: Pool<BoundsPoolItem>;
export {};
