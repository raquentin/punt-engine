import { Matrix } from '../../../maths/matrix/Matrix';
import type { Container } from '../Container';
import type { Bounds } from './Bounds';
export declare function getGlobalBounds(target: Container, skipUpdateTransform: boolean, bounds: Bounds): Bounds;
export declare function _getGlobalBounds(target: Container, bounds: Bounds, parentTransform: Matrix, skipUpdateTransform: boolean): void;
export declare function updateTransformBackwards(target: Container, parentTransform: Matrix): Matrix;
