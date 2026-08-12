import { useEffect, useState } from "react";
import { defaultWordArtConfig, type WordArtEditorConfig } from "../lib/wordArtConfig";
import type { WordArtPreset } from "../lib/wordArtPresets";

export function useWordArtEditor(preset: WordArtPreset) {
  const [config, setConfig] = useState<WordArtEditorConfig>(() => defaultWordArtConfig(preset));
  useEffect(() => setConfig(defaultWordArtConfig(preset)), [preset]);
  const update = <K extends keyof WordArtEditorConfig>(key: K, value: WordArtEditorConfig[K]) => setConfig((current) => ({ ...current, [key]: value }));
  return { config, update };
}
