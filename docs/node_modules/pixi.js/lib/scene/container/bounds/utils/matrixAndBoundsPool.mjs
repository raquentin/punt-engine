import { Matrix } from '../../../../maths/matrix/Matrix.mjs';
import { Pool } from '../../../../utils/pool/Pool.mjs';
import { Bounds } from '../Bounds.mjs';

"use strict";
const matrixPool = new Pool(Matrix);
const boundsPool = new Pool(Bounds);

export { boundsPool, matrixPool };
//# sourceMappingURL=matrixAndBoundsPool.mjs.map
