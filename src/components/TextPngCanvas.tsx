import { useEffect, type RefObject } from "react";
import { renderTextToCanvas, type TextRenderOptions } from "../lib/textToPng";

function TextPngCanvas({
  canvasRef,
  options,
}: {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  options: TextRenderOptions;
}) {
  useEffect(() => {
    if (canvasRef.current) renderTextToCanvas(canvasRef.current, options);
  }, [canvasRef, options]);

  return (
    <div className="text-png-canvas-frame">
      <canvas ref={canvasRef} aria-label="Rendered text preview" />
    </div>
  );
}

export default TextPngCanvas;
