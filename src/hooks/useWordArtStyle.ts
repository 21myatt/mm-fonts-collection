import { useEffect, useState } from "react";
import { WORD_ART_PRESET_STYLES, type WordArtPreset } from "../lib/wordArtPresets";

export function useWordArtStyle(preset: WordArtPreset) {
  const defaults = WORD_ART_PRESET_STYLES[preset];
  const [fill, setFill] = useState(defaults.fill);
  const [outline, setOutline] = useState(defaults.outline);
  const [shadow, setShadow] = useState(defaults.shadow);

  useEffect(() => {
    const next = WORD_ART_PRESET_STYLES[preset];
    setFill(next.fill); setOutline(next.outline); setShadow(next.shadow);
  }, [preset]);

  return { fill, setFill, outline, setOutline, shadow, setShadow, texture: defaults.texture };
}
