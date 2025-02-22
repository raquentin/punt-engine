import { Rectangle } from '../../../../maths/shapes/Rectangle.mjs';

"use strict";
const fullFrame = new Rectangle(0, 0, 1, 1);
function viewportFromFrame(viewport, source, frame) {
  frame || (frame = fullFrame);
  const pixelWidth = source.pixelWidth;
  const pixelHeight = source.pixelHeight;
  viewport.x = frame.x * pixelWidth | 0;
  viewport.y = frame.y * pixelHeight | 0;
  viewport.width = frame.width * pixelWidth | 0;
  viewport.height = frame.height * pixelHeight | 0;
  return viewport;
}

export { viewportFromFrame };
//# sourceMappingURL=viewportFromFrame.mjs.map
