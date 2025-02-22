'use strict';

var Cache = require('../../../assets/cache/Cache.js');
var loadFontCSS = require('./loadFontCSS.js');

"use strict";
const FontStylePromiseCache = /* @__PURE__ */ new Map();
async function getFontCss(fontFamilies, style, defaultOptions) {
  const fontPromises = fontFamilies.filter((fontFamily) => Cache.Cache.has(`${fontFamily}-and-url`)).map((fontFamily, i) => {
    if (!FontStylePromiseCache.has(fontFamily)) {
      const { url } = Cache.Cache.get(`${fontFamily}-and-url`);
      if (i === 0) {
        FontStylePromiseCache.set(fontFamily, loadFontCSS.loadFontCSS({
          fontWeight: style.fontWeight,
          fontStyle: style.fontStyle,
          fontFamily
        }, url));
      } else {
        FontStylePromiseCache.set(fontFamily, loadFontCSS.loadFontCSS({
          fontWeight: defaultOptions.fontWeight,
          fontStyle: defaultOptions.fontStyle,
          fontFamily
        }, url));
      }
    }
    return FontStylePromiseCache.get(fontFamily);
  });
  return (await Promise.all(fontPromises)).join("\n");
}

exports.FontStylePromiseCache = FontStylePromiseCache;
exports.getFontCss = getFontCss;
//# sourceMappingURL=getFontCss.js.map
