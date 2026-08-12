import { useEffect, useState } from "react";
import { cdnUrl, loadFontFace } from "../lib/fonts";
import type { Catalog, FontEntry } from "../types";

export function useWordArtFonts() {
  const [fonts, setFonts] = useState<FontEntry[]>([]);
  const [selectedFontId, setSelectedFontId] = useState("");
  const [fontFamily, setFontFamily] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(cdnUrl("catalog.json"))
      .then((response) => {
        if (!response.ok) throw new Error(`Font catalog request failed (${response.status})`);
        return response.json() as Promise<Catalog>;
      })
      .then((catalog) => {
        const safeFonts = catalog.fonts.filter((font) => font.riskFlags.length === 0);
        setFonts(safeFonts);
        if (safeFonts[0]) setSelectedFontId(safeFonts[0].id);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const font = fonts.find((item) => item.id === selectedFontId);
    if (!font) return;
    loadFontFace(font).then(setFontFamily).catch(() => setFontFamily(""));
  }, [fonts, selectedFontId]);

  return { fonts, selectedFontId, setSelectedFontId, fontFamily, loading };
}

export const wordArtFontFamily = (fontFamily: string) =>
  fontFamily ? `"${fontFamily}", sans-serif` : undefined;
