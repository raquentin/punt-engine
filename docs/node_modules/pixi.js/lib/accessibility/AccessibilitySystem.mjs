import { FederatedEvent } from '../events/FederatedEvent.mjs';
import { ExtensionType } from '../extensions/Extensions.mjs';
import { isMobile } from '../utils/browser/isMobile.mjs';
import { removeItems } from '../utils/data/removeItems.mjs';

"use strict";
const KEY_CODE_TAB = 9;
const DIV_TOUCH_SIZE = 100;
const DIV_TOUCH_POS_X = 0;
const DIV_TOUCH_POS_Y = 0;
const DIV_TOUCH_ZINDEX = 2;
const DIV_HOOK_SIZE = 1;
const DIV_HOOK_POS_X = -1e3;
const DIV_HOOK_POS_Y = -1e3;
const DIV_HOOK_ZINDEX = 2;
class AccessibilitySystem {
  // 2fps
  // eslint-disable-next-line jsdoc/require-param
  /**
   * @param {WebGLRenderer|WebGPURenderer} renderer - A reference to the current renderer
   */
  constructor(renderer, _mobileInfo = isMobile) {
    this._mobileInfo = _mobileInfo;
    /** Setting this to true will visually show the divs. */
    this.debug = false;
    /** Internal variable, see isActive getter. */
    this._isActive = false;
    /** Internal variable, see isMobileAccessibility getter. */
    this._isMobileAccessibility = false;
    /** A simple pool for storing divs. */
    this._pool = [];
    /** This is a tick used to check if an object is no longer being rendered. */
    this._renderId = 0;
    /** The array of currently active accessible items. */
    this._children = [];
    /** Count to throttle div updates on android devices. */
    this._androidUpdateCount = 0;
    /**  The frequency to update the div elements. */
    this._androidUpdateFrequency = 500;
    this._hookDiv = null;
    if (_mobileInfo.tablet || _mobileInfo.phone) {
      this._createTouchHook();
    }
    const div = document.createElement("div");
    div.style.width = `${DIV_TOUCH_SIZE}px`;
    div.style.height = `${DIV_TOUCH_SIZE}px`;
    div.style.position = "absolute";
    div.style.top = `${DIV_TOUCH_POS_X}px`;
    div.style.left = `${DIV_TOUCH_POS_Y}px`;
    div.style.zIndex = DIV_TOUCH_ZINDEX.toString();
    this._div = div;
    this._renderer = renderer;
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    globalThis.addEventListener("keydown", this._onKeyDown, false);
  }
  /**
   * Value of `true` if accessibility is currently active and accessibility layers are showing.
   * @member {boolean}
   * @readonly
   */
  get isActive() {
    return this._isActive;
  }
  /**
   * Value of `true` if accessibility is enabled for touch devices.
   * @member {boolean}
   * @readonly
   */
  get isMobileAccessibility() {
    return this._isMobileAccessibility;
  }
  get hookDiv() {
    return this._hookDiv;
  }
  /**
   * Creates the touch hooks.
   * @private
   */
  _createTouchHook() {
    const hookDiv = document.createElement("button");
    hookDiv.style.width = `${DIV_HOOK_SIZE}px`;
    hookDiv.style.height = `${DIV_HOOK_SIZE}px`;
    hookDiv.style.position = "absolute";
    hookDiv.style.top = `${DIV_HOOK_POS_X}px`;
    hookDiv.style.left = `${DIV_HOOK_POS_Y}px`;
    hookDiv.style.zIndex = DIV_HOOK_ZINDEX.toString();
    hookDiv.style.backgroundColor = "#FF0000";
    hookDiv.title = "select to enable accessibility for this content";
    hookDiv.addEventListener("focus", () => {
      this._isMobileAccessibility = true;
      this._activate();
      this._destroyTouchHook();
    });
    document.body.appendChild(hookDiv);
    this._hookDiv = hookDiv;
  }
  /**
   * Destroys the touch hooks.
   * @private
   */
  _destroyTouchHook() {
    if (!this._hookDiv) {
      return;
    }
    document.body.removeChild(this._hookDiv);
    this._hookDiv = null;
  }
  /**
   * Activating will cause the Accessibility layer to be shown.
   * This is called when a user presses the tab key.
   * @private
   */
  _activate() {
    if (this._isActive) {
      return;
    }
    this._isActive = true;
    globalThis.document.addEventListener("mousemove", this._onMouseMove, true);
    globalThis.removeEventListener("keydown", this._onKeyDown, false);
    this._renderer.runners.postrender.add(this);
    this._renderer.view.canvas.parentNode?.appendChild(this._div);
  }
  /**
   * Deactivating will cause the Accessibility layer to be hidden.
   * This is called when a user moves the mouse.
   * @private
   */
  _deactivate() {
    if (!this._isActive || this._isMobileAccessibility) {
      return;
    }
    this._isActive = false;
    globalThis.document.removeEventListener("mousemove", this._onMouseMove, true);
    globalThis.addEventListener("keydown", this._onKeyDown, false);
    this._renderer.runners.postrender.remove(this);
    this._div.parentNode?.removeChild(this._div);
  }
  /**
   * This recursive function will run through the scene graph and add any new accessible objects to the DOM layer.
   * @private
   * @param {Container} container - The Container to check.
   */
  _updateAccessibleObjects(container) {
    if (!container.visible || !container.accessibleChildren) {
      return;
    }
    if (container.accessible && container.isInteractive()) {
      if (!container._accessibleActive) {
        this._addChild(container);
      }
      container._renderId = this._renderId;
    }
    const children = container.children;
    if (children) {
      for (let i = 0; i < children.length; i++) {
        this._updateAccessibleObjects(children[i]);
      }
    }
  }
  /**
   * Runner init called, view is available at this point.
   * @ignore
   */
  init(options) {
    this.debug = options?.debug ?? this.debug;
    this._renderer.runners.postrender.remove(this);
  }
  /**
   * Runner postrender was called, ensure that all divs are mapped correctly to their Containers.
   * Only fires while active.
   * @ignore
   */
  postrender() {
    const now = performance.now();
    if (this._mobileInfo.android.device && now < this._androidUpdateCount) {
      return;
    }
    this._androidUpdateCount = now + this._androidUpdateFrequency;
    if (!this._renderer.renderingToScreen || !this._renderer.view.canvas) {
      return;
    }
    if (this._renderer.lastObjectRendered) {
      this._updateAccessibleObjects(this._renderer.lastObjectRendered);
    }
    const { x, y, width, height } = this._renderer.view.canvas.getBoundingClientRect();
    const { width: viewWidth, height: viewHeight, resolution } = this._renderer;
    const sx = width / viewWidth * resolution;
    const sy = height / viewHeight * resolution;
    let div = this._div;
    div.style.left = `${x}px`;
    div.style.top = `${y}px`;
    div.style.width = `${viewWidth}px`;
    div.style.height = `${viewHeight}px`;
    for (let i = 0; i < this._children.length; i++) {
      const child = this._children[i];
      if (child._renderId !== this._renderId) {
        child._accessibleActive = false;
        removeItems(this._children, i, 1);
        this._div.removeChild(child._accessibleDiv);
        this._pool.push(child._accessibleDiv);
        child._accessibleDiv = null;
        i--;
      } else {
        div = child._accessibleDiv;
        let hitArea = child.hitArea;
        const wt = child.worldTransform;
        if (child.hitArea) {
          div.style.left = `${(wt.tx + hitArea.x * wt.a) * sx}px`;
          div.style.top = `${(wt.ty + hitArea.y * wt.d) * sy}px`;
          div.style.width = `${hitArea.width * wt.a * sx}px`;
          div.style.height = `${hitArea.height * wt.d * sy}px`;
        } else {
          hitArea = child.getBounds().rectangle;
          this._capHitArea(hitArea);
          div.style.left = `${hitArea.x * sx}px`;
          div.style.top = `${hitArea.y * sy}px`;
          div.style.width = `${hitArea.width * sx}px`;
          div.style.height = `${hitArea.height * sy}px`;
          if (div.title !== child.accessibleTitle && child.accessibleTitle !== null) {
            div.title = child.accessibleTitle || "";
          }
          if (div.getAttribute("aria-label") !== child.accessibleHint && child.accessibleHint !== null) {
            div.setAttribute("aria-label", child.accessibleHint || "");
          }
        }
        if (child.accessibleTitle !== div.title || child.tabIndex !== div.tabIndex) {
          div.title = child.accessibleTitle || "";
          div.tabIndex = child.tabIndex;
          if (this.debug) {
            this._updateDebugHTML(div);
          }
        }
      }
    }
    this._renderId++;
  }
  /**
   * private function that will visually add the information to the
   * accessibility div
   * @param {HTMLElement} div -
   */
  _updateDebugHTML(div) {
    div.innerHTML = `type: ${div.type}</br> title : ${div.title}</br> tabIndex: ${div.tabIndex}`;
  }
  /**
   * Adjust the hit area based on the bounds of a display object
   * @param {Rectangle} hitArea - Bounds of the child
   */
  _capHitArea(hitArea) {
    if (hitArea.x < 0) {
      hitArea.width += hitArea.x;
      hitArea.x = 0;
    }
    if (hitArea.y < 0) {
      hitArea.height += hitArea.y;
      hitArea.y = 0;
    }
    const { width: viewWidth, height: viewHeight } = this._renderer;
    if (hitArea.x + hitArea.width > viewWidth) {
      hitArea.width = viewWidth - hitArea.x;
    }
    if (hitArea.y + hitArea.height > viewHeight) {
      hitArea.height = viewHeight - hitArea.y;
    }
  }
  /**
   * Adds a Container to the accessibility manager
   * @private
   * @param {Container} container - The child to make accessible.
   */
  _addChild(container) {
    let div = this._pool.pop();
    if (!div) {
      div = document.createElement("button");
      div.style.width = `${DIV_TOUCH_SIZE}px`;
      div.style.height = `${DIV_TOUCH_SIZE}px`;
      div.style.backgroundColor = this.debug ? "rgba(255,255,255,0.5)" : "transparent";
      div.style.position = "absolute";
      div.style.zIndex = DIV_TOUCH_ZINDEX.toString();
      div.style.borderStyle = "none";
      if (navigator.userAgent.toLowerCase().includes("chrome")) {
        div.setAttribute("aria-live", "off");
      } else {
        div.setAttribute("aria-live", "polite");
      }
      if (navigator.userAgent.match(/rv:.*Gecko\//)) {
        div.setAttribute("aria-relevant", "additions");
      } else {
        div.setAttribute("aria-relevant", "text");
      }
      div.addEventListener("click", this._onClick.bind(this));
      div.addEventListener("focus", this._onFocus.bind(this));
      div.addEventListener("focusout", this._onFocusOut.bind(this));
    }
    div.style.pointerEvents = container.accessiblePointerEvents;
    div.type = container.accessibleType;
    if (container.accessibleTitle && container.accessibleTitle !== null) {
      div.title = container.accessibleTitle;
    } else if (!container.accessibleHint || container.accessibleHint === null) {
      div.title = `container ${container.tabIndex}`;
    }
    if (container.accessibleHint && container.accessibleHint !== null) {
      div.setAttribute("aria-label", container.accessibleHint);
    }
    if (this.debug) {
      this._updateDebugHTML(div);
    }
    container._accessibleActive = true;
    container._accessibleDiv = div;
    div.container = container;
    this._children.push(container);
    this._div.appendChild(container._accessibleDiv);
    container._accessibleDiv.tabIndex = container.tabIndex;
  }
  /**
   * Dispatch events with the EventSystem.
   * @param e
   * @param type
   * @private
   */
  _dispatchEvent(e, type) {
    const { container: target } = e.target;
    const boundary = this._renderer.events.rootBoundary;
    const event = Object.assign(new FederatedEvent(boundary), { target });
    boundary.rootTarget = this._renderer.lastObjectRendered;
    type.forEach((type2) => boundary.dispatchEvent(event, type2));
  }
  /**
   * Maps the div button press to pixi's EventSystem (click)
   * @private
   * @param {MouseEvent} e - The click event.
   */
  _onClick(e) {
    this._dispatchEvent(e, ["click", "pointertap", "tap"]);
  }
  /**
   * Maps the div focus events to pixi's EventSystem (mouseover)
   * @private
   * @param {FocusEvent} e - The focus event.
   */
  _onFocus(e) {
    if (!e.target.getAttribute("aria-live")) {
      e.target.setAttribute("aria-live", "assertive");
    }
    this._dispatchEvent(e, ["mouseover"]);
  }
  /**
   * Maps the div focus events to pixi's EventSystem (mouseout)
   * @private
   * @param {FocusEvent} e - The focusout event.
   */
  _onFocusOut(e) {
    if (!e.target.getAttribute("aria-live")) {
      e.target.setAttribute("aria-live", "polite");
    }
    this._dispatchEvent(e, ["mouseout"]);
  }
  /**
   * Is called when a key is pressed
   * @private
   * @param {KeyboardEvent} e - The keydown event.
   */
  _onKeyDown(e) {
    if (e.keyCode !== KEY_CODE_TAB) {
      return;
    }
    this._activate();
  }
  /**
   * Is called when the mouse moves across the renderer element
   * @private
   * @param {MouseEvent} e - The mouse event.
   */
  _onMouseMove(e) {
    if (e.movementX === 0 && e.movementY === 0) {
      return;
    }
    this._deactivate();
  }
  /** Destroys the accessibility manager */
  destroy() {
    this._destroyTouchHook();
    this._div = null;
    globalThis.document.removeEventListener("mousemove", this._onMouseMove, true);
    globalThis.removeEventListener("keydown", this._onKeyDown);
    this._pool = null;
    this._children = null;
    this._renderer = null;
  }
}
/** @ignore */
AccessibilitySystem.extension = {
  type: [
    ExtensionType.WebGLSystem,
    ExtensionType.WebGPUSystem
  ],
  name: "accessibility"
};

export { AccessibilitySystem };
//# sourceMappingURL=AccessibilitySystem.mjs.map
