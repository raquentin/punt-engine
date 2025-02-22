import { FederatedEvent } from './FederatedEvent';
import type { Container } from '../scene/container/Container';
import type { AllFederatedEventMap } from './FederatedEventMap';
import type { FederatedPointerEvent } from './FederatedPointerEvent';
import type { FederatedWheelEvent } from './FederatedWheelEvent';
/**
 * The type of cursor to use when the mouse pointer is hovering over.
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/cursor
 *
 * Can be any valid CSS cursor value:
 * `auto`, `default`, `none`, `context-menu`, `help`, `pointer`, `progress`,
 * `wait`, `cell`, `crosshair`, `text`, `verticaltext`, `alias`, `copy`, `move`,
 * `nodrop`, `notallowed`, `eresize`, `nresize`, `neresize`, `nwresize`, `sresize`,
 *  `seresize`, `swresize`, `wresize`, `nsresize`, `ewresize`, `neswresize`, `colresize`,
 *  `nwseresize`, `rowresize`, `allscroll`, `zoomin`, `zoomout`, `grab`, `grabbing`
 * @memberof events
 */
export type Cursor = 'auto' | 'default' | 'none' | 'context-menu' | 'help' | 'pointer' | 'progress' | 'wait' | 'cell' | 'crosshair' | 'text' | 'vertical-text' | 'alias' | 'copy' | 'move' | 'no-drop' | 'not-allowed' | 'e-resize' | 'n-resize' | 'ne-resize' | 'nw-resize' | 's-resize' | 'se-resize' | 'sw-resize' | 'w-resize' | 'ns-resize' | 'ew-resize' | 'nesw-resize' | 'col-resize' | 'nwse-resize' | 'row-resize' | 'all-scroll' | 'zoom-in' | 'zoom-out' | 'grab' | 'grabbing';
/**
 * The hit area specifies the area for which pointer events should be captured by this event target.
 * @memberof events
 */
export interface IHitArea {
    /**
     * Checks if the x and y coordinates given are contained within this hit area.
     * @returns Whether the x and y coordinates are contained within this hit area.
     */
    contains(x: number, y: number): boolean;
}
/**
 * Function type for handlers, e.g., onclick
 * @memberof events
 */
export type FederatedEventHandler<T = FederatedPointerEvent> = (event: T) => void;
/**
 * The type of interaction a Container can be.
 * This is the {@link scene.Container#eventMode|Container.eventMode} property of any {@link scene.Container}.
 *
 * Can be one of the following:
 * - `'none'`: Ignores all interaction events, even on its children.
 * - `'passive'`: **(default)** Does not emit events and ignores all hit testing on itself and non-interactive children.
 * Interactive children will still emit events.
 * - `'auto'`: Does not emit events but is hit tested if parent is interactive. Same as `interactive = false` in v7
 * - `'static'`: Emit events and is hit tested. Same as `interaction = true` in v7
 * - `'dynamic'`: Emits events and is hit tested but will also receive mock interaction events fired from a ticker to
 * allow for interaction when the mouse isn't moving
 *
 * `none` and `passive` are useful for optimizing interaction events on objects as it reduces the number of hit tests
 * PixiJS has to do. `auto` is useful for when you want to recreate how the DOM handles interaction events with
 * `pointer-events: auto`.
 * @since 7.2.0
 * @memberof events
 */
export type EventMode = 'none' | 'passive' | 'auto' | 'static' | 'dynamic';
/**
 * The properties available for any interactive object.
 * @memberof events
 */
