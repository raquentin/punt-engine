'use strict';

"use strict";
const ktxTranscoderUrls = {
  jsUrl: "https://files.pixijs.download/transcoders/ktx/libktx.js",
  wasmUrl: "https://files.pixijs.download/transcoders/ktx/libktx.wasm"
};
function setKTXTranscoderPath(config) {
  Object.assign(ktxTranscoderUrls, config);
}

exports.ktxTranscoderUrls = ktxTranscoderUrls;
exports.setKTXTranscoderPath = setKTXTranscoderPath;
//# sourceMappingURL=setKTXTranscoderPath.js.map
