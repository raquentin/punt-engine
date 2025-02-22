/**
 * This function converts an image to a canvas, and returns the canvas.
 * It is used to convert images to canvases to work around a CORS issue where WebGPU cannot
 * upload an SVGImage to a texture.
 *
 * It uses the CanvasPool to get an optimal canvas and context, and then draws the image onto it.
 * This canvas is immediately returned to the CanvasPool for reuse, so use the result straight away!
 * (eg upload it to the GPU!)
 * @param image - The image to convert to a canvas.
 * @param resolution - The resolution of the canvas.
 */
export declare function getTemporaryCanvasFromImage(image: HTMLImageElement, resolution: number): HTMLCanvasElement;