export interface FederatedOptions {
    /** The cursor preferred when the mouse pointer is hovering over. */
    cursor?: Cursor | string;
    /** The mode of interaction for this object */
    eventMode?: EventMode;
    /** Whether this event target should fire UI events. */
    interactive?: boolean;
    /** Whether this event target has any children that need UI events. This can be used optimize event propagation. */
    interactiveChildren?: boolean;
    /** The hit-area specifies the area for which pointer events should be captured by this event target. */
    hitArea?: IHitArea | null;
    /** Handler for 'click' event */
    onclick?: FederatedEventHandler | null;
    /** Handler for 'mousedown' event */
    onmousedown?: FederatedEventHandler | null;
    /** Handler for 'mouseenter' event */
    onmouseenter?: FederatedEventHandler | null;
    /** Handler for 'mouseleave' event */
    onmouseleave?: FederatedEventHandler | null;
    /** Handler for 'mousemove' event */
    onmousemove?: FederatedEventHandler | null;
    /** Handler for 'globalmousemove' event */
    onglobalmousemove?: FederatedEventHandler | null;
    /** Handler for 'mouseout' event */
    onmouseout?: FederatedEventHandler | null;
    /** Handler for 'mouseover' event */
    onmouseover?: FederatedEventHandler | null;
    /** Handler for 'mouseup' event */
    onmouseup?: FederatedEventHandler | null;
    /** Handler for 'mouseupoutside' event */
    onmouseupoutside?: FederatedEventHandler | null;
    /** Handler for 'pointercancel' event */
    onpointercancel?: FederatedEventHandler | null;
    /** Handler for 'pointerdown' event */
    onpointerdown?: FederatedEventHandler | null;
    /** Handler for 'pointerenter' event */
    onpointerenter?: FederatedEventHandler | null;
    /** Handler for 'pointerleave' event */
    onpointerleave?: FederatedEventHandler | null;
    /** Handler for 'pointermove' event */
    onpointermove?: FederatedEventHandler | null;
    /** Handler for 'globalpointermove' event */
    onglobalpointermove?: FederatedEventHandler | null;
    /** Handler for 'pointerout' event */
    onpointerout?: FederatedEventHandler | null;
    /** Handler for 'pointerover' event */
    onpointerover?: FederatedEventHandler | null;
    /** Handler for 'pointertap' event */
    onpointertap?: FederatedEventHandler | null;
    /** Handler for 'pointerup' event */
    onpointerup?: FederatedEventHandler | null;
    /** Handler for 'pointerupoutside' event */
    onpointerupoutside?: FederatedEventHandler | null;
    /** Handler for 'rightclick' event */
    onrightclick?: FederatedEventHandler | null;
    /** Handler for 'rightdown' event */
    onrightdown?: FederatedEventHandler | null;
    /** Handler for 'rightup' event */
    onrightup?: FederatedEventHandler | null;
    /** Handler for 'rightupoutside' event */
    onrightupoutside?: FederatedEventHandler | null;
    /** Handler for 'tap' event */
    ontap?: FederatedEventHandler | null;
    /** Handler for 'touchcancel' event */
    ontouchcancel?: FederatedEventHandler | null;
    /** Handler for 'touchend' event */
    ontouchend?: FederatedEventHandler | null;
    /** Handler for 'touchendoutside' event */
    ontouchendoutside?: FederatedEventHandler | null;
    /** Handler for 'touchmove' event */
    ontouchmove?: FederatedEventHandler | null;
    /** Handler for 'globaltouchmove' event */
    onglobaltouchmove?: FederatedEventHandler | null;
    /** Handler for 'touchstart' event */
    ontouchstart?: FederatedEventHandler | null;
    /** Handler for 'wheel' event */
    onwheel?: FederatedEventHandler<FederatedWheelEvent> | null;
}
type AddListenerOptions = boolean | AddEventListenerOptions;
type RemoveListenerOptions = boolean | EventListenerOptions;
export interface IFederatedContainer extends FederatedOptions {
    /** The parent of this event target. */
    readonly parent?: Container;
    /** The children of this event target. */
    readonly children?: ReadonlyArray<Container>;
    _internalEventMode: EventMode;
    /** Returns true if the Container has interactive 'static' or 'dynamic' */
    isInteractive: () => boolean;
    addEventListener<K extends keyof AllFederatedEventMap>(type: K, listener: (e: AllFederatedEventMap[K]) => any, options?: AddListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: AddListenerOptions): void;
    removeEventListener<K extends keyof AllFederatedEventMap>(type: K, listener: (e: AllFederatedEventMap[K]) => any, options?: RemoveListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: RemoveListenerOptions): void;
    dispatchEvent(e: FederatedEvent): boolean;
}
export declare const FederatedContainer: IFederatedContainer;
export {};
