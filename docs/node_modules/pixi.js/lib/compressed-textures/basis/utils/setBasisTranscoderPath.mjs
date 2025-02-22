"use strict";
const basisTranscoderUrls = {
  jsUrl: "https://files.pixijs.download/transcoders/basis/basis_transcoder.js",
  wasmUrl: "https://files.pixijs.download/transcoders/basis/basis_transcoder.wasm"
};
function setBasisTranscoderPath(config) {
  Object.assign(basisTranscoderUrls, config);
}

export { basisTranscoderUrls, setBasisTranscoderPath };
//# sourceMappingURL=setBasisTranscoderPath.mjs.map
