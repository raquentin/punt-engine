import { DOMAdapter } from '../../../environment/adapter.mjs';
import { ExtensionType } from '../../../extensions/Extensions.mjs';
import { warn } from '../../../utils/logging/warn.mjs';
import { path } from '../../../utils/path.mjs';
import { Cache } from '../../cache/Cache.mjs';
import { checkDataUrl } from '../../utils/checkDataUrl.mjs';
import { checkExtension } from '../../utils/checkExtension.mjs';
import { LoaderParserPriority } from './LoaderParser.mjs';

"use strict";
const validWeights = [
  "normal",
  "bold",
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900"
];
const validFontExtensions = [".ttf", ".otf", ".woff", ".woff2"];
const validFontMIMEs = [
  "font/ttf",
  "font/otf",
  "font/woff",
  "font/woff2"
];
const CSS_IDENT_TOKEN_REGEX = /^(--|-?[A-Z_])[0-9A-Z_-]*$/i;
function getFontFamilyName(url) {
  const ext = path.extname(url);
  const name = path.basename(url, ext);
  const nameWithSpaces = name.replace(/(-|_)/g, " ");
  const nameTokens = nameWithSpaces.toLowerCase().split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1));
  let valid = nameTokens.length > 0;
  for (const token of nameTokens) {
    if (!token.match(CSS_IDENT_TOKEN_REGEX)) {
      valid = false;
      break;
    }
  }
  let fontFamilyName = nameTokens.join(" ");
  if (!valid) {
    fontFamilyName = `"${fontFamilyName.replace(/[\\"]/g, "\\$&")}"`;
  }
  return fontFamilyName;
}
const validURICharactersRegex = /^[0-9A-Za-z%:/?#\[\]@!\$&'()\*\+,;=\-._~]*$/;
function encodeURIWhenNeeded(uri) {
  if (validURICharactersRegex.test(uri)) {
    return uri;
  }
  return encodeURI(uri);
}
const loadWebFont = {
  extension: {
    type: ExtensionType.LoadParser,
    priority: LoaderParserPriority.Low
  },
  name: "loadWebFont",
  test(url) {
    return checkDataUrl(url, validFontMIMEs) || checkExtension(url, validFontExtensions);
  },
  async load(url, options) {
    const fonts = DOMAdapter.get().getFontFaceSet();
    if (fonts) {
      const fontFaces = [];
      const name = options.data?.family ?? getFontFamilyName(url);
      const weights = options.data?.weights?.filter((weight) => validWeights.includes(weight)) ?? ["normal"];
      const data = options.data ?? {};
      for (let i = 0; i < weights.length; i++) {
        const weight = weights[i];
        const font = new FontFace(name, `url(${encodeURIWhenNeeded(url)})`, {
          ...data,
          weight
        });
        await font.load();
        fonts.add(font);
        fontFaces.push(font);
      }
      Cache.set(`${name}-and-url`, {
        url,
        fontFaces
      });
      return fontFaces.length === 1 ? fontFaces[0] : fontFaces;
    }
    warn("[loadWebFont] FontFace API is not supported. Skipping loading font");
    return null;
  },
  unload(font) {
    (Array.isArray(font) ? font : [font]).forEach((t) => {
      Cache.remove(t.family);
      DOMAdapter.get().getFontFaceSet().delete(t);
    });
  }
};

export { getFontFamilyName, loadWebFont };
//# sourceMappingURL=loadWebFont.mjs.map
