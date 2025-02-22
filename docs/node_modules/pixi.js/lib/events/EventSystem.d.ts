import { EventBoundary } from './EventBoundary';
import { FederatedPointerEvent } from './FederatedPointerEvent';
import { FederatedWheelEvent } from './FederatedWheelEvent';
import type { ExtensionMetadata } from '../extensions/Extensions';
import type { PointData } from '../maths/point/PointData';
import type { System } from '../rendering/renderers/shared/system/System';
import type { Renderer } from '../rendering/renderers/types';
import type { EventMode } from './FederatedEventTarget';
/** @ignore */
export interface EventSystemOptions {
    /**
     * The default event mode mode for all display objects.
     * (included in the **pixi.js** and **pixi.js-legacy** bundle), otherwise it will be ignored.
     */
    eventMode?: EventMode;
    /**
     * The event features that are enabled by the EventSystem
     * (included in the **pixi.js** and **pixi.js-legacy** bundle), otherwise it will be ignored.
     * @example
     * const app = new Application({
     *   view: canvas,
     *   events: {
     *     move: true,
     *     globalMove: false,
     *     click: true,
     *     wheel: true,
     *   },
     * });
     */
    eventFeatures?: Partial<EventSystemFeatures>;
}
/**
 * The event features that are enabled by the EventSystem
 * (included in the **pixi.js** and **pixi.js-legacy** bundle), otherwise it will be ignored.
 * @since 7.2.0
 * @memberof events
 */
export interface EventSystemFeatures {
    /**
     * Enables pointer events associated with pointer movement:
     * - `pointermove` / `mousemove` / `touchmove`
     * - `pointerout` / `mouseout`
     * - `pointerover` / `mouseover`
     */
    move: boolean;
    /**
     * Enables global pointer move events:
     * - `globalpointermove`
     * - `globalmousemove`
     * - `globaltouchemove`
     */
    globalMove: boolean;
    /**
     * Enables pointer events associated with clicking:
     * - `pointerup` / `mouseup` / `touchend` / 'rightup'
     * - `pointerupoutside` / `mouseupoutside` / `touchendoutside` / 'rightupoutside'
     * - `pointerdown` / 'mousedown' / `touchstart` / 'rightdown'
     * - `click` / `tap`
     */
    click: boolean;
    /** - Enables wheel events. */
    wheel: boolean;
}
/**
 * The system for handling UI events.
 * @memberof events
 */
