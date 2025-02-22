"use strict";
const ktxTranscoderUrls = {
  jsUrl: "https://files.pixijs.download/transcoders/ktx/libktx.js",
  wasmUrl: "https://files.pixijs.download/transcoders/ktx/libktx.wasm"
};
function setKTXTranscoderPath(config) {
  Object.assign(ktxTranscoderUrls, config);
}

export { ktxTranscoderUrls, setKTXTranscoderPath };
//# sourceMappingURL=setKTXTranscoderPath.mjs.map
