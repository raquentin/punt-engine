"use strict";
function fastCopy(sourceBuffer, destinationBuffer) {
  const lengthDouble = sourceBuffer.byteLength / 8 | 0;
  const sourceFloat64View = new Float64Array(sourceBuffer, 0, lengthDouble);
  const destinationFloat64View = new Float64Array(destinationBuffer, 0, lengthDouble);
  destinationFloat64View.set(sourceFloat64View);
  const remainingBytes = sourceBuffer.byteLength - lengthDouble * 8;
  if (remainingBytes > 0) {
    const sourceUint8View = new Uint8Array(sourceBuffer, lengthDouble * 8, remainingBytes);
    const destinationUint8View = new Uint8Array(destinationBuffer, lengthDouble * 8, remainingBytes);
    destinationUint8View.set(sourceUint8View);
  }
}

export { fastCopy };
//# sourceMappingURL=fastCopy.mjs.map
