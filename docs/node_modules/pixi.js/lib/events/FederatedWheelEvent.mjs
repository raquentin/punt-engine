import { FederatedMouseEvent } from './FederatedMouseEvent.mjs';

"use strict";
class FederatedWheelEvent extends FederatedMouseEvent {
  constructor() {
    super(...arguments);
    /** Units specified in pixels. */
    this.DOM_DELTA_PIXEL = 0;
    /** Units specified in lines. */
    this.DOM_DELTA_LINE = 1;
    /** Units specified in pages. */
    this.DOM_DELTA_PAGE = 2;
  }
}
/** Units specified in pixels. */
FederatedWheelEvent.DOM_DELTA_PIXEL = 0;
/** Units specified in lines. */
FederatedWheelEvent.DOM_DELTA_LINE = 1;
/** Units specified in pages. */
FederatedWheelEvent.DOM_DELTA_PAGE = 2;

export { FederatedWheelEvent };
//# sourceMappingURL=FederatedWheelEvent.mjs.map
