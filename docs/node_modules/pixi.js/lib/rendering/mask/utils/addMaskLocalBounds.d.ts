import type { Matrix } from '../../../maths/matrix/Matrix';
import type { Bounds } from '../../../scene/container/bounds/Bounds';
import type { Container } from '../../../scene/container/Container';
export declare function addMaskLocalBounds(mask: Container, bounds: Bounds, localRoot: Container): void;
export declare function getMatrixRelativeToParent(target: Container, root: Container, matrix: Matrix): Matrix;
