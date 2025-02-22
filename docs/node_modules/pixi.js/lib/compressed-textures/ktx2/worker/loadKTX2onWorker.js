'use strict';

var ktx_worker = require('../../../_virtual/ktx.worker.js');
var setKTXTranscoderPath = require('../utils/setKTXTranscoderPath.js');

"use strict";
let ktxWorker;
const urlHash = {};
function getKTX2Worker(supportedTextures) {
  if (!ktxWorker) {
    ktxWorker = new ktx_worker.default().worker;
    ktxWorker.onmessage = (messageEvent) => {
      const { success, url, textureOptions } = messageEvent.data;
      if (!success) {
        console.warn("Failed to load KTX texture", url);
      }
      urlHash[url](textureOptions);
    };
    ktxWorker.postMessage({
      type: "init",
      jsUrl: setKTXTranscoderPath.ktxTranscoderUrls.jsUrl,
      wasmUrl: setKTXTranscoderPath.ktxTranscoderUrls.wasmUrl,
      supportedTextures
    });
  }
  return ktxWorker;
}
function loadKTX2onWorker(url, supportedTextures) {
  const ktxWorker2 = getKTX2Worker(supportedTextures);
  return new Promise((resolve) => {
    urlHash[url] = resolve;
    ktxWorker2.postMessage({ type: "load", url });
  });
}

exports.loadKTX2onWorker = loadKTX2onWorker;
//# sourceMappingURL=loadKTX2onWorker.js.map
