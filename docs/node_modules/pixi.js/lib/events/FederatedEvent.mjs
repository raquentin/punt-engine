import { Point } from '../maths/point/Point.mjs';

"use strict";
class FederatedEvent {
  /**
   * @param manager - The event boundary which manages this event. Propagation can only occur
   *  within the boundary's jurisdiction.
   */
  constructor(manager) {
    /** Flags whether this event bubbles. This will take effect only if it is set before propagation. */
    this.bubbles = true;
    /** @deprecated since 7.0.0 */
    this.cancelBubble = true;
    /**
     * Flags whether this event can be canceled using {@link FederatedEvent.preventDefault}. This is always
     * false (for now).
     */
    this.cancelable = false;
    /**
     * Flag added for compatibility with DOM {@code Event}. It is not used in the Federated Events
     * API.
     * @see https://dom.spec.whatwg.org/#dom-event-composed
     */
    this.composed = false;
    /** Flags whether the default response of the user agent was prevent through this event. */
    this.defaultPrevented = false;
    /**
     * The propagation phase.
     * @default {@link FederatedEvent.NONE}
     */
    this.eventPhase = FederatedEvent.prototype.NONE;
    /** Flags whether propagation was stopped. */
    this.propagationStopped = false;
    /** Flags whether propagation was immediately stopped. */
    this.propagationImmediatelyStopped = false;
    /** The coordinates of the event relative to the nearest DOM layer. This is a non-standard property. */
    this.layer = new Point();
    /** The coordinates of the event relative to the DOM document. This is a non-standard property. */
    this.page = new Point();
    this.NONE = 0;
    this.CAPTURING_PHASE = 1;
    this.AT_TARGET = 2;
    this.BUBBLING_PHASE = 3;
    this.manager = manager;
  }
  /** @readonly */
  get layerX() {
    return this.layer.x;
  }
  /** @readonly */
  get layerY() {
    return this.layer.y;
  }
  /** @readonly */
  get pageX() {
    return this.page.x;
  }
  /** @readonly */
  get pageY() {
    return this.page.y;
  }
  /**
   * Fallback for the deprecated @code{InteractionEvent.data}.
   * @deprecated since 7.0.0
   */
  get data() {
    return this;
  }
  /** The propagation path for this event. Alias for {@link EventBoundary.propagationPath}. */
  composedPath() {
    if (this.manager && (!this.path || this.path[this.path.length - 1] !== this.target)) {
      this.path = this.target ? this.manager.propagationPath(this.target) : [];
    }
    return this.path;
  }
  /**
   * Unimplemented method included for implementing the DOM interface {@code Event}. It will throw an {@code Error}.
   * @deprecated
   * @param _type
   * @param _bubbles
   * @param _cancelable
   */
  initEvent(_type, _bubbles, _cancelable) {
    throw new Error("initEvent() is a legacy DOM API. It is not implemented in the Federated Events API.");
  }
  /**
   * Unimplemented method included for implementing the DOM interface {@code UIEvent}. It will throw an {@code Error}.
   * @deprecated
   * @param _typeArg
   * @param _bubblesArg
   * @param _cancelableArg
   * @param _viewArg
   * @param _detailArg
   */
  initUIEvent(_typeArg, _bubblesArg, _cancelableArg, _viewArg, _detailArg) {
    throw new Error("initUIEvent() is a legacy DOM API. It is not implemented in the Federated Events API.");
  }
  /** Prevent default behavior of PixiJS and the user agent. */
  preventDefault() {
    if (this.nativeEvent instanceof Event && this.nativeEvent.cancelable) {
      this.nativeEvent.preventDefault();
    }
    this.defaultPrevented = true;
  }
  /**
   * Stop this event from propagating to any addition listeners, including on the
   * {@link FederatedEventTarget.currentTarget currentTarget} and also the following
   * event targets on the propagation path.
   */
  stopImmediatePropagation() {
    this.propagationImmediatelyStopped = true;
  }
  /**
   * Stop this event from propagating to the next {@link FederatedEventTarget}. The rest of the listeners
   * on the {@link FederatedEventTarget.currentTarget currentTarget} will still be notified.
   */
  stopPropagation() {
    this.propagationStopped = true;
  }
}

export { FederatedEvent };
//# sourceMappingURL=FederatedEvent.mjs.map
