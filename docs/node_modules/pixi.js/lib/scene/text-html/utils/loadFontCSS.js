'use strict';

var loadFontAsBase64 = require('./loadFontAsBase64.js');

"use strict";
async function loadFontCSS(style, url) {
  const dataSrc = await loadFontAsBase64.loadFontAsBase64(url);
  return `@font-face {
        font-family: "${style.fontFamily}";
        src: url('${dataSrc}');
        font-weight: ${style.fontWeight};
        font-style: ${style.fontStyle};
    }`;
}

exports.loadFontCSS = loadFontCSS;
//# sourceMappingURL=loadFontCSS.js.map
