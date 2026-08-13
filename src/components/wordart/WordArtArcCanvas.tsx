import { useEffect, useRef } from "react";
import { renderHarfBuzzArc, type WordArtConfig } from "../../wordart";
import type { FontEntry } from "../../types";

export default function WordArtArcCanvas({
  text,
  fontEntry,
  config,
}: {
  text: string;
  fontEntry?: FontEntry;
  config: WordArtConfig;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !fontEntry) return;
    renderHarfBuzzArc(canvas, text, fontEntry, config);
  }, [config, fontEntry, text]);

  return (
    <canvas ref={canvasRef} className="word-art-arc-canvas" aria-label={text} />
  );
}
