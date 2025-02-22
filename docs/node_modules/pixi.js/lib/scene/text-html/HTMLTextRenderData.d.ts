import type { CanvasAndContext } from '../../rendering/renderers/shared/texture/CanvasPool';
export declare const nssvg = "http://www.w3.org/2000/svg";
export declare const nsxhtml = "http://www.w3.org/1999/xhtml";
export declare class HTMLTextRenderData {
    svgRoot: SVGSVGElement;
    foreignObject: SVGForeignObjectElement;
    domElement: HTMLElement;
    styleElement: HTMLElement;
    image: HTMLImageElement;
    canvasAndContext?: CanvasAndContext;
    constructor();
}
