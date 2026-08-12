import { useEffect, useMemo, useRef, useState } from "react";
import { cdnUrl, loadFontFace } from "../lib/fonts";
import {
  defaultTextRenderOptions,
  downloadCanvasPng,
  type TextRenderOptions,
} from "../lib/textToPng";
import type { Catalog, FontEntry } from "../types";

export function useTextToPng() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [fontError, setFontError] = useState("");
  const [fontLoading, setFontLoading] = useState(true);
  const [selectedFontId, setSelectedFontId] = useState("");
  const [loadedFontFamily, setLoadedFontFamily] = useState("");
  const [options, setOptions] = useState<TextRenderOptions>(
    defaultTextRenderOptions,
  );
  const selectedFont = useMemo(
    () => catalog?.fonts.find((font) => font.id === selectedFontId) ?? null,
    [catalog, selectedFontId],
  );

  useEffect(() => {
    fetch(cdnUrl("catalog.json"))
      .then((response) => {
        if (!response.ok)
          throw new Error(`Catalog request failed (${response.status})`);
        return response.json() as Promise<Catalog>;
      })
      .then((nextCatalog) => {
        const safeFonts = nextCatalog.fonts.filter(
          (font) => font.riskFlags.length === 0,
        );
        setCatalog({ ...nextCatalog, fonts: safeFonts });
        setSelectedFontId(safeFonts[0]?.id ?? "");
      })
      .catch((reason: Error) => setFontError(reason.message))
      .finally(() => setFontLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedFont) return;
    setFontLoading(true);
    loadFontFace(selectedFont)
      .then((family) => {
        setLoadedFontFamily(`"${family}", sans-serif`);
        setFontError("");
      })
      .catch((reason: Error) => setFontError(reason.message))
      .finally(() => setFontLoading(false));
  }, [selectedFont]);

  const renderOptions = useMemo(
    () => ({
      ...options,
      fontFamily: loadedFontFamily || options.fontFamily,
    }),
    [options, loadedFontFamily],
  );

  const download = () => {
    if (canvasRef.current)
      downloadCanvasPng(canvasRef.current, "burmese-text.png");
  };

  return {
    canvasRef,
    options,
    setOptions,
    renderOptions,
    download,
    fonts: catalog?.fonts ?? [],
    fontError,
    fontLoading,
    selectedFontId,
    setSelectedFontId,
  };
}
