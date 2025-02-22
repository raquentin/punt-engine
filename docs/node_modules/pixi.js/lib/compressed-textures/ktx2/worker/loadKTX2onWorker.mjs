import WorkerInstance from '../../../_virtual/ktx.worker.mjs';
import { ktxTranscoderUrls } from '../utils/setKTXTranscoderPath.mjs';

"use strict";
let ktxWorker;
const urlHash = {};
function getKTX2Worker(supportedTextures) {
  if (!ktxWorker) {
    ktxWorker = new WorkerInstance().worker;
    ktxWorker.onmessage = (messageEvent) => {
      const { success, url, textureOptions } = messageEvent.data;
      if (!success) {
        console.warn("Failed to load KTX texture", url);
      }
      urlHash[url](textureOptions);
    };
    ktxWorker.postMessage({
      type: "init",
      jsUrl: ktxTranscoderUrls.jsUrl,
      wasmUrl: ktxTranscoderUrls.wasmUrl,
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

export { loadKTX2onWorker };
//# sourceMappingURL=loadKTX2onWorker.mjs.map
