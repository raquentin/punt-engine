import { Point } from '../../../maths/point/Point';
import type { PointData } from '../../../maths/point/PointData';
import type { Container } from '../Container';
export interface ToLocalGlobalMixin {
    getGlobalPosition(point?: Point, skipUpdate?: boolean): Point;
    toGlobal<P extends PointData = Point>(position: PointData, point?: P, skipUpdate?: boolean): P;
    toLocal<P extends PointData = Point>(position: PointData, from?: Container, point?: P, skipUpdate?: boolean): P;
}
export declare const toLocalGlobalMixin: Partial<Container>;
