'use strict';

var Color = require('../../../color/Color.js');

"use strict";
function textStyleToCSS(style) {
  const stroke = style._stroke;
  const fill = style._fill;
  const cssStyleString = [
    `color: ${Color.Color.shared.setValue(fill.color).toHex()}`,
    `font-size: ${style.fontSize}px`,
    `font-family: ${style.fontFamily}`,
    `font-weight: ${style.fontWeight}`,
    `font-style: ${style.fontStyle}`,
    `font-variant: ${style.fontVariant}`,
    `letter-spacing: ${style.letterSpacing}px`,
    `text-align: ${style.align}`,
    `padding: ${style.padding}px`,
    `white-space: ${style.whiteSpace === "pre" && style.wordWrap ? "pre-wrap" : style.whiteSpace}`,
    ...style.lineHeight ? [`line-height: ${style.lineHeight}px`] : [],
    ...style.wordWrap ? [
      `word-wrap: ${style.breakWords ? "break-all" : "break-word"}`,
      `max-width: ${style.wordWrapWidth}px`
    ] : [],
    ...stroke ? [strokeToCSS(stroke)] : [],
    ...style.dropShadow ? [dropShadowToCSS(style.dropShadow)] : [],
    ...style.cssOverrides
  ].join(";");
  const cssStyles = [`div { ${cssStyleString} }`];
  tagStyleToCSS(style.tagStyles, cssStyles);
  return cssStyles.join(" ");
}
function dropShadowToCSS(dropShadowStyle) {
  const color = Color.Color.shared.setValue(dropShadowStyle.color).setAlpha(dropShadowStyle.alpha).toHexa();
  const x = Math.round(Math.cos(dropShadowStyle.angle) * dropShadowStyle.distance);
  const y = Math.round(Math.sin(dropShadowStyle.angle) * dropShadowStyle.distance);
  const position = `${x}px ${y}px`;
  if (dropShadowStyle.blur > 0) {
    return `text-shadow: ${position} ${dropShadowStyle.blur}px ${color}`;
  }
  return `text-shadow: ${position} ${color}`;
}
function strokeToCSS(stroke) {
  return [
    `-webkit-text-stroke-width: ${stroke.width}px`,
    `-webkit-text-stroke-color: ${Color.Color.shared.setValue(stroke.color).toHex()}`,
    `text-stroke-width: ${stroke.width}px`,
    `text-stroke-color: ${Color.Color.shared.setValue(stroke.color).toHex()}`,
    "paint-order: stroke"
  ].join(";");
}
const templates = {
  fontSize: `font-size: {{VALUE}}px`,
  fontFamily: `font-family: {{VALUE}}`,
  fontWeight: `font-weight: {{VALUE}}`,
  fontStyle: `font-style: {{VALUE}}`,
  fontVariant: `font-variant: {{VALUE}}`,
  letterSpacing: `letter-spacing: {{VALUE}}px`,
  align: `text-align: {{VALUE}}`,
  padding: `padding: {{VALUE}}px`,
  whiteSpace: `white-space: {{VALUE}}`,
  lineHeight: `line-height: {{VALUE}}px`,
  wordWrapWidth: `max-width: {{VALUE}}px`
};
const transform = {
  fill: (value) => `color: ${Color.Color.shared.setValue(value).toHex()}`,
  breakWords: (value) => `word-wrap: ${value ? "break-all" : "break-word"}`,
  stroke: strokeToCSS,
  dropShadow: dropShadowToCSS
};
function tagStyleToCSS(tagStyles, out) {
  for (const i in tagStyles) {
    const tagStyle = tagStyles[i];
    const cssTagStyle = [];
    for (const j in tagStyle) {
      if (transform[j]) {
        cssTagStyle.push(transform[j](tagStyle[j]));
      } else if (templates[j]) {
        cssTagStyle.push(templates[j].replace("{{VALUE}}", tagStyle[j]));
      }
    }
    out.push(`${i} { ${cssTagStyle.join(";")} }`);
  }
}

exports.textStyleToCSS = textStyleToCSS;
//# sourceMappingURL=textStyleToCSS.js.map
