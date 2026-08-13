import { useEffect, useState } from "react";
import { createWordArtConfig, patchWordArtConfig, type WordArtConfig, type WordArtPreset } from "../wordart";

export function useWordArtEditor(preset: WordArtPreset, usePresetDefaults = true) {
  const [config, setConfig] = useState<WordArtConfig>(() => createWordArtConfig(preset, usePresetDefaults));
  useEffect(() => setConfig(createWordArtConfig(preset, usePresetDefaults)), [preset, usePresetDefaults]);
  const update = <K extends keyof WordArtConfig>(key: K, value: WordArtConfig[K]) => setConfig((current) => patchWordArtConfig(current, { [key]: value }));
  return { config, update };
}
