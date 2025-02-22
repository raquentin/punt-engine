'use strict';

var Extensions = require('../../../../extensions/Extensions.js');
var VideoSource = require('../../../../rendering/renderers/shared/texture/sources/VideoSource.js');
var detectVideoAlphaMode = require('../../../../utils/browser/detectVideoAlphaMode.js');
var getResolutionOfUrl = require('../../../../utils/network/getResolutionOfUrl.js');
var checkDataUrl = require('../../../utils/checkDataUrl.js');
var checkExtension = require('../../../utils/checkExtension.js');
var createTexture = require('./utils/createTexture.js');

"use strict";
const validVideoExtensions = [".mp4", ".m4v", ".webm", ".ogg", ".ogv", ".h264", ".avi", ".mov"];
const validVideoMIMEs = validVideoExtensions.map((ext) => `video/${ext.substring(1)}`);
function crossOrigin(element, url, crossorigin) {
  if (crossorigin === void 0 && !url.startsWith("data:")) {
    element.crossOrigin = determineCrossOrigin(url);
  } else if (crossorigin !== false) {
    element.crossOrigin = typeof crossorigin === "string" ? crossorigin : "anonymous";
  }
}
function preloadVideo(element) {
  return new Promise((resolve, reject) => {
    element.addEventListener("canplaythrough", loaded);
    element.addEventListener("error", error);
    element.load();
    function loaded() {
      cleanup();
      resolve();
    }
    function error(err) {
      cleanup();
      reject(err);
    }
    function cleanup() {
      element.removeEventListener("canplaythrough", loaded);
      element.removeEventListener("error", error);
    }
  });
}
function determineCrossOrigin(url, loc = globalThis.location) {
  if (url.startsWith("data:")) {
    return "";
  }
  loc = loc || globalThis.location;
  const parsedUrl = new URL(url, document.baseURI);
  if (parsedUrl.hostname !== loc.hostname || parsedUrl.port !== loc.port || parsedUrl.protocol !== loc.protocol) {
    return "anonymous";
  }
  return "";
}
const loadVideoTextures = {
  name: "loadVideo",
  extension: {
    type: Extensions.ExtensionType.LoadParser,
    name: "loadVideo"
  },
  test(url) {
    const isValidDataUrl = checkDataUrl.checkDataUrl(url, validVideoMIMEs);
    const isValidExtension = checkExtension.checkExtension(url, validVideoExtensions);
    return isValidDataUrl || isValidExtension;
  },
  async load(url, asset, loader) {
    const options = {
      ...VideoSource.VideoSource.defaultOptions,
      resolution: asset.data?.resolution || getResolutionOfUrl.getResolutionOfUrl(url),
      alphaMode: asset.data?.alphaMode || await detectVideoAlphaMode.detectVideoAlphaMode(),
      ...asset.data
    };
    const videoElement = document.createElement("video");
    const attributeMap = {
      preload: options.autoLoad !== false ? "auto" : void 0,
      "webkit-playsinline": options.playsinline !== false ? "" : void 0,
      playsinline: options.playsinline !== false ? "" : void 0,
      muted: options.muted === true ? "" : void 0,
      loop: options.loop === true ? "" : void 0,
      autoplay: options.autoPlay !== false ? "" : void 0
    };
    Object.keys(attributeMap).forEach((key) => {
      const value = attributeMap[key];
      if (value !== void 0)
        videoElement.setAttribute(key, value);
    });
    if (options.muted === true) {
      videoElement.muted = true;
    }
    crossOrigin(videoElement, url, options.crossorigin);
    const sourceElement = document.createElement("source");
    let mime;
    if (url.startsWith("data:")) {
      mime = url.slice(5, url.indexOf(";"));
    } else if (!url.startsWith("blob:")) {
      const ext = url.split("?")[0].slice(url.lastIndexOf(".") + 1).toLowerCase();
      mime = VideoSource.VideoSource.MIME_TYPES[ext] || `video/${ext}`;
    }
    sourceElement.src = url;
    if (mime) {
      sourceElement.type = mime;
    }
    return new Promise((resolve) => {
      const onCanPlay = async () => {
        const base = new VideoSource.VideoSource({ ...options, resource: videoElement });
        videoElement.removeEventListener("canplay", onCanPlay);
        if (asset.data.preload) {
          await preloadVideo(videoElement);
        }
        resolve(createTexture.createTexture(base, loader, url));
      };
      videoElement.addEventListener("canplay", onCanPlay);
      videoElement.appendChild(sourceElement);
    });
  },
  unload(texture) {
    texture.destroy(true);
  }
};

exports.crossOrigin = crossOrigin;
exports.determineCrossOrigin = determineCrossOrigin;
exports.loadVideoTextures = loadVideoTextures;
exports.preloadVideo = preloadVideo;
//# sourceMappingURL=loadVideoTextures.js.map