export declare class EventSystem implements System<EventSystemOptions> {
    /** @ignore */
    static extension: ExtensionMetadata;
    /**
     * The event features that are enabled by the EventSystem
     * (included in the **pixi.js** and **pixi.js-legacy** bundle), otherwise it will be ignored.
     * @since 7.2.0
     */
    static defaultEventFeatures: EventSystemFeatures;
    private static _defaultEventMode;
    /**
     * The default interaction mode for all display objects.
     * @see Container.eventMode
     * @type {EventMode}
     * @readonly
     * @since 7.2.0
     */
    static get defaultEventMode(): EventMode;
    /**
     * The {@link EventBoundary} for the stage.
     *
     * The {@link EventBoundary#rootTarget rootTarget} of this root boundary is automatically set to
     * the last rendered object before any event processing is initiated. This means the main scene
     * needs to be rendered atleast once before UI events will start propagating.
     *
     * The root boundary should only be changed during initialization. Otherwise, any state held by the
     * event boundary may be lost (like hovered & pressed Containers).
     */
    readonly rootBoundary: EventBoundary;
    /** Does the device support touch events https://www.w3.org/TR/touch-events/ */
    readonly supportsTouchEvents: boolean;
    /** Does the device support pointer events https://www.w3.org/Submission/pointer-events/ */
    readonly supportsPointerEvents: boolean;
    /**
     * Should default browser actions automatically be prevented.
     * Does not apply to pointer events for backwards compatibility
     * preventDefault on pointer events stops mouse events from firing
     * Thus, for every pointer event, there will always be either a mouse of touch event alongside it.
     * @default true
     */
    autoPreventDefault: boolean;
    /**
     * Dictionary of how different cursor modes are handled. Strings are handled as CSS cursor
     * values, objects are handled as dictionaries of CSS values for {@code domElement},
     * and functions are called instead of changing the CSS.
     * Default CSS cursor values are provided for 'default' and 'pointer' modes.
     */
    cursorStyles: Record<string, string | ((mode: string) => void) | CSSStyleDeclaration>;
    /**
     * The DOM element to which the root event listeners are bound. This is automatically set to
     * the renderer's {@link Renderer#view view}.
     */
    domElement: HTMLElement;
    /** The resolution used to convert between the DOM client space into world space. */
    resolution: number;
    /** The renderer managing this {@link EventSystem}. */
    renderer: Renderer;
    /**
     * The event features that are enabled by the EventSystem
     * (included in the **pixi.js** and **pixi.js-legacy** bundle), otherwise it will be ignored.
     * @since 7.2.0
     * @example
     * const app = new Application()
     * app.renderer.events.features.globalMove = false
     *
     * // to override all features use Object.assign
     * Object.assign(app.renderer.events.features, {
     *  move: false,
     *  globalMove: false,
     *  click: false,
     *  wheel: false,
     * })
     */
    readonly features: EventSystemFeatures;
    private _currentCursor;
    private readonly _rootPointerEvent;
    private readonly _rootWheelEvent;
    private _eventsAdded;
    /**
     * @param {Renderer} renderer
     */
    constructor(renderer: Renderer);
    /**
     * Runner init called, view is available at this point.
     * @ignore
     */
    init(options: EventSystemOptions): void;
    /**
     * Handle changing resolution.
     * @ignore
     */
    resolutionChange(resolution: number): void;
    /** Destroys all event listeners and detaches the renderer. */
    destroy(): void;
    /**
     * Sets the current cursor mode, handling any callbacks or CSS style changes.
     * @param mode - cursor mode, a key from the cursorStyles dictionary
     */
    setCursor(mode: string): void;
    /**
     * The global pointer event.
     * Useful for getting the pointer position without listening to events.
     * @since 7.2.0
     */
    get pointer(): Readonly<FederatedPointerEvent>;
    /**
     * Event handler for pointer down events on {@link EventSystem#domElement this.domElement}.
     * @param nativeEvent - The native mouse/pointer/touch event.
     */
    private _onPointerDown;
    /**
     * Event handler for pointer move events on on {@link EventSystem#domElement this.domElement}.
     * @param nativeEvent - The native mouse/pointer/touch events.
     */
    private _onPointerMove;
    /**
     * Event handler for pointer up events on {@link EventSystem#domElement this.domElement}.
     * @param nativeEvent - The native mouse/pointer/touch event.
     */
    private _onPointerUp;
    /**
     * Event handler for pointer over & out events on {@link EventSystem#domElement this.domElement}.
     * @param nativeEvent - The native mouse/pointer/touch event.
     */
    private _onPointerOverOut;
    /**
     * Passive handler for `wheel` events on {@link EventSystem.domElement this.domElement}.
     * @param nativeEvent - The native wheel event.
     */
    protected onWheel(nativeEvent: WheelEvent): void;
    /**
     * Sets the {@link EventSystem#domElement domElement} and binds event listeners.
     *
     * To deregister the current DOM element without setting a new one, pass {@code null}.
     * @param element - The new DOM element.
     */
    setTargetElement(element: HTMLElement): void;
    /** Register event listeners on {@link Renderer#domElement this.domElement}. */
    private _addEvents;
    /** Unregister event listeners on {@link EventSystem#domElement this.domElement}. */
    private _removeEvents;
    /**
     * Maps x and y coords from a DOM object and maps them correctly to the PixiJS view. The
     * resulting value is stored in the point. This takes into account the fact that the DOM
     * element could be scaled and positioned anywhere on the screen.
     * @param  {PointData} point - the point that the result will be stored in
     * @param  {number} x - the x coord of the position to map
     * @param  {number} y - the y coord of the position to map
     */
    mapPositionToPoint(point: PointData, x: number, y: number): void;
    /**
     * Ensures that the original event object contains all data that a regular pointer event would have
     * @param event - The original event data from a touch or mouse event
     * @returns An array containing a single normalized pointer event, in the case of a pointer
     *  or mouse event, or a multiple normalized pointer events if there are multiple changed touches
     */
    private _normalizeToPointerData;
    /**
     * Normalizes the native {@link https://w3c.github.io/uievents/#interface-wheelevent WheelEvent}.
     *
     * The returned {@link FederatedWheelEvent} is a shared instance. It will not persist across
     * multiple native wheel events.
     * @param nativeEvent - The native wheel event that occurred on the canvas.
     * @returns A federated wheel event.
     */
    protected normalizeWheelEvent(nativeEvent: WheelEvent): FederatedWheelEvent;
    /**
     * Normalizes the `nativeEvent` into a federateed {@link FederatedPointerEvent}.
     * @param event
     * @param nativeEvent
     */
    private _bootstrapEvent;
    /**
     * Transfers base & mouse event data from the {@code nativeEvent} to the federated event.
     * @param event
     * @param nativeEvent
     */
    private _transferMouseData;
}
