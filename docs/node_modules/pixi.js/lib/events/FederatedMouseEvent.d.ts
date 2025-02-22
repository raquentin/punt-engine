import { Point } from '../maths/point/Point';
import { FederatedEvent } from './FederatedEvent';
import type { PointData } from '../maths/point/PointData';
import type { Container } from '../scene/container/Container';
import type { PixiTouch } from './FederatedEvent';
/**
 * A {@link FederatedEvent} for mouse events.
 * @memberof events
 */
export declare class FederatedMouseEvent extends FederatedEvent<MouseEvent | PointerEvent | PixiTouch> implements MouseEvent {
    /** Whether the "alt" key was pressed when this mouse event occurred. */
    altKey: boolean;
    /** The specific button that was pressed in this mouse event. */
    button: number;
    /** The button depressed when this event occurred. */
    buttons: number;
    /** Whether the "control" key was pressed when this mouse event occurred. */
    ctrlKey: boolean;
    /** Whether the "meta" key was pressed when this mouse event occurred. */
    metaKey: boolean;
    /** This is currently not implemented in the Federated Events API. */
    relatedTarget: EventTarget;
    /** Whether the "shift" key was pressed when this mouse event occurred. */
    shiftKey: boolean;
    /** The coordinates of the mouse event relative to the canvas. */
    client: Point;
    /** @readonly */
    get clientX(): number;
    /** @readonly */
    get clientY(): number;
    /**
     * Alias for {@link FederatedMouseEvent.clientX this.clientX}.
     * @readonly
     */
    get x(): number;
    /**
     * Alias for {@link FederatedMouseEvent.clientY this.clientY}.
     * @readonly
     */
    get y(): number;
    /** This is the number of clicks that occurs in 200ms/click of each other. */
    detail: number;
    /** The movement in this pointer relative to the last `mousemove` event. */
    movement: Point;
    /** @readonly */
    get movementX(): number;
    /** @readonly */
    get movementY(): number;
    /** The offset of the pointer coordinates w.r.t. target Container in world space. This is not supported at the moment. */
    offset: Point;
    /** @readonly */
    get offsetX(): number;
    /** @readonly */
    get offsetY(): number;
    /** The pointer coordinates in world space. */
    global: Point;
    /** @readonly */
    get globalX(): number;
    /** @readonly */
    get globalY(): number;
    /**
     * The pointer coordinates in the renderer's {@link Renderer.screen screen}. This has slightly
     * different semantics than native PointerEvent screenX/screenY.
     */
    screen: Point;
    /**
     * The pointer coordinates in the renderer's screen. Alias for {@code screen.x}.
     * @readonly
     */
    get screenX(): number;
    /**
     * The pointer coordinates in the renderer's screen. Alias for {@code screen.y}.
     * @readonly
     */
    get screenY(): number;
    /**
     * This will return the local coordinates of the specified container for this InteractionData
     * @param {Container} container - The Container that you would like the local
     *  coords off
     * @param {PointData} point - A Point object in which to store the value, optional (otherwise
     *  will create a new point)
     * @param {PointData} globalPos - A Point object containing your custom global coords, optional
     *  (otherwise will use the current global coords)
     * @returns - A point containing the coordinates of the InteractionData position relative
     *  to the Container
     */
    getLocalPosition<P extends PointData = Point>(container: Container, point?: P, globalPos?: PointData): P;
    /**
     * Whether the modifier key was pressed when this event natively occurred.
     * @param key - The modifier key.
     */
    getModifierState(key: string): boolean;
    /**
     * Not supported.
     * @param _typeArg
     * @param _canBubbleArg
     * @param _cancelableArg
     * @param _viewArg
     * @param _detailArg
     * @param _screenXArg
     * @param _screenYArg
     * @param _clientXArg
     * @param _clientYArg
     * @param _ctrlKeyArg
     * @param _altKeyArg
     * @param _shiftKeyArg
     * @param _metaKeyArg
     * @param _buttonArg
     * @param _relatedTargetArg
     * @deprecated since 7.0.0
     */
    initMouseEvent(_typeArg: string, _canBubbleArg: boolean, _cancelableArg: boolean, _viewArg: Window, _detailArg: number, _screenXArg: number, _screenYArg: number, _clientXArg: number, _clientYArg: number, _ctrlKeyArg: boolean, _altKeyArg: boolean, _shiftKeyArg: boolean, _metaKeyArg: boolean, _buttonArg: number, _relatedTargetArg: EventTarget): void;
}
