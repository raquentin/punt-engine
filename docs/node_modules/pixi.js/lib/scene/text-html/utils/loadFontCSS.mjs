import { loadFontAsBase64 } from './loadFontAsBase64.mjs';

"use strict";
async function loadFontCSS(style, url) {
  const dataSrc = await loadFontAsBase64(url);
  return `@font-face {
        font-family: "${style.fontFamily}";
        src: url('${dataSrc}');
        font-weight: ${style.fontWeight};
        font-style: ${style.fontStyle};
    }`;
}

export { loadFontCSS };
//# sourceMappingURL=loadFontCSS.mjs.map
