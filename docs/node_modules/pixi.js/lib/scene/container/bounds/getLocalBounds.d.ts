import { Matrix } from '../../../maths/matrix/Matrix';
import type { Container } from '../Container';
import type { Bounds } from './Bounds';
export declare function getLocalBounds(target: Container, bounds: Bounds, relativeMatrix?: Matrix): Bounds;
export declare function getParent(target: Container, root: Container, matrix: Matrix): void;
